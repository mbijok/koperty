import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CATALOG, saved } from "./catalog-data";
import { ComponentCatalog, ComponentTable } from "./catalog";

// Tests for the "Design system" blocks. Hidden from the sidebar: the MDX pages render the same blocks.
const meta = {
  title: "Design system/Bloki",
  tags: ["!dev", "!autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// Every entry links to its docs page; live previews work in the catalog.
export const Katalog: Story = {
  render: () => <ComponentCatalog entries={CATALOG} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole("listitem").length).toBeGreaterThanOrEqual(CATALOG.length);
    await expect(canvas.getByRole("link", { name: "Przycisk" })).toHaveAttribute(
      "href",
      "./?path=/docs/komponenty-bazowe-przycisk--dokumentacja",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Kopiuj link zaproszenia" }));
    await expect(
      await within(canvasElement.ownerDocument.body).findByText("Skopiowano link zaproszenia"),
    ).toBeInTheDocument();
    // The first month switcher is the live one; later ones are inert static previews.
    const [monthSwitch] = canvas.getAllByRole("button", { name: "Następny miesiąc" });
    if (monthSwitch) await userEvent.click(monthSwitch);
    await expect(saved()).resolves.toEqual({ ok: true });
  },
};

export const Tabela: Story = {
  render: () => <ComponentTable entries={CATALOG} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("term")).toHaveLength(CATALOG.length);
  },
};
