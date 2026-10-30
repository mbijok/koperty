import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { ErrorState } from "@koperty/ui/primitives/empty";
import { OfflineBanner } from "@koperty/ui/product/app/offline-banner";
import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";
import { Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const offline = () => {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
  return () => {
    Reflect.deleteProperty(navigator, "onLine");
  };
};

const meta = {
  title: "Ekrany/Aplikacja na telefonie",
  parameters: SCREEN_PARAMETERS,
  beforeEach: offline,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// US-23: the connection dropped – the loaded envelopes stay under the message.
export const UtrataPolaczenia: Story = {
  name: "Brak sieci: w trakcie pracy",
  render: () => (
    <Screen section="koperty" title="Koperty">
      <OfflineBanner />
      <PoolSummary amount={420000} />
      <section aria-labelledby="offline-balances" className="flex flex-col gap-group">
        <h2 id="offline-balances" className="text-section text-default">
          Salda kopert
        </h2>
        <EnvelopeList
          envelopes={[
            { id: "jedzenie", name: "Jedzenie", balance: 17950 },
            { id: "chemia", name: "Chemia", balance: -3000 },
          ]}
        />
      </section>
    </Screen>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Brak połączenia z internetem")).toBeVisible();
  },
};

// US-23: opened without a connection – nothing loaded, a clear message and a retry.
export const StartBezPolaczenia: Story = {
  name: "Brak sieci: start aplikacji",
  render: () => (
    <Screen section="koperty" title="Koperty">
      <OfflineBanner />
      <ErrorState
        title="Nie udało się wczytać budżetu"
        description="Aplikacja potrzebuje internetu. Sprawdź połączenie i spróbuj ponownie."
        action={<Button variant="secondary">Spróbuj ponownie</Button>}
      />
    </Screen>
  ),
};
