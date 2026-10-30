import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { InvitationRow } from "@koperty/ui/product/budgets/invitation-row";

const meta = {
  title: "Komponenty produktu/Budżety i członkostwo/Wiersz zaproszenia",
  component: InvitationRow,
  args: { expiresOn: "2026-11-05", createdBy: "Ala Kowalska", onRevoke: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof InvitationRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByText(/Ważne do 5 listopada 2026/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Unieważnij…" }));
    await expect(args.onRevoke).toHaveBeenCalledOnce();
  },
};

export const BezUprawnien: Story = { args: { onRevoke: undefined } };

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <InvitationRow {...args} createdBy="Aleksandra Kowalska-Wiśniewska" />
    </NarrowScreen>
  ),
};
