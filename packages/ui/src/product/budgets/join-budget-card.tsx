import { Button } from "@koperty/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@koperty/ui/primitives/card";
import { ErrorState } from "@koperty/ui/primitives/empty";
import { Spinner } from "@koperty/ui/primitives/spinner";

type JoinState = "checking" | "valid" | "expired" | "used" | "revoked";

type JoinBudgetCardProps = {
  state: JoinState;
  budgetName?: string;
  /** Display name of the owner who invited. */
  invitedBy?: string;
  joining?: boolean;
  onJoin: () => void;
  /** Leaves the join screen without joining. */
  onGoHome: () => void;
};

// An existing member goes straight to the budget without using the link (US-08), so that case has
// no card of its own.
const UNAVAILABLE: Record<Exclude<JoinState, "checking" | "valid">, string> = {
  expired: "Ten link zaproszenia wygasł",
  used: "Ten link zaproszenia został już użyty",
  revoked: "Ten link zaproszenia został unieważniony",
};

function JoinBudgetCard({
  state,
  budgetName,
  invitedBy,
  joining = false,
  onJoin,
  onGoHome,
}: JoinBudgetCardProps) {
  if (state === "checking")
    return <Spinner label="Sprawdzanie zaproszenia…" className="size-icon-standalone" />;
  if (state !== "valid") {
    return (
      <ErrorState
        title={UNAVAILABLE[state]}
        description="Poproś właściciela budżetu o nowy link. Linki działają raz i są ważne 7 dni."
        action={
          <Button variant="secondary" onClick={onGoHome}>
            Przejdź do aplikacji
          </Button>
        }
      />
    );
  }
  return (
    <Card data-slot="join-budget-card">
      <CardHeader>
        <CardTitle asChild>
          <h1>Dołącz do budżetu „{budgetName}”</h1>
        </CardTitle>
        <CardDescription>
          {invitedBy
            ? `${invitedBy} zaprasza Cię do wspólnego prowadzenia budżetu.`
            : "Zaproszono Cię do wspólnego prowadzenia budżetu."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body text-default">
          Dołączysz jako członek: zobaczysz koperty i operacje tego budżetu i będziesz mieć
          możliwość ich zapisywania.
        </p>
      </CardContent>
      <CardFooter className="flex-col-reverse items-stretch md:flex-row md:items-center">
        <Button variant="secondary" onClick={onGoHome} disabled={joining}>
          Nie teraz
        </Button>
        <Button loading={joining} loadingText="Dołączanie…" onClick={onJoin}>
          Dołącz do budżetu
        </Button>
      </CardFooter>
    </Card>
  );
}

export { JoinBudgetCard, type JoinBudgetCardProps, type JoinState };
