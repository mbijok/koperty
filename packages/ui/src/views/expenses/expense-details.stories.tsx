import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { ExpenseDetails, type ExpenseDetail } from "@koperty/ui/views/expenses/expense-details";

const SPLIT: ExpenseDetail = {
  amount: 10000,
  date: "2026-10-29",
  description: "Rossmann i Lidl",
  author: "Tomasz Kowalski",
  parts: [
    { envelope: "Jedzenie", amount: 6500 },
    { envelope: "Chemia", amount: 3500 },
  ],
};

const meta = {
  title: "Wzorce/Widok szczegółów",
  component: ExpenseDetails,
  args: { expense: SPLIT, onBack: fn(), onEdit: fn(), onDelete: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof ExpenseDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

// The amount and the actions come first, the split below (polecenie budowy).
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Rossmann i Lidl");
    await expect(canvas.getByRole("heading", { name: "Podział na koperty" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Edytuj wydatek" }));
    await expect(args.onEdit).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Usuń wydatek…" }));
    await expect(args.onDelete).toHaveBeenCalledOnce();
  },
};

// Partial data: no description, one envelope.
export const BezOpisuJednaKoperta: Story = {
  args: {
    expense: {
      amount: 25000,
      date: "2026-10-28",
      author: "Ala Kowalska",
      parts: [{ envelope: "Rachunki", amount: 25000 }],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Wydatek bez opisu");
    await expect(canvas.getByRole("heading", { name: "Koperta" })).toBeVisible();
  },
};

export const Ladowanie: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie wydatku…")).toBeInTheDocument();
  },
};

// Doesn't exist or no access: one message for both, as PT404 in the error contract (docs/architecture.md).
export const NieIstniejeAlboBrakDostepu: Story = {
  args: { expense: undefined },
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByText("Wydatek nie istnieje albo nie masz do niego dostępu."),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Wróć do operacji" }));
    await expect(args.onBack).toHaveBeenCalledOnce();
  },
};

export const Blad: Story = {
  args: { expense: undefined, error: "Nie udało się wczytać wydatku", onRetry: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};

export const BladBezPonowienia: Story = {
  args: { expense: undefined, error: "Nie udało się wczytać wydatku" },
};

// Only the actions the person may take are shown.
export const TylkoUsuwanie: Story = { args: { onEdit: undefined } };

export const BezAkcji: Story = { args: { onEdit: undefined, onDelete: undefined } };

export const WaskiEkran: Story = {
  args: {
    expense: {
      ...SPLIT,
      description: "Zakupy na urodziny Zosi w Rossmannie, Lidlu i na targu",
      parts: [
        { envelope: "Jedzenie", amount: 4500 },
        { envelope: "Chemia", amount: 3500 },
        { envelope: "Prezenty i okazje rodzinne", amount: 2000 },
      ],
    },
  },
  render: (args) => (
    <NarrowScreen>
      <ExpenseDetails {...args} />
    </NarrowScreen>
  ),
};
