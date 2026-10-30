import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, ChevronDown, EllipsisVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@koperty/ui/primitives/dropdown-menu";

const onEdit = fn();

function EnvelopeActions({ open }: { open?: boolean }) {
  return (
    <DropdownMenu defaultOpen={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Więcej akcji: Jedzenie">
          <EllipsisVertical aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onEdit}>
          <Pencil aria-hidden="true" />
          Zmień nazwę
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Archive aria-hidden="true" />
          Zarchiwizuj
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Plus aria-hidden="true" />
          Dodaj przydział (koperta zarchiwizowana)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">
          <Trash2 aria-hidden="true" />
          Usuń…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BudgetSwitcher({ open, current = "dom" }: { open?: boolean; current?: string }) {
  return (
    <DropdownMenu defaultOpen={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {current === "dom" ? "Dom" : "Mieszkanie na Ochocie"}
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Budżety</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current}>
          <DropdownMenuRadioItem value="dom">Dom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ochota">
            Wspólne mieszkanie na Ochocie z Tomkiem i Kasią
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus aria-hidden="true" />
          Utwórz budżet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: "Komponenty bazowe/Menu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 320 } } };
// Documented a11y exception: an open menu hides the page with aria-hidden while focus is in the menu.
const openException = {
  a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
};

export const Playground: Story = {
  render: () => <EnvelopeActions />,
  play: async ({ canvas, canvasElement }) => {
    onEdit.mockClear();
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Więcej akcji: Jedzenie" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await body.findByRole("menu");
    // Arrow keys move between items, disabled items are skipped, Escape returns focus to the trigger.
    await waitFor(() =>
      expect(within(menu).getByRole("menuitem", { name: "Zmień nazwę" })).toHaveFocus(),
    );
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(menu).getByRole("menuitem", { name: "Zarchiwizuj" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(menu).getByRole("menuitem", { name: "Usuń…" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Enter}");
    await expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const Otwarte: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => (
    <div className="flex justify-end">
      <EnvelopeActions open />
    </div>
  ),
};

export const PrzelacznikBudzetu: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => <BudgetSwitcher open />,
};

export const Stany: Story = {
  render: () => (
    <div className="flex flex-wrap gap-between-groups">
      <BudgetSwitcher />
      <BudgetSwitcher current="ochota" />
    </div>
  ),
};
