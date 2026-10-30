import { describe, expect, it } from "vite-plus/test";
import {
  addMonths,
  formatDate,
  formatDayHeading,
  formatMonth,
  monthOf,
  todayInWarsaw,
} from "@koperty/ui/lib/dates";

describe("dates", () => {
  it("returns today's date in Warsaw, also late in the evening UTC", () => {
    expect(todayInWarsaw(new Date("2026-10-29T23:30:00Z"))).toBe("2026-10-30");
    expect(todayInWarsaw(new Date("2026-10-29T10:00:00Z"))).toBe("2026-10-29");
    expect(todayInWarsaw()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats dates and months in Polish", () => {
    expect(formatDate("2026-10-29")).toBe("29 października 2026");
    expect(formatDayHeading("2026-10-29")).toBe("czwartek, 29 października");
    expect(formatMonth("2026-10")).toBe("Październik 2026");
  });

  it("takes the month of a date", () => {
    expect(monthOf("2026-10-29")).toBe("2026-10");
  });

  it.each([
    ["2026-10", 1, "2026-11"],
    ["2026-12", 1, "2027-01"],
    ["2026-01", -1, "2025-12"],
    ["2026-10", -22, "2024-12"],
    ["2026-10", 0, "2026-10"],
  ])("adds months: %s %+i", (month, steps, result) => {
    expect(addMonths(month, steps)).toBe(result);
  });

  it("treats a malformed date as the start of year 0", () => {
    expect(formatMonth("")).toBe("Styczeń 1900");
  });
});
