import { Wallet } from "lucide-react";
import { Button } from "@koperty/ui/primitives/button";
import { EmptyState, ErrorState } from "@koperty/ui/primitives/empty";
import { EnvelopeCard, EnvelopeCardSkeleton } from "@koperty/ui/product/envelopes/envelope-card";

type EnvelopeSummary = { id: string; name: string; balance: number; archived?: boolean };

type EnvelopeListProps = {
  /** Envelopes in the order set by the members (US-12). */
  envelopes?: EnvelopeSummary[];
  loading?: boolean;
  /** Loading error message; shows the error state with a retry. */
  error?: string;
  onRetry?: () => void;
  /** Empty budget: the first envelope (US-21). */
  onCreate?: () => void;
  /** Reorder mode (E3-Q3): when given, the cards show "Przesuń w górę / w dół" instead of their menu. */
  onMove?: (id: string, direction: "up" | "down") => void;
  onAllocate?: (id: string) => void;
  onRename?: (id: string) => void;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
};

const SKELETON_COUNT = 3;
const NO_ENVELOPES: EnvelopeSummary[] = [];

function EnvelopeList({
  envelopes = NO_ENVELOPES,
  loading = false,
  error,
  onRetry,
  onCreate,
  onMove,
  ...handlers
}: EnvelopeListProps) {
  if (loading) {
    return (
      <div aria-busy="true" className="flex flex-col gap-between-groups">
        <output className="sr-only">Ładowanie kopert…</output>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <EnvelopeCardSkeleton key={index} />
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
  if (envelopes.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="Nie masz jeszcze kopert"
        description="Koperty to cele wydatków, np. Jedzenie albo Rachunki. Zacznij od pierwszej."
        action={onCreate && <Button onClick={onCreate}>Dodaj kopertę</Button>}
      />
    );
  }

  const last = envelopes.length - 1;
  return (
    <ul className="flex flex-col gap-between-groups">
      {envelopes.map((envelope, index) => (
        <li key={envelope.id}>
          <EnvelopeCard
            name={envelope.name}
            balance={envelope.balance}
            archived={envelope.archived}
            onAllocate={handlers.onAllocate && (() => handlers.onAllocate?.(envelope.id))}
            onRename={handlers.onRename && (() => handlers.onRename?.(envelope.id))}
            onArchive={handlers.onArchive && (() => handlers.onArchive?.(envelope.id))}
            onRestore={handlers.onRestore && (() => handlers.onRestore?.(envelope.id))}
            reorder={
              onMove && {
                onMoveUp: index > 0 ? () => onMove(envelope.id, "up") : undefined,
                onMoveDown: index < last ? () => onMove(envelope.id, "down") : undefined,
              }
            }
          />
        </li>
      ))}
    </ul>
  );
}

export { EnvelopeList, type EnvelopeListProps, type EnvelopeSummary };
