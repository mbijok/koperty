import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { OperationRow } from "@koperty/ui/product/expenses/operation-row";
import {
  BIEDRONKA as biedronka,
  DELETED_AUTHOR as deletedAuthor,
  NO_DESCRIPTION as noDescription,
  SALARY as salary,
  SPLIT_EXPENSE as split,
} from "#docs/data/operations.ts";

const meta = {
  title: "Komponenty produktu/Wydatki/Wiersz operacji",
  component: OperationRow,
  args: { ...biedronka, onEdit: fn(), onDelete: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof OperationRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Edytuj wydatek: Biedronka" }));
    await expect(args.onEdit).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Usuń wydatek: Biedronka" }));
    await expect(args.onDelete).toHaveBeenCalledOnce();
  },
};

export const Stany: Story = {
  render: (args) => (
    <StateGrid
      states={[
        { label: "Wydatek (US-20)", node: <OperationRow {...args} /> },
        { label: "Podział (US-18)", node: <OperationRow {...args} {...split} /> },
        { label: "Przychód (P7)", node: <OperationRow {...args} {...salary} /> },
        {
          label: "Bez opisu (częściowe dane)",
          node: <OperationRow {...args} {...noDescription} />,
        },
        { label: "Konto usunięte (US-03)", node: <OperationRow {...args} {...deletedAuthor} /> },
        { label: "Bez akcji", node: <OperationRow {...biedronka} /> },
        { label: "Tylko edycja", node: <OperationRow {...biedronka} onEdit={fn()} /> },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: (args) => (
    <NarrowScreen>
      <OperationRow
        {...args}
        description="Zakupy na weekend w Biedronce i drogerii, razem z chemią dla domu"
        envelopes={["Jedzenie", "Chemia", "Remont łazienki i kuchni w mieszkaniu na Ochocie"]}
        author="Aleksandra Kowalska-Wiśniewska"
        amount={1234567}
      />
    </NarrowScreen>
  ),
};
