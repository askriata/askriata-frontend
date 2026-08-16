import MediaCard from './MediaCard';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'light_novel', label: 'Light Novels' },
  { value: 'visual_novel', label: 'Visual Novels' },
  { value: 'web_manga', label: 'Web Manga' },
  { value: 'art_book', label: 'Art Books' },
];

export default function MediaGrid({ media, activeType }) {
  return (
    <div>
      <div style={styles.tabs}>
        {TYPES.map((t) => (
          <a
            key={t.value}
            href={t.value ? `/?type=${t.value}` : '/'}
            style={{
              ...styles.tab,
              borderColor: activeType === t.value ? 'var(--accent-crimson)' : 'transparent',
              color: activeType === t.value ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {t.label}
          </a>
        ))}
      </div>

      {media.length === 0 ? (
        <div style={styles.empty}>
          <p className="display-title" style={{ fontSize: 20, marginBottom: 6 }}>
            Nothing catalogued here yet.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Add your first entry through the API's <code>POST /media</code> route to see it appear.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {media.map((m) => (
            <MediaCard key={m.id} media={m} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 28,
    borderBottom: '1px solid var(--border)',
    flexWrap: 'wrap',
  },
  tab: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.03em',
    padding: '0 4px 12px',
    borderBottom: '2px solid transparent',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  empty: {
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius)',
    padding: '48px 24px',
    textAlign: 'center',
  },
};
