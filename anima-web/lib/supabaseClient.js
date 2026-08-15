// Client-side Supabase instance, used only for auth (login/signup) in the
// browser. Uses the ANON key -- safe to expose, unlike the service_role
// key the backend uses.
'use client';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
