import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { EnvelopeList, type EnvelopeSummary } from "@koperty/ui/product/envelopes/envelope-list";

const ENVELOPES: EnvelopeSummary[] = [
  { id: "rachunki", name: "Rachunki", balance: 0 },
  { id: "jedzenie", name: "Jedzenie", balance: 17950 },
  { id: "chemia", name: "Chemia", balance: -3000 },
  { id: "wakacje", name: "Wakacje", balance: 200000 },
];

const MANY: EnvelopeSummary[] = [
  ...ENVELOPES,
  ...[
    "Transport",
    "Zdrowie",
    "Dzieci",
    "Prezenty",
    "Ubrania",
    "Samochód",
    "Mieszkanie",
    "Rozrywka",
    "Subskrypcje",
    "Zwierzęta",
    "Fundusz awaryjny",
  ].map((name, index) => ({ id: name, name, balance: (index + 1) * 4321 })),
];

const onCreate = fn();
const onRetry = fn();

const meta = {
  title: "Komponenty produktu/Koperty/Lista kopert",
  component: EnvelopeList,
  args: {
    envelopes: ENVELOPES,
    onAllocate: fn(),
    onRename: fn(),
    onArchive: fn(),
    onRestore: fn(),
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof EnvelopeList>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 420 } } };

async function chooseAction(canvasElement: HTMLElement, envelope: string, action: string) {
  const body = within(canvasElement.ownerDocument.body);
  await userEvent.click(
    within(canvasElement).getByRole("button", { name: `Więcej akcji: ${envelope}` }),
  );
  await userEvent.click(
    within(await body.findByRole("menu")).getByRole("menuitem", { name: action }),
  );
  await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
}

// Each card action reports the envelope's id to the screen.
export const Playground: Story = {
  parameters: ownFrame,
  play: async ({ args, canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
    await chooseAction(canvasElement, "Jedzenie", "Przydziel środki");
    await expect(args.onAllocate).toHaveBeenLastCalledWith("jedzenie");
    await chooseAction(canvasElement, "Jedzenie", "Zmień nazwę");
    await expect(args.onRename).toHaveBeenLastCalledWith("jedzenie");
    await chooseAction(canvasElement, "Rachunki", "Zarchiwizuj");
    await expect(args.onArchive).toHaveBeenLastCalledWith("rachunki");
  },
};

export const Ladowanie: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie kopert…")).toBeInTheDocument();
  },
};

export const Pusto: Story = {
  args: { envelopes: [], onCreate },
  play: async ({ canvas }) => {
    onCreate.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj kopertę" }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};

export const PustoBezAkcji: Story = { args: { envelopes: undefined } };

export const Blad: Story = {
  args: { error: "Nie udało się wczytać kopert", onRetry },
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const BladBezPonowienia: Story = { args: { error: "Nie udało się wczytać kopert" } };

export const DuzoKopert: Story = { args: { envelopes: MANY } };

function Reorderable() {
  const [envelopes, setEnvelopes] = useState(ENVELOPES);
  function move(id: string, direction: "up" | "down") {
    setEnvelopes((current) => {
      const index = current.findIndex((envelope) => envelope.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      const next = [...current];
      next.splice(target, 0, ...next.splice(index, 1));
      return next;
    });
  }
  return <EnvelopeList envelopes={envelopes} onMove={move} />;
}

// E3-Q3: reorder with buttons; the list order changes and focus stays on the moved envelope's button.
export const ZmianaKolejnosci: Story = {
  render: () => <Reorderable />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Przesuń w dół: Rachunki" }));
    await expect(canvas.getByRole("button", { name: "Przesuń w dół: Rachunki" })).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Przesuń w górę: Chemia" }));
    const names = canvas
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    await expect(names).toEqual(["Jedzenie", "Chemia", "Rachunki", "Wakacje"]);
  },
};

export const ZArchiwum: Story = {
  parameters: ownFrame,
  args: {
    envelopes: [...ENVELOPES, { id: "w25", name: "Wakacje 2025", balance: 0, archived: true }],
  },
  play: async ({ args, canvasElement }) => {
    await chooseAction(canvasElement, "Wakacje 2025", "Przywróć");
    await expect(args.onRestore).toHaveBeenLastCalledWith("w25");
  },
};

export const BezAkcji: Story = {
  args: { onAllocate: undefined, onRename: undefined, onArchive: undefined, onRestore: undefined },
};

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <EnvelopeList
        {...args}
        envelopes={[
          {
            id: "remont",
            name: "Remont łazienki i kuchni w mieszkaniu na Ochocie",
            balance: 2050000,
          },
          ...ENVELOPES,
        ]}
      />
    </NarrowScreen>
  ),
};
