import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel";

const LINK = "https://koperty.app/dolacz/8f3c2a91-4b7e-4d0a-9c55-1e2f3a4b5c6d";

const meta = {
  title: "Komponenty produktu/Budżety i członkostwo/Panel linku zaproszenia",
  component: InviteLinkPanel,
  args: { onGenerate: fn(), onCopy: fn(), onShare: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof InviteLinkPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Wygeneruj link" }));
    await expect(args.onGenerate).toHaveBeenCalledOnce();
  },
};

export const Generowanie: Story = { args: { generating: true } };

// US-07: the owner copies or shares the link.
export const ZLinkiem: Story = {
  args: { link: LINK, expiresOn: "2026-11-05" },
  play: async ({ args, canvas }) => {
    const field = canvas.getByLabelText("Link zaproszenia");
    await expect(field).toHaveAccessibleDescription("Ważny do 5 listopada 2026. Działa raz.");
    await expect(field).toHaveValue(LINK);
    await userEvent.click(canvas.getByRole("button", { name: "Kopiuj link" }));
    await expect(args.onCopy).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Udostępnij" }));
    await expect(args.onShare).toHaveBeenCalledOnce();
  },
};

export const BezUdostepniania: Story = {
  args: { link: LINK, expiresOn: "2026-11-05", onShare: undefined },
};

export const BezDatyWaznosci: Story = { args: { link: LINK } };

export const Blad: Story = {
  args: { error: "Nie udało się wygenerować linku. Spróbuj ponownie." },
};

export const WaskiEkran: Story = {
  args: { link: LINK, expiresOn: "2026-11-05" },
  render: (args) => (
    <NarrowScreen>
      <InviteLinkPanel {...args} />
    </NarrowScreen>
  ),
};
