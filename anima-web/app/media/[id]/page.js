import { apiGet } from '../../../lib/api';
import Link from 'next/link';

export default async function MediaDetailPage({ params }) {
  let media = null;
  let loadError = null;

  try {
    media = await apiGet(`/media/${params.id}`);
  } catch (err) {
    loadError = err.message;
  }

  if (loadError) {
    return (
      <div style={{ color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        Couldn't load this entry ({loadError}).
      </div>
    );
  }

  const genres = (media.media_genres || []).map((g) => g.genres?.name).filter(Boolean);
  const studios = (media.media_studios || []).map((s) => s.studios?.name).filter(Boolean);
  const stats = media.media_stats?.[0];

  return (
    <article style={{ maxWidth: 720 }}>
      <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
        &larr; Back to catalog
      </Link>

      <div className="eyebrow" style={{ marginTop: 20 }}>
        {media.show_type} · {media.status}
      </div>
      <h1 className="display-title" style={{ fontSize: 40, margin: '8px 0 20px' }}>
        {media.name}
      </h1>

      {genres.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {genres.map((g) => (
            <span
              key={g}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-muted)',
              }}
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {media.description && (
        <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: 28 }}>{media.description}</p>
      )}

      <dl style={styles.factGrid}>
        {studios.length > 0 && <Fact label="Studio" value={studios.join(', ')} />}
        {media.episodes_count != null && <Fact label="Episodes" value={media.episodes_count} />}
        {media.started_at && <Fact label="Started" value={media.started_at} />}
        {stats?.score != null && <Fact label="Score" value={`${stats.score} / 10`} />}
      </dl>
    </article>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd style={{ margin: '4px 0 0', fontSize: 15 }}>{value}</dd>
    </div>
  );
}

const styles = {
  factGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 20,
    padding: '20px 0',
    borderTop: '1px solid var(--border)',
  },
};
