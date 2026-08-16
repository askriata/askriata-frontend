'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, getCurrentUser } from '../lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COMMON_ROLES = ['director', 'author', 'illustrator', 'character_design', 'studio', 'producer'];

export default function AddMediaStaffForm({ mediaId }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState('director');
  const [matches, setMatches] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  // Debounced search-as-you-type against the existing /staff/search endpoint,
  // so adding "Studio X" again reuses the row instead of creating a duplicate.
  useEffect(() => {
    setSelectedStaffId(null);
    if (!name.trim()) {
      setMatches([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/staff/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        setMatches(res.ok ? await res.json() : []);
      } catch {
        setMatches([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [name]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      let staffId = selectedStaffId;

      // No existing staff selected -- create a new one first.
      if (!staffId) {
        const created = await apiPost('/staff', { name: name.trim(), staff_type: role });
        staffId = created.id;
      }

      await apiPost(`/media/${mediaId}/staff`, { staff_id: staffId, role });
      setName('');
      setMatches([]);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Staff name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          {COMMON_ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace('_', ' ')}
            </option>
          ))}
        </select>
        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? '…' : selectedStaffId ? '+ Credit existing' : '+ Create & credit'}
        </button>
        {error && <span style={{ fontSize: 11, color: 'var(--accent-crimson)' }}>{error}</span>}
      </form>

      {matches.length > 0 && !selectedStaffId && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Existing matches:</span>
          {matches.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedStaffId(m.id);
                setName(m.name);
              }}
              style={styles.matchChip}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
    </div>
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
  matchChip: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    padding: '4px 8px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--accent-gold)',
    background: 'transparent',
    color: 'var(--accent-gold)',
  },
};
