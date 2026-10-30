import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { ConfirmDeleteDialog } from "@koperty/ui/patterns/confirm-delete-dialog";
import { InvitationRow } from "@koperty/ui/product/budgets/invitation-row";
import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel";
import { JoinBudgetCard } from "@koperty/ui/product/budgets/join-budget-card";

const LINK = "https://koperty.app/join/7Hq2-Kx9p-Ld4m";
const onCopy = fn();
const onRevoke = fn();

// The owner's side (US-07): generate a link, copy or share it, see active links and revoke one.
function Invitations({ failGenerate = false }: { failGenerate?: boolean }) {
  const [link, setLink] = useState<string>();
  const [error, setError] = useState<string>();
  const [active, setActive] = useState(true);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex flex-col gap-section">
      <InviteLinkPanel
        link={link}
        expiresOn="2026-11-06"
        error={error}
        onGenerate={() =>
          failGenerate
            ? setError("Nie udało się wygenerować linku. Spróbuj ponownie.")
            : setLink(LINK)
        }
        onCopy={onCopy}
      />
      <section aria-labelledby="active-invitations" className="flex flex-col gap-group">
        <h2 id="active-invitations" className="text-section text-default">
          Aktywne zaproszenia
        </h2>
        {active ? (
          <InvitationRow
            expiresOn="2026-11-02"
            createdBy="Ala Kowalska"
            onRevoke={() => setConfirm(true)}
          />
        ) : (
          <p className="text-body text-muted">Brak aktywnych zaproszeń.</p>
        )}
      </section>
      <ConfirmDeleteDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Unieważnić link zaproszenia ważny do 2 listopada?"
        description="Osoba, która go dostała, nie dołączy przez niego do budżetu. Zawsze możesz wygenerować nowy link."
        confirmLabel="Unieważnij link"
        onConfirm={async () => {
          onRevoke();
          setActive(false);
        }}
      />
    </div>
  );
}

const meta = {
  title: "Wzorce/Zaproszenie",
  component: InviteLinkPanel,
  args: { onGenerate: () => {}, onCopy },
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof InviteLinkPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-07: the link appears only after generating; revoking asks first and names the link.
export const Udostepnienie: Story = {
  render: () => <Invitations />,
  play: async ({ canvas, canvasElement }) => {
    onCopy.mockClear();
    onRevoke.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Wygeneruj link" }));
    await expect(canvas.getByLabelText("Link zaproszenia")).toHaveValue(LINK);
    await userEvent.click(canvas.getByRole("button", { name: /Kopiuj link/ }));
    await expect(onCopy).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Unieważnij…" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Unieważnij link" }));
    await waitFor(() => expect(canvas.getByText("Brak aktywnych zaproszeń.")).toBeVisible());
    await expect(onRevoke).toHaveBeenCalledOnce();
  },
};

export const BladGenerowania: Story = {
  render: () => <Invitations failGenerate />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Wygeneruj link" }));
    await expect(canvas.getByText(/Nie udało się wygenerować linku/)).toBeVisible();
  },
};

// A member (not an owner) sees active links but can't create or revoke them (US-07).
export const WidokCzlonka: Story = {
  render: () => (
    <section aria-labelledby="member-invitations" className="flex flex-col gap-group">
      <h2 id="member-invitations" className="text-section text-default">
        Aktywne zaproszenia
      </h2>
      <InvitationRow expiresOn="2026-11-02" createdBy="Ala Kowalska" />
      <p className="text-body text-muted">Zaproszenia tworzą i unieważniają właściciele budżetu.</p>
    </section>
  ),
};

// US-08: the invited person opens the link while signed in and confirms.
export const Otwarcie: Story = {
  render: () => (
    <JoinBudgetCard
      state="valid"
      budgetName="Dom"
      invitedBy="Ala Kowalska"
      onJoin={() => {}}
      onGoHome={() => {}}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Dołącz do budżetu „Dom”" })).toBeVisible();
  },
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <InviteLinkPanel
        link={LINK}
        expiresOn="2026-11-06"
        onGenerate={() => {}}
        onCopy={() => {}}
        onShare={() => {}}
      />
    </NarrowScreen>
  ),
};
