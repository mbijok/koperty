import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { NameForm } from "@koperty/ui/patterns/name-form";
import { EnvelopeList, type EnvelopeSummary } from "@koperty/ui/product/envelopes/envelope-list";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";
import { Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const ENVELOPES: EnvelopeSummary[] = [
  { id: "rachunki", name: "Rachunki", balance: 0 },
  { id: "jedzenie", name: "Jedzenie", balance: 17950 },
  { id: "chemia", name: "Chemia", balance: -3000 },
  { id: "wakacje", name: "Wakacje", balance: 200000 },
];
const ok = async () => ({ ok: true as const });
function noop() {}

// Envelope cards are h3 headings, so the list sits under an h2 (WCAG 1.3.1, axe heading-order).
function Balances({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="balances" className="flex flex-col gap-group">
      <h2 id="balances" className="text-section text-default">
        Salda kopert
      </h2>
      {children}
    </section>
  );
}

const meta = {
  title: "Ekrany/Koperty",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type State = "data" | "empty" | "loading" | "error";

// US-21: right after opening the app – the pool and the envelopes with current balances.
function Overview({ state }: { state: State }) {
  return (
    <Screen section="koperty" title="Koperty">
      <PoolSummary
        amount={state === "empty" ? 0 : 420000}
        loading={state === "loading"}
        error={state === "error" ? "Nie udało się wczytać puli" : undefined}
        onRetry={noop}
        action={
          <Button variant="secondary">
            {state === "empty" ? "Dodaj przychód" : "Przydziel środki"}
          </Button>
        }
      />
      <Balances>
        <EnvelopeList
          envelopes={state === "empty" ? [] : ENVELOPES}
          loading={state === "loading"}
          error={state === "error" ? "Nie udało się wczytać kopert" : undefined}
          onRetry={noop}
          onCreate={noop}
          onAllocate={noop}
          onRename={noop}
          onArchive={noop}
        />
      </Balances>
    </Screen>
  );
}

export const WidokKopert: Story = {
  name: "Widok kopert",
  render: () => <Overview state="data" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Koperty" })).toBeVisible();
    await expect(canvas.getByText("Debet")).toBeVisible();
  },
};

export const WidokKopertPustyBudzet: Story = {
  name: "Widok kopert: pusty budżet",
  render: () => <Overview state="empty" />,
};

export const WidokKopertLadowanie: Story = {
  name: "Widok kopert: ładowanie",
  render: () => <Overview state="loading" />,
};

export const WidokKopertBlad: Story = {
  name: "Widok kopert: błąd",
  render: () => <Overview state="error" />,
};

function Reorder() {
  const [envelopes, setEnvelopes] = useState(ENVELOPES);
  function move(id: string, direction: "up" | "down") {
    setEnvelopes((current) => {
      const index = current.findIndex((envelope) => envelope.id === id);
      const next = [...current];
      next.splice(direction === "up" ? index - 1 : index + 1, 0, ...next.splice(index, 1));
      return next;
    });
  }
  return (
    <Screen
      section="koperty"
      title="Kolejność kopert"
      description="Kolejność widzą wszyscy członkowie budżetu."
    >
      <Balances>
        <EnvelopeList envelopes={envelopes} onMove={move} />
      </Balances>
      <Button className="self-start">Gotowe</Button>
    </Screen>
  );
}

// US-12, E3-Q3: reordering with buttons, also from the keyboard.
export const ZmianaKolejnosci: Story = {
  name: "Zarządzanie: kolejność",
  render: () => <Reorder />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Przesuń w dół: Rachunki" }));
    await expect(canvas.getByRole("button", { name: "Przesuń w dół: Rachunki" })).toHaveFocus();
  },
};

// US-13: archived envelopes below the active ones, with "Przywróć".
export const ZArchiwum: Story = {
  name: "Zarządzanie: archiwum",
  render: () => (
    <Screen section="koperty" title="Koperty">
      <Balances>
        <EnvelopeList
          envelopes={[
            ...ENVELOPES,
            { id: "w25", name: "Wakacje 2025", balance: 0, archived: true },
          ]}
          onAllocate={noop}
          onRename={noop}
          onArchive={noop}
          onRestore={noop}
        />
      </Balances>
    </Screen>
  ),
};

export const NowaKoperta: Story = {
  name: "Zarządzanie: nowa koperta",
  render: () => (
    <Screen section="koperty" title="Nowa koperta">
      <NameForm
        label="Nazwa koperty"
        hint="Np. Jedzenie, Rachunki, Wakacje"
        emptyMessage="Podaj nazwę koperty."
        submitLabel="Dodaj kopertę"
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};

// US-12 [Z3]: renaming to the name of another active envelope.
export const ZmianaNazwyZajeta: Story = {
  name: "Zarządzanie: nazwa zajęta",
  render: () => (
    <Screen section="koperty" title="Zmień nazwę koperty">
      <NameForm
        label="Nazwa koperty"
        emptyMessage="Podaj nazwę koperty."
        submitLabel="Zmień nazwę"
        initial="Chemia"
        submit={async () => ({
          ok: false,
          fieldErrors: { name: "Masz już kopertę o tej nazwie." },
        })}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
  play: async ({ canvas }) => {
    await userEvent.clear(canvas.getByLabelText("Nazwa koperty"));
    await userEvent.type(canvas.getByLabelText("Nazwa koperty"), "Jedzenie");
    await userEvent.click(canvas.getByRole("button", { name: "Zmień nazwę" }));
    await expect(await canvas.findByText("Masz już kopertę o tej nazwie.")).toBeVisible();
  },
};
