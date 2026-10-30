import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Button } from "@koperty/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@koperty/ui/primitives/card";

const meta = {
  title: "Komponenty bazowe/Karta",
  component: Card,
  argTypes: { size: { control: "inline-radio", options: ["default", "compact"] } },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-content">
      <CardHeader>
        <CardTitle>Do rozdysponowania</CardTitle>
        <CardDescription>Przychody minus przydziały, także na przyszłe miesiące</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-amount-lg">4 200,00 zł</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 3, name: "Do rozdysponowania" }),
    ).toBeVisible();
  },
};

const onEdit = fn();

export const ZAkcjaIStopka: Story = {
  render: () => (
    <Card className="max-w-content">
      <CardHeader
        action={
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Zmień
          </Button>
        }
      >
        <CardTitle>Jedzenie</CardTitle>
        <CardDescription>Przydział w październiku: 800,00 zł</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body text-muted">Zostało</p>
        <p className="text-amount-lg">179,50 zł</p>
      </CardContent>
      <CardFooter>
        <Button>Dodaj wydatek</Button>
        <Button variant="ghost">Historia</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    onEdit.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Zmień" }));
    await expect(onEdit).toHaveBeenCalledOnce();
  },
};

export const Kompaktowa: Story = {
  render: () => (
    <div className="flex max-w-content flex-col gap-between-groups">
      {[
        ["Rachunki", "1 250,00 zł"],
        ["Transport", "310,00 zł"],
        ["Wakacje", "2 400,00 zł"],
      ].map(([name, balance]) => (
        <Card key={name} size="compact">
          <CardHeader action={<span className="text-amount">{balance}</span>}>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

export const PoziomNaglowka: Story = {
  render: () => (
    <Card className="max-w-content">
      <CardHeader>
        <CardTitle asChild>
          <h2>Logowanie</h2>
        </CardTitle>
        <CardDescription>Wyślemy Ci kod i link do logowania.</CardDescription>
      </CardHeader>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2, name: "Logowanie" })).toBeVisible();
  },
};

export const DlugaTresc: Story = {
  render: () => (
    <NarrowScreen>
      <Card>
        <CardHeader
          action={
            <Button size="sm" variant="secondary">
              Zmień
            </Button>
          }
        >
          <CardTitle>Remont łazienki i kuchni w mieszkaniu na Ochocie</CardTitle>
          <CardDescription>
            Przydział w październiku: 12 500,00 zł, w listopadzie: 8 000,00 zł
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-amount-lg">20 500,00 zł</p>
        </CardContent>
      </Card>
    </NarrowScreen>
  ),
};
