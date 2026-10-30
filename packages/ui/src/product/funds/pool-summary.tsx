import type { ReactNode } from "react";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@koperty/ui/primitives/card";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { Amount } from "@koperty/ui/product/funds/amount";

type PoolSummaryProps = {
  /** All incomes minus all allocations, also for future months (PRD 4.3, Z2). */
  amount?: number;
  loading?: boolean;
  /** What went wrong while loading, e.g. "Nie udało się wczytać puli". */
  error?: string;
  onRetry?: () => void;
  /** Next step, e.g. a "Dodaj przychód" button. */
  action?: ReactNode;
};

function PoolSummary({ amount, loading = false, error, onRetry, action }: PoolSummaryProps) {
  let content: ReactNode;
  if (loading) {
    content = (
      <>
        <Skeleton className="h-control w-content" />
        <output className="sr-only">Ładowanie puli…</output>
      </>
    );
  } else if (error) {
    content = (
      <Alert
        variant="danger"
        action={
          onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          )
        }
      >
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );
  } else {
    const value = amount ?? 0;
    content = (
      <>
        <Amount amount={value} size="lg" />
        <CardDescription>
          {value < 0
            ? "Przydzielono więcej, niż wpłynęło. Dodaj przychód albo zmniejsz przydział."
            : "Przychody minus przydziały, także na przyszłe miesiące."}
        </CardDescription>
      </>
    );
  }

  return (
    <Card data-slot="pool-summary" aria-busy={loading || undefined}>
      <CardHeader>
        <CardTitle asChild>
          <h2>Do rozdysponowania</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      {action && !loading && <CardFooter>{action}</CardFooter>}
    </Card>
  );
}

export { PoolSummary, type PoolSummaryProps };
