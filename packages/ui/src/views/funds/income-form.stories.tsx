import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, userEvent, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { todayInWarsaw } from "@koperty/ui/lib/dates";
import {
  OFFLINE_MESSAGE,
  SERVER_MESSAGE,
  type SubmitResult,
} from "@koperty/ui/patterns/use-form-submit";
import { IncomeForm } from "@koperty/ui/views/funds/income-form";

type IncomeResult = SubmitResult<"amount" | "date" | "description">;

const saved = (): Promise<IncomeResult> => Promise.resolve({ ok: true });
// Simulated API responses (polecenie budowy): codes from the error contract in docs/architecture.md.
const amountRejected = (): Promise<IncomeResult> =>
  Promise.resolve({
    ok: false,
    fieldErrors: { amount: "Serwer nie przyjął tej kwoty. Sprawdź ją i spróbuj ponownie." }, // AMOUNT_INVALID
  });
const forbidden = (): Promise<IncomeResult> =>
  Promise.resolve({ ok: false, formError: "Nie masz już dostępu do tego budżetu." }); // FORBIDDEN
const serverDown = (): Promise<IncomeResult> => Promise.reject(new Error("500"));
const neverAnswers = (): Promise<IncomeResult> => new Promise(() => {});

let confirm: (result: IncomeResult) => void = () => {};
const waitsForServer = (): Promise<IncomeResult> =>
  new Promise((resolve) => {
    confirm = resolve;
  });

const meta = {
  title: "Wzorce/Formularz",
  component: IncomeForm,
  args: { submit: fn(saved), onSuccess: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof IncomeForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// A new income: today's date, amount typed in złoty, sent in grosze.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByLabelText("Data")).toHaveValue(todayInWarsaw());
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(args.submit).toHaveBeenLastCalledWith({
      amount: 500000,
      date: todayInWarsaw(),
      description: "",
    });
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

// Editing (US-15): the form starts with the saved values and can be cancelled.
export const Edycja: Story = {
  args: {
    initial: { amount: "5 000,00", date: "2026-10-28", description: "Wypłata" },
    submitLabel: "Zapisz zmiany",
    onCancel: fn(),
  },
  play: async ({ args, canvas }) => {
    await fireEvent.change(canvas.getByLabelText("Data"), { target: { value: "2026-10-27" } });
    await userEvent.type(canvas.getByLabelText(/Opis/), " październik ");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));
    await expect(args.submit).toHaveBeenLastCalledWith({
      amount: 500000,
      date: "2026-10-27",
      description: "Wypłata październik",
    });
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

// Validation on blur: the error shows after leaving the field and disappears once it's fixed.
export const BladPoOpuszczeniuPola: Story = {
  play: async ({ canvas }) => {
    const amount = canvas.getByLabelText("Kwota");
    await userEvent.type(amount, "0");
    await userEvent.tab();
    await expect(canvas.getByText("Podaj kwotę większą od zera.")).toBeVisible();
    await expect(amount).toHaveAttribute("aria-invalid", "true");
    await userEvent.clear(amount);
    await userEvent.type(amount, "120,50");
    await userEvent.tab();
    await expect(canvas.queryByText("Podaj kwotę większą od zera.")).toBeNull();
  },
};

// Validation on submit: every error at once, focus on the first one, nothing sent.
export const BledyPrzyWyslaniu: Story = {
  args: { initial: { date: "" } },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(canvas.getByText("Podaj kwotę, np. 5000 albo 120,50.")).toBeVisible();
    await expect(canvas.getByText("Podaj datę przychodu.")).toBeVisible();
    await expect(canvas.getByLabelText("Kwota")).toHaveFocus();
    await expect(args.submit).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByLabelText("Data"));
    await userEvent.click(canvas.getByLabelText(/Opis/));
    await expect(canvas.getByText("Podaj datę przychodu.")).toBeVisible();
  },
};

// Waiting for the server: the button shows progress and a second submit sends nothing.
export const Oczekiwanie: Story = {
  args: { submit: fn(neverAnswers) },
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    const busy = canvas.getByRole("button", { name: "Zapisywanie…" });
    await expect(busy).toHaveAttribute("aria-busy", "true");
    await userEvent.click(busy);
    const form = canvasElement.querySelector("form");
    if (form) await fireEvent.submit(form);
    await expect(args.submit).toHaveBeenCalledOnce();
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

// Success only after the server confirms (polecenie budowy).
export const SukcesPoPotwierdzeniu: Story = {
  args: { submit: fn(waitsForServer) },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(args.onSuccess).not.toHaveBeenCalled();
    confirm({ ok: true });
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

// A business error mapped to its field; focus moves there and the typed value stays.
export const BladPolaZSerwera: Story = {
  args: { submit: fn(amountRejected) },
  play: async ({ args, canvas }) => {
    const amount = canvas.getByLabelText("Kwota");
    await userEvent.type(amount, "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(await canvas.findByText(/Serwer nie przyjął tej kwoty/)).toBeVisible();
    await waitFor(() => expect(amount).toHaveFocus());
    await expect(amount).toHaveDisplayValue(/^5\s000,00$/);
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

// A business error of the whole form (no field to point at).
export const BladUprawnien: Story = {
  args: { submit: fn(forbidden) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(await canvas.findByText("Nie masz już dostępu do tego budżetu.")).toBeVisible();
  },
};

export const BladSerwera: Story = {
  args: { submit: fn(serverDown) },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
    await expect(canvas.getByLabelText("Kwota")).toHaveDisplayValue(/^5\s000,00$/);
    await expect(args.onSuccess).not.toHaveBeenCalled();
  },
};

// No network: navigator.onLine is false only for this story.
export const BrakSieci: Story = {
  args: { submit: fn(serverDown) },
  beforeEach: () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
    return () => {
      Reflect.deleteProperty(navigator, "onLine");
    };
  },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "5000");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przychód" }));
    await expect(await canvas.findByText(OFFLINE_MESSAGE)).toBeVisible();
    await expect(canvas.getByLabelText("Kwota")).toHaveDisplayValue(/^5\s000,00$/);
  },
};

export const WaskiEkran: Story = {
  args: { onCancel: fn() },
  render: (args) => (
    <NarrowScreen>
      <IncomeForm {...args} />
    </NarrowScreen>
  ),
};
