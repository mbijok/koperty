import type { ComponentProps } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";

// Track 44 × 24 px, thumb 20 px (E2-Q3); the off thumb has 3:1 contrast to the track (WCAG 1.4.11).
function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-switch w-switch shrink-0 items-center rounded-full border border-control bg-surface-muted p-px transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-invalid data-checked:border-transparent data-checked:bg-action-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-switch-thumb rounded-full bg-switch-thumb-off transition-transform duration-fast ease-standard data-checked:translate-x-switch-travel data-checked:bg-switch-thumb-on"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
