import type { ComponentProps } from "react";
import { cn } from "@koperty/ui/lib/utils";

// Header on surface-muted, rows separated by border-subtle (R01.3), amounts right-aligned in columns
// (Typografia). The wrapper scrolls sideways on a narrow screen; the page never does (WCAG 1.4.10).
// The scrollable wrapper is a named, focusable region, so it scrolls with the keyboard (WCAG 2.1.1).
function Table({
  className,
  label,
  ...props
}: ComponentProps<"table"> & { /** Name of the table region. */ label: string }) {
  return (
    // A <section> with a name is a region landmark.
    <section
      data-slot="table-container"
      aria-label={label}
      tabIndex={0}
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full border-collapse text-left text-body text-default", className)}
        {...props}
      />
    </section>
  );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("pb-group text-left text-meta text-muted", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={cn("bg-surface-muted", className)} {...props} />
  );
}

function TableBody(props: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />;
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-surface-muted text-label", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr data-slot="table-row" className={cn("border-b border-subtle", className)} {...props} />
  );
}

type CellProps = { /** Amount column: right-aligned. */ numeric?: boolean };

function TableHead({ className, numeric = false, ...props }: ComponentProps<"th"> & CellProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-control px-group text-label whitespace-nowrap",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, numeric = false, ...props }: ComponentProps<"td"> & CellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-group py-group align-top",
        numeric && "text-right whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
