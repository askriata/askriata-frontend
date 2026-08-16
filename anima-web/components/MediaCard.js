import Link from 'next/link';

const TYPE_LABELS = {
  anime: 'Anime',
  manga: 'Manga',
  light_novel: 'Light Novel',
  visual_novel: 'Visual Novel',
  manhwa: 'Manhwa',
  manhua: 'Manhua',
  webcomic: 'Webcomic',
};

export default function MediaCard({ media }) {
  const genres = (media.media_genres || []).map((g) => g.genres?.name).filter(Boolean);
  const score = media.media_stats?.[0]?.score;

  return (
    <Link href={`/media/${media.id}`} className={`type-${media.media_type}`} style={styles.card}>
      <div style={styles.spine}>
        <span style={styles.spineLabel}>{TYPE_LABELS[media.media_type] || media.media_type}</span>
      </div>

      <div style={styles.body}>
        <div className="eyebrow">
          {media.show_type || TYPE_LABELS[media.media_type]} · {media.status || 'Unknown'}
        </div>
        <h3 className="display-title" style={styles.title}>
          {media.name}
        </h3>
        {genres.length > 0 && (
          <div style={styles.genres}>{genres.slice(0, 3).join(' / ')}</div>
        )}
        {score != null && (
          <div style={styles.score}>
            <span style={{ color: 'var(--accent-gold)' }}>&#9733;</span> {score}
          </div>
        )}
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'flex',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    minHeight: 132,
  },
  spine: {
    width: 28,
    background: 'var(--type-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  spineLabel: {
    writingMode: 'vertical-rl',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.08em',
    color: 'rgba(0,0,0,0.65)',
    fontWeight: 500,
  },
  body: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 1.3,
    margin: 0,
  },
  genres: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  score: {
    marginTop: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
};
