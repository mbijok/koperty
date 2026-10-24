import { createClient } from "@supabase/supabase-js";
import { readSupabaseConfig } from "@/lib/supabase-config";

const config = readSupabaseConfig(import.meta.env);

// Untyped until the first migration; switch to createClient<Database> after `supabase gen types` (S-01).
export const supabase = createClient(config.url, config.publishableKey);
