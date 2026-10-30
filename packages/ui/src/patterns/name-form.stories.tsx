import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import type { SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { NameForm } from "@koperty/ui/patterns/name-form";

const saved = (): Promise<SubmitResult<"name">> => Promise.resolve({ ok: true });
const taken = (): Promise<SubmitResult<"name">> =>
  Promise.resolve({ ok: false, fieldErrors: { name: "Masz już kopertę o tej nazwie." } }); // ENVELOPE_NAME_TAKEN

const meta = {
  title: "Wzorce/Formularz nazwy",
  component: NameForm,
  args: {
    label: "Nazwa koperty",
    hint: "Np. Jedzenie, Rachunki, Wakacje",
    emptyMessage: "Podaj nazwę koperty.",
    submitLabel: "Dodaj kopertę",
    submit: fn(saved),
    onSuccess: fn(),
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof NameForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-11: a new envelope; the name is trimmed.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa koperty"), " Transport ");
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj kopertę" }));
    await expect(args.submit).toHaveBeenLastCalledWith("Transport");
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

// US-12: renaming starts with the current name.
export const ZmianaNazwy: Story = {
  args: { initial: "Jedzenie", submitLabel: "Zmień nazwę", onCancel: fn() },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByLabelText("Nazwa koperty")).toHaveValue("Jedzenie");
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

// US-11 [Z3]: the name of an active envelope is taken.
export const NazwaZajeta: Story = {
  args: { submit: fn(taken) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Nazwa koperty"), "Jedzenie");
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj kopertę" }));
    await expect(await canvas.findByText("Masz już kopertę o tej nazwie.")).toBeVisible();
  },
};

// US-24: the display name, as on the profile screen.
export const NazwaWyswietlana: Story = {
  args: {
    label: "Nazwa wyświetlana",
    hint: "Tak zobaczą Cię inni członkowie budżetu.",
    emptyMessage: "Podaj nazwę wyświetlaną.",
    submitLabel: "Zapisz nazwę",
    initial: "ala",
  },
};

export const WaskiEkran: Story = {
  args: { onCancel: fn() },
  render: (args) => (
    <NarrowScreen>
      <NameForm {...args} />
    </NarrowScreen>
  ),
};
