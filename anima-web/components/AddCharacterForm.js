'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, getCurrentUser } from '../lib/apiClient';

const ROLES = ['main', 'supporting', 'background'];

export default function AddCharacterForm({ mediaId, onAdded }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState('supporting');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const created = await apiPost('/characters', { media_id: Number(mediaId), name: name.trim(), role });
      setName('');
      onAdded?.(created);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null; // logged-out visitors don't see edit controls at all

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        placeholder="Character name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button type="submit" disabled={saving} style={styles.button}>
        {saving ? '…' : '+ Add character'}
      </button>
      {error && <span style={{ fontSize: 11, color: 'var(--accent-crimson)' }}>{error}</span>}
    </form>
  );
}

const styles = {
  input: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '7px 10px',
    color: 'var(--text)',
    fontSize: 12,
  },
  button: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '7px 12px',
    fontSize: 12,
    color: 'var(--accent-gold)',
  },
};
