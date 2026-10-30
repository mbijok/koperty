import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";

const onRetry = fn();

const meta = {
  title: "Komponenty produktu/Przychody i przydziały/Podsumowanie puli",
  component: PoolSummary,
  args: { amount: 420000, action: <Button variant="secondary">Dodaj przychód</Button> },
  argTypes: { action: { control: false } },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof PoolSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-16: 5000,00 zł of income, 800,00 zł allocated – 4200,00 zł left to allocate.
export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Do rozdysponowania" })).toBeVisible();
    await expect(canvas.getByText(/4\s200,00/)).toBeVisible();
  },
};

export const Ujemna: Story = {
  args: { amount: -20000 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Debet")).toBeVisible();
    await expect(canvas.getByText(/Przydzielono więcej, niż wpłynęło/)).toBeVisible();
  },
};

export const NowyBudzet: Story = { args: { amount: 0 } };

export const Ladowanie: Story = {
  args: { loading: true, amount: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Ładowanie puli…")).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "Dodaj przychód" })).toBeNull();
  },
};

export const Blad: Story = {
  args: { error: "Nie udało się wczytać puli", onRetry, amount: undefined, action: undefined },
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const BladBezPonowienia: Story = {
  args: { error: "Nie udało się wczytać puli", amount: undefined, action: undefined },
};

export const BezDanych: Story = { args: { amount: undefined, action: undefined } };

export const DuzaKwota: Story = {
  render: (args) => (
    <NarrowScreen>
      <PoolSummary {...args} amount={-1234567890} />
    </NarrowScreen>
  ),
};
