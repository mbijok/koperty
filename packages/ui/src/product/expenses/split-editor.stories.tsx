import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import {
  SplitEditor,
  type SplitPart,
  type SplitEditorProps,
} from "@koperty/ui/product/expenses/split-editor";

const ENVELOPES = [
  { id: "jedzenie", name: "Jedzenie" },
  { id: "chemia", name: "Chemia" },
  { id: "dom", name: "Dom" },
];

const TWO_PARTS: SplitPart[] = [
  { id: "p1", envelopeId: "jedzenie", amount: "" },
  { id: "p2", envelopeId: "chemia", amount: "" },
];

let nextId = 3;

function ControlledSplit({
  total,
  initial = TWO_PARTS,
  errors,
}: {
  total: number | null;
  initial?: SplitPart[];
  errors?: SplitEditorProps["errors"];
}) {
  const [parts, setParts] = useState(initial);
  return (
    <SplitEditor
      total={total}
      parts={parts}
      envelopes={ENVELOPES}
      onPartsChange={setParts}
      errors={errors}
      createPartId={() => `p${nextId++}`}
    />
  );
}

const meta = {
  title: "Komponenty produktu/Wydatki/Edytor podziału",
  component: SplitEditor,
  args: { total: 10000, parts: TWO_PARTS, envelopes: ENVELOPES, onPartsChange: () => {} },
  argTypes: {
    parts: { control: false },
    envelopes: { control: false },
    onPartsChange: { control: false },
  },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof SplitEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

const ownFrame = { docs: { story: { inline: false, iframeHeight: 640 } } };

// US-18: 100,00 zł split evenly into 3 parts gives 33,34 + 33,33 + 33,33 zł.
export const Playground: Story = {
  parameters: ownFrame,
  render: () => <ControlledSplit total={10000} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Do podziału: 100,00/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Podziel po równo" }));
    await expect(canvas.getByText("Podzielono całą kwotę.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj część" }));
    await userEvent.click(canvas.getByRole("button", { name: "Podziel po równo" }));
    const [first, second, third] = canvas.getAllByLabelText("Kwota");
    await expect(first).toHaveValue("33,34");
    await expect(second).toHaveValue("33,33");
    await expect(third).toHaveValue("33,33");
    await userEvent.click(canvas.getByRole("button", { name: "Usuń część 3" }));
    await expect(canvas.getAllByLabelText("Kwota")).toHaveLength(2);
    await expect(canvas.getByText(/Do podziału: 33,33/)).toBeVisible();
  },
};

export const PrzekroczonaKwota: Story = {
  render: () => (
    <ControlledSplit
      total={10000}
      initial={[
        { id: "p1", envelopeId: "jedzenie", amount: "70,00" },
        { id: "p2", envelopeId: "chemia", amount: "30,01" },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Części przekraczają kwotę wydatku o 0,01/)).toBeVisible();
    // Typing a part updates what is left to split.
    const second = canvas.getAllByLabelText("Kwota").at(1);
    if (second) {
      await userEvent.clear(second);
      await userEvent.type(second, "20");
    }
    await expect(canvas.getByText(/Do podziału: 10,00/)).toBeVisible();
  },
};

// Each envelope can appear once per expense (PRD 4.6): options taken by other parts are disabled.
export const KopertaRazNaWydatek: Story = {
  parameters: ownFrame,
  render: () => <ControlledSplit total={10000} />,
  play: async ({ canvas, canvasElement }) => {
    const second = canvas.getAllByRole("combobox").at(1);
    second?.focus();
    await userEvent.keyboard("{Enter}");
    const listbox = await within(canvasElement.ownerDocument.body).findByRole("listbox");
    await expect(within(listbox).getByRole("option", { name: "Jedzenie" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.click(within(listbox).getByRole("option", { name: "Dom" }));
    await waitFor(() => expect(second).toHaveTextContent("Dom"));
    await waitFor(() =>
      expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).toBeNull(),
    );
  },
};

export const BezKwotyWydatku: Story = {
  render: () => <ControlledSplit total={null} />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Podziel po równo" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAccessibleDescription(
      "Podział po równo zadziała, gdy wpiszesz kwotę wydatku.",
    );
  },
};

export const ZBledami: Story = {
  render: () => (
    <ControlledSplit
      total={10000}
      initial={[
        { id: "p1", envelopeId: "", amount: "100,00" },
        { id: "p2", envelopeId: "chemia", amount: "0" },
      ]}
      errors={{
        p1: { envelope: "Wybierz kopertę." },
        p2: { amount: "Podaj kwotę większą od zera." },
      }}
    />
  ),
};

export const JednaCzesc: Story = {
  render: () => (
    <ControlledSplit
      total={12050}
      initial={[{ id: "p1", envelopeId: "jedzenie", amount: "120,50" }]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: /Usuń część/ })).toBeNull();
  },
};

export const LosoweIdentyfikatory: Story = {
  args: { onPartsChange: () => {} },
  render: (args) => <SplitEditor {...args} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dodaj część" }));
  },
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <ControlledSplit total={10000} />
    </NarrowScreen>
  ),
};
