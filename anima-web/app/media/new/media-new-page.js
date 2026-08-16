'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiPost, getCurrentUser } from '../../../lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const MEDIA_TYPES = [
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'light_novel', label: 'Light Novel' },
  { value: 'visual_novel', label: 'Visual Novel' },
  { value: 'web_manga', label: 'Web Manga' },
  { value: 'art_book', label: 'Art Book' },
];

export default function NewMediaPage() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [genres, setGenres] = useState([]);
  const [studios, setStudios] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [newStudio, setNewStudio] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    media_type: 'anime',
    show_type: '',
    status: '',
    description: '',
    episodes_count: '',
    started_at: '',
    genre_ids: [],
    studio_ids: [],
  });

  useEffect(() => {
    (async () => {
      setUser(await getCurrentUser());
      // Public GETs -- no auth needed to read the lists, just to write to them
      try {
        const [g, s] = await Promise.all([
          fetch(`${API_URL}/genres`).then((r) => r.json()),
          fetch(`${API_URL}/studios`).then((r) => r.json()),
        ]);
        setGenres(g);
        setStudios(s);
      } catch {
        // non-fatal -- the form still works, just without existing lists to pick from
      }
    })();
  }, []);

  function toggleId(field, id) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(id) ? f[field].filter((x) => x !== id) : [...f[field], id],
    }));
  }

  async function handleAddGenre() {
    if (!newGenre.trim()) return;
    try {
      const created = await apiPost('/genres', { name: newGenre.trim() });
      setGenres((g) => [...g, created]);
      setForm((f) => ({ ...f, genre_ids: [...f.genre_ids, created.id] }));
      setNewGenre('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddStudio() {
    if (!newStudio.trim()) return;
    try {
      const created = await apiPost('/studios', { name: newStudio.trim() });
      setStudios((s) => [...s, created]);
      setForm((f) => ({ ...f, studio_ids: [...f.studio_ids, created.id] }));
      setNewStudio('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const created = await apiPost('/media', {
        ...form,
        episodes_count: form.episodes_count === '' ? null : Number(form.episodes_count),
        started_at: form.started_at || null,
      });
      router.push(`/media/${created.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (user === undefined) {
    return <p style={{ color: 'var(--text-muted)' }}>Loading…</p>;
  }

  if (!user) {
    return (
      <div>
        <div className="eyebrow">Add entry</div>
        <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 20px' }}>
          You need to be logged in.
        </h1>
        <Link href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent-gold)' }}>
          Go to login &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="eyebrow">Anima · catalog</div>
      <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 28px' }}>
        Add a new entry
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
        </Field>

        <Field label="Type">
          <select
            value={form.media_type}
            onChange={(e) => setForm({ ...form, media_type: e.target.value })}
            style={styles.input}
          >
            {MEDIA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Show type" style={{ flex: 1 }}>
            <input
              placeholder="TV, Movie, OVA, Oneshot…"
              value={form.show_type}
              onChange={(e) => setForm({ ...form, show_type: e.target.value })}
              style={styles.input}
            />
          </Field>
          <Field label="Status" style={{ flex: 1 }}>
            <input
              placeholder="Ongoing, Finished, Upcoming…"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={styles.input}
            />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...styles.input, minHeight: 100, fontFamily: 'var(--font-body)', resize: 'vertical' }}
          />
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Episode / chapter count" style={{ flex: 1 }}>
            <input
              type="number"
              min="0"
              value={form.episodes_count}
              onChange={(e) => setForm({ ...form, episodes_count: e.target.value })}
              style={styles.input}
            />
          </Field>
          <Field label="Started" style={{ flex: 1 }}>
            <input
              type="date"
              value={form.started_at}
              onChange={(e) => setForm({ ...form, started_at: e.target.value })}
              style={styles.input}
            />
          </Field>
        </div>

        <Field label="Genres">
          <div style={styles.chipWrap}>
            {genres.map((g) => (
              <Chip
                key={g.id}
                label={g.name}
                active={form.genre_ids.includes(g.id)}
                onClick={() => toggleId('genre_ids', g.id)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              placeholder="New genre…"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              style={{ ...styles.input, fontSize: 12, padding: '6px 10px' }}
            />
            <button type="button" onClick={handleAddGenre} style={styles.smallButton}>
              Add
            </button>
          </div>
        </Field>

        <Field label="Studios">
          <div style={styles.chipWrap}>
            {studios.map((s) => (
              <Chip
                key={s.id}
                label={s.name}
                active={form.studio_ids.includes(s.id)}
                onClick={() => toggleId('studio_ids', s.id)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input
              placeholder="New studio…"
              value={newStudio}
              onChange={(e) => setNewStudio(e.target.value)}
              style={{ ...styles.input, fontSize: 12, padding: '6px 10px' }}
            />
            <button type="button" onClick={handleAddStudio} style={styles.smallButton}>
              Add
            </button>
          </div>
        </Field>

        <button type="submit" disabled={saving} style={styles.submitButton}>
          {saving ? 'Creating…' : 'Create entry'}
        </button>

        {error && <p style={{ color: 'var(--accent-crimson)', fontSize: 13 }}>{error}</p>}
      </form>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{label}</span>
      {children}
    </label>
  );
}

function Chip({ label, active, onClick }) {
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
      {label}
    </button>
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
    fontFamily: 'var(--font-body)',
  },
  chipWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallButton: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '6px 12px',
    fontSize: 12,
    color: 'var(--text)',
  },
  submitButton: {
    marginTop: 8,
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    fontWeight: 600,
    fontSize: 14,
  },
};
