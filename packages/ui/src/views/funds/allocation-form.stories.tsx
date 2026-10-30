import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Alert, AlertDescription, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { SERVER_MESSAGE, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { EnvelopeCard } from "@koperty/ui/product/envelopes/envelope-card";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";
import { AllocationForm } from "@koperty/ui/views/funds/allocation-form";

const saved = (): Promise<SubmitResult<"amount">> => Promise.resolve({ ok: true });
const serverDown = (): Promise<SubmitResult<"amount">> => Promise.reject(new Error("500"));

const meta = {
  title: "Wzorce/Kwota ujemna i debet",
  component: AllocationForm,
  args: {
    envelopeName: "Jedzenie",
    month: "2026-10",
    current: 0,
    pool: 500000,
    submit: fn(saved),
    onSuccess: fn(),
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof AllocationForm>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-16: pool 5000,00 zł, allocating 800,00 zł shows the pool after saving – 4200,00 zł.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText(/Przydział: Jedzenie, Październik 2026/), "800");
    await expect(canvas.getByText(/4\s200,00\szł/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przydział" }));
    await expect(args.submit).toHaveBeenLastCalledWith(80000);
    await waitFor(() => expect(args.onSuccess).toHaveBeenCalledOnce());
  },
};

// US-16: pool 100,00 zł, allocating 300,00 zł is allowed; the pool −200,00 zł is clearly marked.
export const PulaPonizejZera: Story = {
  args: { pool: 10000 },
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText(/Przydział/), "300");
    await expect(canvas.getByText(/−200,00\szł/)).toBeVisible();
    await expect(canvas.getByText("Debet")).toBeVisible();
    await expect(canvas.getByText(/Przydzielasz więcej, niż jest w puli/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przydział" }));
    await expect(args.submit).toHaveBeenLastCalledWith(30000);
  },
};

// US-16: lowering 800,00 zł to 600,00 zł returns 200,00 zł to the pool.
export const ZmniejszeniePrzydzialu: Story = {
  args: { current: 80000, pool: 420000, onCancel: fn() },
  play: async ({ args, canvas }) => {
    const field = canvas.getByLabelText(/Przydział/);
    await expect(field).toHaveDisplayValue(/^800,00$/);
    await userEvent.clear(field);
    await userEvent.type(field, "600");
    await expect(canvas.getByText(/4\s400,00\szł/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

// Planning ahead: a future month takes from the pool at once (US-16, PRD 4.3).
export const PrzyszlyMiesiac: Story = {
  args: { month: "2027-01", envelopeName: "Wakacje" },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText(/Przydział: Wakacje, Styczeń 2027/)).toBeVisible();
  },
};

export const BladKwoty: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText(/Przydział/), "osiemset");
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przydział" }));
    await expect(canvas.getByText(/Podaj kwotę, np\. 800/)).toBeVisible();
    await expect(canvas.queryByText(/Pula po zapisie/)).toBeNull();
    await expect(args.submit).not.toHaveBeenCalled();
  },
};

export const BladSerwera: Story = {
  args: { submit: fn(serverDown), current: 80000 },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz przydział" }));
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
  },
};

// A negative balance or pool across the product: minus sign and "Debet" (K3), never colour alone (W4).
export const DebetWKopercieIPuli: Story = {
  render: () => (
    <div className="flex flex-col gap-between-groups">
      <PoolSummary amount={-20000} />
      <EnvelopeCard name="Chemia" balance={-3000} onAllocate={() => {}} />
      <Alert action={<Button size="sm">Przydziel środki</Button>}>
        <AlertTitle>Koperta Chemia ma debet 30,00 zł</AlertTitle>
        <AlertDescription>Debet pokrywasz, zwiększając przydział koperty.</AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText("Debet")).toHaveLength(2);
  },
};

export const WaskiEkran: Story = {
  args: { pool: -20000, current: 30000, envelopeName: "Remont łazienki i kuchni" },
  render: (args) => (
    <NarrowScreen>
      <AllocationForm {...args} />
    </NarrowScreen>
  ),
};
