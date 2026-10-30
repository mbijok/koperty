import { CalendarX, Receipt } from "lucide-react";
import { formatDayHeading, formatMonth } from "@koperty/ui/lib/dates";
import { Button } from "@koperty/ui/primitives/button";
import { EmptyState, ErrorState } from "@koperty/ui/primitives/empty";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { OperationRow, type Operation } from "@koperty/ui/product/expenses/operation-row";

type OperationListProps = {
  /** Operations of the month, newest first – the order of the API (US-20). */
  operations?: Operation[];
  /** "YYYY-MM" of the list. */
  month: string;
  /** Whether the budget has any operation at all: picks the right empty state (polecenie budowy). */
  budgetHasOperations?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  /** Empty budget: first expense. */
  onCreate?: () => void;
  /** Empty month: go to the previous one. */
  onPreviousMonth?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const NO_OPERATIONS: Operation[] = [];
const SKELETON_ROWS = 4;

function groupByDay(operations: Operation[]): [string, Operation[]][] {
  const groups: [string, Operation[]][] = [];
  for (const operation of operations) {
    const last = groups.at(-1);
    if (last && last[0] === operation.date) last[1].push(operation);
    else groups.push([operation.date, [operation]]);
  }
  return groups;
}

function OperationList({
  operations = NO_OPERATIONS,
  month,
  budgetHasOperations = true,
  loading = false,
  error,
  onRetry,
  onCreate,
  onPreviousMonth,
  onEdit,
  onDelete,
}: OperationListProps) {
  if (loading) {
    return (
      <div aria-busy="true" className="flex flex-col">
        <output className="sr-only">Ładowanie operacji…</output>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="flex items-center gap-group border-b border-subtle py-panel-compact"
          >
            <Skeleton className="size-avatar rounded-full" />
            <Skeleton className="h-badge flex-1" />
            <Skeleton className="h-badge w-control" />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <ErrorState
        title={error}
        description="Spróbuj ponownie za chwilę. Twoje dane są bezpieczne."
        action={
          onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          )
        }
      />
    );
  }
  if (operations.length === 0) {
    return budgetHasOperations ? (
      <EmptyState
        icon={CalendarX}
        title="Brak operacji w wybranym miesiącu"
        description={`${formatMonth(month)}: nikt jeszcze nic nie zapisał.`}
        action={
          onPreviousMonth && (
            <Button variant="secondary" onClick={onPreviousMonth}>
              Pokaż poprzedni miesiąc
            </Button>
          )
        }
      />
    ) : (
      <EmptyState
        icon={Receipt}
        title="Brak operacji w tym budżecie"
        description="Zapisz pierwszy wydatek albo przychód – pojawi się tutaj."
        action={onCreate && <Button onClick={onCreate}>Dodaj wydatek</Button>}
      />
    );
  }

  return (
    <div data-slot="operation-list" className="flex flex-col gap-section">
      {groupByDay(operations).map(([date, items]) => (
        <section key={date} aria-labelledby={`day-${date}`} className="flex flex-col">
          <h3 id={`day-${date}`} className="border-b border-subtle pb-group text-label text-muted">
            {formatDayHeading(date)}
          </h3>
          <ul>
            {items.map((operation) => (
              <li key={operation.id} className="border-b border-subtle">
                <OperationRow
                  {...operation}
                  onEdit={onEdit && (() => onEdit(operation.id))}
                  onDelete={onDelete && (() => onDelete(operation.id))}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export { OperationList, type OperationListProps };
