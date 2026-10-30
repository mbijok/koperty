import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { BudgetSwitcher } from "@koperty/ui/product/budgets/budget-switcher";

const BUDGETS = [
  { id: "dom", name: "Dom" },
  { id: "ochota", name: "Wspólne mieszkanie na Ochocie z Tomkiem i Kasią" },
];

const meta = {
  title: "Komponenty produktu/Budżety i członkostwo/Przełącznik budżetu",
  component: BudgetSwitcher,
  args: { budgets: BUDGETS, currentId: "dom", onSwitch: fn(), onCreate: fn() },
  parameters: { docs: { story: { inline: false, iframeHeight: 280 } } },
} satisfies Meta<typeof BudgetSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Budżet: Dom" }));
    const menu = await body.findByRole("menu");
    await expect(within(menu).getByRole("menuitemradio", { name: "Dom" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.click(within(menu).getByRole("menuitemradio", { name: /Wspólne mieszkanie/ }));
    await expect(args.onSwitch).toHaveBeenCalledWith("ochota");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Budżet: Dom" }));
    await userEvent.click(
      within(await body.findByRole("menu")).getByRole("menuitem", { name: "Utwórz budżet" }),
    );
    await expect(args.onCreate).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const BezWybranegoBudzetu: Story = {
  args: { currentId: "nieznany" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Budżet: Wybierz budżet" })).toBeVisible();
  },
};

export const DlugaNazwa: Story = {
  args: { currentId: "ochota" },
  render: (args) => (
    <NarrowScreen>
      <BudgetSwitcher {...args} />
    </NarrowScreen>
  ),
};
