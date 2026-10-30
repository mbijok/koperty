# Tokeny Koperty

**Status:** zatwierdzony (2026-10-29). Uzasadnienia i identyfikatory źródeł są w [brief.md](brief.md). W etapie 1 te wartości trafiają do kodu w trzech warstwach: surowe → znaczeniowe → komponentowe. Kontrast policzono dla dokładnie tych wartości (WCAG 2.1, konwersja OKLCH → sRGB).

## 1. Wartości surowe

Nazwy opisują wartość, nie przeznaczenie. Komponenty nigdy nie używają ich bezpośrednio.

| Token         | Wartość                      | Pochodzenie                    |
| ------------- | ---------------------------- | ------------------------------ |
| `neutral-0`   | `oklch(1 0 0)`               | R01                            |
| `neutral-50`  | `oklch(0.985 0 0)`           | R01                            |
| `neutral-100` | `oklch(0.97 0 0)`            | R01                            |
| `neutral-200` | `oklch(0.922 0 0)`           | R01                            |
| `neutral-400` | `oklch(0.708 0 0)`           | R01                            |
| `neutral-450` | `oklch(0.64 0 0)`            | K2 (obramowanie pola, jasny)   |
| `neutral-500` | `oklch(0.56 0 0)`            | K2 (obramowanie pola, ciemny)  |
| `neutral-550` | `oklch(0.53 0 0)`            | K2 (z R01 0,556)               |
| `neutral-750` | `oklch(0.30 0 0)`            | K2 (separator, ciemny)         |
| `neutral-800` | `oklch(0.269 0 0)`           | R01                            |
| `neutral-850` | `oklch(0.205 0 0)`           | R01                            |
| `neutral-900` | `oklch(0.145 0 0)`           | R01                            |
| `slate-100`   | `oklch(0.967 0.001 286.375)` | R01 (`secondary`)              |
| `slate-150`   | `oklch(0.94 0.002 286.4)`    | K2 (zamiast `color-mix` z R01) |
| `slate-900`   | `oklch(0.21 0.006 285.885)`  | R01                            |
| `slate-800`   | `oklch(0.274 0.006 286.033)` | R01                            |
| `slate-750`   | `oklch(0.31 0.006 286)`      | K2                             |
| `emerald-50`  | `oklch(0.979 0.021 166.113)` | R01                            |
| `emerald-400` | `oklch(0.765 0.177 163.223)` | K2 (link i fokus, ciemny)      |
| `emerald-500` | `oklch(0.508 0.118 165.612)` | R01                            |
| `emerald-550` | `oklch(0.475 0.105 166.5)`   | K2 (najechanie, ciemny)        |
| `emerald-600` | `oklch(0.455 0.105 166.2)`   | K2 (najechanie, jasny)         |
| `emerald-700` | `oklch(0.432 0.095 166.913)` | R01                            |
| `emerald-750` | `oklch(0.415 0.093 166.9)`   | K2 (wciśnięty, jasny)          |
| `red-400`     | `oklch(0.704 0.191 22.216)`  | R01                            |
| `red-350`     | `oklch(0.75 0.17 22.2)`      | K2 (najechanie, ciemny)        |
| `red-500`     | `oklch(0.577 0.245 27.325)`  | R01                            |
| `red-550`     | `oklch(0.52 0.22 27.3)`      | K2 (najechanie, jasny)         |

## 2. Tokeny znaczeniowe – kolor

