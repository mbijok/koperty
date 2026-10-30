import { describe, expect, it } from "vite-plus/test";
import { initials } from "@koperty/ui/primitives/avatar";

describe("initials", () => {
  it("takes the first letters of the first two words", () => {
    expect(initials("Ala Kowalska")).toBe("AK");
    expect(initials("  ewa   maria  nowak ")).toBe("EM");
    expect(initials("łukasz")).toBe("Ł");
  });

  it("falls back to a question mark for an empty name", () => {
    expect(initials("   ")).toBe("?");
  });
});
