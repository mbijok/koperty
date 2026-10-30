import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";

// Text action and link: the Button component with variant="link", or a link rendered with asChild.
const meta = {
  title: "Komponenty bazowe/Akcja tekstowa i link",
  component: Button,
  args: { variant: "link", children: "Wyślij nowy kod", onClick: fn() },
  argTypes: {
    variant: { control: false },
    size: { control: "inline-radio", options: ["default", "sm", "inline"] },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const LinkWZdaniu: Story = {
  render: (args) => (
    <p className="max-w-measure text-body text-default">
      Nazwę, którą widzą inni członkowie budżetu, zmienisz w{" "}
      <Button {...args} asChild size="inline">
        <a href="#profil">ustawieniach profilu</a>
      </Button>
      .
    </p>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "ustawieniach profilu" })).toHaveAttribute(
      "href",
      "#profil",
    );
  },
};

// Navigation that looks like a button is still a link: role "link", opens with Enter.
export const LinkJakoPrzycisk: Story = {
  render: (args) => (
    <Button {...args} asChild variant="primary">
      <a href="#budzet">Przejdź do budżetu</a>
    </Button>
  ),
};

export const Stany: Story = {
  render: (args) => (
    <StateGrid
      states={[
        { label: "Domyślny", node: <Button {...args} /> },
        { label: "Najechanie", node: <Button {...args} data-preview-state="hover" /> },
        { label: "Fokus", node: <Button {...args} data-preview-state="focus" /> },
        { label: "Zablokowany", node: <Button {...args} disabled /> },
      ]}
    />
  ),
};

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <div className="flex flex-col items-start gap-inline">
        <p className="text-body text-muted">Nie przyszła wiadomość z kodem?</p>
        <Button {...args} />
      </div>
    </NarrowScreen>
  ),
};
