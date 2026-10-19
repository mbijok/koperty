---
title: Wdrożenie propozycji „teraz” ze standardów inżynieryjnych
started: 2026-10-19
spec: docs/engineering-standards.md (sekcja 5) – propozycje P-01, P-02, P-04, P-05, P-06, P-12 (sfw) zaakceptowane przez użytkownika w rozmowie; zmiany narzędziowe i dokumentacyjne bez zmian w zachowaniu aplikacji
status: completed
---

# Wdrożenie propozycji „teraz” ze standardów inżynieryjnych

## Cel

Wdrożyć w PR #1 (gałąź `chore/project-bootstrap`) zaakceptowane propozycje: P-01 (uprawnienia jawne – konfiguracja i dokumentacja), P-02 (kody błędów `PTxyz`), P-04 (doradcy Supabase w CI), P-05 (ostrzejszy lint), P-06 (flagi TS), P-12 (`sfw` w setup-vp) oraz zaktualizować specyfikację S-01 o P-01, P-02, P-03 i P-07.

## Plan

1. P-05 i P-06: konfiguracja lintu i TS, `vp check`.
2. P-01 (`auto_expose_new_tables = false`), P-04 (advisors w CI, sprawdzone lokalnie), P-12 (`sfw: true`).
3. Dokumentacja: architektura (sekcje 3–4, katalog kodów błędów), ADR 0003, AGENTS.md.
4. Specyfikacja S-01 (status pozostaje `draft`).
5. Weryfikacja (`vp check`, `vp test`, `vp build`, `supabase db reset`, `supabase test db`, advisors, `check:ai`, walidacja workflow), status propozycji w standardach, commit i push do PR #1.

## Przebieg kroków

### Krok 1. Start

- **Co zrobiono:** założono log; drzewo czyste na `a646b7e`.

### Krok 2. P-05 i P-06

- **Co zrobiono:** główny `vite.config.ts`: pluginy `typescript`, `unicorn`, `oxc`, `import`, `promise`, `jsx-a11y`, `vitest`; kategorie `correctness: error`, `suspicious: warn`, `perf: warn`; `import/no-cycle: error`; `import/no-unassigned-import` z wyjątkiem `**/*.css`; `react/react-in-jsx-scope: off`. `tsconfig.app.json` i `tsconfig.node.json`: `noUncheckedIndexedAccess`, `noImplicitOverride`.
- **Komendy:** `vp check` → 0 błędów, 0 ostrzeżeń; próba z plikiem `<img>` bez `alt` → `jsx-a11y(alt-text)` błąd (plik usunięty).

### Krok 3. P-01 (config), P-04, P-12

- **Co zrobiono:** `auto_expose_new_tables = false` w `supabase/config.toml`; w `ci.yml` `sfw: true` w obu krokach setup-vp i krok `supabase db advisors --local --type all --fail-on warn` w zadaniu bazy.
- **Komendy:** `orb start` (Docker był wyłączony); `supabase db start`, `test db` (PASS), `db advisors` (No issues found, exit 0); walidacja workflow (exit 0).
- **Ustalenie:** po `db reset` nowa tabela nie ma `select` dla `anon`/`authenticated` (config działa), ale nowa funkcja nadal ma `EXECUTE` dla `anon`; `alter default privileges in schema public revoke execute on functions from public, anon, authenticated` tego nie zmienia, działa dopiero globalne `alter default privileges revoke execute on functions from public` (próby w transakcji z `rollback`). Uwzględnione w specyfikacji S-01, architekturze, ADR 0003, AGENTS.md i wniosku.

### Krok 4. Dokumentacja

- **Co zrobiono:** `docs/architecture.md` (uprawnienia jawne, sekcja „Kontrakt błędów” z katalogiem kodów `PTxyz`, niezmienniki i helpery testów), uzupełnienie ADR 0003, dwie reguły w AGENTS.md (kody błędów, uprawnienia jawne), statusy propozycji w `docs/engineering-standards.md`.

### Krok 5. Specyfikacja S-01

- **Co zrobiono:** P-01 (globalne `alter default privileges`, `grant select` / `grant execute` tylko dla `authenticated`), P-02 (`PT401`, `PT400`), P-03 (helpery `tests.*`, plik niezmienników), P-07 (wzorzec Router + Query, `features/*/api.ts`), kontrola typów w CI; status pozostaje `draft`.

### Krok 6. Weryfikacja

- **Komendy:** `vp check` (pass), `vp test` (7/7), `vp build` (pass), `supabase db reset` (pass), `supabase test db` (PASS), `supabase db advisors --local --type all --fail-on warn` (No issues found), `vp run check:ai` (pass), walidacja `ci.yml` (exit 0).

## Decyzje i założenia

- Push do PR #1 na wyraźną prośbę użytkownika („wdroż je w tym PR”).

## Problemy

- Docker (OrbStack) był wyłączony – uruchomiony `orb start`.
- Ochrona `master` niedostępna w planie GitHub Free dla repozytorium prywatnego (API: „Upgrade to GitHub Pro or make this repository public”).

## Status końcowy

`completed` – wszystkie zaakceptowane propozycje wdrożone i zweryfikowane lokalnie; CI na GitHubie po pushu.

## Następne kroki

- Przegląd i zatwierdzenie specyfikacji S-01, przegląd sekcji 3–4 standardów i pozostałych propozycji.
- Decyzja właściciela: GitHub Pro / repozytorium publiczne dla ochrony `master`; ustawienia scalania (tylko squash, usuwanie gałęzi).
