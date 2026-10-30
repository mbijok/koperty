---
title: W Storybooku z Vite+ importuj z React tylko typy, motyw przekazuj kanałem globali, a nazwę produktu ustaw w managerze
created: 2026-10-29
area: Testy
---

# W Storybooku z Vite+ importuj z React tylko typy, motyw przekazuj kanałem globali, a nazwę produktu ustaw w managerze

## Kontekst

T-03, etap 1: Storybook 10.6 (`@storybook/react-vite`, `@storybook/addon-vitest`) w pakiecie `packages/ui`, stories uruchamiane jako testy w Chromium z progiem 100% pokrycia.

## Co się stało

- `button.tsx` miał 87,5% pokrycia gałęzi: niepokryta „gałąź” w linii 1.
- Przełącznik motywu nie działał na stronach MDX bez stories.
- Tytuł karty kończył się na „⋅ Storybook”, a ukryty nagłówek dla czytników ekranu brzmiał „Storybook”, mimo `brandTitle`.
- Strony dokumentacji przewijały się poziomo przy 320 px, choć tabele miały przewijany kontener.
- `test.include` w konfiguracji z wtyczką `storybookTest` jest ignorowane, więc testy `*.test.ts` pakietu się nie uruchamiały.

## Przyczyna

- `import * as React from "react"` (React to CommonJS) dostaje w przeglądarce pomocnika zgodności Vite z wyrażeniami warunkowymi, które v8 liczy jako gałęzie.
- Dekoratory działają tylko przy renderowaniu story; strona MDX bez stories ich nie uruchamia.
- Storybook 10 ma nazwę wpisaną na sztywno w `getDescription` i w `#global-site-h1`.
- Elementy `sr-only` mają `position: absolute`; bez pozycjonowanego przodka wychodzą poza kontener z `overflow-x: auto`.
- Wtyczka Storybooka zastępuje `include` listą stories.

## Wniosek

Nie importuj przestrzeni nazw React (`import * as React`); importuj typy (`import type { ComponentProps } from "react"`) i nazwane funkcje (`import { useState } from "react"` – to nie tworzy fałszywych gałęzi), motyw ustawiaj na `<html>` także z nasłuchu `SET_GLOBALS` / `GLOBALS_UPDATED`, nazwę produktu podmieniaj w `manager.ts`, przewijane kontenery z ukrytym tekstem oznaczaj `relative`, a testy Node pakietu uruchamiaj w osobnym projekcie Vitest.

## Jak go stosować

- Po `shadcn add` zamień `import * as React from "react"` na import typów lub nazwanych funkcji. Reguła dotyczy plików mierzonych w pokryciu; w stories nazwane importy (`useState`) są zwykłą praktyką (doprecyzowane po teście agentem, 2026-10-30).
- Konfiguracja motywu: `packages/ui/.storybook/preview.tsx`; nazwa produktu: `packages/ui/.storybook/manager.ts` (MutationObserver).
- Kontrolę stron robi skrypt Playwrighta albo `vp test --project ui --project ui-dark`; poziome przewijanie sprawdzaj przez `scrollWidth > clientWidth` przy 320 px.
- Testy `*.test.ts` z `packages/*/{src,docs,scripts}` należą do projektu `scripts` w głównym `vite.config.ts`.
- CLI shadcn w pakiecie monorepo potrzebuje `paths` w `tsconfig.json` pakietu dla aliasów z `components.json`; komponent zależny od istniejącego pliku (np. `dialog` → `button`) czeka na pytanie o nadpisanie mimo `--yes` – podawaj `printf 'n\n' |` i po każdym `add` usuwaj zależność `cn`.
- Kontener przewijany w bok (np. szeroka tabela) musi mieć nazwę i `tabIndex={0}`, a element siatki z treścią `whitespace-nowrap` – `min-w-0`; inaczej axe zgłasza `scrollable-region-focusable`, a strona przewija się przy 320 px.
- `toHaveTextContent` i `getByText` normalizują białe znaki (twarda spacja z `Intl` staje się zwykłą): kwoty sprawdzaj wyrażeniem z `\s`, a wartość pola (`toHaveValue`) dosłownie.
- Nie nazywaj propów komponentów `role` (lint `jsx-a11y/aria-role` traktuje je jak atrybut ARIA) i nie nadawaj przyciskom `aria-label` innego niż widoczny tekst (axe `label-content-name-mismatch`); ukryty przedrostek dodawaj przez `sr-only`.
- W tekście MDX nawiasy klamrowe poza kodem są wyrażeniem JavaScript; pisz je w `kodzie` albo opisowo.
- Strona MDX z `<Meta of={Stories} />` dostaje nazwę z pliku; podawaj `name="Dokumentacja"`.
- Story we własnej ramce na stronie dokumentacji (`docs.story.inline: false`) to iframe w iframe: startuje z globalami domyślnymi i wysyła je przez kanał stronie dokumentacji, która je przejmuje. Ramka zagnieżdżona bierze motyw z `<html>` strony dokumentacji (`initialGlobals`) i śledzi go `MutationObserver`; sprawdzaj motyw w managerze, nie tylko w `iframe.html`.
- Przewijanie przy 320 px sprawdzaj na każdej story (`viewMode=story`), nie tylko na stronach dokumentacji; elementy o stałej szerokości z tokenu (`w-content`) potrzebują `max-w-full`, a komórki `flex-wrap` – `max-w-full` albo `min-w-0`.
- `<legend>` nazywa `fieldset` tylko jako jego pierwsze dziecko; obok przycisku w wierszu nagłówka użyj `aria-labelledby` (zapytanie `getByRole("group", { name })` w teście to wykrywa).
- Pole `type="email"` samo usuwa spacje z brzegów wartości (sanityzacja przeglądarki): nie przycinaj go w kodzie i nie oczekuj spacji w teście.
- Komponenty z nagłówkami `h3` (karty kopert, dni listy) potrzebują `h2` nad sobą, gdy ekran daje `h1` (axe `heading-order` wykrywa to dopiero w złożeniu na ekranie); w sprawdzaniu `h1` licz tylko `#storybook-root`, bo `iframe.html` ma ukryte nagłówki Storybooka.
- Bloki React na stronach MDX oznaczaj `sb-unstyled` (i `font-sans`), bo typografia dokumentacji Storybooka nadpisuje krój i marginesy komponentów; preflight Tailwinda zeruje znaczniki list MDX – przywróć je w CSS Storybooka dla `.sbdocs-content > ol/ul`. Ramki stories na stronach dokumentacji ładują się leniwie: w kontroli motywu przewiń do nich przed odczytem.
- Stany najechania i wciśnięcia do dokumentacji: nadpisz warianty `hover` i `active` przez `@custom-variant` tylko w CSS Storybooka (z `[data-preview-state~=…]`), żeby komponenty nie miały kodu dokumentacji.

## Powiązania

- Specyfikacja: [.ai/specs/implemented/2026-10-29-design-system-storybook.md](../specs/implemented/2026-10-29-design-system-storybook.md)
- Log: [.ai/runs/2026-10-29-design-system-storybook.md](../runs/2026-10-29-design-system-storybook.md)
- ADR: [docs/adr/0012-design-system-package-storybook.md](../../docs/adr/0012-design-system-package-storybook.md)
