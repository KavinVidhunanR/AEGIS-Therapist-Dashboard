// FIX: Manually define types for import.meta.env.
// The `<reference types="vite/client" />` directive was failing in this environment.
// Using `declare global` correctly augments the global `ImportMeta` type.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a flag to check if the application is configured.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the client, passing empty strings if the env vars are not set.
// This prevents a crash on import and allows the app to display a config error.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
