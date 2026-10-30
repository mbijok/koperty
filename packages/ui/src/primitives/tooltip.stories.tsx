import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2 } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@koperty/ui/primitives/tooltip";

function IconAction({
  label,
  icon,
  open,
}: {
  label: string;
  icon: "delete" | "edit";
  open?: boolean;
}) {
  const Icon = icon === "delete" ? Trash2 : Pencil;
  return (
    <Tooltip defaultOpen={open}>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const meta = {
  title: "Komponenty bazowe/Podpowiedź",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 160 } } };

export const Playground: Story = {
  render: () => (
    <div className="flex gap-group p-section">
      <IconAction label="Zmień nazwę koperty" icon="edit" />
      <IconAction label="Usuń wydatek" icon="delete" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Usuń wydatek" });
    // Keyboard focus shows the tooltip too, not only the mouse (WCAG 1.4.13).
    await userEvent.tab();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(body.getByRole("tooltip")).toHaveTextContent("Usuń wydatek"));
    // Escape hides it without moving focus (dismissible, WCAG 1.4.13).
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const Stany: Story = {
  parameters: ownFrame,
  render: () => (
    <div className="p-section">
      <StateGrid
        states={[
          { label: "Ukryta", node: <IconAction label="Zmień nazwę koperty" icon="edit" /> },
          {
            label: "Widoczna (najechanie lub fokus)",
            node: <IconAction label="Usuń wydatek" icon="delete" open />,
          },
        ]}
      />
    </div>
  ),
};

export const DlugaTresc: Story = {
  parameters: ownFrame,
  render: () => (
    <NarrowScreen>
      <div className="flex justify-end">
        <IconAction
          label="Usuń zaproszenie dla nowego członka budżetu wysłane w poniedziałek"
          icon="delete"
          open
        />
      </div>
    </NarrowScreen>
  ),
};
