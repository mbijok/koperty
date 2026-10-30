import { describe, expect, it } from "vite-plus/test";
import { cn } from "@koperty/ui/lib/utils";

describe("cn", () => {
  it("keeps a token font size and a token text colour together", () => {
    expect(cn("text-meta", "text-muted")).toBe("text-meta text-muted");
  });

  it("lets a later token override an earlier one of the same kind", () => {
    expect(cn("text-default", "text-muted")).toBe("text-muted");
    expect(cn("text-body", "text-meta")).toBe("text-meta");
    expect(cn("p-panel", "p-panel-compact")).toBe("p-panel-compact");
    expect(cn("h-control", "h-control-sm")).toBe("h-control-sm");
    expect(cn("rounded-control", "rounded-card")).toBe("rounded-card");
    expect(cn("shadow-card", "shadow-overlay")).toBe("shadow-overlay");
  });

  it("joins conditional classes", () => {
    expect(cn("gap-group", false, undefined, "px-control-x")).toBe("gap-group px-control-x");
  });
});
