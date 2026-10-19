import { createClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn<() => string>(() => "client") }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("supabase", () => {
  it("creates the client from the validated environment", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", " http://127.0.0.1:54321 ");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");

    const { supabase } = await import("@/lib/supabase");

    expect(supabase).toBe("client");
    expect(createClient).toHaveBeenCalledWith("http://127.0.0.1:54321", "sb_publishable_test");
  });

  it("fails fast when the environment is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");

    await expect(import("@/lib/supabase")).rejects.toThrow(/VITE_SUPABASE_URL/);
  });
});
