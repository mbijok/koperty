import { describe, expect, it } from "vite-plus/test";
import { readSupabaseConfig } from "@/lib/supabase-config";

describe("readSupabaseConfig", () => {
  it("returns trimmed settings", () => {
    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: " http://127.0.0.1:54321 ",
        VITE_SUPABASE_PUBLISHABLE_KEY: " sb_publishable_test ",
      }),
    ).toEqual({ url: "http://127.0.0.1:54321", publishableKey: "sb_publishable_test" });
  });

  it("throws when a variable is missing or blank", () => {
    expect(() => readSupabaseConfig({ VITE_SUPABASE_URL: "http://127.0.0.1:54321" })).toThrow(
      /VITE_SUPABASE_PUBLISHABLE_KEY/,
    );
    expect(() =>
      readSupabaseConfig({ VITE_SUPABASE_URL: "  ", VITE_SUPABASE_PUBLISHABLE_KEY: "key" }),
    ).toThrow(/VITE_SUPABASE_URL/);
  });

  it("throws on an invalid URL", () => {
    expect(() =>
      readSupabaseConfig({ VITE_SUPABASE_URL: "not a url", VITE_SUPABASE_PUBLISHABLE_KEY: "key" }),
    ).toThrow(/not a valid URL/);
  });
});
