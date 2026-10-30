import type { Meta, StoryObj } from "@storybook/react-vite";
import { AllocationForm } from "@koperty/ui/views/funds/allocation-form";
import { IncomeForm } from "@koperty/ui/views/funds/income-form";
import { Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const ok = async () => ({ ok: true as const });
function noop() {}

const meta = {
  title: "Ekrany/Przychody i przydziały",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// US-14: a new income raises the pool.
export const NowyPrzychod: Story = {
  name: "Przychód: nowy",
  render: () => (
    <Screen section="operacje" title="Nowy przychód">
      <IncomeForm submit={ok} onSuccess={noop} onCancel={noop} />
    </Screen>
  ),
};

// US-15: editing a saved income.
export const EdycjaPrzychodu: Story = {
  name: "Przychód: edycja",
  render: () => (
    <Screen section="operacje" title="Edycja przychodu">
      <IncomeForm
        initial={{ amount: "5 000,00", date: "2026-10-28", description: "Wypłata" }}
        submitLabel="Zapisz zmiany"
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};

// US-16: an allocation from the pool to an envelope for a month.
export const Przydzial: Story = {
  name: "Przydział",
  render: () => (
    <Screen section="koperty" title="Przydziel środki">
      <AllocationForm
        envelopeName="Jedzenie"
        month="2026-10"
        current={80000}
        pool={420000}
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};

// US-16: the allocation is larger than the pool – allowed, the negative pool is shown before saving.
export const PrzydzialPulaPonizejZera: Story = {
  name: "Przydział: pula poniżej zera",
  render: () => (
    <Screen section="koperty" title="Przydziel środki">
      <AllocationForm
        envelopeName="Chemia"
        month="2026-10"
        current={30000}
        pool={-20000}
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};

// US-16: planning a future month.
export const PrzydzialPrzyszlyMiesiac: Story = {
  name: "Przydział: przyszły miesiąc",
  render: () => (
    <Screen section="koperty" title="Przydziel środki">
      <AllocationForm
        envelopeName="Wakacje"
        month="2027-01"
        current={0}
        pool={420000}
        submit={ok}
        onSuccess={noop}
        onCancel={noop}
      />
    </Screen>
  ),
};
