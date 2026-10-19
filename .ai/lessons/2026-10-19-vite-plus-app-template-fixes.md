---
title: Po vp create vite:application popraw import defineConfig, blok lint i strict
created: 2026-10-19
area: Vite+
---

# Po vp create vite:application popraw import defineConfig, blok lint i strict

## Kontekst

Faza 0, etap 5: dodanie `apps/web` poleceniem `vp create vite:application --directory apps/web -- --template react-ts` wewnątrz monorepo.

## Co się stało

Wygenerowana aplikacja była niezgodna z zasadami projektu:

- `apps/web/vite.config.ts` importował `defineConfig` z `vite`, a nie z `vite-plus`,
- konfiguracja pakietu miała własny blok `lint` (w monorepo `vp check` i tak używa bloku z katalogu głównego),
- `tsconfig.app.json` i `tsconfig.node.json` nie miały `"strict": true`,
- szablon dodał demo (`App.tsx`, grafiki), własny `.gitignore` i `README.md` pakietu.

Dodatkowo `vp check` formatuje także pliki Markdown (`AGENTS.md`, `docs/`), np. wyrównuje tabele.

## Przyczyna

Szablon `react-ts` pochodzi z `create-vite` i jest tylko częściowo dostosowany do Vite+ i monorepo.

## Wniosek

Po każdym `vp create` w tym repo przejrzyj wygenerowane pliki i dostosuj je do AGENTS.md, zamiast zakładać, że szablon jest zgodny z konwencjami projektu.

## Jak go stosować

- `defineConfig` (i `lazyPlugins`) zawsze z `vite-plus`; reguły lintu tylko w głównym `vite.config.ts` przez `lint.overrides`.
- Sprawdź `strict: true` we wszystkich `tsconfig*.json` pakietu.
- Usuń demo i pliki dublujące konfigurację katalogu głównego.
- Po edycji dokumentacji uruchom `vp check --fix`, żeby formatowanie Markdown nie blokowało CI.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 5 fazy 0
