import { env } from './env';

export type SupabaseConfig =
  | { url: string; anonKey: string }
  | undefined;

export function getSupabaseConfig(): SupabaseConfig {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) 
    return undefined;

  return {
    url: env.VITE_SUPABASE_URL,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
  };
}
