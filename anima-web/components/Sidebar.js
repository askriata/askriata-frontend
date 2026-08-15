'use client';

import { useState } from 'react';
import Link from 'next/link';

// Other properties in your network. Point these at the real URLs once
// they exist -- for now they're placeholders so the switcher is wired up
// and ready to extend.
const NETWORK_SITES = [
  { label: 'Comics DB', href: '#', current: true },
  { label: 'Social', href: '#', current: false },
  { label: 'Movies', href: '#', current: false },
  { label: 'TV', href: '#', current: false },
  { label: 'Games', href: '#', current: false },
];

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Search', href: '/search', icon: SearchIcon },
  { label: 'Profile', href: '/profile', icon: ProfileIcon },
];

export default function Sidebar() {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <nav style={styles.rail} aria-label="Primary">
      <Link href="/" style={styles.brand} aria-label="Anima home">
        A
      </Link>

      <div style={styles.navItems}>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} style={styles.navItem}>
            <Icon />
            <span style={styles.navLabel}>{label}</span>
          </Link>
        ))}
      </div>

      <div style={styles.spacer} />

      <div style={{ position: 'relative' }}>
        <button
          style={styles.navItem}
          onClick={() => setSwitcherOpen((v) => !v)}
          aria-expanded={switcherOpen}
          aria-haspopup="true"
        >
          <GridIcon />
          <span style={styles.navLabel}>More</span>
        </button>

        {switcherOpen && (
          <div style={styles.switcherPanel} role="menu">
            <div className="eyebrow" style={{ padding: '4px 12px 8px' }}>
              Your network
            </div>
            {NETWORK_SITES.map((site) => (
              <a
                key={site.label}
                href={site.href}
                role="menuitem"
                style={{
                  ...styles.switcherItem,
                  color: site.current ? 'var(--accent-gold)' : 'var(--text)',
                }}
              >
                {site.label}
                {site.current && <span style={{ fontSize: 11 }}>&nbsp;· here</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  rail: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    zIndex: 10,
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--accent-crimson)',
    marginBottom: 28,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  navItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: '100%',
    alignItems: 'center',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: 64,
    padding: '10px 4px',
    borderRadius: 'var(--radius)',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
  },
  navLabel: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.02em',
  },
  spacer: { flex: 1 },
  switcherPanel: {
    position: 'absolute',
    left: 72,
    bottom: 0,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 4px',
    minWidth: 160,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  switcherItem: {
    display: 'block',
    padding: '8px 12px',
    fontSize: 13,
    borderRadius: 'var(--radius)',
  },
};

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-4 4-6 7-6s5.8 2 7 6" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="6.5" height="6.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" />
    </svg>
  );
}
