import type { ComponentProps } from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";
import { Button } from "@koperty/ui/primitives/button";

// Scrim without blur (K5), overlay radius and shadow (R01.3, W5), fade only (P6). The panel keeps the
// page gutter on every side and scrolls when taller than the screen.
const overlayClass =
  "fixed inset-0 z-50 bg-surface-scrim duration-base data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0";
const panelClass =
  "fixed inset-gutter z-50 m-auto flex h-fit max-h-overlay max-w-measure flex-col gap-between-groups overflow-y-auto rounded-overlay border border-subtle bg-surface-overlay p-panel text-default shadow-overlay duration-base outline-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0";

function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay data-slot="dialog-overlay" className={overlayClass} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(panelClass, className)}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zamknij"
            className="absolute top-panel-compact right-panel-compact"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-inline pr-section", className)}
      {...props}
    />
  );
}

// Narrow screen: full-width buttons, the main action first (E2-P5); from 768 px side by side.
function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-group *:w-full md:flex-row md:justify-end md:*:w-auto",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-section text-default", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-body text-muted", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  overlayClass,
  panelClass,
};
