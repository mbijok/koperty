---
title: Pokrycie testami jednostkowymi w CI
started: 2026-10-19
spec: brak – zmiana narzędziowa (CI, konfiguracja testów) bez wpływu na zachowanie aplikacji; plan zaakceptowany w rozmowie
status: completed
---

# Pokrycie testami jednostkowymi w CI

## Cel

Przegląd konfiguracji GitHub CI i wymuszenie 100% pokrycia testami jednostkowymi kodu TypeScript: próg w Vitest, krok w CI, zasada w `AGENTS.md`, testy pokrywające istniejący kod.

## Plan

1. Dodać `@vitest/coverage-v8@5.0.5` (wersja Vitest wbudowanego w Vite+), skonfigurować `coverage` z progiem 100% w głównym `vite.config.ts`, w CI uruchamiać `vp test --coverage`.
2. Zakres pomiaru: `apps/*/src/**` i `scripts/**`; wykluczenia z uzasadnieniem: pliki generowane, `components/ui/**` (shadcn), `main.tsx` (bootstrap DOM).
3. Testy istniejącego kodu w środowisku node (bez nowych bibliotek DOM).
4. Zasada 100% pokrycia w `AGENTS.md` (Testy, komendy, DoD) i w szablonie PR.
5. Weryfikacja: `vp check`, `vp test --coverage`, `vp build`.

## Przebieg kroków

### Krok 0. Ocena istniejącego CI

- **Co zrobiono:** przegląd `.github/workflows/ci.yml` i dokumentacji testów (backlog T-01, engineering-standards P-11).
- **Wynik:** CI na każdy PR już uruchamia `vp check` (format, lint, typy), `vp test`, `vp build`, pgTAP na `supabase db start` i advisors; ostatnie przebiegi zielone. Brak pomiaru pokrycia. `vp test run --coverage` kończy się błędem `MISSING DEPENDENCY @vitest/coverage-v8`.

### Krok 1. Provider pokrycia i próg 100%

- **Co zrobiono:** dodano `@vitest/coverage-v8@5.0.5` (dokładna wersja) do głównego `package.json`. W głównym `vite.config.ts` dodano `test.coverage`: provider v8, zakres `apps/*/src/**`, `scripts/**`, wykluczenia (pliki generowane, `*.d.ts`, `components/ui/**`, `main.tsx`), `thresholds: { 100: true, perFile: true }`. W CI krok „Unit tests” zamieniono na `vp test --coverage`.
- **Komendy:**
  ```bash
  vp add -D @vitest/coverage-v8@5.0.5
  vp test run --coverage
  ```
- **Wynik:** pokrycie 74% linii; brak testów dla `utils.ts`, `query-client.ts`, `supabase.ts`, tras; `check-ai.ts` 83%.

### Krok 2. Testy istniejącego kodu

- **Co zrobiono:** dodano `lib/utils.test.ts`, `lib/query-client.test.ts`, `lib/supabase.test.ts` (mock `createClient`, `vi.stubEnv`), `src/routes.test.tsx` (router w pamięci, `renderToString`), rozszerzono `scripts/check-ai.test.ts` o brakujące katalogi i indeks oraz wejście CLI.
- **Problem:** trasy `.tsx` miały fałszywie niepokryte gałęzie z kodu HMR doklejanego przez `@vitejs/plugin-react` i `@tanstack/router-plugin`. Rozwiązanie: w `apps/web/vite.config.ts` pluginy nie są ładowane pod Vitest (`process.env.VITEST ? [] : [...]`).
- **Wynik:** `vp test --coverage`: 15 testów, 100% instrukcji, gałęzi, funkcji i linii (7 plików).

### Krok 3. Dokumentacja

- **Co zrobiono:** zasada 100% pokrycia w `AGENTS.md` (Testy, tabela komend, Definition of Done), szablon PR, `README.md`, `docs/backlog.md`, `docs/prompts/feature-workflow.md`. Wniosek w `.ai/lessons/2026-10-19-vitest-coverage-vite-plus.md`.

### Krok 4. Weryfikacja

- **Komendy:**
  ```bash
  vp check && vp test --coverage && vp build && vp run check:ai
  ```
- **Wynik:** wszystkie przechodzą (kod wyjścia 0). Kontrola negatywna: tymczasowy plik bez testów powoduje `ERROR: Coverage for lines (0%) does not meet global threshold (100%)` i kod wyjścia 1 (plik usunięto).

## Decyzje i założenia

- Testcontainers pominięte (zaakceptowane przez użytkownika): aplikacja wymaga stosu Supabase (Auth, PostgREST, Mailpit), nie samego Postgresa; tymczasową instancję w Dockerze stawia już Supabase CLI, a testy integracyjne bazy to pgTAP w CI.
- agent-browser pominięty w CI: to narzędzie agenta do ręcznej weryfikacji, nie deterministyczny test; testy E2E to zadanie T-01 (Playwright) w backlogu.
- Nowa zależność `@vitest/coverage-v8` zaakceptowana przez użytkownika.
- Pluginy aplikacji wyłączone w testach: trasy w testach korzystają z zatwierdzonego `routeTree.gen.ts`, JSX transformuje wbudowany oxc.
- Komponenty React testowane w środowisku node przez `react-dom/server`; testy interakcji w przeglądarce zostają przy T-01 (P-11 w engineering-standards).

## Problemy

- Fałszywie niepokryte gałęzie w plikach `.tsx` (kod HMR pluginów); rozwiązane w kroku 2.
- Dynamiczny import `check-ai.ts` zwracał moduł z cache; rozwiązane przez `vi.resetModules()` przed importem.

## Status końcowy

completed: CI egzekwuje 100% pokrycia, istniejący kod ma pełne pokrycie, zasada zapisana w `AGENTS.md`. CI na GitHubie zweryfikuje się dopiero po otwarciu PR.

## Następne kroki

- Otworzyć PR i sprawdzić przebieg CI.
- Ochrona gałęzi `master` z wymaganymi zadaniami CI (ustawienie repozytorium, P-12).
- T-01: testy E2E (Playwright na `supabase start` + `vp preview`); rozważyć opis agent-browser jako narzędzia agenta do lokalnej weryfikacji UI.
