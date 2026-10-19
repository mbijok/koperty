export type SupabaseConfig = { url: string; publishableKey: string };

type Env = Partial<Record<"VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY", string>>;

/** Reads and validates the public Supabase settings; fails fast when they are missing. */
export function readSupabaseConfig(env: Env): SupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy apps/web/.env.example to apps/web/.env.local.",
    );
  }
  if (!URL.canParse(url)) {
    throw new Error(`VITE_SUPABASE_URL is not a valid URL: ${url}`);
  }
  return { url, publishableKey };
}
