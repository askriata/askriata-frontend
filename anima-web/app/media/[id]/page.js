import { apiGet } from '../../../lib/api';
import Link from 'next/link';
import AddToListWidget from '../../../components/AddToListWidget';
import UnitsPanel from '../../../components/UnitsPanel';
import AddCharacterForm from '../../../components/AddCharacterForm';
import AddUnitsForm from '../../../components/AddUnitsForm';
import AddArcForm from '../../../components/AddArcForm';

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

  // These are supplementary -- if one fails (e.g. no units entered yet),
  // the page should still render everything else instead of erroring out.
  const [seasonsResult, charactersResult, unitsResult, arcsResult] = await Promise.allSettled([
    media.parent_id ? Promise.resolve([]) : apiGet(`/media?parent_id=${params.id}`),
    apiGet(`/characters?media_id=${params.id}`),
    apiGet(`/media/${params.id}/units`),
    apiGet(`/media/${params.id}/arcs`),
  ]);

  const seasons = seasonsResult.status === 'fulfilled' ? seasonsResult.value : [];
  const characters = charactersResult.status === 'fulfilled' ? charactersResult.value : [];
  const units = unitsResult.status === 'fulfilled' ? unitsResult.value : [];
  const arcs = arcsResult.status === 'fulfilled' ? arcsResult.value : [];

  // Group units by arc (unit.arcs is { id, name } or null -- media_units.js
  // includes this via its select). Ungrouped units land under 'Episodes'/
  // 'Chapters' depending on what's actually in the list.
  const unitTypeLabel = units[0]?.unit_type === 'episode' ? 'Episodes'
    : units[0]?.unit_type === 'volume' ? 'Volumes'
    : units[0]?.unit_type === 'chapter' ? 'Chapters'
    : media.media_type === 'anime' ? 'Episodes'
    : media.media_type === 'light_novel' ? 'Volumes'
    : 'Chapters';

  const defaultUnitType = unitTypeLabel === 'Episodes' ? 'episode'
    : unitTypeLabel === 'Volumes' ? 'volume'
    : 'chapter';

  const unitGroups = new Map();
  for (const unit of units) {
    const key = unit.arcs?.name || unitTypeLabel;
    if (!unitGroups.has(key)) unitGroups.set(key, []);
    unitGroups.get(key).push(unit);
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

      <AddToListWidget mediaId={params.id} />

      <dl style={styles.factGrid}>
        {studios.length > 0 && <Fact label="Studio" value={studios.join(', ')} />}
        {media.episodes_count != null && <Fact label="Episodes" value={media.episodes_count} />}
        {media.started_at && <Fact label="Started" value={media.started_at} />}
        {stats?.score != null && <Fact label="Score" value={`${stats.score} / 10`} />}
      </dl>

      {seasons.length > 0 && (
        <Section title="Seasons & parts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {seasons
              .sort((a, b) => (a.part_number || 0) - (b.part_number || 0))
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/media/${s.id}`}
                  style={styles.seasonRow}
                >
                  <span>{s.name}</span>
                  {s.media_stats?.[0]?.score != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-gold)' }}>
                      &#9733; {s.media_stats[0].score}
                    </span>
                  )}
                </Link>
              ))}
          </div>
        </Section>
      )}

      <Section title="Characters">
        {characters.length > 0 && (
          <div style={{ ...styles.characterGrid, marginBottom: 14 }}>
            {characters.map((c) => (
              <div key={c.id} style={styles.characterCard}>
                <div className="eyebrow">{c.role || '—'}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{c.name}</div>
              </div>
            ))}
          </div>
        )}
        <AddCharacterForm mediaId={params.id} />
      </Section>

      <Section title={unitTypeLabel}>
        {units.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <UnitsPanel
              mediaId={params.id}
              unitGroups={[...unitGroups.entries()]}
              unitTypeLabel={unitTypeLabel}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AddArcForm mediaId={params.id} />
          <AddUnitsForm mediaId={params.id} defaultUnitType={defaultUnitType} arcs={arcs} />
        </div>
      </Section>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
      <h2 className="display-title" style={{ fontSize: 20, margin: '0 0 16px' }}>
        {title}
      </h2>
      {children}
    </div>
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
  seasonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 14,
  },
  characterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 10,
  },
  characterCard: {
    padding: '10px 12px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
};
