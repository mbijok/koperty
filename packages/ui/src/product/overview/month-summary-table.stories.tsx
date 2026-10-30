import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import {
  MonthSummaryTable,
  type EnvelopeMonth,
} from "@koperty/ui/product/overview/month-summary-table";

// US-22: start + allocation − expenses = end, per envelope used in October.
const ROWS: EnvelopeMonth[] = [
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

const onRetry = fn();

const meta = {
  title: "Komponenty produktu/Przegląd budżetu/Tabela podsumowania miesiąca",
  component: MonthSummaryTable,
  args: {
    month: "2026-10",
    rows: ROWS,
    totals: { incomes: 500000, allocations: 251000, pool: 420000 },
  },
  decorators: [(Story) => <div className="max-w-content-wide">{Story()}</div>],
} satisfies Meta<typeof MonthSummaryTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("table", { name: "Podsumowanie: Październik 2026" }),
    ).toBeVisible();
    await expect(canvas.getByRole("rowheader", { name: "Chemia" })).toBeVisible();
    await expect(canvas.getByText("Debet")).toBeVisible();
    await expect(canvas.getByText("Do rozdysponowania")).toBeVisible();
  },
};

export const Ladowanie: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie podsumowania miesiąca…")).toBeInTheDocument();
  },
};

export const Pusto: Story = { args: { rows: [] } };

export const BezSumMiesiaca: Story = { args: { totals: undefined } };

export const BezDanych: Story = { args: { rows: undefined, totals: undefined } };

export const Blad: Story = {
  args: { error: "Nie udało się wczytać podsumowania", onRetry },
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const BladBezPonowienia: Story = { args: { error: "Nie udało się wczytać podsumowania" } };

export const DuzoDanych: Story = {
  args: {
    rows: [
      ...ROWS,
      ...[
        "Transport",
        "Zdrowie",
        "Dzieci",
        "Prezenty",
        "Ubrania",
        "Samochód",
        "Rozrywka",
        "Subskrypcje",
      ].map((name, index) => ({
        id: name,
        name,
        start: index * 1500,
        allocation: 20000 + index * 1000,
        expenses: 18000 + index * 2500,
        end: index * 1500 + 2000 - index * 1500,
      })),
    ],
  },
};

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <MonthSummaryTable
        {...args}
        rows={[
          {
            id: "remont",
            name: "Remont łazienki i kuchni w mieszkaniu na Ochocie",
            start: 1250000,
            allocation: 800000,
            expenses: 1523040,
            end: 526960,
          },
          ...ROWS,
        ]}
      />
    </NarrowScreen>
  ),
};
