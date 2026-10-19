import { describe, expect, it } from "vite-plus/test";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins conditional classes and lets later Tailwind classes win", () => {
    expect(cn("p-2 text-sm", { hidden: false, "font-bold": true }, "p-4")).toBe(
      "text-sm font-bold p-4",
    );
  });
});