| Token                    | Przeznaczenie                                  | Jasny               | Ciemny              | Źródło          |
| ------------------------ | ---------------------------------------------- | ------------------- | ------------------- | --------------- |
| `surface-page`           | tło strony                                     | `neutral-0`         | `neutral-900`       | R01             |
| `surface-card`           | tło karty i panelu                             | `neutral-0`         | `neutral-850`       | R01             |
| `surface-muted`          | tło wyróżnionego obszaru, nagłówka tabeli      | `neutral-100`       | `neutral-800`       | R01             |
| `surface-overlay`        | tło dialogu, menu, popovera                    | `neutral-0`         | `neutral-850`       | R01             |
| `surface-scrim`          | przyciemnienie pod dialogiem                   | `neutral-900` / 50% | `neutral-900` / 70% | K5              |
| `text-default`           | tekst, kwoty                                   | `neutral-900`       | `neutral-50`        | R01, W4         |
| `text-muted`             | podpowiedzi, metadane                          | `neutral-550`       | `neutral-400`       | K2              |
| `text-link`              | linki i akcje tekstowe                         | `emerald-500`       | `emerald-400`       | R01.2, K2       |
| `text-danger`            | tekst błędu pola, alert błędu                  | `red-500`           | `red-400`           | R01             |
| `text-on-action`         | tekst na przycisku głównym                     | `emerald-50`        | `emerald-50`        | R01             |
| `text-on-danger`         | tekst na przycisku usuwania                    | `neutral-50`        | `neutral-900`       | K2              |
| `action-primary`         | przycisk główny                                | `emerald-500`       | `emerald-700`       | R01.2           |
| `action-primary-hover`   | najechanie                                     | `emerald-600`       | `emerald-550`       | K2              |
| `action-primary-pressed` | wciśnięcie                                     | `emerald-750`       | `emerald-500`       | K2              |
| `action-secondary`       | przycisk drugorzędny                           | `slate-100`         | `slate-800`         | R01             |
| `action-secondary-hover` | najechanie                                     | `slate-150`         | `slate-750`         | K2              |
| `text-on-secondary`      | tekst przycisku drugorzędnego                  | `slate-900`         | `neutral-50`        | R01             |
| `action-danger`          | przycisk usuwania (tylko w potwierdzeniu)      | `red-500`           | `red-400`           | R01             |
| `action-danger-hover`    | najechanie                                     | `red-550`           | `red-350`           | K2              |
| `border-subtle`          | separatory, obramowanie karty                  | `neutral-200`       | `neutral-750`       | R01.3           |
| `border-control`         | granica pola, selecta, przełącznika            | `neutral-450`       | `neutral-500`       | K2, WCAG 1.4.11 |
| `border-invalid`         | granica pola z błędem (zawsze z tekstem błędu) | `red-500`           | `red-400`           | R01, WCAG 1.4.1 |
| `focus-ring`             | linia fokusu 2 px z odstępem 2 px              | `emerald-500`       | `emerald-400`       | W2, WCAG 2.4.7  |

Kwoty nie mają tokenu koloru: używają `text-default` niezależnie od znaku (W4). Debet oznacza znak minus i znacznik „Debet” w wariancie neutralnym (K3).

### Kontrast (zmierzony)

| Para                                        | Jasny | Ciemny | Próg |
| ------------------------------------------- | ----- | ------ | ---- |
| `text-default` / `surface-page`             | 19,79 | 18,96  | 4,5  |
| `text-default` / `surface-card`             | 19,79 | 17,16  | 4,5  |
| `text-default` / `surface-muted`            | 18,15 | 14,48  | 4,5  |
| `text-muted` / `surface-page`               | 5,28  | 7,63   | 4,5  |
| `text-muted` / `surface-card`               | 5,28  | 6,91   | 4,5  |
| `text-muted` / `surface-muted`              | 4,84  | 5,83   | 4,5  |
| `text-link` / `surface-page`                | 5,37  | 10,24  | 4,5  |
| `text-link` / `surface-card`                | 5,37  | 9,27   | 4,5  |
| `text-link` / `surface-muted`               | 4,92  | 7,82   | 4,5  |
| `text-danger` / `surface-page`              | 4,76  | 6,84   | 4,5  |
| `text-danger` / `surface-card`              | 4,76  | 6,19   | 4,5  |
| `text-on-action` / `action-primary`         | 5,09  | 7,19   | 4,5  |
| `text-on-action` / `action-primary-hover`   | 6,44  | 5,94   | 4,5  |
| `text-on-action` / `action-primary-pressed` | 7,73  | 5,09   | 4,5  |
| `text-on-danger` / `action-danger`          | 4,56  | 6,84   | 4,5  |
| `text-on-danger` / `action-danger-hover`    | 5,77  | 7,94   | 4,5  |
| `focus-ring` / `surface-page`               | 5,37  | 10,24  | 3    |
| `focus-ring` / `surface-card`               | 5,37  | 9,27   | 3    |
| `border-control` / `surface-page`           | 3,36  | 4,25   | 3    |
| `border-control` / `surface-card`           | 3,36  | 3,85   | 3    |
| `border-control` / `surface-muted`          | 3,08  | 3,25   | 3    |

Do policzenia w etapie 1 (zależą od komponentów): `text-on-secondary` / `action-secondary` i stany najechania drugorzędnych, `text-muted` na tłach najechania w menu.

## 3. Tokeny znaczeniowe – typografia (P3, W3)

Krój: Oxanium Variable (podzbiory `latin` i `latin-ext`, dołączone do pakietu). Kod: systemowy krój o stałej szerokości (P8).

