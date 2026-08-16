'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGetAuthed, apiPost, getCurrentUser } from '../../lib/apiClient';

// This property's `site` value for the shared-login site_profiles system
// (see server/schema.sql -- site_profiles.site check constraint).
const SITE = 'comics';

export default function ProfilePage() {
  const [user, setUser] = useState(undefined); // undefined = checking auth
  const [profile, setProfile] = useState(undefined); // undefined = loading, null = no profile yet
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ username: '', display_name: '', bio: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (!u) return;

      try {
        const p = await apiGetAuthed(`/profiles/me?site=${SITE}`);
        setProfile(p);
      } catch (err) {
        setError(err.message);
      }

      try {
        const entries = await apiGetAuthed('/list');
        setList(entries);
      } catch {
        // list is supplementary -- a fresh profile just won't have one yet
      }
    })();
  }, []);

  async function handleCreateProfile(e) {
    e.preventDefault();
    setError(null);
    try {
      const created = await apiPost('/profiles/me', { site: SITE, ...form });
      setProfile(created);
    } catch (err) {
      setError(err.message);
    }
  }

  if (user === undefined) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  }

  if (!user) {
    return (
      <div>
        <div className="eyebrow">Profile</div>
        <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 20px' }}>
          You&apos;re not logged in.
        </h1>
        <Link href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-gold)' }}>
          Go to login &rarr;
        </Link>
      </div>
    );
  }

  if (profile === undefined) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading profile…</p>;
  }

  if (profile === null) {
    return (
      <div style={{ maxWidth: 360 }}>
        <div className="eyebrow">Set up your profile</div>
        <h1 className="display-title" style={{ fontSize: 28, margin: '6px 0 24px' }}>
          Pick a username
        </h1>
        <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            placeholder="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={styles.input}
          />
          <input
            placeholder="Display name (optional)"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            style={{ ...styles.input, minHeight: 80, fontFamily: 'var(--font-body)', resize: 'vertical' }}
          />
          <button type="submit" style={styles.button}>
            Create profile
          </button>
        </form>
        {error && <p style={{ color: 'var(--accent-crimson)', fontSize: 13, marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  const grouped = list.reduce((acc, entry) => {
    (acc[entry.status] ||= []).push(entry);
    return acc;
  }, {});

  return (
    <div>
      <div className="eyebrow">Profile</div>
      <h1 className="display-title" style={{ fontSize: 34, margin: '6px 0 8px' }}>
        {profile.display_name || profile.username}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 24 }}>
        @{profile.username}
      </p>
      {profile.bio && <p style={{ lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>{profile.bio}</p>}

      {Object.entries(grouped).map(([entryStatus, entries]) => (
        <div key={entryStatus} style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 10, textTransform: 'capitalize' }}>
            {entryStatus.replace('_', ' ')} ({entries.length})
          </div>
          <div style={styles.listGrid}>
            {entries.map((entry) => (
              <Link key={entry.media_id} href={`/media/${entry.media_id}`} style={styles.listCard}>
                <span>{entry.media?.name}</span>
                {entry.score != null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-gold)' }}>
                    {entry.score}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Nothing on your list yet. Add entries from a media page.
        </p>
      )}
    </div>
  );
}

const styles = {
  input: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: 14,
  },
  button: {
    marginTop: 6,
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '11px 16px',
    fontWeight: 600,
    fontSize: 14,
  },
  listGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 8,
  },
  listCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 14,
  },
};
