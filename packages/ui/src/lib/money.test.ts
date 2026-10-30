import { describe, expect, it } from "vite-plus/test";
import { formatAmountInput, formatPLN, parsePLN } from "@koperty/ui/lib/money";

const NBSP = " ";

describe("formatPLN", () => {
  it.each([
    [123456, `1${NBSP}234,56${NBSP}zł`],
    [500000, `5${NBSP}000,00${NBSP}zł`],
    [99, `0,99${NBSP}zł`],
    [0, `0,00${NBSP}zł`],
    [-3000, `−30,00${NBSP}zł`],
    [100000000, `1${NBSP}000${NBSP}000,00${NBSP}zł`],
  ])("formats %i grosze", (grosze, text) => {
    expect(formatPLN(grosze)).toBe(text);
  });
});

describe("formatAmountInput", () => {
  it("formats the value of an amount field", () => {
    expect(formatAmountInput(123450)).toBe(`1${NBSP}234,50`);
  });
});

describe("parsePLN", () => {
  it.each([
    ["120,50", 12050],
    ["120.50", 12050],
    ["120,5", 12050],
    ["1 234", 123400],
    [`1${NBSP}234,56`, 123456],
    ["5000 zł", 500000],
    ["0,01", 1],
    ["0", 0],
  ])("parses %s", (text, grosze) => {
    expect(parsePLN(text)).toBe(grosze);
  });

  it.each(["", "abc", "-10", "1,234", "12,345", ",50", "1.234,56"])("rejects %s", (text) => {
    expect(parsePLN(text)).toBeNull();
  });
});
