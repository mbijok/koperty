import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { Toaster, showToast } from "@koperty/ui/primitives/toast";

const meta = {
  title: "Komponenty bazowe/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
  // Toasts are fixed to the bottom of the screen, so the docs show them in their own frame.
  parameters: { docs: { story: { inline: false, iframeHeight: 240 } } },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Button onClick={() => showToast("Link skopiowany")}>Kopiuj link</Button>,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Kopiuj link" }));
    const region = within(canvasElement.ownerDocument.body).getByRole("region", {
      name: /Powiadomienia/,
    });
    await waitFor(() => expect(region).toHaveTextContent("Link skopiowany"));
  },
};

// E2-Q4: one toast at a time – the newest replaces the previous one.
export const JedenNaRaz: Story = {
  render: () => (
    <div className="flex flex-wrap gap-group">
      <Button variant="secondary" onClick={() => showToast("Zapisano wydatek")}>
        Zapisz wydatek
      </Button>
      <Button variant="secondary" onClick={() => showToast("Link skopiowany")}>
        Kopiuj link
      </Button>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz wydatek" }));
    await userEvent.click(canvas.getByRole("button", { name: "Kopiuj link" }));
    const body = canvasElement.ownerDocument.body;
    await waitFor(() => {
      const visible = [...body.querySelectorAll("[data-sonner-toast][data-visible=true]")];
      return expect(visible.map((toast) => toast.textContent)).toEqual(["Link skopiowany"]);
    });
  },
};

export const DlugaTresc: Story = {
  render: () => (
    <Button
      variant="secondary"
      onClick={() =>
        showToast(
          "Zapisano wydatek 120,50 zł w kopercie „Remont łazienki i kuchni w mieszkaniu na Ochocie”",
        )
      }
    >
      Pokaż długi toast
    </Button>
  ),
};
