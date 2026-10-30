import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { ConfirmDeleteDialog } from "@koperty/ui/patterns/confirm-delete-dialog";

const deleted = (): Promise<void> => Promise.resolve();
const serverDown = (): Promise<void> => Promise.reject(new Error("500"));
const neverAnswers = (): Promise<void> => new Promise(() => {});

const QUESTION = "Usunąć wydatek „Biedronka” z 29 października?";

const meta = {
  title: "Wzorce/Potwierdzenie usunięcia",
  component: ConfirmDeleteDialog,
  args: {
    open: false,
    onOpenChange: fn(),
    title: QUESTION,
    description: "Kwota 120,50 zł wróci do koperty Jedzenie. Tej operacji nie można cofnąć.",
    confirmLabel: "Usuń wydatek",
    onConfirm: fn(deleted),
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: (args) => <WithTrigger {...args} />,
} satisfies Meta<typeof ConfirmDeleteDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function WithTrigger(props: Parameters<typeof ConfirmDeleteDialog>[0]) {
  const [open, setOpen] = useState(props.open);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Usuń wydatek…
      </Button>
      <ConfirmDeleteDialog
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          props.onOpenChange(next);
        }}
      />
    </>
  );
}

async function openDialog(canvasElement: HTMLElement) {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Usuń wydatek…" }));
  return within(canvasElement.ownerDocument.body).findByRole("alertdialog", { name: QUESTION });
}

// The dialog closes only after the server confirmed the deletion.
export const Playground: Story = {
  play: async ({ args, canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Usuń wydatek" }));
    await expect(args.onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(false));
  },
};

// Easy to back out: Escape or "Anuluj", focus returns to the trigger, nothing deleted.
export const Rezygnacja: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Usuń wydatek…" });
    const dialog = await openDialog(canvasElement);
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Anuluj" })).toHaveFocus(),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(
      within(await openDialog(canvasElement)).getByRole("button", { name: "Anuluj" }),
    );
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const Oczekiwanie: Story = {
  args: { onConfirm: fn(neverAnswers) },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Usuń wydatek" }));
    await expect(within(dialog).getByRole("button", { name: "Usuwanie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(within(dialog).getByRole("button", { name: "Anuluj" })).toBeDisabled();
  },
};

// The error stays in the open dialog; closing it clears the message.
export const BladSerwera: Story = {
  args: { onConfirm: fn(serverDown) },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Usuń wydatek" }));
    await expect(
      await within(dialog).findByText("Nie udało się usunąć. Spróbuj ponownie za chwilę."),
    ).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Anuluj" }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const reopened = await openDialog(canvasElement);
    await expect(within(reopened).queryByText(/Nie udało się usunąć/)).toBeNull();
  },
};

export const BrakSieci: Story = {
  args: { onConfirm: fn(serverDown) },
  beforeEach: () => {
    Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
    return () => {
      Reflect.deleteProperty(navigator, "onLine");
    };
  },
  play: async ({ canvasElement }) => {
    const dialog = await openDialog(canvasElement);
    await userEvent.click(within(dialog).getByRole("button", { name: "Usuń wydatek" }));
    await expect(
      await within(dialog).findByText(/Brak połączenia z internetem/),
    ).toBeInTheDocument();
  },
};

// Opened by the screen (e.g. from a route) with nothing focused before: closing leaves focus to the page.
export const OtwartyOdRazu: Story = {
  args: { open: true },
  // Documented a11y exception, as for Dialog: the trigger behind an open modal ("aria-hidden-focus").
  parameters: { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } },
  play: async ({ args, canvasElement }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Anuluj" }));
    await waitFor(() => expect(args.onOpenChange).toHaveBeenLastCalledWith(false));
  },
};
