import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher";

function ControlledSwitcher({ initial }: { initial: string }) {
  const [month, setMonth] = useState(initial);
  return <MonthSwitcher month={month} onMonthChange={setMonth} />;
}

const meta = {
  title: "Komponenty produktu/Przychody i przydziały/Przełącznik miesiąca",
  component: MonthSwitcher,
  args: { month: "2026-10", onMonthChange: fn() },
} satisfies Meta<typeof MonthSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-content">
      <MonthSwitcher {...args} />
    </div>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Następny miesiąc" }));
    await expect(args.onMonthChange).toHaveBeenCalledWith("2026-11");
    await userEvent.click(canvas.getByRole("button", { name: "Poprzedni miesiąc" }));
    await expect(args.onMonthChange).toHaveBeenLastCalledWith("2026-09");
  },
};

// Crossing the year and planning ahead (US-16): the name changes and is announced.
export const PrzejscieRoku: Story = {
  render: () => (
    <div className="max-w-content">
      <ControlledSwitcher initial="2026-12" />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Następny miesiąc" }));
    await expect(canvas.getByText("Styczeń 2027")).toHaveAttribute("aria-live", "polite");
  },
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <ControlledSwitcher initial="2026-09" />
    </NarrowScreen>
  ),
};
