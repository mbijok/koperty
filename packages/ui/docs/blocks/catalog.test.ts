import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vite-plus/test";

// Every component module of the package is listed in the catalog (Storybook) and in the file for
// agents (docs/design-system.md), so a new component can't be added without documenting it.
const root = join(import.meta.dirname, "..", "..");
const catalog = readFileSync(join(root, "docs/blocks/catalog-data.tsx"), "utf8");
const forAgents = readFileSync(join(root, "../../docs/design-system.md"), "utf8");

// Building blocks of other components, documented on their pages, not imported by screens.
const INTERNAL = new Set(["primitives/label"]);

function modules(dir: string): string[] {
  return readdirSync(join(root, "src", dir), { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file) && !/\.(stories|test)\.tsx?$/.test(file))
    .map((file) => `${dir}/${file.replace(/\.tsx?$/, "")}`)
    .filter((module) => !INTERNAL.has(module));
}

const MODULES = ["primitives", "product", "views", "patterns"].flatMap(modules);

describe("documentation of the package modules", () => {
  it.each(MODULES)("%s is in the catalog and in docs/design-system.md", (module) => {
    expect(catalog).toContain(`importPath: "@koperty/ui/${module}"`);
    expect(forAgents).toContain(`@koperty/ui/${module}`);
  });
});
