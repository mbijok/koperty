import type { ComponentProps } from "react";
import { cn } from "@koperty/ui/lib/utils";

// One neutral look: the status is carried by the word, never by colour (P1, K3, K6, AC4).
function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-badge w-fit shrink-0 items-center rounded-control border border-subtle bg-surface-muted px-group text-meta whitespace-nowrap text-default",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
