'use client';

import { useState } from 'react';
import Link from 'next/link';

// These two endpoints are public (no auth) per staff.js/characters.js, so
// this hits the API directly rather than going through lib/apiClient.js.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState(null); // null | 'loading' | 'done' | 'error'

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setStatus('loading');

    try {
      const [charRes, staffRes] = await Promise.all([
        fetch(`${API_URL}/characters/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: query }),
        }),
        fetch(`${API_URL}/staff/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: query }),
        }),
      ]);

      setCharacters(charRes.ok ? await charRes.json() : []);
      setStaff(staffRes.ok ? await staffRes.json() : []);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      <div className="eyebrow">Search</div>
      <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 24px' }}>
        Characters &amp; staff
      </h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 32, maxWidth: 420 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {status === 'loading' ? '…' : 'Search'}
        </button>
      </form>

      {status === 'error' && (
        <p style={{ color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Search failed. Check the API is reachable (NEXT_PUBLIC_API_URL).
        </p>
      )}

      {status === 'done' && characters.length === 0 && staff.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No results for &quot;{query}&quot;.</p>
      )}

      {characters.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Characters
          </div>
          <div style={styles.resultGrid}>
            {characters.map((c) => (
              <Link key={c.id} href={c.media_id ? `/media/${c.media_id}` : '#'} style={styles.resultCard}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {staff.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Staff
          </div>
          <div style={styles.resultGrid}>
            {staff.map((s) => (
              <div key={s.id} style={styles.resultCard}>
                {s.name}
                {s.staff_type && (
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {s.staff_type}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: 14,
  },
  button: {
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '10px 18px',
    fontWeight: 600,
    fontSize: 14,
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 10,
  },
  resultCard: {
    display: 'block',
    padding: '12px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 14,
  },
};
