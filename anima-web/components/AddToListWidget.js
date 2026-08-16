'use client';

import { useEffect, useState } from 'react';
import { apiGetAuthed, apiPost, getCurrentUser } from '../lib/apiClient';

const STATUSES = ['watching', 'completed', 'planning', 'paused', 'dropped'];

export default function AddToListWidget({ mediaId }) {
  const [user, setUser] = useState(undefined);
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState('planning');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      if (!u) return;
      try {
        const existing = await apiGetAuthed(`/list/${mediaId}`);
        if (existing) {
          setEntry(existing);
          setStatus(existing.status);
          setScore(existing.score ?? '');
        }
      } catch {
        // no existing entry -- fine, leave defaults
      }
    })();
  }, [mediaId]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const saved = await apiPost('/list', {
        media_id: Number(mediaId),
        status,
        score: score === '' ? null : Number(score),
      });
      setEntry(saved);
      setMessage('Saved.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (user === undefined) return null; // still checking auth, avoid a flash

  if (!user) {
    return (
      <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', margin: '12px 0' }}>
        Log in to add this to your list.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        max="10"
        step="0.5"
        placeholder="score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        style={styles.scoreInput}
      />
      <button onClick={save} disabled={saving} style={styles.button}>
        {saving ? 'Saving…' : entry ? 'Update list entry' : 'Add to list'}
      </button>
      {message && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{message}</span>}
    </div>
  );
}

const styles = {
  select: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '8px 10px',
    color: 'var(--text)',
    fontSize: 13,
  },
  scoreInput: {
    width: 64,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '8px 10px',
    color: 'var(--text)',
    fontSize: 13,
  },
  button: {
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: 13,
  },
};
