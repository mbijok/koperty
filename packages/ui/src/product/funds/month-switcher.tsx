import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, formatMonth } from "@koperty/ui/lib/dates";
import { Button } from "@koperty/ui/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@koperty/ui/primitives/tooltip";

type MonthSwitcherProps = {
  /** "YYYY-MM", e.g. from the ?month=2026-10 search parameter (engineering standards 4.3). */
  month: string;
  onMonthChange: (month: string) => void;
};

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Past and future months alike: allocations can be planned ahead (US-16). The month name is a live
// region, so the change is announced (WCAG 4.1.3).
function MonthSwitcher({ month, onMonthChange }: MonthSwitcherProps) {
  return (
    <div data-slot="month-switcher" className="flex items-center gap-inline">
      <StepButton label="Poprzedni miesiąc" onClick={() => onMonthChange(addMonths(month, -1))}>
        <ChevronLeft aria-hidden="true" />
      </StepButton>
      <p aria-live="polite" className="min-w-0 flex-1 text-center text-section text-default">
        {formatMonth(month)}
      </p>
      <StepButton label="Następny miesiąc" onClick={() => onMonthChange(addMonths(month, 1))}>
        <ChevronRight aria-hidden="true" />
      </StepButton>
    </div>
  );
}

export { MonthSwitcher, type MonthSwitcherProps };
