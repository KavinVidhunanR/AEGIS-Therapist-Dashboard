// FIX: The manual type definitions for `import.meta.env` were incorrect and did not correctly
// augment the global types. Using the Vite client types reference is the standard and correct
// way to provide types for environment variables in a Vite project.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a flag to check if the application is configured.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the client, passing empty strings if the env vars are not set.
// This prevents a crash on import and allows the app to display a config error.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');