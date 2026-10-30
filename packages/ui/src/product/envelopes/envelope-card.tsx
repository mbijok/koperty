import { ArrowDown, ArrowUp, EllipsisVertical } from "lucide-react";
import { formatPLN } from "@koperty/ui/lib/money";
import { Badge } from "@koperty/ui/primitives/badge";
import { Button } from "@koperty/ui/primitives/button";
import { Card, CardHeader, CardTitle } from "@koperty/ui/primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@koperty/ui/primitives/dropdown-menu";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { Amount } from "@koperty/ui/product/funds/amount";

type EnvelopeCardProps = {
  name: string;
  /** Current balance in grosze, computed from history (PRD 4.5); may be negative. */
  balance: number;
  archived?: boolean;
  onAllocate?: () => void;
  onRename?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  /** Reorder mode (E3-Q3): moves the envelope; a missing handler disables the button (first or last). */
  reorder?: { onMoveUp?: () => void; onMoveDown?: () => void };
};

function ReorderButtons({
  name,
  onMoveUp,
  onMoveDown,
}: {
  name: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="flex gap-inline">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Przesuń w górę: ${name}`}
        disabled={!onMoveUp}
        onClick={onMoveUp}
      >
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Przesuń w dół: ${name}`}
        disabled={!onMoveDown}
        onClick={onMoveDown}
      >
        <ArrowDown aria-hidden="true" />
      </Button>
    </div>
  );
}

function EnvelopeMenu({
  name,
  balance,
  archived,
  onAllocate,
  onRename,
  onArchive,
  onRestore,
}: EnvelopeCardProps) {
  const canArchive = balance === 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Więcej akcji: ${name}`}>
          <EllipsisVertical aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {archived ? (
          <DropdownMenuItem onSelect={onRestore}>Przywróć</DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onSelect={onAllocate}>Przydziel środki</DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>Zmień nazwę</DropdownMenuItem>
            {/* Archiving needs a zero balance (US-13, Z4); the database enforces it, the menu explains it. */}
            <DropdownMenuItem disabled={!canArchive} onSelect={onArchive}>
              {canArchive ? "Zarchiwizuj" : `Zarchiwizuj (saldo musi wynosić ${formatPLN(0)})`}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EnvelopeCard(props: EnvelopeCardProps) {
  const { name, balance, archived = false, reorder } = props;
  return (
    <Card size="compact" data-slot="envelope-card" data-archived={archived || undefined}>
      <CardHeader
        className="items-center"
        action={
          reorder ? (
            <ReorderButtons name={name} {...reorder} />
          ) : (
            <div className="flex items-center gap-inline">
              <Amount amount={balance} />
              <EnvelopeMenu {...props} />
            </div>
          )
        }
      >
        <CardTitle className="text-label">{name}</CardTitle>
        {archived && <Badge>Zarchiwizowana</Badge>}
      </CardHeader>
    </Card>
  );
}

function EnvelopeCardSkeleton() {
  return (
    <Card size="compact" aria-hidden="true">
      <CardHeader className="items-center" action={<Skeleton className="h-badge w-control" />}>
        <Skeleton className="h-badge w-content" />
      </CardHeader>
    </Card>
  );
}

export { EnvelopeCard, EnvelopeCardSkeleton, type EnvelopeCardProps };
