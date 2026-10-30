import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar } from "@koperty/ui/primitives/avatar";
import { Button } from "@koperty/ui/primitives/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@koperty/ui/primitives/tooltip";
import { Amount } from "@koperty/ui/product/funds/amount";

type Operation = {
  id: string;
  type: "income" | "expense";
  /** Grosze, always positive (PRD 4.6, 4.7). */
  amount: number;
  /** "YYYY-MM-DD". */
  date: string;
  description?: string;
  /** Envelope names of the expense parts; empty for an income. */
  envelopes?: string[];
  /** Display name of the author; "Usunięty użytkownik" after the account was deleted (US-03). */
  author: string;
};

type OperationRowProps = Operation & {
  onEdit?: () => void;
  onDelete?: () => void;
};

const TYPE_LABEL = { income: "Przychód", expense: "Wydatek" } as const;
const NO_ENVELOPES: string[] = [];

function IconAction({
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
        <Button variant="ghost" size="icon-sm" aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Two actions stay visible (E2-P9); the delete action opens a confirmation in the screen.
function OperationRow({
  type,
  amount,
  description,
  envelopes = NO_ENVELOPES,
  author,
  onEdit,
  onDelete,
}: OperationRowProps) {
  const title = description || `${TYPE_LABEL[type]} bez opisu`;
  const subject = `${TYPE_LABEL[type].toLocaleLowerCase("pl-PL")}: ${title}`;
  const meta = [envelopes.length > 1 ? `Podział: ${envelopes.join(", ")}` : envelopes[0], author]
    .filter(Boolean)
    .join(" · ");

  return (
    <div data-slot="operation-row" className="flex items-center gap-group py-panel-compact">
      <Avatar name={author} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className={description ? "text-label text-default" : "text-label text-muted"}>{title}</p>
        <p className="text-meta text-muted">{meta}</p>
      </div>
      <Amount amount={amount} kind={type} />
      {(onEdit || onDelete) && (
        <div className="flex shrink-0">
          {onEdit && (
            <IconAction label={`Edytuj ${subject}`} onClick={onEdit}>
              <Pencil aria-hidden="true" />
            </IconAction>
          )}
          {onDelete && (
            <IconAction label={`Usuń ${subject}`} onClick={onDelete}>
              <Trash2 aria-hidden="true" />
            </IconAction>
          )}
        </div>
      )}
    </div>
  );
}

export { OperationRow, type Operation, type OperationRowProps };
