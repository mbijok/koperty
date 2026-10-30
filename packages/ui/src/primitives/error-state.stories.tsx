import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import { ErrorState } from "@koperty/ui/primitives/empty";

const onRetry = fn();

const meta = {
  title: "Komponenty bazowe/Stan błędu",
  component: ErrorState,
  args: {
    title: "Nie udało się wczytać kopert",
    description: "Spróbuj ponownie za chwilę. Twoje dane są bezpieczne.",
    action: (
      <Button variant="secondary" onClick={onRetry}>
        Spróbuj ponownie
      </Button>
    ),
  },
  argTypes: { action: { control: false } },
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await expect(canvas.getByRole("alert")).toHaveTextContent("Nie udało się wczytać kopert");
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        {
          label: "Błąd serwera",
          node: (
            <ErrorState
              title="Nie udało się wczytać operacji"
              description="Spróbuj ponownie za chwilę."
              action={<Button variant="secondary">Spróbuj ponownie</Button>}
            />
          ),
        },
        {
          label: "Brak sieci (US-23)",
          node: (
            <ErrorState
              title="Brak połączenia z internetem"
              description="Sprawdź Wi-Fi lub dane komórkowe i spróbuj ponownie."
              action={<Button variant="secondary">Spróbuj ponownie</Button>}
            />
          ),
        },
        {
          label: "Nie istnieje albo brak dostępu (US-05)",
          node: (
            <ErrorState
              title="Nie znaleziono budżetu"
              description="Budżet nie istnieje albo nie masz do niego dostępu."
              action={
                <Button asChild variant="secondary">
                  <a href="#budzety">Wróć do moich budżetów</a>
                </Button>
              }
            />
          ),
        },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <ErrorState
        title="Nie udało się wczytać podsumowania października 2026"
        description="Serwer nie odpowiada. Spróbuj ponownie za chwilę – wpisane wcześniej operacje są zapisane i nic nie zginęło."
        action={
          <Button variant="secondary" className="w-full">
            Spróbuj ponownie
          </Button>
        }
      />
    </NarrowScreen>
  ),
};
