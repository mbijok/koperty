import type { ComponentProps, FocusEvent } from "react";
import { formatAmountInput, parsePLN } from "@koperty/ui/lib/money";
import { cn } from "@koperty/ui/lib/utils";
import { Input } from "@koperty/ui/primitives/input";

type AmountInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "type" | "inputMode"
> & {
  /** The text as typed, e.g. "120,50"; parse it with parsePLN when validating or sending. */
  value: string;
  onValueChange: (value: string) => void;
};

// Decimal keyboard on phones; on leaving the field a valid amount is tidied up to "1 234,50".
// The "zł" suffix is decorative – the hint of the field says the unit (WCAG 1.3.1).
function AmountInput({ value, onValueChange, onBlur, className, ...props }: AmountInputProps) {
  function tidy(event: FocusEvent<HTMLInputElement>) {
    const grosze = parsePLN(value);
    if (grosze !== null) onValueChange(formatAmountInput(grosze));
    onBlur?.(event);
  }

  return (
    <div data-slot="amount-input" className="relative w-full">
      <Input
        {...props}
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onBlur={tidy}
        className={cn("pr-section", className)}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-control-x flex items-center text-input text-muted"
      >
        zł
      </span>
    </div>
  );
}

export { AmountInput, type AmountInputProps };
