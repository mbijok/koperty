import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Input } from "@koperty/ui/primitives/input";

// Inputs always have a visible label; stories without FormField use aria-label only to isolate the input.
const meta = {
  title: "Komponenty bazowe/Pole tekstowe",
  component: Input,
  args: { "aria-label": "Opis wydatku", placeholder: "np. Biedronka, zakupy na weekend" },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "email", "date"] },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Opis wydatku" });
    await userEvent.type(input, "Zakupy na weekend");
    await expect(input).toHaveValue("Zakupy na weekend");
  },
};

export const Typy: Story = {
  render: () => (
    <div className="flex max-w-content flex-col gap-between-groups">
      <Input
        aria-label="Adres e-mail"
        type="email"
        autoComplete="email"
        placeholder="ala@example.com"
      />
      <Input
        aria-label="Kod z wiadomości"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="6 cyfr"
      />
      <Input aria-label="Data wydatku" type="date" defaultValue="2026-10-29" />
    </div>
  ),
};

export const Stany: Story = {
  render: (args) => (
    <StateGrid
      states={[
        { label: "Puste (przykład w podpowiedzi)", node: <Input {...args} /> },
        { label: "Z wartością", node: <Input {...args} defaultValue="Zakupy na weekend" /> },
        { label: "Fokus", node: <Input {...args} data-preview-state="focus" /> },
        { label: "Błąd", node: <Input {...args} aria-invalid defaultValue="Zakupy" /> },
        {
          label: "Zablokowane",
          node: <Input {...args} disabled defaultValue="Zakupy na weekend" />,
        },
        {
          label: "Tylko do odczytu",
          node: <Input {...args} readOnly defaultValue="ala@example.com" />,
        },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: (args) => (
    <NarrowScreen>
      <Input
        {...args}
        defaultValue="Zakupy na weekend w Biedronce i drogerii, razem z chemią dla domu"
      />
    </NarrowScreen>
  ),
};
