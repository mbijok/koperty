import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// Lint and format settings live in the root vite.config.ts.
export default defineConfig({
  // The router plugin must run before the React plugin. Tests use the committed routeTree.gen.ts
  // and Vite's built-in JSX transform: these plugins only add HMR footers and code-splitting
  // chunks there, which show up as uncovered branches.
  plugins: lazyPlugins(() =>
    process.env.VITEST
      ? []
      : [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  ),
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
