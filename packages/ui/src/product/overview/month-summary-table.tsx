import { CalendarX } from "lucide-react";
import { formatMonth } from "@koperty/ui/lib/dates";
import { Button } from "@koperty/ui/primitives/button";
import { EmptyState, ErrorState } from "@koperty/ui/primitives/empty";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@koperty/ui/primitives/table";
import { Amount } from "@koperty/ui/product/funds/amount";

/** One envelope in month M (US-22): start + allocation − expenses = end, computed by the database. */
type EnvelopeMonth = {
  id: string;
  name: string;
  start: number;
  allocation: number;
  expenses: number;
  end: number;
};
type MonthTotals = { incomes: number; allocations: number; pool: number };

type MonthSummaryTableProps = {
  /** "YYYY-MM". */
  month: string;
  /** Envelopes used in the month. */
  rows?: EnvelopeMonth[];
  totals?: MonthTotals;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};

const NO_ROWS: EnvelopeMonth[] = [];
const COLUMNS = ["Saldo na początek", "Przydział", "Wydatki", "Saldo na koniec"];

function Head() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Koperta</TableHead>
        {COLUMNS.map((column) => (
          <TableHead key={column} scope="col" numeric>
            {column}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

function Totals({ totals }: { totals: MonthTotals }) {
  const items = [
    ["Przychody w miesiącu", <Amount key="incomes" amount={totals.incomes} kind="expense" />],
    [
      "Przydziały w miesiącu",
      <Amount key="allocations" amount={totals.allocations} kind="expense" />,
    ],
    ["Do rozdysponowania", <Amount key="pool" amount={totals.pool} />],
  ] as const;
  return (
    <dl className="grid gap-group md:grid-cols-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col gap-inline rounded-card border border-subtle p-panel-compact"
        >
          <dt className="text-meta text-muted">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function MonthSummaryTable({
  month,
  rows = NO_ROWS,
  totals,
  loading = false,
  error,
  onRetry,
}: MonthSummaryTableProps) {
  const title = `Podsumowanie: ${formatMonth(month)}`;
  if (loading) {
    return (
      <div aria-busy="true">
        <output className="sr-only">Ładowanie podsumowania miesiąca…</output>
        <Table label={title}>
          <Head />
          <TableBody>
            {[1, 2, 3].map((row) => (
              <TableRow key={row}>
                {[1, 2, 3, 4, 5].map((cell) => (
                  <TableCell key={cell}>
                    <Skeleton className="h-badge" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

  return (
    <div data-slot="month-summary" className="flex flex-col gap-between-groups">
      {totals && <Totals totals={totals} />}
      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="Brak kopert używanych w tym miesiącu"
          description={`${formatMonth(month)}: żadna koperta nie miała przydziału ani wydatku.`}
        />
      ) : (
        <Table label={title}>
          <TableCaption>{title}</TableCaption>
          <Head />
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableHead scope="row" className="font-normal whitespace-normal">
                  {row.name}
                </TableHead>
                <TableCell numeric>
                  <Amount amount={row.start} />
                </TableCell>
                <TableCell numeric>
                  <Amount amount={row.allocation} kind="expense" />
                </TableCell>
                <TableCell numeric>
                  <Amount amount={row.expenses} kind="expense" />
                </TableCell>
                <TableCell numeric>
                  <Amount amount={row.end} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { MonthSummaryTable, type EnvelopeMonth, type MonthSummaryTableProps, type MonthTotals };
