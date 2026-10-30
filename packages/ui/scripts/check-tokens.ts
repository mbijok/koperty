// Finds styling that bypasses the design tokens (packages/ui/src/tokens/tokens.css, ADR 0012):
// colour literals outside the token file, Tailwind palette classes, arbitrary values and the `dark:`
// variant (themes switch through tokens, see Fundamenty/Motywy).
// Usage: vp run check:tokens  (or: node packages/ui/scripts/check-tokens.ts [path...])
// Exit code 1 when problems are found.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const DEFAULT_PATHS = [
  "packages/ui/src",
  "packages/ui/docs",
  "packages/ui/.storybook",
  "apps/web/src",
];
const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".mdx"]);
// The token file is the only place for colour values; tests and generated files describe or
// contain data rather than styling.
const SKIPPED = [/tokens\/tokens\.css$/, /\.test\.tsx?$/, /\.gen\.ts$/, /database\.types\.ts$/];

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black";
const COLOR_UTILITIES =
  "bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow|inset-shadow|drop-shadow";
// A bracket followed by `:` or `/name:` is an arbitrary variant (e.g. `data-[state=open]:`), not a value.
const NOT_A_VARIANT = String.raw`(?![\w-]*(?:\/[\w-]+)?:)`;

const RULES: { name: string; pattern: RegExp }[] = [
  {
    name: "colour value outside the token file",
    pattern:
      /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi,
  },
  {
    name: "Tailwind palette class",
    pattern: new RegExp(
      String.raw`(?<![\w-])(?:${COLOR_UTILITIES})-(?:${PALETTE})(?:-\d{2,3})?(?![\w-])`,
      "g",
    ),
  },
  {
    name: "arbitrary value",
    pattern: new RegExp(String.raw`(?<![\w-])[a-z][\w-]*-\[[^\]\s]+\]${NOT_A_VARIANT}`, "g"),
  },
  {
    name: "arbitrary property",
    pattern: new RegExp(String.raw`(?<![\w&-])\[[a-z][a-z-]*:[^\]\s]+\]${NOT_A_VARIANT}`, "g"),
  },
  { name: "dark: variant (use tokens)", pattern: /(?<![\w-])dark:(?=[\w[-])/g },
];

export type Problem = { file: string; line: number; rule: string; match: string };

const blank = (text: string) => text.replace(/[^\n]/g, " ");

// In MDX, inline code and code blocks document classes instead of applying them.
function stripMdxCode(content: string): string {
  return content.replace(/```[\s\S]*?```/g, blank).replace(/`[^`\n]*`/g, blank);
}

export function checkContent(file: string, content: string): Problem[] {
  const source = extname(file) === ".mdx" ? stripMdxCode(content) : content;
  const problems: Problem[] = [];
  source.split("\n").forEach((text, index) => {
    for (const rule of RULES) {
      for (const match of text.matchAll(rule.pattern)) {
        problems.push({ file, line: index + 1, rule: rule.name, match: match[0] });
      }
    }
  });
  return problems;
}

function listFiles(path: string): string[] {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path).flatMap((name) => listFiles(join(path, name)));
}

export function checkPaths(paths: string[]): Problem[] {
  return paths
    .flatMap(listFiles)
    .filter((file) => EXTENSIONS.has(extname(file)) && !SKIPPED.some((skip) => skip.test(file)))
    .flatMap((file) => checkContent(file, readFileSync(file, "utf8")));
}

if (import.meta.filename === process.argv[1]) {
  const args = process.argv.slice(2);
  const problems = checkPaths(args.length > 0 ? args : DEFAULT_PATHS);
  for (const { file, line, rule, match } of problems)
    console.error(`✗ ${file}:${line} ${rule}: ${match}`);
  if (problems.length > 0) process.exit(1);
  console.log("✓ no values outside the design tokens");
}
