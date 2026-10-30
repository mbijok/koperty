import { Link2 } from "lucide-react";
import { formatDate } from "@koperty/ui/lib/dates";
import { Badge } from "@koperty/ui/primitives/badge";
import { Button } from "@koperty/ui/primitives/button";

type InvitationRowProps = {
  /** "YYYY-MM-DD": links are valid for 7 days (PRD 4.10). */
  expiresOn: string;
  /** Display name of the owner who generated the link. */
  createdBy: string;
  /** Revoking opens a confirmation in the screen (US-07). */
  onRevoke?: () => void;
};

function InvitationRow({ expiresOn, createdBy, onRevoke }: InvitationRowProps) {
  return (
    <div
      data-slot="invitation-row"
      className="flex flex-wrap items-center gap-group py-panel-compact"
    >
      <Link2 aria-hidden="true" className="size-icon-standalone text-muted" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-inline text-label text-default">
          Link zaproszenia <Badge>Aktywne</Badge>
        </span>
        <span className="text-meta text-muted">
          Ważne do {formatDate(expiresOn)} · autor: {createdBy}
        </span>
      </div>
      {onRevoke && (
        <Button variant="secondary" size="sm" onClick={onRevoke}>
          Unieważnij…
        </Button>
      )}
    </div>
  );
}

export { InvitationRow, type InvitationRowProps };
