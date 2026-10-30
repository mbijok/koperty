import type { Decorator, Preview } from "@storybook/react-vite";
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
import "./preview.css";

const THEMES = ["system", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];

function toTheme(value: unknown): Theme {
  return THEMES.find((theme) => theme === value) ?? "system";
}

// The theme is set on <html>, so dialogs, menus and popovers rendered outside the story get it too.
function applyTheme(value: unknown) {
  const theme = toTheme(value);
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

// A story with its own frame on a docs page (docs.story.inline: false) is an iframe inside the docs
// iframe. It would start with the default theme and report it to the docs page through the channel,
// so it takes the docs page's theme instead and follows it.
function docsPageRoot(): HTMLElement | undefined {
  if (window.parent === window) return undefined;
  const isDocs = new URLSearchParams(window.parent.location.search).get("viewMode") === "docs";
  return isDocs ? window.parent.document.documentElement : undefined;
}

function themeOf(root: HTMLElement): Theme {
  return THEMES.find((theme) => root.classList.contains(theme)) ?? "system";
}

const docsRoot = docsPageRoot();
if (docsRoot) {
  new MutationObserver(() => applyTheme(themeOf(docsRoot))).observe(docsRoot, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

// Docs pages without stories never run decorators, so they follow the toolbar through the channel.
for (const event of [SET_GLOBALS, GLOBALS_UPDATED]) {
  addons
    .getChannel()
    .on(event, ({ globals }: { globals: Record<string, unknown> }) => applyTheme(globals["theme"]));
}

const withTheme: Decorator = (Story, context) => {
  applyTheme(context.globals["theme"]);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Motyw",
      toolbar: {
        title: "Motyw",
        icon: "mirror",
        items: [
          { value: "system", title: "Systemowy" },
          { value: "light", title: "Jasny" },
          { value: "dark", title: "Ciemny" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    // Story tests run once per theme (vite.config.ts); Storybook itself starts with the system theme.
    theme: docsRoot ? themeOf(docsRoot) : toTheme(import.meta.env.VITE_STORYBOOK_THEME),
  },
  parameters: {
    a11y: { test: "error" },
    layout: "padded",
    options: {
      storySort: {
        order: [
          "Design system",
          [
            "Zacznij tutaj",
            "Komponenty",
            "Jak wybrać",
            "Użycie i dostępność",
            "Treść",
            "Czego unikać",
            "Czego brakuje",
            "Jak zmieniać system",
            "Epik: Konto",
            "Epik: Budżety i członkostwo",
            "Epik: Koperty",
            "Epik: Przychody i przydziały",
            "Epik: Wydatki",
            "Epik: Przegląd budżetu",
            "Epik: Aplikacja na telefonie",
          ],
          "Fundamenty",
          ["Kolor", "Typografia", "Odstępy i układ", "Kształt i głębia", "Ruch", "Ikony", "Motywy"],
          "Komponenty bazowe",
          "Komponenty produktu",
          [
            "Konto",
            "Budżety i członkostwo",
            "Koperty",
            "Przychody i przydziały",
            "Wydatki",
            "Przegląd budżetu",
            "Aplikacja na telefonie",
          ],
          "Wzorce",
          "Ekrany",
        ],
      },
    },
  },
};

export default preview;
