import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { FormField } from "@koperty/ui/primitives/field";
import { Switch } from "@koperty/ui/primitives/switch";

const meta = {
  title: "Komponenty bazowe/Przełącznik",
  component: Switch,
  args: { onCheckedChange: fn() },
  argTypes: { disabled: { control: "boolean" }, checked: { control: "boolean" } },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-content">
      <FormField label="Pokaż zarchiwizowane koperty" orientation="horizontal">
        {(control) => <Switch {...args} {...control} />}
      </FormField>
    </div>
  ),
  play: async ({ args, canvas }) => {
    const toggle = canvas.getByRole("switch", { name: "Pokaż zarchiwizowane koperty" });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    // The label is part of the target: clicking it toggles the switch.
    await userEvent.click(canvas.getByText("Pokaż zarchiwizowane koperty"));
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    toggle.focus();
    await userEvent.keyboard(" ");
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(3);
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Wyłączony", node: <Switch aria-label="Pokaż zarchiwizowane koperty" /> },
        {
          label: "Włączony",
          node: <Switch aria-label="Pokaż zarchiwizowane koperty" defaultChecked />,
        },
        {
          label: "Fokus",
          node: <Switch aria-label="Pokaż zarchiwizowane koperty" data-preview-state="focus" />,
        },
        {
          label: "Zablokowany",
          node: <Switch aria-label="Pokaż zarchiwizowane koperty" disabled />,
        },
        {
          label: "Zablokowany, włączony",
          node: <Switch aria-label="Pokaż zarchiwizowane koperty" disabled defaultChecked />,
        },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <FormField
        label="Podziel wydatek na kilka kopert"
        hint="Np. jeden paragon za jedzenie i chemię. Suma części musi być równa kwocie wydatku."
        orientation="horizontal"
      >
        {(control) => <Switch {...control} />}
      </FormField>
    </NarrowScreen>
  ),
};