| Token            | Rola                                         | Rozmiar / wysokość linii | Grubość |
| ---------------- | -------------------------------------------- | ------------------------ | ------- |
| `type-page`      | nagłówek strony                              | 24 / 32 px               | 600     |
| `type-section`   | nagłówek sekcji, tytuł dialogu               | 18 / 28 px               | 600     |
| `type-body`      | tekst interfejsu i treść                     | 14 / 20 px               | 400     |
| `type-label`     | etykieta pola, tekst przycisku               | 14 / 20 px               | 500     |
| `type-input`     | tekst wpisywany w pole                       | 16 / 24 px               | 400     |
| `type-meta`      | metadane (data, autor), podpowiedź, znacznik | 12 / 16 px               | 400     |
| `type-amount`    | kwota w wierszu                              | 14 / 20 px               | 500     |
| `type-amount-lg` | kwota główna (pula, saldo w nagłówku)        | 32 / 40 px               | 600     |
| `type-code`      | link zaproszenia                             | 14 / 20 px, mono         | 400     |

Tekst ciągły: `measure-text` = 65ch.

## 4. Tokeny znaczeniowe – odstępy i układ (P4, P5)

| Token                  | Poziom relacji                                 | Wartość    |
| ---------------------- | ---------------------------------------------- | ---------- |
| `space-inline`         | w elemencie (ikona–tekst, kwota–znacznik)      | 4 px       |
| `space-group`          | w grupie (etykieta–pole–podpowiedź)            | 8 px       |
| `space-between-groups` | między grupami (pola formularza, wiersze kart) | 16 px      |
| `space-panel`          | wnętrze karty, dialogu                         | 16 px      |
| `space-panel-compact`  | wnętrze małej karty, wiersza listy             | 12 px      |
| `space-section`        | między sekcjami strony                         | 32 px      |
| `page-gutter`          | margines strony: < 768 px / ≥ 768 px           | 16 / 24 px |
| `content-max`          | szerokość treści (formularze, listy)           | 640 px     |
| `content-max-wide`     | szerokość tabeli podsumowania                  | 960 px     |

## 5. Tokeny znaczeniowe – kształt, głębia, ruch

| Token            | Przeznaczenie                    | Wartość                                                                                                   | Źródło  |
| ---------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- | ------- |
| `radius-base`    | podstawa skali                   | 0,45 rem                                                                                                  | R01     |
| `radius-control` | przycisk, pole, znacznik         | 0,36 rem (`base` × 0,8)                                                                                   | R01, P1 |
| `radius-card`    | karta, alert, menu               | 0,45 rem                                                                                                  | R01     |
| `radius-overlay` | dialog                           | 0,63 rem (`base` × 1,4)                                                                                   | R01     |
| `border-width`   | obramowania                      | 1 px                                                                                                      | R01     |
| `focus-width`    | linia fokusu / odstęp            | 2 px / 2 px                                                                                               | W2      |
| `shadow-card`    | karta (zawsze z `border-subtle`) | jasny: `0 1px 2px oklch(0 0 0 / 6%), 0 1px 3px oklch(0 0 0 / 4%)`; ciemny: `0 1px 2px oklch(0 0 0 / 40%)` | W5, K4  |
| `shadow-overlay` | dialog, menu, toast              | jasny: `0 8px 24px -4px oklch(0 0 0 / 14%)`; ciemny: `0 8px 24px -4px oklch(0 0 0 / 60%)`                 | W5      |
| `duration-fast`  | zmiana koloru (najechanie)       | 100 ms                                                                                                    | P6      |
| `duration-base`  | wejście i wyjście nakładki       | 150 ms                                                                                                    | P6      |
| `ease-standard`  | krzywa                           | `cubic-bezier(0.2, 0, 0, 1)`                                                                              | P6      |

Przy `prefers-reduced-motion: reduce` nakładki pojawiają się bez przesunięcia i powiększenia (tylko przenikanie albo od razu).

## 6. Tokeny komponentów (tylko tam, gdzie potrzebne)

| Token               | Wartość                                 | Źródło           |
| ------------------- | --------------------------------------- | ---------------- |
| `control-height`    | 40 px                                   | W1, P2           |
| `control-height-sm` | 32 px                                   | P2               |
| `control-padding-x` | 12 px                                   | P2               |
| `badge-height`      | 20 px                                   | P1               |
| `icon-size`         | 16 px w kontrolkach, 20 px samodzielnie | R01 (lucide), W1 |
| `menu-item-height`  | 40 px                                   | W1               |
