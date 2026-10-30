import type { ComponentProps, ReactNode } from "react";
import { Slot } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";

// Border and a light shadow; the shadow never separates content on its own (W5, K4).
function Card({
  className,
  size = "default",
  ...props
}: ComponentProps<"div"> & { size?: "default" | "compact" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "flex flex-col gap-between-groups rounded-card border border-subtle bg-surface-card text-default shadow-card",
        size === "compact" ? "p-panel-compact" : "p-panel",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  action,
  children,
  ...props
}: ComponentProps<"div"> & { action?: ReactNode }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-group", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-inline">{children}</div>
      {action && (
        <div data-slot="card-action" className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

/** A heading (h3 by default); use asChild to render the level that fits the page outline. */
function CardTitle({
  className,
  asChild = false,
  ...props
}: ComponentProps<"h3"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h3";
  return (
    <Comp
      data-slot="card-title"
      className={cn("text-section text-default", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p data-slot="card-description" className={cn("text-body text-muted", className)} {...props} />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("flex flex-col gap-group", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex flex-wrap items-center gap-group", className)}
      {...props}
    />
  );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
