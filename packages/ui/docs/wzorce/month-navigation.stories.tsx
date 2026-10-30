import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher";
import {
  MonthSummaryTable,
  type EnvelopeMonth,
} from "@koperty/ui/product/overview/month-summary-table";

// Invented, consistent months (US-22): the end of September is the start of October; November is
// planned ahead with allocations only (US-16). The pool counts every allocation, also future ones.
const MONTHS: Record<string, { rows: EnvelopeMonth[]; incomes: number; allocations: number }> = {
  "2026-09": {
    rows: [
      {
        id: "jedzenie",
        name: "Jedzenie",
        start: 0,
        allocation: 80000,
        expenses: 68000,
        end: 12000,
      },
      { id: "chemia", name: "Chemia", start: 0, allocation: 6000, expenses: 4000, end: 2000 },
      {
        id: "wakacje",
        name: "Wakacje",
        start: 120000,
        allocation: 40000,
        expenses: 0,
        end: 160000,
      },
    ],
    incomes: 500000,
    allocations: 126000,
  },
  "2026-10": {
    rows: [
      {
        id: "jedzenie",
        name: "Jedzenie",
        start: 12000,
        allocation: 80000,
        expenses: 74050,
        end: 17950,
      },
      { id: "chemia", name: "Chemia", start: 2000, allocation: 6000, expenses: 11000, end: -3000 },
      {
        id: "wakacje",
        name: "Wakacje",
        start: 160000,
        allocation: 40000,
        expenses: 0,
        end: 200000,
      },
    ],
    incomes: 500000,
    allocations: 126000,
  },
  "2026-11": {
    rows: [
      {
        id: "jedzenie",
        name: "Jedzenie",
        start: 17950,
        allocation: 80000,
        expenses: 0,
        end: 97950,
      },
      {
        id: "wakacje",
        name: "Wakacje",
        start: 200000,
        allocation: 40000,
        expenses: 0,
        end: 240000,
      },
    ],
    incomes: 0,
    allocations: 120000,
  },
};
const POOL = 628000;
const CURRENT = "2026-10";

function MonthNavigation({ initial = CURRENT }: { initial?: string }) {
  const [month, setMonth] = useState(initial);
  const data = MONTHS[month];
  return (
    <div className="flex flex-col gap-between-groups">
      <MonthSwitcher month={month} onMonthChange={setMonth} />
      {month !== CURRENT && (
        <Button variant="link" size="sm" className="self-start" onClick={() => setMonth(CURRENT)}>
          Wróć do bieżącego miesiąca
        </Button>
      )}
      <MonthSummaryTable
        month={month}
        rows={data?.rows ?? []}
        totals={{ incomes: data?.incomes ?? 0, allocations: data?.allocations ?? 0, pool: POOL }}
      />
    </div>
  );
}

const meta = {
  title: "Wzorce/Nawigacja po miesiącach",
  component: MonthSwitcher,
  args: { month: CURRENT, onMonthChange: () => {} },
  decorators: [(Story) => <div className="max-w-content-wide">{Story()}</div>],
} satisfies Meta<typeof MonthSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

// Back to the past, ahead to a planned month and back to today in one click.
export const Playground: Story = {
  render: () => <MonthNavigation />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Następny miesiąc" }));
    await expect(canvas.getByText("Listopad 2026")).toBeVisible();
    await expect(canvas.getByText("Wakacje")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Wróć do bieżącego miesiąca" }));
    await expect(canvas.getByText("Październik 2026")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Wróć do bieżącego miesiąca" })).toBeNull();
  },
};

// A future month: allocations only, no expenses yet (US-16).
export const PrzyszlyMiesiac: Story = { render: () => <MonthNavigation initial="2026-11" /> };

// The year changes with the month; a month with no data shows the empty table.
export const PrzejscieRoku: Story = {
  render: () => <MonthNavigation initial="2026-12" />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Następny miesiąc" }));
    await expect(canvas.getByText("Styczeń 2027")).toBeVisible();
  },
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <MonthNavigation initial="2026-09" />
    </NarrowScreen>
  ),
};
