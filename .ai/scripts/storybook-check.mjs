// Browser checks of the design system Storybook (T-03, etap 5) that story tests can't do:
// docs pages at 320 / 768 / 1440 px in both themes, every story at 320 px, keyboard and overlays,
// and catalog links. Run against a running Storybook:
//   vp -C packages/ui run storybook --ci      (in another terminal)
//   vp run check:storybook [-- --url http://127.0.0.1:6006]
// Exit code 1 when a check fails. Not part of CI; the log of the run records its result.
import { createRequire } from "node:module";

const require = createRequire(new URL("../../packages/ui/package.json", import.meta.url));
const { chromium } = require("playwright");

const urlArg = process.argv.indexOf("--url");
const base = urlArg > -1 ? process.argv[urlArg + 1] : "http://127.0.0.1:6006";
const WIDTHS = [
  [320, "light"],
  [768, "dark"],
  [1440, "light"],
];
const CONCURRENCY = 6;
// Stories with an overlay opened from the keyboard: Tab to the trigger, Enter, Escape.
const OVERLAY_STORIES = [
  "komponenty-bazowe-dialog--playground",
  "komponenty-bazowe-dialog-potwierdzenia--playground",
  "komponenty-bazowe-menu--playground",
  "komponenty-bazowe-select--playground",
  "komponenty-bazowe-podpowiedź--playground",
  "komponenty-produktu-budżety-i-członkostwo-przełącznik-budżetu--playground",
  "komponenty-produktu-koperty-karta-koperty--playground",
  "wzorce-potwierdzenie-usunięcia--rezygnacja",
  "komponenty-produktu-konto-powłoka-aplikacji--playground",
];
const OVERLAY = "[role=dialog],[role=alertdialog],[role=menu],[role=listbox],[role=tooltip]";

let index;
try {
  index = (await (await fetch(`${base}/index.json`)).json()).entries;
} catch {
  console.error(
    `Storybook is not running at ${base}. Start it: vp -C packages/ui run storybook --ci`,
  );
  process.exit(1);
}
const ids = Object.keys(index);
const docs = ids.filter((id) => index[id].type === "docs");
const stories = ids.filter((id) => index[id].type === "story");
const known = new Set(ids);
const problems = [];
const browser = await chromium.launch();

async function pool(items, task) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) await task(queue.shift());
    }),
  );
}

async function withPage(width, height, run) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    return await run(page, errors);
  } finally {
    await page.close();
  }
}

// 1. Docs pages: 13 sections on component pages, tables rendered, no horizontal scroll,
//    theme on <html> and in story frames (lazy frames are scrolled into view first), links.
await pool(
  docs.flatMap((id) => WIDTHS.map(([width, theme]) => ({ id, width, theme }))),
  ({ id, width, theme }) =>
    withPage(width, 900, async (page, errors) => {
      await page.goto(`${base}/iframe.html?viewMode=docs&id=${id}&globals=theme:${theme}`, {
        waitUntil: "load",
      });
      await page.waitForTimeout(2000);
      for (const frame of await page.$$("iframe")) {
        await frame.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      }
      const info = await page.evaluate(() => ({
        sections: [...document.querySelectorAll(".sbdocs-content > h2")].filter((h) =>
          /^\d+\./.test(h.textContent ?? ""),
        ).length,
        rawTables: /\|\s*---/.test(document.querySelector(".sbdocs-content")?.innerText ?? ""),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        theme: document.documentElement.className,
        frames: [...document.querySelectorAll("iframe")].map(
          (frame) => frame.contentDocument?.documentElement.className ?? "?",
        ),
        links: [...document.querySelectorAll('a[href^="./?path=/docs/"]')].map((link) =>
          decodeURIComponent(link.getAttribute("href").replace("./?path=/docs/", "")),
        ),
      }));
      const issues = [];
      if (id.endsWith("--dokumentacja") && info.sections !== 13)
        issues.push(`${info.sections} sections`);
      if (info.rawTables) issues.push("unrendered table");
      if (info.overflow) issues.push("horizontal scroll");
      if (info.theme !== theme) issues.push(`theme "${info.theme}"`);
      if (info.frames.some((frame) => frame !== theme)) issues.push(`frames ${info.frames}`);
      const broken = info.links.filter((link) => !known.has(link));
      if (broken.length) issues.push(`broken links ${broken}`);
      if (errors.length) issues.push(`errors ${errors.slice(0, 2)}`);
      if (issues.length) problems.push(`docs ${id} ${width} ${theme}: ${issues.join("; ")}`);
    }),
);

