# Anima — frontend

The visual site: browse page, media detail pages, login. Talks to your
Render API for data and to Supabase directly (browser-side) for login.

## What's built vs. stubbed

- **Home (`/`)** — full catalog grid, filterable by type (anime/manga/etc),
  pulling live from your API.
- **Media detail (`/media/[id]`)** — full entry page: description, genres,
  studio, episode count, score.
- **Login (`/login`)** — working log in / sign up against Supabase Auth.
- **Search (`/search`)** and **Profile (`/profile`)** — placeholder pages
  only, so the nav doesn't 404. The API routes they'll eventually call
  (`/characters/search`, `/staff/search`, `/profiles/me`) already exist
  from the backend build — these pages just need a form wired up to them.

## Local setup

```
npm install
cp .env.local.example .env.local
# fill in .env.local with your Render API URL + Supabase URL/anon key
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel

1. Push this `anima-web` folder to its own GitHub repository (separate
   from the backend repo).
2. Go to vercel.com, sign up free, click **Add New → Project**, and import
   that repository.
3. Vercel auto-detects Next.js — you don't need to set a build/start
   command, that part is genuinely zero-config.
4. Before deploying, open **Environment Variables** and add the same three
   values from `.env.local.example`:
   - `NEXT_PUBLIC_API_URL` — your live Render URL, e.g. `https://anima-4b6k.onrender.com`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. You'll get a live URL like `https://anima-web.vercel.app`.

## One thing to circle back on

Once this is live, go back to your Render service's environment variables
and change `ALLOWED_ORIGINS` from `*` to your real Vercel URL
(e.g. `https://anima-web.vercel.app`). Right now the API accepts requests
from anywhere, which is fine for testing, but should be locked down to
just your frontend once both are live.
