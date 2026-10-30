import type { ComponentProps, MouseEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";
import { Spinner } from "@koperty/ui/primitives/spinner";

// Shape, density and states: packages/ui/POSTEP.md, "Etap 2 – różnice względem bazy".
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-inline rounded-control border border-transparent text-label whitespace-nowrap transition-colors duration-fast ease-standard select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon",
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-on-action hover:bg-action-primary-hover active:bg-action-primary-pressed",
        secondary: "bg-action-secondary text-on-secondary hover:bg-action-secondary-hover",
        ghost: "text-default hover:bg-surface-muted active:bg-action-secondary-hover",
        danger: "bg-action-danger text-on-danger hover:bg-action-danger-hover",
        link: "text-link underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default: "h-control px-control-x",
        sm: "h-control-sm px-group",
        icon: "size-control",
        "icon-sm": "size-control-sm",
        // A link inside a sentence: no height or padding of its own.
        inline: "h-auto p-0 align-baseline",
      },
    },
    compoundVariants: [{ variant: "link", size: ["default", "sm"], class: "px-0" }],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Renders the child element (e.g. a router link) with button styles. */
    asChild?: boolean;
    /** Request in progress: shows a spinner, keeps the width and ignores clicks (E2-Q2). */
    loading?: boolean;
    /** Text shown while loading, e.g. "Zapisywanie…". Defaults to the children. */
    loadingText?: string;
  };

function ignoreClick(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  loading = false,
  loadingText,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const busy = loading && !asChild;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={busy || undefined}
      onClick={busy ? ignoreClick : onClick}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {busy ? (
        <>
          <span className="invisible flex items-center gap-inline">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center gap-inline">
            <Spinner />
            {loadingText ?? children}
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
