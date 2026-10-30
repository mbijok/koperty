// Rows rendered on the Foundations pages and exercised by docs/blocks/foundations.stories.tsx.
// Sources (R01, K2, W4…) refer to packages/ui/brief.md; values live in src/tokens/tokens.css.
import type { ContrastKind } from "./contrast";

export type TokenRow = {
  token: string;
  purpose: string;
  source: string;
  className?: string;
};

export type ContrastPair = {
  fg: string;
  bg: string;
  kind: ContrastKind;
  use: string;
};

export const colorRoles: TokenRow[] = [
  { token: "surface-page", purpose: "Tło strony", source: "R01", className: "bg-surface-page" },
  {
    token: "surface-card",
    purpose: "Tło karty i panelu",
    source: "R01",
    className: "bg-surface-card",
  },
  {
    token: "surface-muted",
    purpose: "Wyróżniony obszar, nagłówek tabeli",
    source: "R01",
    className: "bg-surface-muted",
  },
  {
    token: "surface-overlay",
    purpose: "Dialog, menu, popover",
    source: "R01",
    className: "bg-surface-overlay",
  },
  {
    token: "surface-scrim",
    purpose: "Przyciemnienie pod dialogiem, bez rozmycia",
    source: "K5",
    className: "bg-surface-scrim",
  },
  {
    token: "text-default",
    purpose: "Tekst i kwoty (bez koloru znaczeniowego)",
    source: "R01, W4",
    className: "text-default",
  },
  { token: "text-muted", purpose: "Podpowiedzi, metadane", source: "K2", className: "text-muted" },
  {
    token: "text-link",
    purpose: "Linki i akcje tekstowe",
    source: "R01.2, K2",
    className: "text-link",
  },
  {
    token: "text-danger",
    purpose: "Błąd pola, alert błędu",
    source: "R01",
    className: "text-danger",
  },
  {
    token: "text-on-action",
    purpose: "Tekst na przycisku głównym",
    source: "R01",
    className: "text-on-action",
  },
  {
    token: "text-on-secondary",
    purpose: "Tekst na przycisku drugorzędnym",
    source: "R01",
    className: "text-on-secondary",
  },
  {
    token: "text-on-danger",
    purpose: "Tekst na przycisku usuwania",
    source: "K2",
    className: "text-on-danger",
  },
  {
    token: "action-primary",
    purpose: "Przycisk główny",
    source: "R01.2",
    className: "bg-action-primary",
  },
  {
    token: "action-primary-hover",
    purpose: "Przycisk główny: najechanie",
    source: "K2",
    className: "bg-action-primary-hover",
  },
  {
    token: "action-primary-pressed",
    purpose: "Przycisk główny: wciśnięcie",
    source: "K2",
    className: "bg-action-primary-pressed",
  },
  {
    token: "action-secondary",
    purpose: "Przycisk drugorzędny",
    source: "R01",
    className: "bg-action-secondary",
  },
  {
    token: "action-secondary-hover",
    purpose: "Przycisk drugorzędny: najechanie",
    source: "K2",
    className: "bg-action-secondary-hover",
  },
  {
    token: "action-danger",
    purpose: "Przycisk usuwania (tylko w potwierdzeniu)",
    source: "R01",
    className: "bg-action-danger",
  },
  {
    token: "action-danger-hover",
    purpose: "Przycisk usuwania: najechanie",
    source: "K2",
    className: "bg-action-danger-hover",
  },
  {
    token: "border-subtle",
    purpose: "Separatory, obramowanie karty",
    source: "R01.3",
    className: "border-subtle",
  },
  {
    token: "border-control",
    purpose: "Granica pola, selecta, przełącznika",
    source: "K2, WCAG 1.4.11",
    className: "border-control",
  },
  {
    token: "border-invalid",
    purpose: "Granica pola z błędem (zawsze z tekstem błędu)",
    source: "R01, WCAG 1.4.1",
    className: "border-invalid",
  },
  {
    token: "focus-ring",
    purpose: "Linia fokusu 2 px z odstępem 2 px",
    source: "W2, WCAG 2.4.7",
    className: "outline-focus",
  },
];

