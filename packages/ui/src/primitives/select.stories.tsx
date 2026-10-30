import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { FormField } from "@koperty/ui/primitives/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@koperty/ui/primitives/select";

const ENVELOPES = ["Jedzenie", "Rachunki", "Chemia", "Transport", "Wakacje"];

function EnvelopeSelect({
  items = ENVELOPES,
  previewState,
  ...props
}: Parameters<typeof Select>[0] & {
  items?: string[];
  previewState?: string;
  "aria-invalid"?: true;
  id?: string;
}) {
  const { "aria-invalid": invalid, id, ...root } = props;
  return (
    <Select {...root}>
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        data-preview-state={previewState}
        aria-label={id ? undefined : "Koperta"}
      >
        <SelectValue placeholder="Wybierz kopertę" />
      </SelectTrigger>
      <SelectContent>
        {items.map((name) => (
          <SelectItem key={name} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const meta = {
  title: "Komponenty bazowe/Select",
  component: Select,
  argTypes: { disabled: { control: "boolean" } },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-content">
      <FormField label="Koperta">
        {(control) => <EnvelopeSelect {...args} {...control} />}
      </FormField>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: "Koperta" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const listbox = await within(canvasElement.ownerDocument.body).findByRole("listbox");
    await userEvent.click(within(listbox).getByRole("option", { name: "Chemia" }));
    await waitFor(() => expect(trigger).toHaveTextContent("Chemia"));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        { label: "Bez wyboru", node: <EnvelopeSelect /> },
        { label: "Wybrana koperta", node: <EnvelopeSelect defaultValue="Jedzenie" /> },
        { label: "Najechanie", node: <EnvelopeSelect previewState="hover" /> },
        { label: "Fokus", node: <EnvelopeSelect previewState="focus" /> },
        { label: "Błąd", node: <EnvelopeSelect aria-invalid /> },
        { label: "Zablokowany", node: <EnvelopeSelect disabled defaultValue="Rachunki" /> },
      ]}
    />
  ),
};

// Documented a11y exception: while the list is open, Radix hides the rest of the page with
// aria-hidden and moves focus into the list. A static snapshot still sees the focusable trigger under
// aria-hidden (axe "aria-hidden-focus"); in real use focus is never there. Listed in "Czego brakuje".
export const Otwarty: Story = {
  parameters: { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } },
  render: () => (
    <div className="max-w-content">
      <EnvelopeSelect defaultOpen defaultValue="Rachunki" />
    </div>
  ),
};

export const DlugaLista: Story = {
  render: () => (
    <div className="max-w-content">
      <EnvelopeSelect
        items={[
          ...ENVELOPES,
          "Zdrowie",
          "Dzieci",
          "Prezenty",
          "Ubrania",
          "Samochód",
          "Mieszkanie",
          "Rozrywka",
          "Subskrypcje",
          "Zwierzęta",
          "Edukacja",
          "Fundusz awaryjny",
        ]}
      />
    </div>
  ),
};

export const DlugaNazwa: Story = {
  render: () => (
    <NarrowScreen>
      <EnvelopeSelect
        items={["Remont łazienki i kuchni w mieszkaniu na Ochocie", ...ENVELOPES]}
        defaultValue="Remont łazienki i kuchni w mieszkaniu na Ochocie"
      />
    </NarrowScreen>
  ),
};
