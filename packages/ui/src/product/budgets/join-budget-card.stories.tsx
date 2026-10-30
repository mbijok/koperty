import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { JoinBudgetCard } from "@koperty/ui/product/budgets/join-budget-card";

const meta = {
  title: "Komponenty produktu/Budżety i członkostwo/Karta dołączenia",
  component: JoinBudgetCard,
  args: {
    state: "valid",
    budgetName: "Dom",
    invitedBy: "Ala Kowalska",
    onJoin: fn(),
    onGoHome: fn(),
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["checking", "valid", "expired", "used", "revoked"],
    },
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof JoinBudgetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// US-08: a signed-in person confirms and joins as a member.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Dołącz do budżetu „Dom”" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dołącz do budżetu" }));
    await expect(args.onJoin).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Nie teraz" }));
    await expect(args.onGoHome).toHaveBeenCalledOnce();
  },
};

export const Dolaczanie: Story = {
  args: { joining: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Dołączanie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.getByRole("button", { name: "Nie teraz" })).toBeDisabled();
  },
};

export const Sprawdzanie: Story = {
  args: { state: "checking" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Sprawdzanie zaproszenia…");
  },
};

export const Wygaslo: Story = {
  args: { state: "expired" },
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent("Ten link zaproszenia wygasł");
    await userEvent.click(canvas.getByRole("button", { name: "Przejdź do aplikacji" }));
    await expect(args.onGoHome).toHaveBeenCalled();
  },
};

export const Uzyte: Story = { args: { state: "used" } };

export const Uniewaznione: Story = { args: { state: "revoked" } };

export const BezZapraszajacego: Story = { args: { invitedBy: undefined } };

export const DlugaNazwa: Story = {
  args: {
    budgetName: "Wspólne mieszkanie na Ochocie z Tomkiem i Kasią",
    invitedBy: "Aleksandra Kowalska-Wiśniewska",
  },
  render: (args) => (
    <NarrowScreen>
      <JoinBudgetCard {...args} />
    </NarrowScreen>
  ),
};
