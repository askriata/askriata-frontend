import { apiGet } from '../lib/api';
import MediaGrid from '../components/MediaGrid';

export default async function HomePage({ searchParams }) {
  const activeType = searchParams?.type || '';
  const path = activeType ? `/media?type=${activeType}` : '/media';

  let media = [];
  let loadError = null;
  try {
    media = await apiGet(path);
  } catch (err) {
    loadError = err.message;
  }

  return (
    <div>
      <div className="eyebrow">Anima · your catalog</div>
      <h1 className="display-title" style={{ fontSize: 34, margin: '6px 0 32px' }}>
        Everything you're watching, reading, and tracking.
      </h1>

      {loadError ? (
        <div style={{ color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Couldn't reach the API ({loadError}). Check that NEXT_PUBLIC_API_URL is set correctly.
        </div>
      ) : (
        <MediaGrid media={media} activeType={activeType} />
      )}
    </div>
  );
}
