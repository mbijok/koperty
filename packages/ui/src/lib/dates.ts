// Operation dates are "YYYY-MM-DD" strings (PostgREST `date`), months are "YYYY-MM"; no Date objects
// in logic (engineering standards 4.4). Europe/Warsaw is the default time zone (AGENTS.md).

const TIME_ZONE = "Europe/Warsaw";

const isoDate = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });
const longDate = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dayHeading = new Intl.DateTimeFormat("pl-PL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const monthName = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function utc(date: string): number {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Today's date in Warsaw, e.g. "2026-10-30". */
export function todayInWarsaw(now: Date = new Date()): string {
  return isoDate.format(now);
}

/** "2026-10-29" → "29 października 2026". */
export function formatDate(date: string): string {
  return longDate.format(utc(date));
}

/** "2026-10-29" → "czwartek, 29 października" – heading of a day in the operations list. */
export function formatDayHeading(date: string): string {
  return dayHeading.format(utc(date));
}

/** "2026-10" → "Październik 2026". */
export function formatMonth(month: string): string {
  const text = monthName.format(utc(`${month}-01`));
  return text.charAt(0).toLocaleUpperCase("pl-PL") + text.slice(1);
}

/** "2026-10-29" → "2026-10". */
export function monthOf(date: string): string {
  return date.slice(0, 7);
}

/** "2026-10" + 3 → "2027-01"; negative steps go back. */
export function addMonths(month: string, steps: number): string {
  const [year = 0, monthNumber = 1] = month.split("-").map(Number);
  const index = year * 12 + (monthNumber - 1) + steps;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}
