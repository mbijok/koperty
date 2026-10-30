import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { ColorRoles, ContrastTable, TokenTable, TypeSpecimen } from "./foundations";
import { DoDont } from "./frames";
import {
  colorRoles,
  contrastPairs,
  layoutTokens,
  shapeTokens,
  spacingLevels,
  typeRoles,
} from "./foundations-data";

// Tests for the Foundations documentation blocks. Hidden from the sidebar: the MDX pages under
// Fundamenty render the same blocks.
const meta = {
  title: "Fundamenty/Bloki",
  tags: ["!dev", "!autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Kolory: Story = { render: () => <ColorRoles roles={colorRoles} /> };

// Every documented pair must meet its WCAG threshold in both themes.
export const Kontrast: Story = {
  render: () => <ContrastTable pairs={contrastPairs} />,
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getAllByText(", spełnia próg")).toHaveLength(contrastPairs.length * 2),
    );
    await expect(canvas.queryAllByText(", poniżej progu")).toHaveLength(0);
  },
};

// A separator is not a control boundary: shows how the table marks a pair below its threshold.
export const KontrastPonizejProgu: Story = {
  render: () => (
    <ContrastTable
      pairs={[
        {
          fg: "border-subtle",
          bg: "surface-page",
          kind: "ui",
          use: "Separator użyty jako granica pola",
        },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getAllByText(", poniżej progu")).toHaveLength(2));
  },
};

export const Typografia: Story = { render: () => <TypeSpecimen roles={typeRoles} /> };

export const Odstepy: Story = {
  render: () => (
    <TokenTable
      caption="Poziomy odstępów"
      rows={spacingLevels}
      preview={(row) => (
        <span
          aria-hidden="true"
          className="block h-badge bg-action-primary"
          style={{ width: `var(--${row.token})` }}
        />
      )}
    />
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText("0.25rem")).toBeVisible());
  },
};

export const TokenyBezPodgladu: Story = {
  render: () => <TokenTable caption="Układ" rows={[...layoutTokens, ...shapeTokens]} />,
};

export const DobrzeIZle: Story = {
  render: () => (
    <DoDont
      good={{ node: <span>Zapisz wydatek</span>, note: "czasownik i obiekt." }}
      bad={{ node: <span>OK</span>, note: "nie mówi, co się stanie." }}
    />
  ),
};
