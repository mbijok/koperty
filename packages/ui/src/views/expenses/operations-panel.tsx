import { useId } from "react";
import { addMonths, formatMonth } from "@koperty/ui/lib/dates";
import { Button } from "@koperty/ui/primitives/button";
import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher";
import {
  OperationList,
  type OperationListProps,
} from "@koperty/ui/product/expenses/operation-list";

type OperationsPanelProps = Omit<OperationListProps, "onPreviousMonth"> & {
  /** The month of today ("YYYY-MM"); the filter can be reset to it. */
  currentMonth: string;
  onMonthChange: (month: string) => void;
};

// List with a filter (polecenie budowy): the filter is the month (Q5). The result count is announced,
// the active filter is visible and easy to reset, and the two empty states stay separate.
function OperationsPanel({ month, currentMonth, onMonthChange, ...list }: OperationsPanelProps) {
  const headingId = useId();
  const ready = !list.loading && !list.error;
  return (
    // Days of the list are h3, so the section has an h2; the month name is already visible above.
    <section aria-labelledby={headingId} className="flex flex-col gap-between-groups">
      <h2 id={headingId} className="sr-only">
        Operacje: {formatMonth(month)}
      </h2>
      <MonthSwitcher month={month} onMonthChange={onMonthChange} />
      <div className="flex min-h-control flex-wrap items-center justify-between gap-group">
        <p aria-live="polite" className="text-body text-muted">
          {ready && `Liczba operacji: ${list.operations?.length ?? 0}`}
        </p>
        {month !== currentMonth && (
          <Button variant="link" size="sm" onClick={() => onMonthChange(currentMonth)}>
            Wróć do bieżącego miesiąca
          </Button>
        )}
      </div>
      <OperationList
        month={month}
        {...list}
        onPreviousMonth={() => onMonthChange(addMonths(month, -1))}
      />
    </section>
  );
}

export { OperationsPanel, type OperationsPanelProps };
