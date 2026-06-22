import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("SUPABASE KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);



export const isSupabaseConfigured = Boolean(url && anonKey && !url.includes("your-project"));

function createSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    console.warn(
      "[AGEIX] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and add your Supabase credentials."
    );
  }

  return createClient(url ?? "", anonKey ?? "", {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "ageix-auth",
    },
  });
}

export const supabase = createSupabaseClient();
