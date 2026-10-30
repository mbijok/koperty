// Amounts are integer grosze everywhere (ADR 0004); these are the only formatting and parsing
// functions (engineering standards 4.4). Display only – no money arithmetic on floats.

const GROSZE_PER_ZLOTY = 100;
const MINUS = "−";

// Grouping always on (E3-P1): pl-PL leaves 4-digit numbers ungrouped, which breaks column alignment.
const currency = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  useGrouping: "always",
});
const plain = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
});

/** 123456 → "1 234,56 zł"; negative amounts use the minus sign: "−30,00 zł". */
export function formatPLN(grosze: number): string {
  return currency.format(grosze / GROSZE_PER_ZLOTY).replace("-", MINUS);
}

/** 123450 → "1 234,50" – the value shown in an amount field, without the currency. */
export function formatAmountInput(grosze: number): string {
  return plain.format(grosze / GROSZE_PER_ZLOTY);
}

/**
 * Parses what a person types into an amount field: "120,50", "120.50", "1 234", "5000 zł".
 * Returns grosze, or null when the text is not a non-negative amount with at most two decimals.
 */
export function parsePLN(text: string): number | null {
  const normalized = text.replace(/\s|zł/gi, "").replace(",", ".");
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) return null;
  const [, zlote = "", grosze = ""] = match;
  return Number(zlote) * GROSZE_PER_ZLOTY + Number(grosze.padEnd(2, "0"));
}
