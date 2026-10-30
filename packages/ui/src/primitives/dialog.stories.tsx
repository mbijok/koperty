import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@koperty/ui/primitives/dialog";
import { FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";

const onSave = fn();

function RenameEnvelope({ open, name = "Jedzenie" }: { open?: boolean; name?: string }) {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">Zmień nazwę</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień nazwę koperty</DialogTitle>
          <DialogDescription>Nowa nazwa pojawi się też w historii operacji.</DialogDescription>
        </DialogHeader>
        <FormField label="Nazwa koperty">
          {(control) => <Input {...control} defaultValue={name} />}
        </FormField>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Anuluj</Button>
          </DialogClose>
          <Button onClick={onSave}>Zapisz nazwę</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Komponenty bazowe/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

// Open dialogs render in their own iframe in the docs, so they don't cover the page.
const ownFrame = { docs: { story: { inline: false, iframeHeight: 480 } } };
// Documented a11y exception: while open, Radix hides the page (aria-hidden) and keeps focus in the
// dialog; a static snapshot still sees the focusable trigger under aria-hidden ("aria-hidden-focus").
const openException = {
  a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
};

export const Playground: Story = {
  render: () => <RenameEnvelope />,
  play: async ({ canvas, canvasElement }) => {
    onSave.mockClear();
    const trigger = canvas.getByRole("button", { name: "Zmień nazwę" });
    await userEvent.click(trigger);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", {
      name: "Zmień nazwę koperty",
    });
    // Focus moves into the dialog (first field) and Escape closes it, returning focus to the trigger.
    await waitFor(() => expect(within(dialog).getByLabelText("Nazwa koperty")).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    const reopened = await within(canvasElement.ownerDocument.body).findByRole("dialog");
    await userEvent.click(within(reopened).getByRole("button", { name: "Zapisz nazwę" }));
    await expect(onSave).toHaveBeenCalledOnce();
    await userEvent.click(within(reopened).getByRole("button", { name: "Zamknij" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Otwarty: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => <RenameEnvelope open />,
};

export const DlugaTresc: Story = {
  parameters: { ...ownFrame, ...openException },
  render: () => (
    <RenameEnvelope open name="Remont łazienki i kuchni w mieszkaniu na Ochocie, etap drugi" />
  ),
};
