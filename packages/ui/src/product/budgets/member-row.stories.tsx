import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { MemberRow } from "@koperty/ui/product/budgets/member-row";

const meta = {
  title: "Komponenty produktu/Budżety i członkostwo/Wiersz członka",
  component: MemberRow,
  args: {
    name: "Tomasz Kowalski",
    memberRole: "member",
    viewerIsOwner: true,
    onToggleOwner: fn(),
    onRemove: fn(),
    onLeave: fn(),
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof MemberRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Nadaj rolę właściciela" }));
    await expect(args.onToggleOwner).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Usuń z budżetu…" }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

// US-10: the only owner can't leave; the reason is shown next to the blocked button (E2-Q1).
export const JedynyWlasciciel: Story = {
  args: { name: "Ala Kowalska", memberRole: "owner", isCurrentUser: true, isOnlyOwner: true },
  play: async ({ canvas }) => {
    const leave = canvas.getByRole("button", { name: "Opuść budżet…" });
    await expect(leave).toBeDisabled();
    await expect(leave).toHaveAccessibleDescription(/Jesteś jedynym właścicielem/);
  },
};

export const Stany: Story = {
  render: (args) => (
    <StateGrid
      states={[
        { label: "Właściciel widzi członka", node: <MemberRow {...args} /> },
        {
          label: "Właściciel widzi właściciela",
          node: <MemberRow {...args} name="Kasia Nowak" memberRole="owner" />,
        },
        {
          label: "Ja, członek",
          node: <MemberRow {...args} name="Tomasz Kowalski" isCurrentUser viewerIsOwner={false} />,
        },
        {
          label: "Ja, jedyny właściciel",
          node: (
            <MemberRow {...args} name="Ala Kowalska" memberRole="owner" isCurrentUser isOnlyOwner />
          ),
        },
        {
          label: "Członek widzi innych",
          node: <MemberRow name="Kasia Nowak" memberRole="owner" />,
        },
        {
          label: "Bez akcji usuwania",
          node: (
            <MemberRow name="Kasia Nowak" memberRole="member" viewerIsOwner onToggleOwner={fn()} />
          ),
        },
        {
          label: "Ja bez akcji",
          node: <MemberRow name="Tomasz Kowalski" memberRole="member" isCurrentUser />,
        },
      ]}
    />
  ),
};

const onLeave = fn();

export const OpuszczenieBudzetu: Story = {
  args: { isCurrentUser: true, viewerIsOwner: false, onLeave },
  play: async ({ canvas }) => {
    onLeave.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Opuść budżet…" }));
    await expect(onLeave).toHaveBeenCalledOnce();
  },
};

export const DlugaNazwa: Story = {
  render: (args) => (
    <NarrowScreen>
      <MemberRow {...args} name="Aleksandra Kowalska-Wiśniewska z mieszkania na Ochocie" />
    </NarrowScreen>
  ),
};
