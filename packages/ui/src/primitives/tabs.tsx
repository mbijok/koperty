import type { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";

// Underlined tabs, 40 px (W1); the selected tab is marked by weight and an underline in the text
// colour, not by emerald (E2-P10). The list scrolls sideways on a narrow screen.
function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-between-groups", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex w-full overflow-x-auto border-b border-subtle", className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "-mb-px inline-flex h-control shrink-0 items-center gap-inline border-b-2 border-transparent px-control-x text-label whitespace-nowrap text-muted transition-colors duration-fast hover:text-default disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-tabs-indicator data-[state=active]:text-default [&_svg]:size-icon",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex flex-col gap-group", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
