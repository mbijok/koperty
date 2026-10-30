import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { StateGrid } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { Spinner } from "@koperty/ui/primitives/spinner";

const meta = {
  title: "Komponenty bazowe/Wskaźnik ładowania",
  component: Spinner,
  args: { label: "Wysyłanie kodu…" },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Wysyłanie kodu…");
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Z tekstem dla czytnika", node: <Spinner label="Ładowanie operacji…" /> },
        {
          label: "Dekoracyjny (stan ogłasza przycisk)",
          node: (
            <Button loading loadingText="Zapisywanie…">
              Zapisz wydatek
            </Button>
          ),
        },
        {
          label: "Samodzielny, 20 px",
          node: <Spinner label="Ładowanie budżetu…" className="size-icon-standalone" />,
        },
      ]}
    />
  ),
};

export const ZWidocznymTekstem: Story = {
  render: () => (
    <p className="flex items-center gap-group text-body text-muted">
      <Spinner />
      Sprawdzanie zaproszenia…
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  },
};
