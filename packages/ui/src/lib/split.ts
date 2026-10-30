import { parsePLN } from "@koperty/ui/lib/money";

// Suggestions for the expense split form (US-18). The database checks that the parts add up to the
// expense (PRD 4.6); these helpers only help the person fill the form.

/**
 * Splits an amount equally between the given parts, in grosze; the indivisible remainder goes to the
 * first part (PRD 4.6): 10000 between 3 parts → 3334, 3333, 3333. Returns [part, amount] pairs.
 */
export function splitEvenly<T>(total: number, parts: T[]): [T, number][] {
  const base = Math.floor(total / parts.length);
  const remainder = total - base * parts.length;
  return parts.map((part, index) => [part, index === 0 ? base + remainder : base]);
}

/** What is still to be split: the total minus the parts that are valid amounts (others count as 0). */
export function remainingToSplit(total: number, parts: string[]): number {
  return parts.reduce((left, text) => left - (parsePLN(text) ?? 0), total);
}
