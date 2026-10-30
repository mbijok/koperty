import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@koperty/ui/primitives/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Koperty</h1>
      <p className="text-muted-foreground">Budżet domowy metodą kopertową.</p>
      <Button className="self-start">Zaczynamy</Button>
    </main>
  );
}
