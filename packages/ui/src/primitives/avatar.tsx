import type { ComponentProps } from "react";
import { cn } from "@koperty/ui/lib/utils";

/** Up to two initials of a display name, e.g. "Ala Kowalska" → "AK"; "?" when the name is empty. */
export function initials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase("pl-PL"))
    .join("");
  return letters || "?";
}

// Initials only: the product has no profile photos (PRD 4.11). Decorative – the name is always
// shown next to it (WCAG 1.1.1).
function Avatar({ name, className, ...props }: ComponentProps<"span"> & { name: string }) {
  return (
    <span
      data-slot="avatar"
      aria-hidden="true"
      className={cn(
        "inline-flex size-avatar shrink-0 items-center justify-center rounded-full border border-subtle bg-surface-muted text-meta font-semibold text-default select-none",
        className,
      )}
      {...props}
    >
      {initials(name)}
    </span>
  );
}

export { Avatar };
