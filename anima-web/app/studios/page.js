import Link from 'next/link';
import { apiGet } from '../../lib/api';

export default async function StudiosPage() {
  let studios = [];
  let loadError = null;

  try {
    studios = await apiGet('/studios');
  } catch (err) {
    loadError = err.message;
  }

  return (
    <div>
      <div className="eyebrow">Anima · studios</div>
      <h1 className="display-title" style={{ fontSize: 34, margin: '6px 0 32px' }}>
        Studios
      </h1>

      {loadError ? (
        <div style={{ color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          Couldn't reach the API ({loadError}).
        </div>
      ) : studios.length === 0 ? (
        <div style={styles.empty}>
          <p className="display-title" style={{ fontSize: 20, marginBottom: 6 }}>
            No studios yet.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Studios get created inline from the &quot;Add entry&quot; form, or you can add one from a studio page once it exists.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {studios.map((s) => (
            <Link key={s.id} href={`/studios/${s.id}`} style={styles.card}>
              <div style={{ fontSize: 15 }}>{s.name}</div>
              {s.studio_employees?.length > 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {s.studio_employees.length} staff linked
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12,
  },
  card: {
    display: 'block',
    padding: '14px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  empty: {
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius)',
    padding: '48px 24px',
    textAlign: 'center',
  },
};
