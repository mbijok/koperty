import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@koperty/ui/lib/dates";
import { Button } from "@koperty/ui/primitives/button";
import { ErrorState } from "@koperty/ui/primitives/empty";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { Amount } from "@koperty/ui/product/funds/amount";

type ExpenseDetail = {
  amount: number;
  date: string;
  description?: string;
  author: string;
  /** One part per envelope; the parts add up to the amount (PRD 4.6). */
  parts: { envelope: string; amount: number }[];
};

type ExpenseDetailsProps = {
  /** Missing after loading: the expense doesn't exist or belongs to another budget – one message for both (PT404 in the error contract). */
  expense?: ExpenseDetail;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

// Details view (polecenie budowy): the amount and the main action are visible without scrolling,
// and "doesn't exist or no access" has its own state.
function ExpenseDetails({
  expense,
  loading = false,
  error,
  onRetry,
  onBack,
  onEdit,
  onDelete,
}: ExpenseDetailsProps) {
  if (loading) {
    return (
      <div aria-busy="true" className="flex flex-col gap-group">
        <output className="sr-only">Ładowanie wydatku…</output>
        <Skeleton className="h-control w-content" />
        <Skeleton className="h-badge w-content" />
        <Skeleton className="h-badge" />
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
  if (!expense) {
    return (
      <ErrorState
        title="Nie znaleziono wydatku"
        description="Wydatek nie istnieje albo nie masz do niego dostępu."
        action={
          <Button variant="secondary" onClick={onBack}>
            Wróć do operacji
          </Button>
        }
      />
    );
  }

  return (
    <article data-slot="expense-details" className="flex flex-col gap-section">
      <header className="flex flex-col gap-group">
        <h1 className={expense.description ? "text-page text-default" : "text-page text-muted"}>
          {expense.description || "Wydatek bez opisu"}
        </h1>
        <Amount amount={expense.amount} kind="expense" size="lg" />
        <p className="text-meta text-muted">
          {formatDate(expense.date)} · {expense.author}
        </p>
        {(onEdit || onDelete) && (
          <div className="flex flex-wrap gap-group">
            {onEdit && (
              <Button onClick={onEdit}>
                <Pencil aria-hidden="true" />
                Edytuj wydatek
              </Button>
            )}
            {onDelete && (
              <Button variant="secondary" onClick={onDelete}>
                <Trash2 aria-hidden="true" />
                Usuń wydatek…
              </Button>
            )}
          </div>
        )}
      </header>
      <section aria-labelledby="expense-parts" className="flex flex-col gap-group">
        <h2 id="expense-parts" className="text-section text-default">
          {expense.parts.length > 1 ? "Podział na koperty" : "Koperta"}
        </h2>
        <dl className="flex flex-col">
          {expense.parts.map((part) => (
            <div
              key={part.envelope}
              className="flex items-center justify-between gap-group border-b border-subtle py-group"
            >
              <dt className="text-body text-default">{part.envelope}</dt>
              <dd>
                <Amount amount={part.amount} kind="expense" />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}

export { ExpenseDetails, type ExpenseDetail, type ExpenseDetailsProps };
