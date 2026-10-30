import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { OfflineBanner } from "@koperty/ui/product/app/offline-banner";

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => value });
  window.dispatchEvent(new Event(value ? "online" : "offline"));
}

const offline = () => {
  setOnline(false);
  return () => {
    Reflect.deleteProperty(navigator, "onLine");
  };
};

const meta = {
  title: "Komponenty produktu/Aplikacja na telefonie/Komunikat braku sieci",
  component: OfflineBanner,
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof OfflineBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  beforeEach: offline,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Brak połączenia z internetem");
  },
};

// With a connection nothing is shown.
export const ZPolaczeniem: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("[data-slot=offline-banner]")).toBeNull();
  },
};

// The message follows the connection: it disappears when the network comes back.
export const PowrotPolaczenia: Story = {
  beforeEach: offline,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toBeVisible();
    setOnline(true);
    await waitFor(() => expect(canvas.queryByRole("status")).toBeNull());
  },
};

export const WaskiEkran: Story = {
  beforeEach: offline,
  render: () => (
    <NarrowScreen>
      <OfflineBanner />
    </NarrowScreen>
  ),
};
