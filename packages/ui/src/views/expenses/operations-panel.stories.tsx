import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { OperationsPanel } from "@koperty/ui/views/expenses/operations-panel";
import { BIEDRONKA, OPERATIONS, SALARY } from "#docs/data/operations.ts";

const BY_MONTH: Record<string, typeof OPERATIONS> = {
  "2026-10": OPERATIONS,
  "2026-09": [
    { ...SALARY, id: "i0", date: "2026-09-28" },
    { ...BIEDRONKA, id: "e0", date: "2026-09-27", amount: 8740 },
  ],
};

const meta = {
  title: "Wzorce/Lista z filtrem miesiąca",
  component: OperationsPanel,
  args: { month: "2026-10", currentMonth: "2026-10", operations: OPERATIONS, onMonthChange: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof OperationsPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

function Filtered() {
  const [month, setMonth] = useState("2026-10");
  return (
    <OperationsPanel
      month={month}
      currentMonth="2026-10"
      operations={BY_MONTH[month] ?? []}
      onMonthChange={setMonth}
    />
  );
}

// The filter is the month: the count follows it and the way back to today is one click.
export const Playground: Story = {
  render: () => <Filtered />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Liczba operacji: 5")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Wróć do bieżącego miesiąca" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Poprzedni miesiąc" }));
    await expect(canvas.getByText("Liczba operacji: 2")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Poprzedni miesiąc" }));
    await expect(canvas.getByText("Brak operacji w wybranym miesiącu")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Wróć do bieżącego miesiąca" }));
    await expect(canvas.getByText("Liczba operacji: 5")).toBeVisible();
  },
};

// The active filter is visible: another month shows the reset action.
export const InnyMiesiac: Story = {
  args: { month: "2026-09", operations: BY_MONTH["2026-09"] },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Wróć do bieżącego miesiąca" }));
    await expect(args.onMonthChange).toHaveBeenLastCalledWith("2026-10");
  },
};

// No results for the filter: points to the previous month.
export const BrakWynikowDlaFiltra: Story = {
  args: { month: "2026-11", currentMonth: "2026-11", operations: [] },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("Liczba operacji: 0")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Pokaż poprzedni miesiąc" }));
    await expect(args.onMonthChange).toHaveBeenLastCalledWith("2026-10");
  },
};

// Nothing here yet: a different message and the first action, not the previous month.
export const JeszczeNicTuNieMa: Story = {
  args: { operations: undefined, budgetHasOperations: false, onCreate: fn() },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText("Brak operacji w tym budżecie")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj wydatek" }));
    await expect(args.onCreate).toHaveBeenCalledOnce();
  },
};

// While loading or after an error the count is hidden: it would be wrong.
export const Ladowanie: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Liczba operacji/)).toBeNull();
  },
};

export const Blad: Story = {
  args: { error: "Nie udało się wczytać operacji", onRetry: fn() },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/Liczba operacji/)).toBeNull();
  },
};

export const WaskiEkran: Story = {
  args: { month: "2026-09", operations: BY_MONTH["2026-09"] },
  render: (args) => (
    <NarrowScreen>
      <OperationsPanel {...args} />
    </NarrowScreen>
  ),
};
