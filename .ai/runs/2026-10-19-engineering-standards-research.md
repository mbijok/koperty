---
title: Research stacku, standardów inżynieryjnych i wzorców
started: 2026-10-19
spec: brak – zadanie dokumentacyjne (research i propozycje), bez zmian w zachowaniu aplikacji; zmiany do wdrożenia tylko po akceptacji
status: completed
---

# Research stacku, standardów inżynieryjnych i wzorców

## Cel

Na prośbę użytkownika (przed scaleniem PR #1): zbadać aktualne dobre praktyki dla obecnego stacku (Vite+, Bun, React, TanStack Router/Query, Tailwind/shadcn, Supabase/Postgres, pgTAP, GitHub Actions, Cloudflare Pages) i opisać standardy inżynieryjne, coding standards i wzorce projektowe; zaproponować, co wdrożyć lub zmienić.

## Plan

1. Research: Supabase/Postgres (bezpieczeństwo, RLS, RPC, błędy, testy, migracje).
2. Research: frontend (React, TanStack Router/Query, formularze, walidacja, daty i kwoty).
3. Research: Vite+/Oxlint, testy frontendu, CI, zależności.
4. Dokument `docs/engineering-standards.md` (stan wyjściowy, standardy, wzorce, propozycje z priorytetami).
5. Wnioski, zamknięcie logu, commit na gałęzi `chore/project-bootstrap` (bez pushu bez zgody).

## Przebieg kroków

### Krok 1. Start

- **Co zrobiono:** założono log; gałąź `chore/project-bootstrap`, drzewo czyste.
- **Komendy:** `date +%F` → 2026-10-19.

### Krok 2. Research Supabase/Postgres

- **Źródła:** changelog Supabase (tabele nieeksponowane automatycznie: nowe projekty od 2026-05-30, istniejące od 2026-10-30), dokumentacja PostgREST (błędy `PTxyz`, `PGRST`), Supabase troubleshooting (SQLSTATE 40001 → nieskończone ponowienia w PostgREST 14), RLS performance guide, pgTAP extended (basejump test helpers przez dbdev + `pg_tle` + `http`), blog Declarative Schemas 2.0 (pg-delta alfa).
- **Lokalnie:** `supabase/config.toml` ma `auto_expose_new_tables` (domyślnie `true` lokalnie, inaczej niż nowe projekty w chmurze) i `[experimental.pgdelta] enabled = true`; CLI ma `supabase db advisors --local --type all --fail-on <level>` i `supabase db lint`.

### Krok 3. Research frontend

- **Źródła:** TanStack Router (integracja z Query: `queryClient` w kontekście, `defaultPreloadStaleTime: 0`, `queryOptions` współdzielone przez loader i komponent; `validateSearch` przyjmuje Zod v4 / Valibot bez adaptera), porównania bibliotek formularzy i walidacji (źródła drugorzędne, sprzeczne liczby), README `@vitejs/plugin-react` 6.1.2 (natywny React Compiler eksperymentalny, wariant Babel wymaga 3 zależności), status Temporal (brak w Safari).

### Krok 4. Research Vite+/CI i próby lokalne

- **Źródła:** dokumentacja Vite+ (browser mode Vitest z `vite-plus/test/browser-playwright`), README setup-vp (`sfw`, `cache-toolchain`), Cloudflare (Workers Static Assets jako kierunek zamiast Pages), Bun catalogs (obsługa przez Renovate/Dependabot niepotwierdzona).
- **Próba lint (cofnięta):** pluginy `import`, `promise`, `jsx-a11y`, `vitest` + kategorie `correctness: error`, `suspicious: warn`, `perf: warn` + `import/no-cycle` → 0 błędów, 10 ostrzeżeń: 9× `react/react-in-jsx-scope` (reguła nieaktualna dla nowego JSX transform), 1× `import/no-unassigned-import` (import CSS).
- **Próba TS (cofnięta):** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` w `apps/web/tsconfig.app.json` → `vp check` bez błędów.
- **Komendy:** `vp check` (z próbną konfiguracją i po przywróceniu), `vp exec supabase db advisors --help`, `vp exec supabase db lint --help`; drzewo robocze po próbach czyste.

### Krok 5. Dokument i wnioski

- **Co zrobiono:** `docs/engineering-standards.md` (ocena stacku, standardy procesu i bezpieczeństwa, coding standards, wzorce frontendu i bazy, 16 propozycji P-01–P-16 z terminami i informacją o ADR, źródła); wnioski `2026-10-19-supabase-local-api-exposure.md` i `2026-10-19-oxlint-categories-react-rules.md` dopisane do indeksu.
- **Komendy:** `vp check --fix`, `vp run check:ai`.

## Decyzje i założenia

- Wynikiem jest dokument w `docs/` (standardy projektu) z listą propozycji; propozycje architektoniczne (nowe biblioteki, zmiana wzorca) wymagają ADR i akceptacji – nie są wdrażane w tym przebiegu.

## Problemy

## Status końcowy

`completed` – dokument propozycji gotowy do przeglądu; żadna propozycja nie została wdrożona (konfiguracja i kod bez zmian po próbach lokalnych).

## Następne kroki

- Przegląd `docs/engineering-standards.md` przez użytkownika i decyzja o propozycjach.
- Po akceptacji: mały PR z P-01 (config), P-04 (advisors), P-05, P-06, P-12 (`sfw`), aktualizacja specyfikacji S-01 o P-01, P-02, P-03, P-07, przeniesienie krótkich reguł do `AGENTS.md`; ADR dla P-08 (Zod v4).
