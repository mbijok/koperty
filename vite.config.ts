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
    },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ["apps/web/**"],
        plugins: ["react", "typescript", "oxc"],
        rules: {
          "react/rules-of-hooks": "error",
          "react/only-export-components": ["warn", { allowConstantExport: true }],
          // shadcn 4.x components import `cn` from the `cn` package; the project uses clsx + tailwind-merge.
          "no-restricted-imports": [
            "error",
            {
              paths: [
                {
                  name: "cn",
                  message:
                    'Import cn from "@/lib/utils" (clsx + tailwind-merge) and remove the `cn` dependency.',
                },
              ],
            },
          ],
        },
      },
      {
        // Route files export `Route` objects and shadcn components export variants by design.
        files: ["apps/web/src/routes/**", "apps/web/src/components/ui/**"],
        plugins: ["react"],
        rules: { "react/only-export-components": "off" },
      },
    ],
  },
  // `vp test` at the root runs every workspace package with its own vite.config.ts.
  test: {
    projects: ["apps/*", { test: { name: "scripts", include: ["scripts/**/*.test.ts"] } }],
  },
  run: {
    cache: true,
  },
});
