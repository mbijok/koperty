import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Avatar } from "@koperty/ui/primitives/avatar";

const meta = {
  title: "Komponenty bazowe/Awatar",
  component: Avatar,
  args: { name: "Ala Kowalska" },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <p className="flex items-center gap-group">
      <Avatar {...args} />
      <span className="text-label">{args.name}</span>
    </p>
  ),
  play: async ({ canvasElement }) => {
    const avatar = canvasElement.querySelector("[data-slot=avatar]");
    await expect(avatar).toHaveTextContent("AK");
    await expect(avatar).toHaveAttribute("aria-hidden", "true");
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Imię i nazwisko", node: <Avatar name="Ala Kowalska" /> },
        { label: "Jedno słowo", node: <Avatar name="ala" /> },
        { label: "Konto usunięte (US-03)", node: <Avatar name="Usunięty użytkownik" /> },
        { label: "Pusta nazwa", node: <Avatar name="" /> },
      ]}
    />
  ),
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <ul className="flex flex-col gap-group">
        {["Ala Kowalska", "Tomasz Kowalski", "Aleksandra Kowalska-Wiśniewska z Ochoty"].map(
          (name) => (
            <li key={name} className="flex items-center gap-group">
              <Avatar name={name} />
              <span className="min-w-0 text-label">{name}</span>
            </li>
          ),
        )}
      </ul>
    </NarrowScreen>
  ),
};
