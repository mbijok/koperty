import { describe, expect, it } from "vite-plus/test";
import { remainingToSplit, splitEvenly } from "@koperty/ui/lib/split";

function amounts(total: number, count: number) {
  return splitEvenly(
    total,
    Array.from({ length: count }, (_, index) => index),
  ).map(([, amount]) => amount);
}

describe("splitEvenly", () => {
  it.each([
    [10000, 3, [3334, 3333, 3333]],
    [10000, 2, [5000, 5000]],
    [1, 3, [1, 0, 0]],
    [0, 2, [0, 0]],
    [12050, 1, [12050]],
  ])("splits %i grosze into %i parts", (total, count, result) => {
    expect(amounts(total, count)).toEqual(result);
  });

  it("keeps each part next to its amount and returns nothing for no parts", () => {
    expect(splitEvenly(10000, ["jedzenie", "chemia"])).toEqual([
      ["jedzenie", 5000],
      ["chemia", 5000],
    ]);
    expect(splitEvenly(10000, [])).toEqual([]);
  });
});

describe("remainingToSplit", () => {
  it("subtracts valid parts and ignores the rest", () => {
    expect(remainingToSplit(10000, ["70,00", "30,00"])).toBe(0);
    expect(remainingToSplit(10000, ["70,00", ""])).toBe(3000);
    expect(remainingToSplit(10000, ["70,00", "30,01"])).toBe(-1);
    expect(remainingToSplit(10000, ["abc"])).toBe(10000);
  });
});
