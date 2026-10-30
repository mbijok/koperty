import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Button, type ButtonProps } from "@koperty/ui/primitives/button";

const meta = {
  title: "Komponenty bazowe/Przycisk",
  component: Button,
  args: { children: "Zapisz wydatek", onClick: fn() },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "ghost", "danger", "link"],
    },
    size: { control: "inline-radio", options: ["default", "sm", "icon", "icon-sm", "inline"] },
    loading: { control: "boolean" },
    loadingText: { control: "text" },
    disabled: { control: "boolean" },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const VARIANTS = [
  { variant: "primary", label: "Zapisz wydatek", loadingText: "Zapisywanie…" },
  { variant: "secondary", label: "Wyślij kod", loadingText: "Wysyłanie…" },
  { variant: "ghost", label: "Pokaż archiwum", loadingText: undefined },
  { variant: "danger", label: "Usuń wydatek", loadingText: "Usuwanie…" },
] as const satisfies readonly {
  variant: ButtonProps["variant"];
  label: string;
  loadingText: string | undefined;
}[];

export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Zapisz wydatek" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // Keyboard: Enter and Space activate a focused button (WAI-ARIA button pattern).
    button.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const Warianty: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-group">
      {VARIANTS.map(({ variant, label }) => (
        <Button key={variant} {...args} variant={variant}>
          {label}
        </Button>
      ))}
    </div>
  ),
};

export const Rozmiary: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-group">
      <Button {...args}>Zapisz wydatek</Button>
      <Button {...args} size="sm" variant="secondary">
        Edytuj
      </Button>
      <Button {...args} size="icon" variant="ghost" aria-label="Usuń wydatek">
        <Trash2 aria-hidden="true" />
      </Button>
      <Button {...args} size="icon-sm" variant="ghost" aria-label="Usuń wydatek">
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  ),
};

export const ZIkona: Story = {
  args: {
    children: (
      <>
        <Plus aria-hidden="true" />
        Dodaj wydatek
      </>
    ),
  },
};

// Hover, focus and pressed are frozen previews (data-preview-state, documentation only).
export const Stany: Story = {
  render: (args) => (
    <div className="flex flex-col gap-section">
      {VARIANTS.map(({ variant, label, loadingText }) => (
        <StateGrid
          key={variant}
          title={variant}
          states={[
            {
              label: "Domyślny",
              node: (
                <Button {...args} variant={variant}>
                  {label}
                </Button>
              ),
            },
            {
              label: "Najechanie",
              node: (
                <Button {...args} variant={variant} data-preview-state="hover">
                  {label}
                </Button>
              ),
            },
            {
              label: "Fokus",
              node: (
                <Button {...args} variant={variant} data-preview-state="focus">
                  {label}
                </Button>
              ),
            },
            {
              label: "Wciśnięty",
              node: (
                <Button {...args} variant={variant} data-preview-state="active">
                  {label}
                </Button>
              ),
            },
            {
              label: "Zablokowany",
              node: (
                <Button {...args} variant={variant} disabled>
                  {label}
                </Button>
              ),
            },
            {
              label: "Ładowanie",
              node: (
                <Button {...args} variant={variant} loading loadingText={loadingText}>
                  {label}
                </Button>
              ),
            },
          ]}
        />
      ))}
    </div>
  ),
};

// E2-Q2: the button keeps its width, announces busy state and ignores further clicks.
export const Ladowanie: Story = {
  args: { loading: true, loadingText: "Zapisywanie…" },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Zapisywanie…" });
    await expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Without loadingText the label stays and the spinner is added in front of it.
export const LadowanieBezZmianyTekstu: Story = {
  args: { loading: true, variant: "secondary", children: "Wyślij kod" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Wyślij kod" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

// E2-Q1: a blocked action always says why, next to the button.
export const ZablokowanyZWyjasnieniem: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-inline">
      <Button {...args} variant="secondary" disabled aria-describedby="archive-reason">
        Zarchiwizuj kopertę
      </Button>
      <p id="archive-reason" className="text-meta text-muted">
        Kopertę można zarchiwizować, gdy jej saldo wynosi 0,00 zł. Teraz: 120,50 zł.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Zarchiwizuj kopertę" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAccessibleDescription(/saldo wynosi 0,00 zł/);
  },
};

export const DlugaTresc: Story = {
  render: (args) => (
    <NarrowScreen>
      <Button {...args} className="w-full">
        Wygeneruj link zaproszenia
      </Button>
    </NarrowScreen>
  ),
};

export const WaskiEkran: Story = {
  render: (args) => (
    <NarrowScreen>
      <div className="flex flex-col gap-group">
        <Button {...args} className="w-full">
          Zapisz wydatek
        </Button>
        <Button {...args} variant="secondary" className="w-full">
          Anuluj
        </Button>
      </div>
    </NarrowScreen>
  ),
};
