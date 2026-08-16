export default function SearchPage() {
  return (
    <div>
      <div className="eyebrow">Search</div>
      <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 20px' }}>
        Not built yet.
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.6 }}>
        The API already supports name search for characters and staff
        (<code>POST /characters/search</code>, <code>POST /staff/search</code>).
        This page just needs a form wired up to call them.
      </p>
    </div>
  );
}