export const contrastPairs: ContrastPair[] = [
  { fg: "text-default", bg: "surface-page", kind: "text", use: "Tekst na stronie" },
  { fg: "text-default", bg: "surface-card", kind: "text", use: "Tekst w karcie" },
  { fg: "text-default", bg: "surface-muted", kind: "text", use: "Tekst w wyróżnionym obszarze" },
  { fg: "text-default", bg: "surface-overlay", kind: "text", use: "Tekst w dialogu i menu" },
  { fg: "text-muted", bg: "surface-page", kind: "text", use: "Metadane na stronie" },
  { fg: "text-muted", bg: "surface-card", kind: "text", use: "Metadane w karcie" },
  { fg: "text-muted", bg: "surface-muted", kind: "text", use: "Metadane w wyróżnionym obszarze" },
  { fg: "text-muted", bg: "surface-overlay", kind: "text", use: "Podpowiedź w menu" },
  { fg: "text-link", bg: "surface-page", kind: "text", use: "Link na stronie" },
  { fg: "text-link", bg: "surface-card", kind: "text", use: "Link w karcie" },
  { fg: "text-link", bg: "surface-muted", kind: "text", use: "Link w wyróżnionym obszarze" },
  { fg: "text-danger", bg: "surface-page", kind: "text", use: "Błąd pola na stronie" },
  { fg: "text-danger", bg: "surface-card", kind: "text", use: "Błąd pola w karcie" },
  { fg: "text-on-action", bg: "action-primary", kind: "text", use: "Przycisk główny" },
  {
    fg: "text-on-action",
    bg: "action-primary-hover",
    kind: "text",
    use: "Przycisk główny: najechanie",
  },
  {
    fg: "text-on-action",
    bg: "action-primary-pressed",
    kind: "text",
    use: "Przycisk główny: wciśnięcie",
  },
  { fg: "text-on-secondary", bg: "action-secondary", kind: "text", use: "Przycisk drugorzędny" },
  {
    fg: "text-on-secondary",
    bg: "action-secondary-hover",
    kind: "text",
    use: "Przycisk drugorzędny: najechanie",
  },
  { fg: "text-on-danger", bg: "action-danger", kind: "text", use: "Przycisk usuwania" },
  {
    fg: "text-on-danger",
    bg: "action-danger-hover",
    kind: "text",
    use: "Przycisk usuwania: najechanie",
  },
  { fg: "focus-ring", bg: "surface-page", kind: "ui", use: "Fokus na stronie" },
  { fg: "focus-ring", bg: "surface-card", kind: "ui", use: "Fokus w karcie" },
  { fg: "border-control", bg: "surface-page", kind: "ui", use: "Granica pola na stronie" },
  { fg: "border-control", bg: "surface-card", kind: "ui", use: "Granica pola w karcie" },
  {
    fg: "border-control",
    bg: "surface-muted",
    kind: "ui",
    use: "Granica pola w wyróżnionym obszarze",
  },
];

export const typeRoles: TokenRow[] = [
  { token: "type-page", purpose: "Nagłówek strony", source: "P3", className: "text-page" },
  {
    token: "type-section",
    purpose: "Nagłówek sekcji, tytuł dialogu",
    source: "P3",
    className: "text-section",
  },
  { token: "type-body", purpose: "Tekst interfejsu i treść", source: "P3", className: "text-body" },
  {
    token: "type-label",
    purpose: "Etykieta pola, tekst przycisku",
    source: "P3",
    className: "text-label",
  },
  {
    token: "type-input",
    purpose: "Tekst wpisywany w pole (16 px: iOS nie powiększa strony)",
    source: "K1",
    className: "text-input",
  },
  {
    token: "type-meta",
    purpose: "Data, autor, podpowiedź, znacznik",
    source: "P3",
    className: "text-meta",
  },
  {
    token: "type-amount",
    purpose: "Kwota w wierszu (cyfry tabelaryczne)",
    source: "P3, W3",
    className: "text-amount",
  },
  {
    token: "type-amount-lg",
    purpose: "Kwota główna: pula, saldo w nagłówku",
    source: "P3",
    className: "text-amount-lg",
  },
  {
    token: "font-family-mono",
    purpose: "Link zaproszenia",
    source: "P8",
    className: "font-mono text-body",
  },
];

