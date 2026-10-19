import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { checkAiDir } from "./check-ai.ts";

const doc = (status: string) => `---\ntitle: Test\nstatus: ${status} # comment\n---\n\n# Test\n`;

function makeAiDir(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "check-ai-"));
  const base: Record<string, string> = {
    "specs/_template.md": "",
    "specs/implemented/.gitkeep": "",
    "specs/archive/.gitkeep": "",
    "runs/_template.md": "",
    "lessons/_template.md": "",
    "lessons.md": "# Wnioski\n",
  };
  for (const [path, content] of Object.entries({ ...base, ...files })) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

describe("checkAiDir", () => {
  it("accepts a consistent directory", () => {
    const dir = makeAiDir({
      "specs/2026-10-20-envelope-allocation.md": doc("approved"),
      "specs/2026-10-20-envelope-allocation-2.md": doc("draft"),
      "specs/implemented/2026-10-19-budget-membership.md": doc("implemented"),
      "specs/archive/2026-10-18-old-idea-draft.md": doc("archived"),
      "runs/2026-10-19-project-bootstrap.md": doc("completed"),
      "lessons/2026-10-19-vite-plus-tips.md": "x",
      "lessons.md": "- Rule ([szczegóły](lessons/2026-10-19-vite-plus-tips.md))\n",
    });
    expect(checkAiDir(dir)).toEqual([]);
  });

  it("rejects bad file names and impossible dates", () => {
    const dir = makeAiDir({
      "runs/notes.md": doc("completed"),
      "runs/2026-10-19-Project_Bootstrap.md": doc("completed"),
      "runs/2026-10-19-single.md": doc("completed"),
      "runs/2026-10-19-one-two-three-four-five-six.md": doc("completed"),
      "runs/2026-02-30-bad-date.md": doc("completed"),
    });
    const problems = checkAiDir(dir);
    expect(problems.filter((p) => p.includes("file name must match"))).toHaveLength(4);
    expect(problems).toContain("runs/2026-02-30-bad-date.md: invalid date 2026-02-30");
  });

  it("rejects a status that does not match the directory", () => {
    const dir = makeAiDir({
      "specs/2026-10-20-done-in-wrong-place.md": doc("implemented"),
      "specs/implemented/2026-10-20-not-done-yet.md": doc("in-progress"),
      "specs/archive/2026-10-20-missing-status.md": "# no front matter\n",
      "runs/2026-10-20-unknown-run-status.md": doc("finished"),
    });
    expect(checkAiDir(dir)).toEqual([
      expect.stringContaining('specs/2026-10-20-done-in-wrong-place.md: status "implemented"'),
      expect.stringContaining('specs/implemented/2026-10-20-not-done-yet.md: status "in-progress"'),
      expect.stringContaining('specs/archive/2026-10-20-missing-status.md: status "missing"'),
      expect.stringContaining('runs/2026-10-20-unknown-run-status.md: status "finished"'),
    ]);
  });

  it("reports lessons missing from the index and unexpected spec directories", () => {
    const dir = makeAiDir({
      "lessons/2026-10-19-unlinked-lesson.md": "x",
      "specs/drafts/2026-10-19-misplaced-spec.md": doc("draft"),
    });
    expect(checkAiDir(dir)).toEqual([
      "specs/drafts/: unexpected directory",
      "lessons/2026-10-19-unlinked-lesson.md: not linked in lessons.md",
    ]);
  });

  it("reports missing directories and a missing lessons index", () => {
    const empty = mkdtempSync(join(tmpdir(), "check-ai-"));
    const missingDirs = [
      "specs/: missing directory",
      "specs/implemented/: missing directory",
      "specs/archive/: missing directory",
      "runs/: missing directory",
      "lessons/: missing directory",
    ];
    expect(checkAiDir(empty)).toEqual([...missingDirs, "lessons.md: missing index"]);

    writeFileSync(join(empty, "lessons.md"), "# Wnioski\n");
    expect(checkAiDir(empty)).toEqual(missingDirs);
  });
});

const scriptPath = fileURLToPath(new URL("check-ai.ts", import.meta.url));

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
  await import("./check-ai.ts");
}

describe("check-ai CLI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prints problems and exits with code 1", async () => {
    const dir = makeAiDir({ "runs/notes.md": "" });
    const { exit, error } = mockConsoleAndExit();
    await expect(runCli(dir)).rejects.toThrow("process.exit");
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`✗ ${dir}/runs/notes.md`));
    expect(exit).toHaveBeenCalledWith(1);
  });

  it("checks .ai by default and confirms a consistent directory", async () => {
    const { exit, log } = mockConsoleAndExit();
    await runCli();
    expect(exit).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith("✓ .ai/ is consistent");
  });
});
