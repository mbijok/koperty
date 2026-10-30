import type { ComponentProps } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "@koperty/ui/lib/utils";

function Select(props: ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue(props: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

// Same shape as Input: 40 px, 16 px text, control border (W1, K1, K2).
function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-control w-full min-w-0 items-center justify-between gap-group rounded-control border border-control bg-surface-card px-control-x text-input text-default transition-colors duration-fast hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-invalid data-placeholder:text-muted [&>span]:truncate",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon aria-hidden="true" className="size-icon shrink-0 text-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-card border border-subtle bg-surface-overlay text-default shadow-overlay duration-base data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-control-sm items-center justify-center text-muted">
          <ChevronUpIcon aria-hidden="true" className="size-icon" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-inline">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-control-sm items-center justify-center text-muted">
          <ChevronDownIcon aria-hidden="true" className="size-icon" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex h-menu-item w-full cursor-default items-center gap-group rounded-control px-group text-body text-default select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-muted",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto">
        <CheckIcon aria-hidden="true" className="size-icon text-link" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
