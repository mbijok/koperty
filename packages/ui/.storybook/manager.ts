import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const PRODUCT = "Koperty";

addons.setConfig({
  theme: create({ base: "light", brandTitle: PRODUCT }),
});

// Storybook hardcodes its own name in the tab title and in a screen-reader heading; the interface
// shows only the product name (packages/ui/POSTEP.md, rule 10).
function showProductName() {
  if (document.title.includes("Storybook"))
    document.title = document.title.replace("Storybook", PRODUCT);
  const heading = document.getElementById("global-site-h1");
  if (heading && heading.textContent !== PRODUCT) heading.textContent = PRODUCT;
}

new MutationObserver(showProductName).observe(document, {
  subtree: true,
  childList: true,
  characterData: true,
});
