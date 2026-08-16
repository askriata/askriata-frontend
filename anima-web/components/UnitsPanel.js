'use client';

// Renders the episode/chapter/volume list with an inline rate-and-log
// control on each row. This is a client component (unlike the rest of the
// media detail page, which renders server-side) because it needs to know
// who's logged in and hit authenticated endpoints.
//
// `unitGroups` comes in as an array of [groupName, units[]] pairs rather
// than a Map -- Next.js can't pass a Map from a server component into a
// client component as a prop (RSC serialization only supports plain
// JSON-ish values), so the grouping happens in page.js and gets flattened
// to an array before it reaches here.

import { useEffect, useState } from 'react';
import { apiGetAuthed, apiPost, getCurrentUser } from '../lib/apiClient';

export default function UnitsPanel({ mediaId, unitGroups, unitTypeLabel }) {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out
  const [progressByUnit, setProgressByUnit] = useState({});

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (!u) return;
      await refreshProgress();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  async function refreshProgress() {
    try {
      const rows = await apiGetAuthed(`/progress?media_id=${mediaId}`);
      const map = {};
      for (const row of rows) map[row.unit_id] = row;
      setProgressByUnit(map);
    } catch {
      // progress is supplementary to the unit list -- fail quietly rather
      // than breaking the whole page over it
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {unitGroups.map(([groupName, groupUnits]) => (
        <div key={groupName}>
          {unitGroups.length > 1 && (
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {groupName}
            </div>
          )}
          <div style={styles.unitList}>
            {[...groupUnits]
              .sort((a, b) => a.number - b.number)
              .map((u) => (
                <UnitRow
                  key={u.id}
                  unit={u}
                  unitTypeLabel={unitTypeLabel}
                  loggedIn={!!user}
                  progress={progressByUnit[u.id]}
                  onLogged={refreshProgress}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function UnitRow({ unit, unitTypeLabel, loggedIn, progress, onLogged }) {
  const [rating, setRating] = useState(progress?.latest_rating ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleLog() {
    setBusy(true);
    setError(null);
    try {
      await apiPost(`/units/${unit.id}/log`, {
        rating: rating === '' ? null : Number(rating),
        is_reread: !!progress, // if there's already a progress row, this is a reread
      });
      await onLogged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.unitRow}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', width: 32 }}>
        {unit.number}
      </span>
      <span style={{ fontSize: 14, flex: 1 }}>
        {unit.title || `${unitTypeLabel.slice(0, -1)} ${unit.number}`}
      </span>

      {progress && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-gold)', whiteSpace: 'nowrap' }}>
          {progress.times_consumed > 1 ? `${progress.times_consumed}x` : 'seen'}
          {progress.latest_rating != null ? ` · ${progress.latest_rating}` : ''}
        </span>
      )}

      {loggedIn ? (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            placeholder="rate"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={styles.ratingInput}
          />
          <button disabled={busy} onClick={handleLog} style={styles.logButton}>
            {busy ? '…' : progress ? 'Log reread' : 'Log'}
          </button>
        </div>
      ) : (
        <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Log in to track</span>
      )}

      {error && (
        <span style={{ fontSize: 11, color: 'var(--accent-crimson)' }}>{error}</span>
      )}
    </div>
  );
}

const styles = {
  unitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  unitRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '8px 10px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    flexWrap: 'wrap',
  },
  ratingInput: {
    width: 52,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '4px 6px',
    color: 'var(--text)',
    fontSize: 12,
  },
  logButton: {
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '5px 10px',
    fontSize: 11,
    fontWeight: 600,
  },
};
