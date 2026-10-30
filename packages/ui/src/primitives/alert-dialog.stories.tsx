import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@koperty/ui/primitives/alert-dialog";
import { Button } from "@koperty/ui/primitives/button";

const onDelete = fn();

function DeleteExpense({ open }: { open?: boolean }) {
  return (
    <AlertDialog defaultOpen={open}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Usuń wydatek">
          <Trash2 aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć wydatek „Biedronka” z 29 października?</AlertDialogTitle>
          <AlertDialogDescription>
            120,50 zł wróci do koperty „Jedzenie”. Tej operacji nie da się cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Usuń wydatek</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Waits for the server: the dialog stays open, the action shows progress and can't be sent twice.
function DeleteBudgetPending() {
  const [pending, setPending] = useState(false);
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usunąć budżet „Dom”?</AlertDialogTitle>
          <AlertDialogDescription>
            Wszystkie koperty, przychody i wydatki tego budżetu znikną dla obu członków. Tej
            operacji nie da się cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            loading={pending}
            loadingText="Usuwanie…"
            onClick={(event) => {
              event.preventDefault();
              setPending(true);
            }}
          >
            Usuń budżet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Komponenty bazowe/Dialog potwierdzenia",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 420 } } };
// Documented a11y exception, as for Dialog: static snapshot of an open modal ("aria-hidden-focus").
const openException = {
  a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
};

export const Playground: Story = {
  render: () => <DeleteExpense />,
  play: async ({ canvas, canvasElement }) => {
    onDelete.mockClear();
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Usuń wydatek" });
    await userEvent.click(trigger);
    const dialog = await body.findByRole("alertdialog", { name: /Usunąć wydatek „Biedronka”/ });
    // Focus starts on "Anuluj": the safe choice (WAI-ARIA alertdialog).
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Anuluj" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onDelete).not.toHaveBeenCalled();
    await userEvent.click(trigger);
    await userEvent.click(
      within(await body.findByRole("alertdialog")).getByRole("button", { name: "Usuń wydatek" }),
    );
    await expect(onDelete).toHaveBeenCalledOnce();
  },
};

export const Otwarty: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => <DeleteExpense open />,
};

export const Oczekiwanie: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => <DeleteBudgetPending />,
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Usuń budżet" }));
    const action = within(dialog).getByRole("button", { name: "Usuwanie…" });
    await expect(action).toHaveAttribute("aria-busy", "true");
    await expect(within(dialog).getByRole("button", { name: "Anuluj" })).toBeDisabled();
    await expect(dialog).toHaveAttribute("data-state", "open");
  },
};
