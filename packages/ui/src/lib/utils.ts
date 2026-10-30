import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only knows Tailwind's default theme. Without these groups it would treat e.g.
// `text-meta` (font size) and `text-muted` (colour) as the same utility and drop one of them.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "0",
        "inline",
        "group",
        "between-groups",
        "panel",
        "panel-compact",
        "section",
        "gutter",
        "gutter-wide",
        "control-x",
      ],
      radius: ["control", "card", "overlay"],
      shadow: ["card", "overlay"],
      text: ["page", "section", "body", "label", "input", "meta", "amount", "amount-lg"],
      container: ["content", "content-wide", "measure"],
      ease: ["standard"],
    },
    classGroups: {
      h: [{ h: ["control", "control-sm", "badge", "menu-item"] }],
      size: [{ size: ["control", "control-sm", "icon", "icon-standalone"] }],
      duration: [{ duration: ["fast", "base"] }],
      "text-color": [
        { text: ["default", "muted", "link", "danger", "on-action", "on-secondary", "on-danger"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
