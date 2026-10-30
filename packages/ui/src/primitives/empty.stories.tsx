import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarX, Mail, Receipt, Wallet } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { EmptyState } from "@koperty/ui/primitives/empty";

const onAdd = fn();

const meta = {
  title: "Komponenty bazowe/Pusty stan",
  component: EmptyState,
  args: {
    icon: Wallet,
    title: "Nie masz jeszcze kopert",
    description: "Koperty to cele wydatków, np. Jedzenie albo Rachunki. Zacznij od pierwszej.",
    action: <Button onClick={onAdd}>Dodaj kopertę</Button>,
  },
  argTypes: { icon: { control: false }, action: { control: false } },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-21: a new budget without envelopes shows encouragement to add the first one.
export const Playground: Story = {
  play: async ({ canvas }) => {
    onAdd.mockClear();
    await expect(canvas.getByText("Nie masz jeszcze kopert")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj kopertę" }));
    await expect(onAdd).toHaveBeenCalledOnce();
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        {
          label: "Jeszcze nic tu nie ma (US-20)",
          node: (
            <EmptyState
              icon={Receipt}
              title="Brak operacji w tym budżecie"
              description="Zapisz pierwszy wydatek albo przychód – pojawi się tutaj."
              action={<Button>Dodaj wydatek</Button>}
            />
          ),
        },
        {
          label: "Nic w wybranym miesiącu (Q5)",
          node: (
            <EmptyState
              icon={CalendarX}
              title="Brak operacji w listopadzie"
              description="W tym miesiącu nikt jeszcze nic nie zapisał."
              action={<Button variant="secondary">Pokaż październik</Button>}
            />
          ),
        },
        {
          label: "Bez akcji (US-07)",
          node: (
            <EmptyState
              icon={Mail}
              title="Brak aktywnych zaproszeń"
              description="Wygenerowane linki zaproszeń pojawią się tutaj."
            />
          ),
        },
        { label: "Sam tytuł", node: <EmptyState icon={Mail} title="Brak aktywnych zaproszeń" /> },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <EmptyState
        icon={Wallet}
        title="Nie masz jeszcze kopert w budżecie „Wspólne mieszkanie na Ochocie”"
        description="Koperty to cele wydatków, np. Jedzenie, Rachunki albo Fundusz awaryjny. Zacznij od pierwszej, a potem przydziel jej środki z puli."
        action={<Button className="w-full">Dodaj kopertę</Button>}
      />
    </NarrowScreen>
  ),
};
