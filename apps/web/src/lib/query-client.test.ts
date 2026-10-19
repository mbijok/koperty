import { describe, expect, it } from "vite-plus/test";
import { queryClient } from "@/lib/query-client";

describe("queryClient", () => {
  it("keeps data fresh for 30 s and skips refetch on window focus", () => {
    expect(queryClient.getDefaultOptions().queries).toEqual({
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    });
  });
});
