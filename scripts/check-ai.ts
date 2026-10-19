// Validates the .ai/ project memory against the rules in AGENTS.md ("Katalog .ai/").
// Usage: vp node scripts/check-ai.ts [aiDir]   (exit code 1 when problems are found)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// YYYY-MM-DD-slug.md, slug: 2–5 lowercase ASCII kebab-case words, optional -2, -3… duplicate suffix.
const FILE_NAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+){1,4})(?:-[2-9]|-[1-9]\d+)?\.md$/;
const EXEMPT = new Set(["_template.md", ".gitkeep"]);

const SPEC_STATUSES: Record<string, string[]> = {
  specs: ["draft", "approved", "in-progress"],
  "specs/implemented": ["implemented"],
  "specs/archive": ["archived"],
};
const RUN_STATUSES = ["in-progress", "completed", "partial", "failed", "aborted"];
const MANAGED_DIRS = [...Object.keys(SPEC_STATUSES), "runs", "lessons"];

function isRealDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function readStatus(path: string): string | undefined {
  const frontMatter = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, "utf8"))?.[1];
  return frontMatter ? /^status:\s*([^\s#]+)/m.exec(frontMatter)?.[1] : undefined;
}

export function checkAiDir(aiDir: string): string[] {
  const problems: string[] = [];
  const rel = (path: string) => relative(aiDir, path);

  for (const dir of MANAGED_DIRS) {
    const dirPath = join(aiDir, dir);
    if (!existsSync(dirPath)) {
      problems.push(`${dir}/: missing directory`);
      continue;
    }
    for (const name of readdirSync(dirPath)) {
      const path = join(dirPath, name);
      if (EXEMPT.has(name) || (dir === "specs" && statSync(path).isDirectory())) continue;

      const match = FILE_NAME.exec(name);
      if (!match) {
        problems.push(
          `${rel(path)}: file name must match YYYY-MM-DD-slug.md (2–5 word kebab-case slug)`,
        );
        continue;
      }
      if (!isRealDate(match[1])) problems.push(`${rel(path)}: invalid date ${match[1]}`);

      const allowed = SPEC_STATUSES[dir] ?? (dir === "runs" ? RUN_STATUSES : undefined);
      if (!allowed) continue;
      const status = readStatus(path);
      if (!status || !allowed.includes(status)) {
        problems.push(
          `${rel(path)}: status "${status ?? "missing"}" not allowed here (expected: ${allowed.join(", ")})`,
        );
      }
    }
  }

  const unknownSpecDirs = existsSync(join(aiDir, "specs"))
    ? readdirSync(join(aiDir, "specs")).filter(
        (name) =>
          statSync(join(aiDir, "specs", name)).isDirectory() && !(`specs/${name}` in SPEC_STATUSES),
      )
    : [];
  for (const name of unknownSpecDirs) problems.push(`specs/${name}/: unexpected directory`);

  const indexPath = join(aiDir, "lessons.md");
  if (!existsSync(indexPath)) {
    problems.push("lessons.md: missing index");
  } else if (existsSync(join(aiDir, "lessons"))) {
    const index = readFileSync(indexPath, "utf8");
    for (const name of readdirSync(join(aiDir, "lessons"))) {
      if (!EXEMPT.has(name) && !index.includes(`(lessons/${name})`)) {
        problems.push(`lessons/${name}: not linked in lessons.md`);
      }
    }
  }

  return problems;
}

if (import.meta.filename === process.argv[1]) {
  const aiDir = process.argv[2] ?? ".ai";
  const problems = checkAiDir(aiDir);
  for (const problem of problems) console.error(`✗ ${aiDir}/${problem}`);
  if (problems.length > 0) process.exit(1);
  console.log(`✓ ${aiDir}/ is consistent`);
}
