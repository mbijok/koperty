import { useId } from "react";
import { Avatar } from "@koperty/ui/primitives/avatar";
import { Badge } from "@koperty/ui/primitives/badge";
import { Button } from "@koperty/ui/primitives/button";

type MemberRowProps = {
  name: string;
  memberRole: "owner" | "member";
  /** The signed-in person: can leave the budget. */
  isCurrentUser?: boolean;
  /** The viewer is an owner: can change roles and remove others (US-09). */
  viewerIsOwner?: boolean;
  /** The last owner can't leave or give up the role (PRD 4.9, US-10). */
  isOnlyOwner?: boolean;
  onToggleOwner?: () => void;
  onRemove?: () => void;
  onLeave?: () => void;
};

const ROLE_LABEL = { owner: "Właściciel", member: "Członek" } as const;

// Up to two visible actions per row (E2-P9); removing and leaving open a confirmation in the screen.
function MemberRow({
  name,
  memberRole,
  isCurrentUser = false,
  viewerIsOwner = false,
  isOnlyOwner = false,
  onToggleOwner,
  onRemove,
  onLeave,
}: MemberRowProps) {
  const reasonId = useId();
  const blockedLeave = isCurrentUser && isOnlyOwner;

  return (
    <div data-slot="member-row" className="flex flex-wrap items-center gap-group py-panel-compact">
      <Avatar name={name} />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-inline">
        <span className="text-label text-default">
          {name}
          {isCurrentUser && <span className="font-normal text-muted"> (Ty)</span>}
        </span>
        <Badge>{ROLE_LABEL[memberRole]}</Badge>
      </div>
      {isCurrentUser && onLeave && (
        <div className="flex flex-col items-end gap-inline">
          <Button
            variant="secondary"
            size="sm"
            disabled={blockedLeave}
            aria-describedby={blockedLeave ? reasonId : undefined}
            onClick={onLeave}
          >
            Opuść budżet…
          </Button>
          {blockedLeave && (
            <p id={reasonId} className="max-w-measure text-meta text-muted">
              Jesteś jedynym właścicielem: nadaj rolę właściciela innej osobie albo usuń budżet.
            </p>
          )}
        </div>
      )}
      {!isCurrentUser && viewerIsOwner && (
        <div className="flex flex-wrap gap-inline">
          {onToggleOwner && (
            <Button variant="secondary" size="sm" onClick={onToggleOwner}>
              {memberRole === "owner" ? "Odbierz rolę właściciela" : "Nadaj rolę właściciela"}
            </Button>
          )}
          {onRemove && (
            <Button variant="secondary" size="sm" onClick={onRemove}>
              Usuń z budżetu…
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { MemberRow, type MemberRowProps };
