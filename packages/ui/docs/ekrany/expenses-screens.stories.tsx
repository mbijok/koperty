import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OperationsPanel } from "@koperty/ui/views/expenses/operations-panel";
import { ExpenseDetails } from "@koperty/ui/views/expenses/expense-details";
import { ExpenseForm } from "@koperty/ui/views/expenses/expense-form";
import { OPERATIONS } from "#docs/data/operations.ts";
import { Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const ENVELOPES = [
  { id: "rachunki", name: "Rachunki" },
  { id: "jedzenie", name: "Jedzenie" },
  { id: "chemia", name: "Chemia" },
  { id: "wakacje", name: "Wakacje" },
];
const ok = async () => ({ ok: true as const });
function noop() {}

const meta = {
  title: "Ekrany/Wydatki",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// US-17, E3-Q4: a separate page; in the app the amount gets focus on opening (focusAmountOnOpen).
export const NowyWydatek: Story = {
  name: "Nowy wydatek",
  render: () => (
    <Screen title="Nowy wydatek">
      <ExpenseForm envelopes={ENVELOPES} submit={ok} onSuccess={noop} onCancel={noop} />
    </Screen>
  ),
};

// US-18: one receipt split between two envelopes.
export const NowyWydatekPodzial: Story = {
  name: "Nowy wydatek: podział",
  render: () => (
    <Screen title="Nowy wydatek">
      <ExpenseForm
        envelopes={ENVELOPES}
        initial={{
          amount: "100,00",
          parts: [
            { envelopeId: "jedzenie", amount: "70,00" },
            { envelopeId: "chemia", amount: "30,00" },
          ],
        }}
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};

type ListState = "data" | "empty-month" | "empty-budget" | "loading" | "error";

function Operations({ state }: { state: ListState }) {
  return (
    <Screen section="operacje" title="Operacje">
      <OperationsPanel
        month={state === "empty-month" ? "2026-11" : "2026-10"}
        currentMonth="2026-10"
        onMonthChange={noop}
        operations={state === "data" ? OPERATIONS : []}
        budgetHasOperations={state !== "empty-budget"}
        loading={state === "loading"}
        error={state === "error" ? "Nie udało się wczytać operacji" : undefined}
        onRetry={noop}
        onCreate={noop}
        onEdit={noop}
        onDelete={noop}
      />
    </Screen>
  );
}

// US-20: operations of the month, newest first, grouped by day.
export const Operacje: Story = {
  render: () => <Operations state="data" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Liczba operacji: 5")).toBeVisible();
  },
};

export const OperacjePustyMiesiac: Story = {
  name: "Operacje: pusty miesiąc",
  render: () => <Operations state="empty-month" />,
};

export const OperacjePustyBudzet: Story = {
  name: "Operacje: pusty budżet",
  render: () => <Operations state="empty-budget" />,
};

export const OperacjeLadowanie: Story = {
  name: "Operacje: ładowanie",
  render: () => <Operations state="loading" />,
};

export const OperacjeBlad: Story = {
  name: "Operacje: błąd",
  render: () => <Operations state="error" />,
};

// US-19: the details screen has its own h1 (the expense), the amount and actions first.
export const Szczegoly: Story = {
  name: "Szczegóły wydatku",
  render: () => (
    <Screen section="operacje">
      <ExpenseDetails
        expense={{
          amount: 10000,
          date: "2026-10-29",
          description: "Rossmann i Lidl",
          author: "Tomasz Kowalski",
          parts: [
            { envelope: "Jedzenie", amount: 6500 },
            { envelope: "Chemia", amount: 3500 },
          ],
        }}
        onBack={noop}
        onEdit={noop}
        onDelete={noop}
      />
    </Screen>
  ),
};

export const SzczegolyBrak: Story = {
  name: "Szczegóły: nie istnieje albo brak dostępu",
  render: () => (
    <Screen section="operacje" title="Wydatek">
      <ExpenseDetails onBack={noop} />
    </Screen>
  ),
};
