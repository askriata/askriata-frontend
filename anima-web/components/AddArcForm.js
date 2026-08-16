'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, getCurrentUser } from '../lib/apiClient';

export default function AddArcForm({ mediaId, onAdded }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [name, setName] = useState('');
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
      const created = await apiPost(`/media/${mediaId}/arcs`, { name: name.trim() });
      setName('');
      onAdded?.(created);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <input
        placeholder="Arc name (e.g. Chimera Ant arc)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <button type="submit" disabled={saving} style={styles.button}>
        {saving ? '…' : '+ Add arc'}
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
    minWidth: 200,
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
