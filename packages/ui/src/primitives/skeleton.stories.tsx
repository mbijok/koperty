import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Card, CardContent, CardHeader } from "@koperty/ui/primitives/card";
import { Skeleton } from "@koperty/ui/primitives/skeleton";

// The envelope list while it loads (US-21): same shape as the real cards, announced by the container.
function EnvelopeListLoading() {
  return (
    <section
      aria-busy="true"
      aria-labelledby="envelopes-title"
      className="flex max-w-content flex-col gap-between-groups"
    >
      <h2 id="envelopes-title" className="text-section">
        Koperty
      </h2>
      <output className="sr-only">Ładowanie kopert…</output>
      {[1, 2, 3].map((card) => (
        <Card key={card} size="compact">
          <CardHeader action={<Skeleton className="h-badge w-control" />}>
            <Skeleton className="h-badge w-content" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-badge" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

const meta = {
  title: "Komponenty bazowe/Szkielet ładowania",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <EnvelopeListLoading />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Ładowanie kopert…");
    const skeletons = [...canvasElement.querySelectorAll("[data-slot=skeleton]")];
    await expect(
      skeletons.every((skeleton) => skeleton.getAttribute("aria-hidden") === "true"),
    ).toBe(true);
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Linia tekstu", node: <Skeleton className="h-badge w-content" /> },
        { label: "Kwota główna", node: <Skeleton className="h-control w-content" /> },
        { label: "Przycisk", node: <Skeleton className="h-control w-control" /> },
        { label: "Awatar", node: <Skeleton className="size-avatar rounded-full" /> },
      ]}
    />
  ),
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <EnvelopeListLoading />
    </NarrowScreen>
  ),
};
