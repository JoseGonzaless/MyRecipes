import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from './env';

let supabaseSingleton: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'Check your .env and .env.example.'
    );
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/** App-wide Supabase client (singleton). */
export const supabase: SupabaseClient =
  supabaseSingleton ?? (supabaseSingleton = createSupabaseClient());
