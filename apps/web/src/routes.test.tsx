import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { routeTree } from "@/routeTree.gen";

describe("routes", () => {
  it("renders the home page inside the root layout", async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/"] }),
      context: { queryClient: new QueryClient() },
    });
    await router.load();

    const html = renderToString(<RouterProvider router={router} />);

    expect(html).toContain('class="min-h-dvh bg-background text-foreground"');
    expect(html).toContain("<h1");
    expect(html).toContain("Koperty");
    expect(html).toContain("Zaczynamy");
  });
});
