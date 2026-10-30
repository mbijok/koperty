import type { ComponentProps } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";

// Only repeats a visible or accessible name (an icon button's aria-label); never the only place for
// information needed to act (WCAG 1.3.1, polecenie budowy). Overlay surface, 12 px text (P3, W5).
function TooltipProvider(props: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />;
}

function Tooltip(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        className={cn(
          "z-50 max-w-(--radix-tooltip-content-available-width) rounded-control border border-subtle bg-surface-overlay px-group py-inline text-meta text-default shadow-overlay duration-base data-[side=bottom]:mt-inline data-[side=left]:mr-inline data-[side=right]:ml-inline data-[side=top]:mb-inline data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
          className,
        )}
        {...props}
      >
        <span className="block max-w-measure">{children}</span>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
