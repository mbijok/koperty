import type { ReactNode } from "react";
import { ChartColumn, ListOrdered, Plus, Wallet } from "lucide-react";
import { AppShell } from "@koperty/ui/product/account/app-shell";
import { BudgetSwitcher } from "@koperty/ui/product/budgets/budget-switcher";

// Frames for screen stories (documentation only, not exported): the signed-in shell with the
// navigation from E3-Q2, and a page without the shell for sign-in and joining.

type Section = "koperty" | "operacje" | "podsumowanie";

const NAVIGATION = [
  { key: "koperty", label: "Koperty", href: "#koperty", icon: Wallet },
  { key: "operacje", label: "Operacje", href: "#operacje", icon: ListOrdered },
  { key: "podsumowanie", label: "Podsumowanie", href: "#podsumowanie", icon: ChartColumn },
] as const;

const BUDGETS = [
  { id: "dom", name: "Dom" },
  { id: "ochota", name: "Mieszkanie na Ochocie" },
];

function noop() {}

export function Screen({
  section,
  title,
  description,
  width,
  children,
}: {
  section?: Section;
  title?: string;
  description?: string;
  width?: "content" | "wide";
  children: ReactNode;
}) {
  return (
    <AppShell
      budgetSwitcher={
        <BudgetSwitcher budgets={BUDGETS} currentId="dom" onSwitch={noop} onCreate={noop} />
      }
      displayName="Ala Kowalska"
      onOpenProfile={noop}
      onSignOut={noop}
      navigation={NAVIGATION.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        active: item.key === section,
      }))}
      primaryAction={{
        label: "Dodaj wydatek",
        shortLabel: "Wydatek",
        href: "#nowy-wydatek",
        icon: Plus,
      }}
      width={width}
    >
      <div className="flex flex-col gap-section">
        {title && (
          <header className="flex flex-col gap-inline">
            <h1 className="text-page text-default">{title}</h1>
            {description && <p className="text-body text-muted">{description}</p>}
          </header>
        )}
        {children}
      </div>
    </AppShell>
  );
}

export function PublicScreen({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-content flex-col gap-section bg-surface-page px-gutter py-section">
      <p className="text-section text-default">Koperty</p>
      {title && <h1 className="text-page text-default">{title}</h1>}
      {children}
    </main>
  );
}
