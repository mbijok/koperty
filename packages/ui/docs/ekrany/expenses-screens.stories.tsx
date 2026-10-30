import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SERVER_MESSAGE, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { OperationsPanel } from "@koperty/ui/views/expenses/operations-panel";
import { ExpenseDetails, type ExpenseDetail } from "@koperty/ui/views/expenses/expense-details";
import { ExpenseForm, type ExpenseFormProps } from "@koperty/ui/views/expenses/expense-form";
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

// US-19: editing a saved expense (/expenses/<id>/edit), also one saved by another member.
type EditResult = SubmitResult<string>;
type Edited = { form: NonNullable<ExpenseFormProps["initial"]>; details: ExpenseDetail };

const ONE_ENVELOPE: Edited = {
  form: {
    amount: "120,50",
    date: "2026-10-29",
    description: "Biedronka",
    parts: [{ envelopeId: "jedzenie", amount: "120,50" }],
  },
  details: {
    amount: 12050,
    date: "2026-10-29",
    description: "Biedronka",
    author: "Ala Kowalska",
    parts: [{ envelope: "Jedzenie", amount: 12050 }],
  },
};

const SPLIT: Edited = {
  form: {
    amount: "100,00",
    date: "2026-10-29",
    description: "Rossmann i Lidl",
    parts: [
      { envelopeId: "jedzenie", amount: "65,00" },
      { envelopeId: "chemia", amount: "35,00" },
    ],
  },
  details: {
    amount: 10000,
    date: "2026-10-29",
    description: "Rossmann i Lidl",
    author: "Tomasz Kowalski",
    parts: [
      { envelope: "Jedzenie", amount: 6500 },
      { envelope: "Chemia", amount: 3500 },
    ],
  },
};

const neverAnswers = (): Promise<EditResult> => new Promise(() => {});
const serverDown = (): Promise<EditResult> => Promise.reject(new Error("500"));

// After saving the app returns to the details, which show the change – so no toast (E2-P13).
function EditExpense({
  expense = ONE_ENVELOPE,
  submit = ok,
}: {
  expense?: Edited;
  submit?: () => Promise<EditResult>;
}) {
  const [saved, setSaved] = useState(false);
  return (
    <>
      {saved ? (
        <Screen section="operacje">
          <ExpenseDetails expense={expense.details} onBack={noop} onEdit={noop} onDelete={noop} />
        </Screen>
      ) : (
        <Screen section="operacje" title="Edycja wydatku">
          <ExpenseForm
            envelopes={ENVELOPES}
            initial={expense.form}
            submitLabel="Zapisz zmiany"
            submit={submit}
            onSuccess={() => setSaved(true)}
            onCancel={noop}
          />
        </Screen>
      )}
    </>
  );
}

async function saveChanges(canvas: Parameters<NonNullable<Story["play"]>>[0]["canvas"]) {
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));
}

export const EdycjaLadowanie: Story = {
  name: "Edycja: ładowanie",
  render: () => (
    <Screen section="operacje" title="Edycja wydatku">
      <div aria-busy="true" className="flex flex-col gap-between-groups">
        <output className="sr-only">Ładowanie wydatku…</output>
        {["amount", "envelope", "date", "description"].map((field) => (
          <div key={field} className="flex flex-col gap-group">
            <Skeleton className="h-badge w-1/3" />
            <Skeleton className="h-control w-full" />
          </div>
        ))}
      </div>
    </Screen>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie wydatku…")).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Zapisz zmiany" })).toBeNull();
  },
};

export const EdycjaWydatku: Story = {
  name: "Edycja wydatku",
  render: () => <EditExpense />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Edycja wydatku");
    await expect(canvas.getByLabelText("Kwota")).toHaveValue("120,50");
    await expect(canvas.getByRole("combobox", { name: "Koperta" })).toHaveTextContent("Jedzenie");
    await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
  },
};

// US-19, US-18: an expense with several parts opens with the split turned on.
export const EdycjaPodzialu: Story = {
  name: "Edycja: podział",
  render: () => <EditExpense expense={SPLIT} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("group", { name: /Część/ })).toHaveLength(2);
    await expect(canvas.getByText("Podzielono całą kwotę.")).toBeVisible();
  },
};

export const EdycjaBrak: Story = {
  name: "Edycja: nie istnieje albo brak dostępu",
  // PT404: the API doesn't tell "doesn't exist" from "no access", so neither does the screen.
  render: () => (
    <Screen section="operacje" title="Edycja wydatku">
      <ExpenseDetails onBack={noop} />
    </Screen>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText("Wydatek nie istnieje albo nie masz do niego dostępu."),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Wróć do operacji" })).toBeVisible();
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  },
};

export const EdycjaZapisywanie: Story = {
  name: "Edycja: zapisywanie",
  render: () => <EditExpense submit={neverAnswers} />,
  play: async ({ canvas }) => {
    await saveChanges(canvas);
    await expect(canvas.getByRole("button", { name: "Zapisywanie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

export const EdycjaBladSerwera: Story = {
  name: "Edycja: błąd serwera",
  render: () => <EditExpense submit={serverDown} />,
  play: async ({ canvas }) => {
    await saveChanges(canvas);
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
    await expect(canvas.getByLabelText("Kwota")).toHaveValue("120,50");
  },
};

// Success only after the server confirms; the details show the saved data.
export const EdycjaSukces: Story = {
  name: "Edycja: sukces",
  render: () => <EditExpense expense={SPLIT} />,
  play: async ({ canvas, canvasElement }) => {
    await saveChanges(canvas);
    await expect(
      await canvas.findByRole("heading", { level: 1, name: "Rossmann i Lidl" }),
    ).toBeVisible();
    await expect(
      within(canvasElement.ownerDocument.body).queryByText("Zapisano wydatek"),
    ).toBeNull();
  },
};
