// Small wrapper around fetch so every component talks to the backend the
// same way. Server components (like the pages in this app) can call this
// directly during rendering -- no loading spinners needed for the first
// paint since the data is already there by the time the page reaches you.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(path) {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. Add it in your .env.local (or Vercel Environment Variables).'
    );
  }

  const res = await fetch(`${API_URL}${path}`, {
    // Always get fresh data for now -- add caching once traffic makes it worth it.
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }

  return res.json();
}
