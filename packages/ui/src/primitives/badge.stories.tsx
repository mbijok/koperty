import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Badge } from "@koperty/ui/primitives/badge";

const meta = {
  title: "Komponenty bazowe/Znacznik",
  component: Badge,
  args: { children: "Właściciel" },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    const badge = canvas.getByText("Właściciel");
    await expect(badge).toBeVisible();
    // A badge is information, not a control: it never takes focus.
    await expect(badge).not.toHaveAttribute("tabindex");
  },
};

// The badge has no interactive states; the matrix shows the statuses used in the product.
export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Rola (US-09)", node: <Badge>Właściciel</Badge> },
        { label: "Rola (US-09)", node: <Badge>Członek</Badge> },
        { label: "Koperta (US-13)", node: <Badge>Zarchiwizowana</Badge> },
        { label: "Zaproszenie (US-07)", node: <Badge>Aktywne do 5 listopada</Badge> },
        { label: "Zaproszenie (US-08)", node: <Badge>Wygasło</Badge> },
        { label: "Zaproszenie (US-08)", node: <Badge>Wykorzystane</Badge> },
      ]}
    />
  ),
};

// K3: a negative balance is marked with the minus sign and the word, never with colour.
export const Debet: Story = {
  render: () => (
    <p className="flex items-center gap-inline">
      <span className="text-amount">−30,00 zł</span>
      <Badge>Debet</Badge>
    </p>
  ),
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <div className="flex flex-wrap items-center gap-inline">
        <span className="text-label">Aleksandra Kowalska-Wiśniewska</span>
        <Badge>Właściciel</Badge>
      </div>
    </NarrowScreen>
  ),
};
