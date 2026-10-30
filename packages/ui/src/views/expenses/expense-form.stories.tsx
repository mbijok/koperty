import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { todayInWarsaw } from "@koperty/ui/lib/dates";
import { SERVER_MESSAGE, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { ExpenseForm } from "@koperty/ui/views/expenses/expense-form";

type ExpenseResult = SubmitResult<string>;

const ENVELOPES = [
  { id: "jedzenie", name: "Jedzenie" },
  { id: "chemia", name: "Chemia" },
  { id: "rachunki", name: "Rachunki" },
];

let nextId = 1;
const createPartId = () => `p${nextId++}`;

const saved = (): Promise<ExpenseResult> => Promise.resolve({ ok: true });
// Simulated API responses: codes from the error contract in docs/architecture.md.
const archived = (): Promise<ExpenseResult> =>
  Promise.resolve({
    ok: false,
    fieldErrors: { envelope: "Ta koperta została zarchiwizowana. Wybierz inną." }, // ENVELOPE_ARCHIVED
  });
const splitsInvalid = (): Promise<ExpenseResult> =>
  Promise.resolve({ ok: false, formError: "Serwer nie przyjął podziału. Sprawdź części." }); // SPLITS_INVALID
const serverDown = (): Promise<ExpenseResult> => Promise.reject(new Error("500"));

const meta = {
  title: "Wzorce/Podział wydatku",
  component: ExpenseForm,
  args: { envelopes: ENVELOPES, submit: fn(saved), onSuccess: fn(), createPartId },
  argTypes: { envelopes: { control: false } },
  parameters: { docs: { story: { inline: false, iframeHeight: 640 } } },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof ExpenseForm>;

export default meta;

type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story["play"]>>[0]["canvas"];

async function choose(canvasElement: HTMLElement, trigger: HTMLElement, option: string) {
  await userEvent.click(trigger);
  const body = within(canvasElement.ownerDocument.body);
  await userEvent.click(await body.findByRole("option", { name: option }));
  await waitFor(() => expect(body.queryByRole("listbox")).toBeNull());
}

async function splitOn(canvas: Canvas) {
  await userEvent.click(canvas.getByRole("switch", { name: "Podziel wydatek na kilka kopert" }));
}

// US-17: one envelope, today's date, the description is optional; focus starts on the amount (E3-Q4).
export const Playground: Story = {
  args: { focusAmountOnOpen: true },
  play: async ({ args, canvas, canvasElement }) => {
    const amount = canvas.getByLabelText("Kwota");
    await waitFor(() => expect(amount).toHaveFocus());
    await userEvent.type(amount, "120,50");
    await choose(canvasElement, canvas.getByRole("combobox", { name: "Koperta" }), "Jedzenie");
    await userEvent.type(canvas.getByLabelText(/Opis/), " Biedronka ");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(args.submit).toHaveBeenLastCalledWith({
      amount: 12050,
      date: todayInWarsaw(),
      description: "Biedronka",
      parts: [{ envelopeId: "jedzenie", amount: 12050 }],
    });
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

// US-18: 100,00 zł → Jedzenie 70,00 and Chemia 30,00; the chosen envelope becomes the first part.
export const PodzialNaDwieKoperty: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "100");
    await choose(canvasElement, canvas.getByRole("combobox", { name: "Koperta" }), "Jedzenie");
    await splitOn(canvas);
    const [first, second] = canvas.getAllByRole("group", { name: /Część/ });
    if (!first || !second) throw new Error("two parts expected");
    await expect(within(first).getByRole("combobox", { name: "Koperta" })).toHaveTextContent(
      "Jedzenie",
    );
    await userEvent.type(within(first).getByLabelText("Kwota"), "70");
    await choose(
      canvasElement,
      within(second).getByRole("combobox", { name: "Koperta" }),
      "Chemia",
    );
    await userEvent.type(within(second).getByLabelText("Kwota"), "30");
    await expect(canvas.getByText("Podzielono całą kwotę.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(args.submit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        amount: 10000,
        parts: [
          { envelopeId: "jedzenie", amount: 7000 },
          { envelopeId: "chemia", amount: 3000 },
        ],
      }),
    );
  },
};

// US-18: the sum is off by a grosz – nothing is sent and the parts stay as typed.
export const SumaCzesciSieNieZgadza: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.type(canvas.getByLabelText("Kwota"), "100");
    await splitOn(canvas);
    const [first, second] = canvas.getAllByRole("group", { name: /Część/ });
    if (!first || !second) throw new Error("two parts expected");
    await choose(
      canvasElement,
      within(first).getByRole("combobox", { name: "Koperta" }),
      "Jedzenie",
    );
    await userEvent.type(within(first).getByLabelText("Kwota"), "70");
    await choose(
      canvasElement,
      within(second).getByRole("combobox", { name: "Koperta" }),
      "Chemia",
    );
    await userEvent.type(within(second).getByLabelText("Kwota"), "29,99");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(canvas.getByText("Części muszą dać razem kwotę wydatku.")).toBeVisible();
    await expect(canvas.getByText(/Do podziału: 0,01/)).toBeVisible();
    await expect(args.submit).not.toHaveBeenCalled();
  },
};

