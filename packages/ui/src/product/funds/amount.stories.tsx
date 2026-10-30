import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Amount } from "@koperty/ui/product/funds/amount";

const meta = {
  title: "Komponenty produktu/Przychody i przydziały/Kwota",
  component: Amount,
  args: { amount: 17950 },
  argTypes: {
    kind: { control: "inline-radio", options: ["balance", "income", "expense"] },
    size: { control: "inline-radio", options: ["default", "lg"] },
  },
} satisfies Meta<typeof Amount>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent(/179,50\szł/);
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Saldo dodatnie", node: <Amount amount={17950} /> },
        { label: "Saldo zero", node: <Amount amount={0} /> },
        { label: "Debet (K3)", node: <Amount amount={-3000} /> },
        { label: "Przychód na liście (P7)", node: <Amount amount={500000} kind="income" /> },
        { label: "Wydatek na liście", node: <Amount amount={12050} kind="expense" /> },
        { label: "Kwota główna", node: <Amount amount={-20000} size="lg" /> },
      ]}
    />
  ),
};

export const Debet: Story = {
  args: { amount: -3000 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent(/−30,00\szł/);
    await expect(canvasElement).toHaveTextContent("Debet");
  },
};

export const DuzeKwoty: Story = {
  render: () => (
    <NarrowScreen>
      <div className="flex flex-col items-start gap-group">
        <Amount amount={1234567890} size="lg" />
        <Amount amount={-1234567890} size="lg" />
      </div>
    </NarrowScreen>
  ),
};
