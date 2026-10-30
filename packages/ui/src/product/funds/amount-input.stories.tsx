import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { FormField } from "@koperty/ui/primitives/field";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";

function ControlledAmount({ initial = "", error }: { initial?: string; error?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <FormField label="Kwota" hint="W złotych, np. 120,50" error={error}>
      {(control) => <AmountInput {...control} value={value} onValueChange={setValue} />}
    </FormField>
  );
}

const meta = {
  title: "Komponenty produktu/Przychody i przydziały/Pole kwoty",
  component: AmountInput,
  args: { value: "", onValueChange: () => {} },
  argTypes: { value: { control: false }, onValueChange: { control: false } },
} satisfies Meta<typeof AmountInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="max-w-content">
      <ControlledAmount />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Kwota");
    await expect(input).toHaveAttribute("inputmode", "decimal");
    // A valid amount is tidied up when leaving the field; invalid text stays for the person to fix.
    await userEvent.type(input, "1234,5");
    await userEvent.tab();
    await expect(input).toHaveValue("1 234,50");
    await userEvent.clear(input);
    await userEvent.type(input, "12,345");
    await userEvent.tab();
    await expect(input).toHaveValue("12,345");
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Puste", node: <ControlledAmount /> },
        { label: "Z wartością", node: <ControlledAmount initial="120,50" /> },
        {
          label: "Błąd (US-17)",
          node: <ControlledAmount initial="0" error="Podaj kwotę większą od zera." />,
        },
        {
          label: "Zła liczba miejsc po przecinku",
          node: (
            <ControlledAmount
              initial="12,345"
              error="Podaj kwotę z najwyżej dwoma miejscami po przecinku, np. 12,34."
            />
          ),
        },
      ]}
    />
  ),
};

export const DuzaKwota: Story = {
  render: () => (
    <NarrowScreen>
      <ControlledAmount initial="12 345 678,90" />
    </NarrowScreen>
  ),
};
