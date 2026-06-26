import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Node.js server environments (like Express API).
 * It expects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to be available in process.env.
 */
export function getServerClient(): SupabaseClient {
  // @ts-ignore - Ignore process.env typing for simplicity
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  // @ts-ignore
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and key must be configured in the environment for server functions.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

/**
 * Creates a Supabase client for use in browser/frontend environments (like Vite/React).
 * It uses the provided URL and ANON key (e.g., from import.meta.env).
 */
export function getBrowserClient(url: string, anonKey: string): SupabaseClient {
  if (!url || !anonKey) {
    console.error("Missing Supabase Browser Configuration!");
  }
  return createClient(url, anonKey);
}
