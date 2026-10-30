import { Fragment, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@koperty/ui/lib/utils";
import { Avatar } from "@koperty/ui/primitives/avatar";
import { Button, buttonVariants } from "@koperty/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@koperty/ui/primitives/dropdown-menu";

type NavItem = { label: string; href: string; icon: LucideIcon; active?: boolean };
type PrimaryAction = {
  label: string;
  /** Label in the phone bottom bar, e.g. "Wydatek". */ shortLabel?: string;
  href: string;
  icon: LucideIcon;
};
type LinkRenderProps = {
  href: string;
  className: string;
  "aria-current"?: "page";
  children: ReactNode;
};

type AppShellProps = {
  /** Usually <BudgetSwitcher />. */
  budgetSwitcher?: ReactNode;
  displayName: string;
  onOpenProfile: () => void;
  onSignOut: () => void;
  /** Koperty, Operacje, Podsumowanie (E3-Q2). */
  navigation: NavItem[];
  /** "Dodaj wydatek": in reach of the thumb on phones (DS-S04). */
  primaryAction?: PrimaryAction;
  /** Renders a navigation link, e.g. with the router's Link; a plain <a> by default. */
  renderLink?: (props: LinkRenderProps) => ReactNode;
  /** "wide" for the month summary table (P5). */
  width?: "content" | "wide";
  children: ReactNode;
};

function current(active?: boolean) {
  return active ? ("page" as const) : undefined;
}

function plainLink({ children, ...props }: LinkRenderProps) {
  return <a {...props}>{children}</a>;
}

function UserMenu({
  displayName,
  onOpenProfile,
  onSignOut,
}: Pick<AppShellProps, "displayName" | "onOpenProfile" | "onSignOut">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-inline md:px-control-x">
          <Avatar name={displayName} />
          <span className="sr-only">Konto:</span>
          <span className="sr-only max-w-content truncate md:not-sr-only">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onOpenProfile}>Profil</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut}>Wyloguj</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Header with the budget switcher and account menu; links in the header from 768 px, in a bottom bar
// on phones (E3-Q2). The current page is marked by aria-current and weight, not only by colour.
function AppShell({
  budgetSwitcher,
  displayName,
  onOpenProfile,
  onSignOut,
  navigation,
  primaryAction,
  renderLink = plainLink,
  width = "content",
  children,
}: AppShellProps) {
  return (
    <div data-slot="app-shell" className="flex min-h-dvh flex-col bg-surface-page text-default">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-group focus:left-group focus:z-50 focus:rounded-control focus:bg-surface-overlay focus:p-group focus:shadow-overlay"
      >
        Przejdź do treści
      </a>
      <header className="sticky top-0 z-40 border-b border-subtle bg-surface-page">
        <div className="mx-auto flex max-w-content-wide items-center gap-group px-gutter py-panel-compact md:px-gutter-wide">
          <div className="min-w-0 flex-1">{budgetSwitcher}</div>
          <nav aria-label="Główna" className="hidden items-center gap-inline md:flex">
            {navigation.map((item) => (
              <Fragment key={item.href}>
                {renderLink({
                  href: item.href,
                  "aria-current": current(item.active),
                  className:
                    "inline-flex h-control items-center gap-inline rounded-control px-control-x text-label text-muted transition-colors duration-fast hover:bg-surface-muted hover:text-default aria-[current=page]:bg-surface-muted aria-[current=page]:text-default [&_svg]:size-icon",
                  children: (
                    <>
                      <item.icon aria-hidden="true" />
                      {item.label}
                    </>
                  ),
                })}
              </Fragment>
            ))}
          </nav>
          {primaryAction &&
            renderLink({
              href: primaryAction.href,
              className: cn(buttonVariants(), "hidden md:inline-flex"),
              children: (
                <>
                  <primaryAction.icon aria-hidden="true" />
                  {primaryAction.label}
                </>
              ),
            })}
          <UserMenu displayName={displayName} onOpenProfile={onOpenProfile} onSignOut={onSignOut} />
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "mx-auto w-full flex-1 px-gutter pt-section pb-bottom-nav outline-none md:px-gutter-wide md:pb-section",
          width === "wide" ? "max-w-content-wide" : "max-w-content",
        )}
      >
        {children}
      </main>
      <nav
        aria-label="Główna"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-subtle bg-surface-page pb-safe-bottom md:hidden"
      >
        <ul className="mx-auto flex max-w-content items-stretch gap-inline px-gutter py-panel-compact">
          {navigation.map((item) => (
            <li key={item.href} className="flex flex-1">
              {renderLink({
                href: item.href,
                "aria-current": current(item.active),
                className:
                  "flex min-h-control flex-1 flex-col items-center justify-center gap-inline rounded-control text-meta whitespace-nowrap text-muted aria-[current=page]:font-semibold aria-[current=page]:text-default [&_svg]:size-icon-standalone",
                children: (
                  <>
                    <item.icon aria-hidden="true" />
                    {item.label}
                  </>
                ),
              })}
            </li>
          ))}
          {primaryAction && (
            <li className="flex flex-1">
              {renderLink({
                href: primaryAction.href,
                className:
                  "flex min-h-control flex-1 flex-col items-center justify-center gap-inline rounded-control bg-action-primary text-meta whitespace-nowrap text-on-action active:bg-action-primary-pressed [&_svg]:size-icon-standalone",
                children: (
                  <>
                    <primaryAction.icon aria-hidden="true" />
                    {primaryAction.shortLabel ?? primaryAction.label}
                  </>
                ),
              })}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export { AppShell, type AppShellProps, type LinkRenderProps, type NavItem };
