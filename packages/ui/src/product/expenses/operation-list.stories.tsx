import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import type { Operation } from "@koperty/ui/product/expenses/operation-row";
import { OperationList } from "@koperty/ui/product/expenses/operation-list";
import { OPERATIONS } from "#docs/data/operations.ts";

const MANY: Operation[] = Array.from({ length: 30 }, (_, index) => ({
  id: `m${index}`,
  type: index % 7 === 0 ? "income" : "expense",
  amount: 1999 + index * 731,
  date: `2026-10-${String(30 - Math.floor(index / 2)).padStart(2, "0")}`,
  description: ["Biedronka", "Orlen", "Apteka", "Rossmann", "Kino"][index % 5],
  envelopes:
    index % 7 === 0
      ? []
      : [["Jedzenie", "Transport", "Zdrowie", "Chemia", "Rozrywka"][index % 5] ?? "Jedzenie"],
  author: index % 2 ? "Tomasz Kowalski" : "Ala Kowalska",
}));

const onCreate = fn();
const onPreviousMonth = fn();
const onRetry = fn();

const meta = {
  title: "Komponenty produktu/Wydatki/Lista operacji",
  component: OperationList,
  args: { operations: OPERATIONS, month: "2026-10", onEdit: fn(), onDelete: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof OperationList>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-20: newest first, grouped by day, with amount, description, envelopes and author.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const days = canvas.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    await expect(days).toEqual([
      "czwartek, 29 października",
      "środa, 28 października",
      "poniedziałek, 26 października",
    ]);
    await userEvent.click(canvas.getByRole("button", { name: "Usuń przychód: Wypłata" }));
    await expect(args.onDelete).toHaveBeenLastCalledWith("i1");
    await userEvent.click(canvas.getByRole("button", { name: "Edytuj wydatek: Biedronka" }));
    await expect(args.onEdit).toHaveBeenLastCalledWith("e1");
  },
};

export const Ladowanie: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie operacji…")).toBeInTheDocument();
  },
};

// Two different empty states (polecenie budowy, Q5): nothing in this month vs nothing at all.
export const PustyMiesiac: Story = {
  args: { operations: [], month: "2026-11", onPreviousMonth },
  play: async ({ canvas }) => {
    onPreviousMonth.mockClear();
    await expect(canvas.getByText("Brak operacji w wybranym miesiącu")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Pokaż poprzedni miesiąc" }));
    await expect(onPreviousMonth).toHaveBeenCalledOnce();
  },
};

export const PustyMiesiacBezAkcji: Story = { args: { operations: undefined } };

export const PustyBudzet: Story = {
  args: { operations: [], budgetHasOperations: false, onCreate },
  play: async ({ canvas }) => {
    onCreate.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj wydatek" }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};

export const PustyBudzetBezAkcji: Story = { args: { operations: [], budgetHasOperations: false } };

export const Blad: Story = {
  args: { error: "Nie udało się wczytać operacji", onRetry },
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const BladBezPonowienia: Story = { args: { error: "Nie udało się wczytać operacji" } };

export const DuzoDanych: Story = { args: { operations: MANY } };

export const BezAkcji: Story = { args: { onEdit: undefined, onDelete: undefined } };

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <OperationList {...args} />
    </NarrowScreen>
  ),
};
