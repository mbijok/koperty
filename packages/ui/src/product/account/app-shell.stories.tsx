import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartColumn, ListOrdered, Plus, Wallet } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import {
  AppShell,
  type LinkRenderProps,
  type NavItem,
} from "@koperty/ui/product/account/app-shell";
import { BudgetSwitcher } from "@koperty/ui/product/budgets/budget-switcher";
import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";

const NAVIGATION: NavItem[] = [
  { label: "Koperty", href: "#koperty", icon: Wallet, active: true },
  { label: "Operacje", href: "#operacje", icon: ListOrdered },
  { label: "Podsumowanie", href: "#podsumowanie", icon: ChartColumn },
];

const BUDGETS = [
  { id: "dom", name: "Dom" },
  { id: "ochota", name: "Mieszkanie na Ochocie" },
];

const meta = {
  title: "Komponenty produktu/Konto/Powłoka aplikacji",
  component: AppShell,
  args: {
    displayName: "Ala Kowalska",
    onOpenProfile: fn(),
    onSignOut: fn(),
    navigation: NAVIGATION,
    primaryAction: {
      label: "Dodaj wydatek",
      shortLabel: "Wydatek",
      href: "#nowy-wydatek",
      icon: Plus,
    },
    budgetSwitcher: (
      <BudgetSwitcher budgets={BUDGETS} currentId="dom" onSwitch={fn()} onCreate={fn()} />
    ),
    children: (
      <div className="flex flex-col gap-section">
        <PoolSummary amount={420000} action={<Button variant="secondary">Dodaj przychód</Button>} />
        <EnvelopeList
          envelopes={[
            { id: "rachunki", name: "Rachunki", balance: 0 },
            { id: "jedzenie", name: "Jedzenie", balance: 17950 },
            { id: "chemia", name: "Chemia", balance: -3000 },
          ]}
        />
      </div>
    ),
  },
  argTypes: {
    budgetSwitcher: { control: false },
    children: { control: false },
    navigation: { control: false },
  },
  parameters: { layout: "fullscreen", docs: { story: { inline: false, iframeHeight: 640 } } },
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    await expect(canvas.getByRole("link", { name: "Przejdź do treści" })).toHaveAttribute(
      "href",
      "#main",
    );
    // The current page is announced (aria-current), not only coloured.
    const current = canvas.getAllByRole("link", { name: "Koperty" });
    await expect(current.every((link) => link.getAttribute("aria-current") === "page")).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Konto: Ala Kowalska" }));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      within(await body.findByRole("menu")).getByRole("menuitem", { name: "Profil" }),
    );
    await expect(args.onOpenProfile).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Konto: Ala Kowalska" }));
    await userEvent.click(
      within(await body.findByRole("menu")).getByRole("menuitem", { name: "Wyloguj" }),
    );
    await expect(args.onSignOut).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

const routerLink = fn();

function RouterLink({ href, children, ...props }: LinkRenderProps) {
  routerLink(href);
  return (
    <a href={href} data-router-link="" {...props}>
      {children}
    </a>
  );
}

// The app passes its router's Link through renderLink.
export const ZLinkiemRoutera: Story = {
  args: { renderLink: (props) => <RouterLink {...props} /> },
  play: async ({ canvasElement }) => {
    await expect(routerLink).toHaveBeenCalledWith("#operacje");
    await expect(canvasElement.querySelectorAll("[data-router-link]").length).toBeGreaterThan(0);
  },
};

export const BezSkrotuWBelce: Story = {
  args: { primaryAction: { label: "Dodaj", href: "#nowy-wydatek", icon: Plus } },
};

export const BezAkcjiGlownej: Story = {
  args: { primaryAction: undefined, budgetSwitcher: undefined },
};

export const SzerokaTresc: Story = {
  args: {
    width: "wide",
    navigation: [
      { label: "Koperty", href: "#koperty", icon: Wallet },
      { label: "Operacje", href: "#operacje", icon: ListOrdered },
      { label: "Podsumowanie", href: "#podsumowanie", icon: ChartColumn, active: true },
    ],
    children: <p className="text-body">Treść do 960 px, np. tabela podsumowania miesiąca.</p>,
  },
};
