'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', message }
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    setBusy(false);

    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }

    setStatus(
      mode === 'login'
        ? { type: 'success', message: 'Logged in.' }
        : { type: 'success', message: 'Check your email to confirm your account.' }
    );
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <div className="eyebrow">Anima account</div>
      <h1 className="display-title" style={{ fontSize: 30, margin: '6px 0 24px' }}>
        {mode === 'login' ? 'Log in' : 'Create an account'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={styles.label}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </label>

        <button type="submit" disabled={busy} style={styles.button}>
          {busy ? 'Working…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      {status && (
        <p
          style={{
            marginTop: 14,
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            color: status.type === 'error' ? 'var(--accent-crimson)' : 'var(--accent-gold)',
          }}
        >
          {status.message}
        </p>
      )}

      <button
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        style={styles.switchModeButton}
      >
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </div>
  );
}

const styles = {
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  input: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
  },
  button: {
    marginTop: 6,
    background: 'var(--accent-crimson)',
    color: '#14121b',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '11px 16px',
    fontWeight: 600,
    fontSize: 14,
  },
  switchModeButton: {
    marginTop: 18,
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 13,
    textDecoration: 'underline',
    padding: 0,
  },
};
