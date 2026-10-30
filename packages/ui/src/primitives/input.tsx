import type { ComponentProps } from "react";
import { cn } from "@koperty/ui/lib/utils";

// 40 px high, 16 px text (no iOS zoom on focus), boundary with 3:1 contrast: K1, K2, W1.
function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-control w-full min-w-0 rounded-control border border-control bg-surface-card px-control-x text-input text-default transition-colors duration-fast placeholder:text-muted read-only:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-invalid",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
