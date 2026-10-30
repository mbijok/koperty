import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { ErrorState } from "@koperty/ui/primitives/empty";
import { OfflineBanner } from "@koperty/ui/product/app/offline-banner";
import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list";
import { SignInForm } from "@koperty/ui/views/account/sign-in-form";

const offline = () => {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
  return () => {
    Reflect.deleteProperty(navigator, "onLine");
  };
};

const ENVELOPES = [
  { id: "jedzenie", name: "Jedzenie", balance: 17950 },
  { id: "chemia", name: "Chemia", balance: -3000 },
];
const onRetry = fn();

const meta = {
  title: "Wzorce/Brak sieci i wygasła sesja",
  component: OfflineBanner,
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof OfflineBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

// The connection drops while using the app: loaded data stays on the screen under the message.
export const UtrataPolaczenia: Story = {
  beforeEach: offline,
  render: () => (
    <div className="flex flex-col gap-between-groups">
      <OfflineBanner />
      <EnvelopeList envelopes={ENVELOPES} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Brak połączenia z internetem")).toBeVisible();
    await expect(canvas.getByText("Jedzenie")).toBeVisible();
  },
};

// US-23: the app opened without a connection – nothing to show, a clear message and a retry.
export const StartBezPolaczenia: Story = {
  beforeEach: offline,
  render: () => (
    <div className="flex flex-col gap-between-groups">
      <OfflineBanner />
      <ErrorState
        title="Nie udało się wczytać budżetu"
        description="Aplikacja potrzebuje internetu. Sprawdź połączenie i spróbuj ponownie."
        action={
          <Button variant="secondary" onClick={onRetry}>
            Spróbuj ponownie
          </Button>
        }
      />
    </div>
  ),
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

// S-01 AC-6b: the session expired or ended in another tab – sign-in with a notice, then back.
export const WygaslaSesja: Story = {
  render: () => (
    <SignInForm
      notice="Sesja wygasła. Zaloguj się ponownie, a wrócisz do miejsca, w którym byłeś."
      requestCode={async () => ({ ok: true })}
      verifyCode={async () => ({ ok: true })}
      onSignedIn={() => {}}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Sesja wygasła");
  },
};

export const WaskiEkran: Story = {
  beforeEach: offline,
  render: () => (
    <NarrowScreen>
      <OfflineBanner />
    </NarrowScreen>
  ),
};
