import Link from 'next/link';
import { apiGet } from '../../../lib/api';
import AddStudioStaffForm from '../../../components/AddStudioStaffForm';

export default async function StudioDetailPage({ params }) {
  let studio = null;
  let loadError = null;

  try {
    studio = await apiGet(`/studios/${params.id}`);
  } catch (err) {
    loadError = err.message;
  }

  if (loadError) {
    return (
      <div style={{ color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        Couldn't load this studio ({loadError}).
      </div>
    );
  }

  const employees = studio.studio_employees || [];

  return (
    <article style={{ maxWidth: 640 }}>
      <Link href="/studios" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
        &larr; Back to studios
      </Link>

      <h1 className="display-title" style={{ fontSize: 36, margin: '20px 0 20px' }}>
        {studio.name}
      </h1>

      {studio.description && (
        <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: 28 }}>{studio.description}</p>
      )}

      <div style={{ marginTop: 20, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
        <h2 className="display-title" style={{ fontSize: 20, margin: '0 0 16px' }}>
          Staff
        </h2>
        {employees.length > 0 ? (
          <div style={{ ...styles.grid, marginBottom: 14 }}>
            {employees.map((e) => (
              <div key={e.staff?.id} style={styles.card}>
                <div className="eyebrow">{e.role || e.staff?.staff_type || '—'}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{e.staff?.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>No staff linked yet.</p>
        )}
        <AddStudioStaffForm studioId={params.id} />
      </div>
    </article>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 10,
  },
  card: {
    padding: '10px 12px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
};
