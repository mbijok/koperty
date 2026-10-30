import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { FieldGroup, FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import { Switch } from "@koperty/ui/primitives/switch";

const meta = {
  title: "Komponenty bazowe/Pole formularza",
  component: FormField,
  args: {
    label: "Kwota",
    hint: "W złotych, np. 120,50",
    children: (control) => <Input {...control} inputMode="decimal" />,
  },
  argTypes: { children: { table: { disable: true } } },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Kwota");
    await expect(input).toHaveAttribute("aria-required", "true");
    await expect(input).toHaveAccessibleDescription("W złotych, np. 120,50");
    await userEvent.click(canvas.getByText("Kwota"));
    await expect(input).toHaveFocus();
  },
};

export const Opcjonalne: Story = {
  args: {
    label: "Opis",
    hint: "Np. sklep albo cel zakupu",
    optional: true,
    children: (control) => <Input {...control} />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Opis (opcjonalnie)" });
    await expect(input).not.toHaveAttribute("aria-required");
  },
};

export const BezPodpowiedzi: Story = {
  args: { label: "Nazwa koperty", hint: undefined, children: (control) => <Input {...control} /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Nazwa koperty")).not.toHaveAttribute("aria-describedby");
  },
};

export const ZBledem: Story = {
  args: {
    error: "Podaj kwotę większą od zera.",
    children: (control) => <Input {...control} inputMode="decimal" defaultValue="0" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Kwota");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(
      "W złotych, np. 120,50 Podaj kwotę większą od zera.",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Podaj kwotę większą od zera.");
  },
};

export const Poziome: Story = {
  args: {
    label: "Pokaż zarchiwizowane koperty",
    hint: undefined,
    orientation: "horizontal",
    children: (control) => <Switch {...control} />,
  },
};

export const GrupaPol: Story = {
  render: () => (
    <FieldGroup className="max-w-content">
      <FormField label="Kwota" hint="W złotych, np. 120,50">
        {(control) => <Input {...control} inputMode="decimal" />}
      </FormField>
      <FormField label="Data">
        {(control) => <Input {...control} type="date" defaultValue="2026-10-29" />}
      </FormField>
      <FormField label="Opis" optional>
        {(control) => <Input {...control} />}
      </FormField>
    </FieldGroup>
  ),
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <FormField
        label="Nazwa wyświetlana dla innych członków budżetu"
        hint="Tak zobaczą Cię osoby, z którymi prowadzisz wspólny budżet, np. przy autorze wydatku."
        error="Nazwa może mieć najwyżej 50 znaków. Skróć ją o 12 znaków."
      >
        {(control) => (
          <Input
            {...control}
            defaultValue="Aleksandra Kowalska-Wiśniewska z mieszkania na Ochocie"
          />
        )}
      </FormField>
    </NarrowScreen>
  ),
};
