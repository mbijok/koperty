import { useRef, useState } from "react";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@koperty/ui/primitives/alert-dialog";
import { failureMessage } from "@koperty/ui/patterns/use-form-submit";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A question with the object's name, e.g. "Usunąć wydatek „Biedronka” z 29 października?". */
  title: string;
  /** What happens and that it can't be undone. */
  description: string;
  /** A verb and the object, e.g. "Usuń wydatek" – never "OK". */
  confirmLabel: string;
  /** Deletes on the server; the dialog closes only when it resolves (polecenie budowy). */
  onConfirm: () => Promise<void>;
};

const DELETE_FAILED = "Nie udało się usunąć. Spróbuj ponownie za chwilę.";

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  // Without a Radix trigger (e.g. opened from a list row), focus returns to what was focused before.
  const returnFocus = useRef<HTMLElement>(null);

  async function confirm() {
    setPending(true);
    setError(undefined);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      setError(failureMessage(DELETE_FAILED));
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        setError(undefined);
        onOpenChange(next);
      }}
    >
      <AlertDialogContent
        onOpenAutoFocus={() => {
          returnFocus.current = document.querySelector<HTMLElement>(":focus");
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocus.current?.focus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="danger">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            loading={pending}
            loadingText="Usuwanie…"
            onClick={(event) => {
              event.preventDefault();
              void confirm();
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDeleteDialog, type ConfirmDeleteDialogProps };
