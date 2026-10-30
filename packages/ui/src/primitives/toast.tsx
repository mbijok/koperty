import { CircleCheck } from "lucide-react";
import { Toaster as Sonner, toast } from "sonner";

// E2-Q4: one toast at a time, at the bottom, for 5 s, only for confirmations that need no action.
const TOAST_DURATION_MS = 5000;

/** Render once at the root of the app (and of Storybook stories that show toasts). */
function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      visibleToasts={1}
      duration={TOAST_DURATION_MS}
      offset="var(--page-gutter)"
      mobileOffset="var(--page-gutter)"
      containerAriaLabel="Powiadomienia"
      icons={{ success: <CircleCheck aria-hidden="true" className="size-icon text-muted" /> }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-group rounded-card border border-subtle bg-surface-overlay p-panel-compact font-sans text-body text-default shadow-overlay",
          title: "text-body text-default",
        },
      }}
    />
  );
}

/**
 * Shows a confirmation, e.g. "Link skopiowany". There is deliberately no error variant: an error
 * that needs action belongs next to the field or in an alert, never in a toast (E2-Q4).
 */
function showToast(message: string) {
  return toast.success(message);
}

export { Toaster, showToast };
