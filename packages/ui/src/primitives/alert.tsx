import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, Info } from "lucide-react";
import { cn } from "@koperty/ui/lib/utils";

// Border, no shadow (Fundamenty / Kształt); meaning in title, text and icon, not only colour (WCAG 1.4.1).
const alertVariants = cva(
  "flex w-full items-start gap-group rounded-card border bg-surface-card p-panel-compact text-default",
  {
    variants: {
      variant: {
        default: "border-subtle",
        danger: "border-invalid",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const ICONS = { default: Info, danger: CircleAlert };

type AlertProps = ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    /** Buttons or links shown at the end (on a narrow screen below the text). */
    action?: ReactNode;
  };

function Alert({ className, variant = "default", action, children, ...props }: AlertProps) {
  const tone = variant === "danger" ? "danger" : "default";
  const Icon = ICONS[tone];
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      // An error is announced at once; other messages politely (WCAG 4.1.3).
      role={tone === "danger" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-icon shrink-0", tone === "danger" ? "text-danger" : "text-muted")}
      />
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-group">
        <div className="flex min-w-0 flex-col gap-inline">{children}</div>
        {action && (
          <div data-slot="alert-action" className="flex shrink-0 flex-wrap gap-group">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertTitle({ className, ...props }: ComponentProps<"p">) {
  return (
    <p data-slot="alert-title" className={cn("text-label text-default", className)} {...props} />
  );
}

function AlertDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn("max-w-measure text-body text-muted", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, type AlertProps };
