export type Rgb = readonly [number, number, number];

function linearChannel(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

// WCAG 2.x relative luminance of an sRGB colour with 0–255 channels.
export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * linearChannel(r) + 0.7152 * linearChannel(g) + 0.0722 * linearChannel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Reads the sRGB channels that getComputedStyle returns for a colour-mix() in srgb.
// Channels outside the sRGB gamut are clamped, like a browser does when painting.
export function parseSrgb(value: string): Rgb {
  const [r = 0, g = 0, b = 0] = (value.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map((n) =>
    Math.round(Math.min(1, Math.max(0, Number(n))) * 255),
  );
  return [r, g, b];
}

// WCAG 1.4.3 (text) and 1.4.11 (interface components, focus indicators).
export const CONTRAST_THRESHOLD = { text: 4.5, ui: 3 } as const;

export type ContrastKind = keyof typeof CONTRAST_THRESHOLD;

export function formatRatio(ratio: number): string {
  return `${ratio.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} : 1`;
}
