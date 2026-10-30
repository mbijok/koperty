import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Alert, AlertDescription, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";

const meta = {
  title: "Komponenty bazowe/Alert",
  component: Alert,
  argTypes: { variant: { control: "inline-radio", options: ["default", "danger"] } },
  args: {
    children: (
      <>
        <AlertTitle>Brak połączenia z internetem</AlertTitle>
        <AlertDescription>
          Zmiany zapiszesz, gdy połączenie wróci. Sprawdź Wi-Fi lub dane komórkowe.
        </AlertDescription>
      </>
    ),
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Brak połączenia z internetem");
  },
};

const onRetry = fn();

// An error that needs action (pool summary): the alert says what happened and offers the next step.
export const BladZAkcja: Story = {
  args: {
    variant: "danger",
    action: (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Spróbuj ponownie
      </Button>
    ),
    children: (
      <>
        <AlertTitle>Nie udało się wczytać puli</AlertTitle>
        <AlertDescription>Sprawdź połączenie i spróbuj ponownie.</AlertDescription>
      </>
    ),
  },
  play: async ({ canvas }) => {
    onRetry.mockClear();
    await expect(canvas.getByRole("alert")).toHaveTextContent("Nie udało się wczytać puli");
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledOnce();
  },
};

export const Stany: Story = {
  render: () => (
    <StateGrid
      states={[
        {
          label: "Informacja (US-16, AC4)",
          node: (
            <Alert>
              <AlertTitle>Pula jest ujemna: −200,00 zł</AlertTitle>
              <AlertDescription>
                Przydzielono więcej, niż wpłynęło. Dodaj przychód albo zmniejsz przydział.
              </AlertDescription>
            </Alert>
          ),
        },
        {
          label: "Błąd (US-10)",
          node: (
            <Alert variant="danger">
              <AlertTitle>Nie możesz opuścić budżetu</AlertTitle>
              <AlertDescription>
                Jesteś jedynym właścicielem. Nadaj rolę właściciela innej osobie albo usuń budżet.
              </AlertDescription>
            </Alert>
          ),
        },
      ]}
    />
  ),
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <Alert
        variant="danger"
        action={
          <Button variant="secondary" size="sm">
            Spróbuj ponownie
          </Button>
        }
      >
        <AlertTitle>
          Nie udało się zapisać wydatku „Zakupy na urodziny Zosi w Rossmannie”
        </AlertTitle>
        <AlertDescription>
          Wpisane dane zostały w formularzu. Sprawdź połączenie z internetem i spróbuj ponownie za
          chwilę; jeśli problem się powtarza, odśwież stronę.
        </AlertDescription>
      </Alert>
    </NarrowScreen>
  ),
};