// 2. Every story at 320 px in the dark theme: no horizontal scroll; screens have one h1.
await pool(stories, (id) =>
  withPage(320, 640, async (page) => {
    await page.goto(`${base}/iframe.html?viewMode=story&id=${id}&globals=theme:dark`, {
      waitUntil: "load",
    });
    await page.waitForTimeout(600);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      h1: document.querySelectorAll("#storybook-root h1").length,
    }));
    if (info.overflow) problems.push(`story ${id}: horizontal scroll at 320 px`);
    if (id.startsWith("ekrany-") && info.h1 !== 1) problems.push(`story ${id}: ${info.h1} h1`);
  }),
);

// 3a. Skip link: the first Tab of a page with the app shell lands on "Przejdź do treści". Checked on a
//     story without `play`, which would leave the focus start point inside the content.
await pool(
  ["light", "dark"].flatMap((theme) => [320, 1440].map((width) => ({ width, theme }))),
  ({ width, theme }) =>
    withPage(width, 800, async (page) => {
      const id = "komponenty-produktu-konto-powłoka-aplikacji--bez-akcji-glownej";
      await page.goto(`${base}/iframe.html?viewMode=story&id=${id}&globals=theme:${theme}`, {
        waitUntil: "load",
      });
      await page.waitForTimeout(1500);
      await page.keyboard.press("Tab");
      const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
      if (first !== "Przejdź do treści")
        problems.push(`skip link ${width} ${theme}: first Tab on "${first}"`);
    }),
);

// 3b. Keyboard and overlays: the overlay opens from the keyboard, takes focus, fits the screen,
//    has the theme, and Escape closes it and returns focus to the trigger.
await pool(
  OVERLAY_STORIES.flatMap((id) =>
    [320, 1440].flatMap((width) => ["light", "dark"].map((theme) => ({ id, width, theme }))),
  ),
  ({ id, width, theme }) =>
    withPage(width, 800, async (page) => {
      await page.goto(`${base}/iframe.html?viewMode=story&id=${id}&globals=theme:${theme}`, {
        waitUntil: "load",
      });
      await page.waitForTimeout(2500);
      await page.evaluate(() => document.activeElement?.blur());
      const issues = [];
      let trigger = null;
      for (let i = 0; i < 15 && !trigger; i++) {
        await page.keyboard.press("Tab");
        trigger = await page.evaluate(() => {
          const active = document.activeElement;
          const isTrigger =
            active?.tagName === "BUTTON" &&
            (active.hasAttribute("aria-haspopup") ||
              active.hasAttribute("data-state") ||
              active.getAttribute("aria-label")?.startsWith("Zmień") ||
              active.textContent?.trim() === "Usuń wydatek…");
          return isTrigger ? active.getAttribute("aria-label") || active.textContent?.trim() : null;
        });
      }
      if (!trigger) issues.push("no trigger reachable by Tab");
      const tooltip = id.includes("podpowiedź");
      if (!tooltip) await page.keyboard.press("Enter");
      await page.waitForTimeout(600);
      const overlay = await page.evaluate((selector) => {
        const element = [...document.querySelectorAll(selector)].find(
          (candidate) => candidate.getBoundingClientRect().width > 0,
        );
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return {
          inside:
            element.getAttribute("role") === "tooltip" || element.contains(document.activeElement),
          left: box.left,
          right: window.innerWidth - box.right,
          theme: document.documentElement.className,
        };
      }, OVERLAY);
      if (!overlay) issues.push("overlay did not open");
      else {
        if (!overlay.inside) issues.push("focus outside the overlay");
        if (overlay.left < 0 || overlay.right < 0) issues.push("overlay outside the screen");
        if (overlay.theme !== theme) issues.push(`theme "${overlay.theme}"`);
      }
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
      const after = await page.evaluate(
        (selector) => ({
          open: [...document.querySelectorAll(selector)].some(
            (element) => element.getBoundingClientRect().width > 0,
          ),
          focus:
            document.activeElement?.getAttribute("aria-label") ||
            document.activeElement?.textContent?.trim(),
        }),
        OVERLAY,
      );
      if (after.open) issues.push("Escape did not close the overlay");
      if (!tooltip && trigger && after.focus !== trigger) issues.push("focus not returned");
      if (issues.length) problems.push(`overlay ${id} ${width} ${theme}: ${issues.join("; ")}`);
    }),
);

await browser.close();
console.log(
  `Checked ${docs.length} docs pages × ${WIDTHS.length} widths, ${stories.length} stories at 320 px, ` +
    `${OVERLAY_STORIES.length * 4} overlay runs, 4 skip-link runs.`,
);
if (problems.length) {
  console.log(`✗ ${problems.length} problems:`);
  for (const problem of problems) console.log(`  ${problem}`);
  process.exit(1);
}
console.log("✓ no problems");
