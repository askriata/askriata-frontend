// Client-side counterpart to lib/api.js. That one is for server components
// during the initial page render (no user context needed for public GETs).
// This one is for client components that need to act AS the logged-in
// user -- rating an episode, adding to your list, editing your profile --
// so every call attaches the Supabase access token as a Bearer header,
// same as middleware/auth.js on the backend expects.
'use client';

import { supabase } from './supabaseClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function apiGetAuthed(path) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, { headers, cache: 'no-store' });

  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API request failed: ${path} (${res.status})`);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API request failed: ${path} (${res.status})`);
  }
  return res.json();
}

export async function apiPut(path, body) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API request failed: ${path} (${res.status})`);
  }
  return res.json();
}

export async function apiDelete(path) {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API request failed: ${path} (${res.status})`);
  }
}
