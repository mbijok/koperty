import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { NameForm } from "@koperty/ui/patterns/name-form";
import { InvitationRow } from "@koperty/ui/product/budgets/invitation-row";
import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel";
import { JoinBudgetCard } from "@koperty/ui/product/budgets/join-budget-card";
import { MemberRow } from "@koperty/ui/product/budgets/member-row";
import { SignInForm } from "@koperty/ui/views/account/sign-in-form";
import { CreateBudgetForm } from "@koperty/ui/views/budgets/create-budget-form";
import { PublicScreen, Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const ok = async () => ({ ok: true as const });
function noop() {}

const meta = {
  title: "Ekrany/Budżety i członkostwo",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// US-04: right after the first sign-in there is no budget, so no navigation either.
export const PierwszyBudzet: Story = {
  name: "Utworzenie budżetu: pierwszy",
  render: () => (
    <PublicScreen title="Utwórz pierwszy budżet">
      <p className="text-body text-muted">
        Budżet to wspólne koperty i operacje. Masz zaproszenie? Otwórz link od właściciela budżetu.
      </p>
      <CreateBudgetForm submit={ok} onSuccess={noop} />
    </PublicScreen>
  ),
};

export const KolejnyBudzet: Story = {
  name: "Utworzenie budżetu: kolejny",
  render: () => (
    <Screen title="Nowy budżet">
      <CreateBudgetForm submit={ok} onSuccess={noop} onCancel={noop} />
    </Screen>
  ),
};

type Viewer = "owner" | "member" | "only-owner";

function Settings({ viewer }: { viewer: Viewer }) {
  const owner = viewer !== "member";
  return (
    <Screen title="Ustawienia budżetu" description="Dom">
      {owner && (
        <section aria-labelledby="settings-name" className="flex flex-col gap-group">
          <h2 id="settings-name" className="text-section text-default">
            Nazwa
          </h2>
          <NameForm
            label="Nazwa budżetu"
            emptyMessage="Podaj nazwę budżetu."
            submitLabel="Zmień nazwę"
            initial="Dom"
            submit={ok}
            onSuccess={noop}
          />
        </section>
      )}
      <section aria-labelledby="settings-members" className="flex flex-col">
        <h2 id="settings-members" className="text-section text-default">
          Członkowie
        </h2>
        <MemberRow
          name="Ala Kowalska"
          memberRole="owner"
          isCurrentUser={owner}
          viewerIsOwner={owner}
          isOnlyOwner={viewer === "only-owner"}
          onToggleOwner={owner ? noop : undefined}
          onLeave={owner ? noop : undefined}
        />
        <MemberRow
          name="Tomasz Kowalski"
          memberRole={viewer === "owner" ? "owner" : "member"}
          isCurrentUser={!owner}
          viewerIsOwner={owner}
          onToggleOwner={owner ? noop : undefined}
          onRemove={owner ? noop : undefined}
          onLeave={owner ? undefined : noop}
        />
      </section>
      <section aria-labelledby="settings-invitations" className="flex flex-col gap-group">
        <h2 id="settings-invitations" className="text-section text-default">
          Zaproszenia
        </h2>
        {owner && <InviteLinkPanel onGenerate={noop} onCopy={noop} />}
        <InvitationRow
          expiresOn="2026-11-02"
          createdBy="Ala Kowalska"
          onRevoke={owner ? noop : undefined}
        />
        {!owner && (
          <p className="text-body text-muted">
            Zaproszenia tworzą i unieważniają właściciele budżetu.
          </p>
        )}
      </section>
      {owner && (
        <section aria-labelledby="settings-delete" className="flex flex-col items-start gap-group">
          <h2 id="settings-delete" className="text-section text-default">
            Usunięcie budżetu
          </h2>
          <p className="text-body text-muted">
            Usuwa koperty, operacje i członkostwa wszystkich osób. Tej operacji nie można cofnąć.
          </p>
          <Button variant="danger">Usuń budżet…</Button>
        </section>
      )}
    </Screen>
  );
}

// US-06, US-07, US-09: the owner manages the name, members, invitations and deletion.
export const UstawieniaWlasciciel: Story = {
  name: "Ustawienia: właściciel",
  render: () => <Settings viewer="owner" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Usuń budżet…" })).toBeVisible();
  },
};

// US-10: the only owner can't leave; the row explains why.
export const UstawieniaJedynyWlasciciel: Story = {
  name: "Ustawienia: jedyny właściciel",
  render: () => <Settings viewer="only-owner" />,
};

// A member sees the members and active links and can leave (US-10), nothing more (PRD 4.9).
export const UstawieniaCzlonek: Story = {
  name: "Ustawienia: członek",
  render: () => <Settings viewer="member" />,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "Usuń budżet…" })).toBeNull();
  },
};

export const DolaczenieWazny: Story = {
  name: "Dołączenie: ważny link",
  render: () => (
    <PublicScreen>
      <JoinBudgetCard
        state="valid"
        budgetName="Dom"
        invitedBy="Ala Kowalska"
        onJoin={noop}
        onGoHome={noop}
      />
    </PublicScreen>
  ),
};

// Without a valid invitation the card has no heading of its own, so the page gives the h1.
export const DolaczenieSprawdzanie: Story = {
  name: "Dołączenie: sprawdzanie linku",
  render: () => (
    <PublicScreen title="Zaproszenie do budżetu">
      <JoinBudgetCard state="checking" onJoin={noop} onGoHome={noop} />
    </PublicScreen>
  ),
};

export const DolaczenieWygaslo: Story = {
  name: "Dołączenie: link wygasł",
  render: () => (
    <PublicScreen title="Zaproszenie do budżetu">
      <JoinBudgetCard state="expired" onJoin={noop} onGoHome={noop} />
    </PublicScreen>
  ),
};

// US-08: not signed in – sign in first, then back to joining.
export const DolaczenieNiezalogowany: Story = {
  name: "Dołączenie: bez zalogowania",
  render: () => (
    <PublicScreen title="Zaloguj się">
      <SignInForm
        notice="Zaloguj się, żeby dołączyć do budżetu „Dom”."
        requestCode={ok}
        verifyCode={ok}
        onSignedIn={noop}
      />
    </PublicScreen>
  ),
};
