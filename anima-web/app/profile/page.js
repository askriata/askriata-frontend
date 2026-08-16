import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div>
      <div className="eyebrow">Profile</div>
      <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 20px' }}>
        Not built yet.
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.6, marginBottom: 16 }}>
        Once you're logged in, this is where your watch/read list and site
        profile (from <code>/profiles/me</code>) will live.
      </p>
      <Link
        href="/login"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--accent-gold)',
        }}
      >
        Go to login &rarr;
      </Link>
    </div>
  );
}
