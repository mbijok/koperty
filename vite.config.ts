import { defineConfig } from "vite-plus";

// Workspace-wide lint and format settings. Package configs (e.g. apps/web/vite.config.ts)
// hold only app-specific settings: plugins, aliases, tests.
const generatedFiles = ["**/routeTree.gen.ts", "**/database.types.ts", "supabase/**"];

export default defineConfig({
  // Target of `vp dev` / `vp build` / `vp preview` run at the workspace root.
  defaultPackage: "./apps/web",
  fmt: {
    ignorePatterns: generatedFiles,
  },
  lint: {
    ignorePatterns: generatedFiles,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "typescript/no-explicit-any": "error",
      // Coding standards (docs/engineering-standards.md, 4.1).
      "typescript/no-non-null-assertion": "error",
      "import/no-default-export": "error",
      // Imports from parent directories go through the `@/` alias.
      "import/no-relative-parent-imports": "error",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "import/no-cycle": "error",
      // Side-effect imports are only allowed for stylesheets.
      "import/no-unassigned-import": ["warn", { allow: ["**/*.css"] }],
      // A scrollable, named <section> (e.g. around a wide table) must be reachable by keyboard (WCAG 2.1.1).
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: ["section"], roles: ["tabpanel"] }],
    },
    options: { typeAware: true, typeCheck: true },
    plugins: ["typescript", "unicorn", "oxc", "import", "promise", "jsx-a11y", "vitest"],
    categories: { correctness: "error", suspicious: "warn", perf: "warn" },
    overrides: [
      {
        // Vite and its tools load the config through a default export.
        files: ["**/vite.config.ts"],
        rules: { "import/no-default-export": "off" },
      },
      {
        files: ["apps/web/**", "packages/ui/**"],
        plugins: ["react", "typescript", "oxc"],
        rules: {
          "react/rules-of-hooks": "error",
          // Obsolete with the automatic JSX runtime (React 17+).
          "react/react-in-jsx-scope": "off",
          "react/only-export-components": ["warn", { allowConstantExport: true }],
          // shadcn 4.x components import `cn` from the `cn` package; the project uses clsx + tailwind-merge.
          "no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "cn",
                  message:
                    'Import cn from "@koperty/ui/lib/utils" (tailwind-merge with design tokens) and remove the `cn` dependency.',
                },
              ],
            },
          ],
        },
      },
      {
        // Route files export `Route` objects and shadcn components export variants by design.
        files: ["apps/web/src/routes/**", "packages/ui/src/primitives/**"],
        plugins: ["react"],
        rules: { "react/only-export-components": "off" },
      },
      {
        // Storybook reads stories (CSF) and its config files through default exports (ADR 0012).
        files: ["packages/ui/**/*.stories.tsx", "packages/ui/.storybook/**"],
        rules: { "import/no-default-export": "off" },
      },
    ],
  },
  // `vp test` at the root runs every workspace package with its own vite.config.ts.
  test: {
    projects: [
      "apps/*",
      // Design system: stories and component tests in Chromium, once per theme (ADR 0012).
      "packages/ui",
      {
        extends: "./packages/ui/vite.config.ts",
        test: { name: "ui-dark", env: { VITE_STORYBOOK_THEME: "dark" } },
      },
      {
        test: {
          name: "scripts",
          include: ["scripts/**/*.test.ts", "packages/*/{src,docs,scripts}/**/*.test.ts"],
        },
      },
    ],
    // `vp test --coverage` (run in CI) fails below 100% for any file; see "Testy" in AGENTS.md.
    coverage: {
      provider: "v8",
      include: [
        "apps/*/src/**/*.{ts,tsx}",
        "packages/*/{src,docs,scripts}/**/*.{ts,tsx}",
        "scripts/**/*.ts",
      ],
      exclude: [
        ...generatedFiles,
        "**/*.d.ts",
        // Stories are the tests of the design system, not code under test.
        "**/*.stories.tsx",
        // DOM bootstrap only; covered by `vp build` and E2E tests (T-01).
        "apps/web/src/main.tsx",
      ],
      thresholds: { 100: true, perFile: true },
    },
  },
  // Pre-commit checks (.vite-hooks/pre-commit runs `vp staged`); full test suites run in CI.
  staged: {
    "*": "vp check --fix",
    // The checker validates the whole directory, so it must not receive staged file paths.
    ".ai/**": () => "vp run check:ai",
  },
  run: {
    cache: true,
  },
});
