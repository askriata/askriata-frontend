'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, getCurrentUser } from '../lib/apiClient';

export default function AddUnitsForm({ mediaId, defaultUnitType, arcs, onAdded }) {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [mode, setMode] = useState('bulk'); // 'bulk' | 'single'
  const [unitType, setUnitType] = useState(defaultUnitType || 'episode');
  const [count, setCount] = useState('');
  const [startingNumber, setStartingNumber] = useState('1');
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [arcId, setArcId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  async function handleBulk(e) {
    e.preventDefault();
    if (!count) return;
    setSaving(true);
    setError(null);
    try {
      const created = await apiPost(`/media/${mediaId}/units/bulk`, {
        unit_type: unitType,
        count: Number(count),
        starting_number: Number(startingNumber || 1),
      });
      setCount('');
      onAdded?.(created);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSingle(e) {
    e.preventDefault();
    if (!number) return;
    setSaving(true);
    setError(null);
    try {
      const created = await apiPost(`/media/${mediaId}/units`, {
        unit_type: unitType,
        number: Number(number),
        title: title || null,
        arc_id: arcId || null,
      });
      setNumber('');
      setTitle('');
      onAdded?.([created]);
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <ModeButton active={mode === 'bulk'} onClick={() => setMode('bulk')}>
          Add range
        </ModeButton>
        <ModeButton active={mode === 'single'} onClick={() => setMode('single')}>
          Add one (with title/arc)
        </ModeButton>
      </div>

      {mode === 'bulk' ? (
        <form onSubmit={handleBulk} style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)} style={styles.input}>
            <option value="episode">Episode</option>
            <option value="chapter">Chapter</option>
            <option value="volume">Volume</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder="Starting #"
            value={startingNumber}
            onChange={(e) => setStartingNumber(e.target.value)}
            style={{ ...styles.input, width: 90 }}
          />
          <input
            type="number"
            min="1"
            placeholder="How many"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ ...styles.input, width: 90 }}
          />
          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? '…' : '+ Add'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSingle} style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)} style={styles.input}>
            <option value="episode">Episode</option>
            <option value="chapter">Chapter</option>
            <option value="volume">Volume</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={{ ...styles.input, width: 80 }}
          />
          <input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ ...styles.input, minWidth: 140, flex: 1 }}
          />
          {arcs?.length > 0 && (
            <select value={arcId} onChange={(e) => setArcId(e.target.value)} style={styles.input}>
              <option value="">No arc</option>
              {arcs.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}
          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? '…' : '+ Add'}
          </button>
        </form>
      )}

      {error && <p style={{ fontSize: 11, color: 'var(--accent-crimson)', marginTop: 6 }}>{error}</p>}
    </div>
  );
}

function ModeButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        padding: '5px 10px',
        borderRadius: 'var(--radius)',
        border: `1px solid ${active ? 'var(--accent-crimson)' : 'var(--border)'}`,
        background: active ? 'var(--accent-crimson-soft)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text-muted)',
      }}
    >
      {children}
    </button>
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
