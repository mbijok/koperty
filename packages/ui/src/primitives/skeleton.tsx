import type { ComponentProps } from "react";
import { cn } from "@koperty/ui/lib/utils";

// Decorative placeholder in the shape of the content; the container announces loading
// (aria-busy and a status text). Pulse stops with prefers-reduced-motion (P6).
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("max-w-full animate-pulse rounded-control bg-surface-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
