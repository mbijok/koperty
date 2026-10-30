import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { SERVER_MESSAGE, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";
import { CreateBudgetForm } from "@koperty/ui/views/budgets/create-budget-form";

const created = (): Promise<SubmitResult<"name">> => Promise.resolve({ ok: true });
const nameRejected = (): Promise<SubmitResult<"name">> =>
  Promise.resolve({ ok: false, fieldErrors: { name: "Serwer nie przyjął tej nazwy. Zmień ją." } }); // BUDGET_NAME_INVALID
const neverAnswers = (): Promise<SubmitResult<"name">> => new Promise(() => {});

const meta = {
  title: "Wzorce/Pierwsze uruchomienie",
  component: CreateBudgetForm,
  args: { submit: fn(created), onSuccess: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof CreateBudgetForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-04: a person without budgets names the first one; the name is trimmed.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa budżetu"), "  Dom ");
    await userEvent.click(canvas.getByRole("button", { name: "Utwórz budżet" }));
    await expect(args.submit).toHaveBeenLastCalledWith("Dom");
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

export const PustaNazwa: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa budżetu"), "   ");
    await userEvent.tab();
    await expect(canvas.getByText("Podaj nazwę budżetu.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Utwórz budżet" }));
    await expect(args.submit).not.toHaveBeenCalled();
  },
};

export const Tworzenie: Story = {
  args: { submit: fn(neverAnswers) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa budżetu"), "Dom");
    await userEvent.click(canvas.getByRole("button", { name: "Utwórz budżet" }));
    await expect(canvas.getByRole("button", { name: "Tworzenie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

export const BladNazwyZSerwera: Story = {
  args: { submit: fn(nameRejected) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa budżetu"), "Dom");
    await userEvent.click(canvas.getByRole("button", { name: "Utwórz budżet" }));
    await expect(await canvas.findByText(/Serwer nie przyjął tej nazwy/)).toBeVisible();
  },
};

export const BladSerwera: Story = {
  args: { submit: fn((): Promise<SubmitResult<"name">> => Promise.reject(new Error("500"))) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa budżetu"), "Dom");
    await userEvent.click(canvas.getByRole("button", { name: "Utwórz budżet" }));
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
  },
};

// Another budget from the budget switcher: the form can be cancelled.
export const KolejnyBudzet: Story = {
  args: { onCancel: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

// US-21: a new budget – pool 0 zł and the first two steps: an envelope and an income.
export const PustyBudzet: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <PoolSummary amount={0} action={<Button variant="secondary">Dodaj przychód</Button>} />
      <EnvelopeList envelopes={[]} onCreate={() => {}} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Dodaj przychód" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Dodaj kopertę" })).toBeVisible();
  },
};

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <CreateBudgetForm {...args} />
    </NarrowScreen>
  ),
};
