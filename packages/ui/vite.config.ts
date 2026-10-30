import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const root = fileURLToPath(new URL(".", import.meta.url));

// Lint and format settings live in the root vite.config.ts. This config serves Storybook
// (which reads it) and the story tests; the root config runs it once per theme.
export default defineConfig({
  root,
  // Under Vitest the React plugin only adds HMR code that shows up as uncovered branches; Vite's
  // built-in JSX transform is enough there. Tailwind stays on so a11y checks see real colours.
  plugins: lazyPlugins(() =>
    process.env.VITEST
      ? [tailwindcss(), storybookTest({ configDir: `${root}.storybook` })]
      : [react(), tailwindcss()],
  ),
  test: {
    name: "ui",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