// Errors of the parts: each at its field, focus on the first one.
export const BledyCzesci: Story = {
  play: async ({ args, canvas }) => {
    await splitOn(canvas);
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(canvas.getByText("Podaj kwotę, np. 120,50.")).toBeVisible();
    await expect(canvas.getAllByText("Wybierz kopertę.")).toHaveLength(2);
    await expect(canvas.getAllByText("Podaj kwotę części większą od zera.")).toHaveLength(2);
    await expect(canvas.queryByText("Części muszą dać razem kwotę wydatku.")).toBeNull();
    await expect(canvas.getAllByLabelText("Kwota")[0]).toHaveFocus();
    await expect(args.submit).not.toHaveBeenCalled();
  },
};

// Without a split: the envelope, the amount and the date are required.
export const BledyPrzyWyslaniu: Story = {
  args: { initial: { date: "" } },
  play: async ({ canvas }) => {
    const amount = canvas.getByLabelText("Kwota");
    await userEvent.type(amount, "0");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(canvas.getByText("Podaj kwotę większą od zera.")).toBeVisible();
    await expect(canvas.getByText("Wybierz kopertę.")).toBeVisible();
    await expect(canvas.getByText("Podaj datę wydatku.")).toBeVisible();
    await expect(amount).toHaveFocus();
    await userEvent.click(canvas.getByLabelText("Data"));
    await userEvent.click(canvas.getByLabelText(/Opis/));
    await expect(canvas.getByText("Podaj datę wydatku.")).toBeVisible();
  },
};

// US-19: editing a split expense opens with the split; turning it off keeps the first envelope.
export const EdycjaPodzialu: Story = {
  args: {
    initial: {
      amount: "100,00",
      date: "2026-10-29",
      description: "Rossmann i Lidl",
      parts: [
        { envelopeId: "jedzenie", amount: "65,00" },
        { envelopeId: "chemia", amount: "35,00" },
      ],
    },
    submitLabel: "Zapisz zmiany",
    onCancel: fn(),
  },
  play: async ({ args, canvas }) => {
    await expect(canvas.getAllByRole("group", { name: /Część/ })).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: "Podziel po równo" }));
    await expect(canvas.getAllByLabelText("Kwota")[1]).toHaveValue("50,00");
    await splitOn(canvas);
    await expect(canvas.getByRole("combobox", { name: "Koperta" })).toHaveTextContent("Jedzenie");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));
    await expect(args.submit).toHaveBeenLastCalledWith({
      amount: 10000,
      date: "2026-10-29",
      description: "Rossmann i Lidl",
      parts: [{ envelopeId: "jedzenie", amount: 10000 }],
    });
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

// Editing a one-envelope expense; the date can be changed.
export const EdycjaJednejKoperty: Story = {
  args: {
    initial: {
      amount: "250,00",
      date: "2026-10-28",
      parts: [{ envelopeId: "rachunki", amount: "250,00" }],
    },
  },
  play: async ({ args, canvas }) => {
    await userEvent.clear(canvas.getByLabelText("Data"));
    await userEvent.type(canvas.getByLabelText("Data"), "2026-10-27");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(args.submit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        date: "2026-10-27",
        parts: [{ envelopeId: "rachunki", amount: 25000 }],
      }),
    );
  },
};

// The split can be turned off before any part was chosen.
export const WylaczeniePodzialu: Story = {
  play: async ({ canvas }) => {
    await splitOn(canvas);
    await splitOn(canvas);
    await expect(canvas.getByRole("combobox", { name: "Koperta" })).toHaveTextContent(
      "Wybierz kopertę",
    );
  },
};

// Without createPartId the parts get random ids.
export const KopertaZarchiwizowana: Story = {
  args: {
    createPartId: undefined,
    submit: fn(archived),
    initial: { amount: "120,50", parts: [{ envelopeId: "jedzenie", amount: "120,50" }] },
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(await canvas.findByText(/została zarchiwizowana/)).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("combobox", { name: "Koperta" })).toHaveFocus());
  },
};

export const PodzialOdrzuconyPrzezSerwer: Story = {
  args: {
    submit: fn(splitsInvalid),
    initial: {
      amount: "100,00",
      parts: [
        { envelopeId: "jedzenie", amount: "70,00" },
        { envelopeId: "chemia", amount: "30,00" },
      ],
    },
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(await canvas.findByText(/Serwer nie przyjął podziału/)).toBeVisible();
  },
};

export const BladSerwera: Story = {
  args: {
    submit: fn(serverDown),
    initial: { amount: "120,50", parts: [{ envelopeId: "jedzenie", amount: "120,50" }] },
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
  },
};

export const WaskiEkran: Story = {
  args: {
    initial: {
      amount: "100,00",
      parts: [
        { envelopeId: "jedzenie", amount: "33,34" },
        { envelopeId: "chemia", amount: "33,33" },
        { envelopeId: "rachunki", amount: "33,33" },
      ],
    },
  },
  render: (args) => (
    <NarrowScreen>
      <ExpenseForm {...args} />
    </NarrowScreen>
  ),
};
