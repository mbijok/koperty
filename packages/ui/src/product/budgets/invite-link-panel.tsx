import { Copy, Share2 } from "lucide-react";
import { formatDate } from "@koperty/ui/lib/dates";
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
import { FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";

type InviteLinkPanelProps = {
  /** The generated link; absent until the owner generates one. */
  link?: string;
  /** "YYYY-MM-DD" when the link stops working. */
  expiresOn?: string;
  generating?: boolean;
  /** Why generating failed, e.g. "Nie udało się wygenerować linku". */
  error?: string;
  onGenerate: () => void;
  /** Copies the link; the screen confirms with a toast (E2-Q4). */
  onCopy: () => void;
  /** System share sheet; pass it only where navigator.share exists. */
  onShare?: () => void;
};

// One-time link valid for 7 days, shared by any channel (PRD 4.10, US-07); monospace text (P8).
function InviteLinkPanel({
  link,
  expiresOn,
  generating = false,
  error,
  onGenerate,
  onCopy,
  onShare,
}: InviteLinkPanelProps) {
  return (
    <Card data-slot="invite-link-panel">
      <CardHeader>
        <CardTitle asChild>
          <h2>Zaproś osobę</h2>
        </CardTitle>
        <CardDescription>
          Wyślij link dowolnym komunikatorem. Link działa raz i jest ważny 7 dni.
        </CardDescription>
      </CardHeader>
      {error && (
        <CardContent>
          <Alert variant="danger">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        </CardContent>
      )}
      {link ? (
        <>
          <CardContent>
            <FormField
              label="Link zaproszenia"
              hint={expiresOn && `Ważny do ${formatDate(expiresOn)}. Działa raz.`}
            >
              {(control) => (
                <Input
                  {...control}
                  readOnly
                  value={link}

                  className="font-mono text-body"
                />
              )}
            </FormField>
          </CardContent>
          <CardFooter>
            <Button onClick={onCopy}>
              <Copy aria-hidden="true" />
              Kopiuj link
            </Button>
            {onShare && (
              <Button variant="secondary" onClick={onShare}>
                <Share2 aria-hidden="true" />
                Udostępnij
              </Button>
            )}
          </CardFooter>
        </>
      ) : (
        <CardFooter>
          <Button loading={generating} loadingText="Generowanie…" onClick={onGenerate}>
            Wygeneruj link
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export { InviteLinkPanel, type InviteLinkPanelProps };
