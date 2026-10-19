---
title: Włączając kategorie Oxlint, wyłącz react-in-jsx-scope i dopuść importy CSS
created: 2026-10-19
area: Vite+
---

# Włączając kategorie Oxlint, wyłącz react-in-jsx-scope i dopuść importy CSS

## Kontekst

Research standardów: próba ostrzejszej konfiguracji lintu w głównym `vite.config.ts` (cofnięta).

## Co się stało

Po dodaniu pluginów `import`, `promise`, `jsx-a11y`, `vitest` i kategorii `correctness`, `suspicious`, `perf` `vp check` zgłosił 10 ostrzeżeń: 9× `react/react-in-jsx-scope` i 1× `import/no-unassigned-import` dla `import "./index.css"`.

## Przyczyna

Kategorie włączają reguły pisane dla starego transformu JSX (React 17 i starsze) oraz regułę, która nie zna importów zasobów z efektem ubocznym (CSS).

## Wniosek

Przy włączaniu kategorii Oxlint wyłącz `react/react-in-jsx-scope`, a w `import/no-unassigned-import` dopuść pliki `**/*.css`.

## Jak go stosować

- Po każdej zmianie zestawu pluginów lub kategorii uruchom `vp check` i przejrzyj nowe zgłoszenia przed commitem.
- Wyłączenia reguł opatruj komentarzem z powodem.

## Powiązania

- Specyfikacja: brak (research)
- Log przebiegu: .ai/runs/2026-10-19-engineering-standards-research.md
- Commit: research standardów