export const spacingLevels: TokenRow[] = [
  {
    token: "space-inline",
    purpose: "W elemencie: ikona–tekst, kwota–znacznik",
    source: "P4, R01.5",
    className: "gap-inline",
  },
  {
    token: "space-group",
    purpose: "W grupie: etykieta–pole–podpowiedź",
    source: "P4",
    className: "gap-group",
  },
  {
    token: "space-between-groups",
    purpose: "Między grupami: pola formularza, karty na liście",
    source: "P4, R01.5",
    className: "gap-between-groups",
  },
  {
    token: "space-panel",
    purpose: "Wnętrze karty i dialogu",
    source: "P4, R01.5",
    className: "p-panel",
  },
  {
    token: "space-panel-compact",
    purpose: "Wnętrze małej karty, wiersza listy",
    source: "P4, R01.5",
    className: "p-panel-compact",
  },
  {
    token: "space-section",
    purpose: "Między sekcjami strony",
    source: "P4",
    className: "gap-section",
  },
];

export const layoutTokens: TokenRow[] = [
  {
    token: "page-gutter",
    purpose: "Margines strony poniżej 768 px",
    source: "P5",
    className: "px-gutter",
  },
  {
    token: "page-gutter-wide",
    purpose: "Margines strony od 768 px",
    source: "P5",
    className: "md:px-gutter-wide",
  },
  {
    token: "content-max",
    purpose: "Szerokość treści: formularze, listy",
    source: "P5",
    className: "max-w-content",
  },
  {
    token: "content-max-wide",
    purpose: "Szerokość tabeli podsumowania miesiąca",
    source: "P5",
    className: "max-w-content-wide",
  },
  {
    token: "measure-text",
    purpose: "Długość linii tekstu ciągłego (około 65 znaków)",
    source: "P3, polecenie budowy",
    className: "max-w-measure",
  },
];

export const shapeTokens: TokenRow[] = [
  {
    token: "radius-control",
    purpose: "Przycisk, pole, znacznik",
    source: "R01.3, P1",
    className: "rounded-control",
  },
  {
    token: "radius-card",
    purpose: "Karta, alert, menu",
    source: "R01.3",
    className: "rounded-card",
  },
  { token: "radius-overlay", purpose: "Dialog", source: "R01.3", className: "rounded-overlay" },
  { token: "border-width", purpose: "Obramowania", source: "R01.3", className: "border" },
  {
    token: "shadow-card",
    purpose: "Karta: zawsze razem z obramowaniem",
    source: "W5, K4",
    className: "shadow-card",
  },
  {
    token: "shadow-overlay",
    purpose: "Dialog, menu, toast",
    source: "W5",
    className: "shadow-overlay",
  },
];

export const motionTokens: TokenRow[] = [
  {
    token: "duration-fast",
    purpose: "Zmiana koloru przy najechaniu i wciśnięciu",
    source: "P6",
    className: "duration-fast",
  },
  {
    token: "duration-base",
    purpose: "Wejście i wyjście nakładki",
    source: "P6",
    className: "duration-base",
  },
  {
    token: "ease-standard",
    purpose: "Krzywa wszystkich przejść",
    source: "P6",
    className: "ease-standard",
  },
];

export const componentTokens: TokenRow[] = [
  {
    token: "control-height",
    purpose: "Przycisk, pole, select, pozycja menu",
    source: "W1, P2",
    className: "h-control",
  },
  {
    token: "control-height-sm",
    purpose: "Akcje w wierszu listy lub tabeli",
    source: "P2",
    className: "h-control-sm",
  },
  {
    token: "control-padding-x",
    purpose: "Poziome wnętrze kontrolki",
    source: "P2",
    className: "px-control-x",
  },
  { token: "badge-height", purpose: "Znacznik statusu", source: "P1", className: "h-badge" },
  { token: "icon-size", purpose: "Ikona w kontrolce", source: "R01, W1", className: "size-icon" },
  {
    token: "icon-size-standalone",
    purpose: "Ikona samodzielna",
    source: "R01, W1",
    className: "size-icon-standalone",
  },
];
