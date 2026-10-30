import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { EnvelopeCard, EnvelopeCardSkeleton } from "@koperty/ui/product/envelopes/envelope-card";

const meta = {
  title: "Komponenty produktu/Koperty/Karta koperty",
  component: EnvelopeCard,
  args: {
    name: "Jedzenie",
    balance: 17950,
    onAllocate: fn(),
    onRename: fn(),
    onArchive: fn(),
    onRestore: fn(),
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof EnvelopeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 260 } } };

export const Playground: Story = {
  parameters: ownFrame,
  play: async ({ args, canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Więcej akcji: Jedzenie" }));
    const menu = await body.findByRole("menu");
    // US-13: archiving needs a zero balance – the item is blocked and says why.
    await expect(
      within(menu).getByRole("menuitem", { name: /Zarchiwizuj \(saldo musi wynosić/ }),
    ).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(within(menu).getByRole("menuitem", { name: "Przydziel środki" }));
    await expect(args.onAllocate).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const ZerowaDoArchiwizacji: Story = {
  parameters: ownFrame,
  args: { name: "Prezenty", balance: 0 },
  play: async ({ args, canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Więcej akcji: Prezenty" }));
    await userEvent.click(
      within(await body.findByRole("menu")).getByRole("menuitem", { name: "Zarchiwizuj" }),
    );
    await expect(args.onArchive).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const Zarchiwizowana: Story = {
  parameters: ownFrame,
  args: { name: "Wakacje 2025", balance: 0, archived: true },
  play: async ({ args, canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(canvas.getByText("Zarchiwizowana")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Więcej akcji: Wakacje 2025" }));
    await userEvent.click(
      within(await body.findByRole("menu")).getByRole("menuitem", { name: "Przywróć" }),
    );
    await expect(args.onRestore).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const Stany: Story = {
  render: (args) => (
    <StateGrid
      states={[
        { label: "Saldo dodatnie", node: <EnvelopeCard {...args} /> },
        { label: "Debet (K3)", node: <EnvelopeCard {...args} name="Chemia" balance={-3000} /> },
        {
          label: "Zarchiwizowana",
          node: <EnvelopeCard {...args} name="Wakacje 2025" balance={0} archived />,
        },
        { label: "Ładowanie", node: <EnvelopeCardSkeleton /> },
      ]}
    />
  ),
};

const onMoveUp = fn();

export const ZmianaKolejnosci: Story = {
  render: (args) => (
    <div className="flex flex-col gap-between-groups">
      <EnvelopeCard {...args} name="Rachunki" reorder={{ onMoveDown: fn() }} />
      <EnvelopeCard {...args} name="Jedzenie" reorder={{ onMoveUp, onMoveDown: fn() }} />
      <EnvelopeCard {...args} name="Wakacje" reorder={{ onMoveUp: fn() }} />
    </div>
  ),
  play: async ({ canvas }) => {
    onMoveUp.mockClear();
    await expect(canvas.getByRole("button", { name: "Przesuń w górę: Rachunki" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Przesuń w dół: Wakacje" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Przesuń w górę: Jedzenie" }));
    await expect(onMoveUp).toHaveBeenCalledOnce();
  },
};

export const DlugaNazwa: Story = {
  render: (args) => (
    <NarrowScreen>
      <EnvelopeCard
        {...args}
        name="Remont łazienki i kuchni w mieszkaniu na Ochocie"
        balance={-1234567}
      />
    </NarrowScreen>
  ),
};
