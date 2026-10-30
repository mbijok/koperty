import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { NarrowScreen, StateGrid } from "#docs/blocks/frames.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@koperty/ui/primitives/tabs";

function BudgetSettingsTabs({ defaultValue = "members" }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue} className="max-w-content">
      <TabsList aria-label="Ustawienia budżetu">
        <TabsTrigger value="members">Członkowie</TabsTrigger>
        <TabsTrigger value="invitations">Zaproszenia (2)</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <p className="text-body">Ala Kowalska, Tomasz Kowalski</p>
      </TabsContent>
      <TabsContent value="invitations">
        <p className="text-body">2 aktywne zaproszenia, ważne do 5 listopada.</p>
      </TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "Komponenty bazowe/Zakładki",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <BudgetSettingsTabs />,
  play: async ({ canvas }) => {
    const members = canvas.getByRole("tab", { name: "Członkowie" });
    const invitations = canvas.getByRole("tab", { name: "Zaproszenia (2)" });
    await expect(members).toHaveAttribute("aria-selected", "true");
    await userEvent.click(invitations);
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("2 aktywne zaproszenia");
    // Arrow keys move between tabs and select them (WAI-ARIA tabs, automatic activation).
    await userEvent.keyboard("{ArrowLeft}");
    await expect(members).toHaveFocus();
    await expect(members).toHaveAttribute("aria-selected", "true");
  },
};

export const Stany: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList aria-label="Stany zakładek">
        <StateGrid
          states={[
            { label: "Wybrana", node: <TabsTrigger value="active">Członkowie</TabsTrigger> },
            { label: "Niewybrana", node: <TabsTrigger value="b">Zaproszenia</TabsTrigger> },
            {
              label: "Najechanie",
              node: (
                <TabsTrigger value="c" data-preview-state="hover">
                  Zaproszenia
                </TabsTrigger>
              ),
            },
            {
              label: "Fokus",
              node: (
                <TabsTrigger value="d" data-preview-state="focus">
                  Zaproszenia
                </TabsTrigger>
              ),
            },
            {
              label: "Zablokowana",
              node: (
                <TabsTrigger value="e" disabled>
                  Zaproszenia
                </TabsTrigger>
              ),
            },
          ]}
        />
      </TabsList>
      <TabsContent value="active">
        <p className="text-body">Treść wybranej zakładki.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <Tabs defaultValue="members">
        <TabsList aria-label="Ustawienia budżetu">
          <TabsTrigger value="members">Członkowie</TabsTrigger>
          <TabsTrigger value="invitations">Zaproszenia (12)</TabsTrigger>
          <TabsTrigger value="budget">Nazwa i usunięcie budżetu</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <p className="text-body">Lista przewija się w bok, strona nie.</p>
        </TabsContent>
      </Tabs>
    </NarrowScreen>
  ),
};
