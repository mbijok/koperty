import type { ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@koperty/ui/lib/utils";

type SpinnerProps = ComponentProps<"svg"> & {
  /** Announced text, e.g. "Ładowanie operacji…". Without it the spinner is decorative (the
   * surrounding element announces the state, e.g. a button with aria-busy). */
  label?: string;
};

// Stops spinning with prefers-reduced-motion (global rule in styles.css); the text carries the state (P6).
function Spinner({ label, className, ...props }: SpinnerProps) {
  const icon = (
    <LoaderCircle
      aria-hidden="true"
      className={cn("size-icon animate-spin", className)}
      {...props}
    />
  );
  if (!label) return icon;
  return (
    // <output> has the implicit status role; aria-live makes the announcement reliable across readers.
    <output aria-live="polite" data-slot="spinner" className="inline-flex items-center gap-inline">
      {icon}
      <span className="sr-only">{label}</span>
    </output>
  );
}

export { Spinner, type SpinnerProps };
