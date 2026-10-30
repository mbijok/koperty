import { describe, expect, it } from "vite-plus/test";
import { contrastRatio, formatRatio, parseSrgb, relativeLuminance } from "./contrast";

describe("contrast", () => {
  it("computes luminance of black and white", () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1);
  });

  it("computes the WCAG ratio regardless of argument order", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21);
    expect(contrastRatio([255, 255, 255], [118, 118, 118])).toBeCloseTo(4.54, 2);
    expect(contrastRatio([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2);
  });

  it("parses and clamps a computed srgb colour", () => {
    expect(parseSrgb("color(srgb 1 0.5 0)")).toEqual([255, 128, 0]);
    expect(parseSrgb("color(srgb 1.02 -0.01 2e-3)")).toEqual([255, 0, 1]);
    expect(parseSrgb("none")).toEqual([0, 0, 0]);
  });

  it("formats a ratio in pl-PL", () => {
    expect(formatRatio(4.5)).toBe("4,50 : 1");
  });
});
