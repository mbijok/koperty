import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher";
import {
  MonthSummaryTable,
  type EnvelopeMonth,
} from "@koperty/ui/product/overview/month-summary-table";
import { Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

// US-22: start + allocation − expenses = end for each envelope used in the month.
const OCTOBER: EnvelopeMonth[] = [
  {
    id: "jedzenie",
    name: "Jedzenie",
    start: 12000,
    allocation: 80000,
    expenses: 74050,
    end: 17950,
  },
  { id: "rachunki", name: "Rachunki", start: 0, allocation: 125000, expenses: 125000, end: 0 },
  { id: "chemia", name: "Chemia", start: 2000, allocation: 6000, expenses: 11000, end: -3000 },
  { id: "wakacje", name: "Wakacje", start: 160000, allocation: 40000, expenses: 0, end: 200000 },
];
const NOVEMBER: EnvelopeMonth[] = [
  { id: "jedzenie", name: "Jedzenie", start: 17950, allocation: 80000, expenses: 0, end: 97950 },
  { id: "wakacje", name: "Wakacje", start: 200000, allocation: 40000, expenses: 0, end: 240000 },
];
const POOL = 300000;

const meta = {
  title: "Ekrany/Przegląd budżetu",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Summary({
  initial = "2026-10",
  state,
}: {
  initial?: string;
  state?: "loading" | "error";
}) {
  const [month, setMonth] = useState(initial);
  const rows = month === "2026-10" ? OCTOBER : month === "2026-11" ? NOVEMBER : [];
  return (
    <Screen section="podsumowanie" title="Podsumowanie miesiąca" width="wide">
      <MonthSwitcher month={month} onMonthChange={setMonth} />
      <MonthSummaryTable
        month={month}
        rows={rows}
        totals={{
          incomes: month === "2026-10" ? 500000 : 0,
          allocations: rows.reduce((sum, row) => sum + row.allocation, 0),
          pool: POOL,
        }}
        loading={state === "loading"}
        error={state === "error" ? "Nie udało się wczytać podsumowania" : undefined}
        onRetry={() => {}}
      />
    </Screen>
  );
}

export const Podsumowanie: Story = {
  name: "Podsumowanie miesiąca",
  render: () => <Summary />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Następny miesiąc" }));
    await expect(canvas.getByText("Listopad 2026")).toBeVisible();
  },
};

// A planned month: allocations only (US-16).
export const PodsumowaniePrzyszlyMiesiac: Story = {
  name: "Podsumowanie: przyszły miesiąc",
  render: () => <Summary initial="2026-11" />,
};

export const PodsumowaniePusto: Story = {
  name: "Podsumowanie: miesiąc bez kopert",
  render: () => <Summary initial="2026-08" />,
};

export const PodsumowanieLadowanie: Story = {
  name: "Podsumowanie: ładowanie",
  render: () => <Summary state="loading" />,
};

export const PodsumowanieBlad: Story = {
  name: "Podsumowanie: błąd",
  render: () => <Summary state="error" />,
};
