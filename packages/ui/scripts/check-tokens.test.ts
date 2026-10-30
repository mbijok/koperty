import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { checkContent, checkPaths } from "./check-tokens.ts";

const rules = (file: string, content: string) => checkContent(file, content).map((p) => p.rule);

describe("checkContent", () => {
  it("accepts token classes, CSS variables and arbitrary variants", () => {
    const ok = [
      'className="bg-surface-card text-muted p-panel h-control rounded-control shadow-card"',
      "style={{ width: `var(--${token})` }}",
      "color: color-mix(in srgb, var(--text-default) 100%, transparent);",
      "data-[state=open]:animate-in group-data-[disabled=true]/field:opacity-50 aria-[invalid]:border-invalid",
      "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-icon scheme-dark",
      'href="#profil" const theme = { light: 1, dark: 2 };',
    ].join("\n");
    expect(checkContent("a.tsx", ok)).toEqual([]);
  });

  it("finds colour literals", () => {
    expect(
      rules("a.tsx", "color: #fff; background: #1a2b3c80; x: oklch(0.5 0 0); y: rgb(0 0 0)"),
    ).toEqual([
      "colour value outside the token file",
      "colour value outside the token file",
      "colour value outside the token file",
      "colour value outside the token file",
    ]);
  });

  it("finds Tailwind palette classes", () => {
    expect(
      rules("a.tsx", 'className="bg-zinc-900 text-white border-t-red-500 ring-black/50"'),
    ).toEqual([
      "Tailwind palette class",
      "Tailwind palette class",
      "Tailwind palette class",
      "Tailwind palette class",
    ]);
  });

  it("finds arbitrary values, arbitrary properties and dark:", () => {
    expect(
      rules(
        "a.tsx",
        'className="p-[13px] hover:bg-[color-mix(in_oklch,red,blue)] [mask-type:alpha] dark:bg-surface-card"',
      ),
    ).toEqual([
      "arbitrary value",
      "arbitrary value",
      "arbitrary property",
      "dark: variant (use tokens)",
    ]);
  });

  it("reports the whole class", () => {
    expect(
      checkContent("a.tsx", "hover:bg-[color-mix(in_oklch,red,blue)]").map((p) => p.match),
    ).toEqual(["bg-[color-mix(in_oklch,red,blue)]"]);
  });

  it("reports the line of each problem", () => {
    expect(checkContent("a.css", "a {}\nb { color: #000; }")).toEqual([
      { file: "a.css", line: 2, rule: "colour value outside the token file", match: "#000" },
    ]);
  });

  it("ignores code examples in MDX but checks rendered markup", () => {
    const mdx =
      'Avoid `bg-zinc-900`.\n```tsx\n<div className="p-[13px]" />\n```\n<div className="text-white" />';
    expect(checkContent("page.mdx", mdx)).toEqual([
      { file: "page.mdx", line: 5, rule: "Tailwind palette class", match: "text-white" },
    ]);
  });
});

function makeDir(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "check-tokens-"));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

describe("checkPaths", () => {
  it("skips the token file, tests, generated and unrelated files", () => {
    const dir = makeDir({
      "src/tokens/tokens.css": "--raw: oklch(1 0 0);",
      "src/button.test.tsx": "#fff",
      "src/routeTree.gen.ts": "#fff",
      "src/lib/database.types.ts": "#fff",
      "src/notes.md": "#fff",
      "src/ok.tsx": 'className="bg-surface-card"',
    });
    expect(checkPaths([dir])).toEqual([]);
  });

  it("checks single files and nested directories", () => {
    const dir = makeDir({ "src/deep/a.tsx": "bg-zinc-900", "b.css": "#fff" });
    expect(checkPaths([join(dir, "src"), join(dir, "b.css")]).map((p) => p.match)).toEqual([
      "bg-zinc-900",
      "#fff",
    ]);
  });
});

const scriptPath = fileURLToPath(new URL("check-tokens.ts", import.meta.url));

function mockConsoleAndExit() {
  return {
    // Throwing mirrors process.exit: nothing after the call runs.
    exit: vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    }),
    log: vi.spyOn(console, "log").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
  };
}

async function runCli(...args: string[]) {
  vi.spyOn(process, "argv", "get").mockReturnValue(["node", scriptPath, ...args]);
  // A fresh module instance re-runs the CLI entry point with the mocked argv.
  vi.resetModules();
  await import("./check-tokens.ts");
}

describe("check-tokens CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prints problems and exits with code 1", async () => {
    const dir = makeDir({ "a.tsx": "bg-zinc-900" });
    const { exit, error } = mockConsoleAndExit();
    await expect(runCli(dir)).rejects.toThrow("process.exit");
    expect(error).toHaveBeenCalledWith(
      `✗ ${join(dir, "a.tsx")}:1 Tailwind palette class: bg-zinc-900`,
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it("checks the design system and the app by default", async () => {
    const { exit, log } = mockConsoleAndExit();
    await runCli();
    expect(exit).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("✓ no values outside the design tokens");
  });
});
