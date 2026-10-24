---
title: Poprawki spójności setupu projektu
started: 2026-10-24
spec: brak – zmiany narzędziowe, konfiguracyjne i dokumentacyjne bez wpływu na zachowanie aplikacji; zakres zaakceptowany przez użytkownika w rozmowie („popraw wszystko, w tym opcjonalne”)
status: completed
---

# Poprawki spójności setupu projektu

## Cel

Usunąć niespójności i elementy na wyrost znalezione w przeglądzie setupu (rozmowa z 2026-10-24) i przygotować PR z gałęzi `chore/setup-consistency`.

## Plan

1. Skrypty: usunąć zepsuty `ready` i zdublowany `dev` z głównego `package.json`; `build` aplikacji web bez `tsc -b`.
2. Główny `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`; poprawić błąd typów w `scripts/check-ai.ts`.
3. Komentarz `ponytail:` w `apps/web/src/lib/supabase.ts` zamienić na zwykły.
4. `docs/engineering-standards.md`: nieaktualny wiersz 3.2 i notatka o ochronie `master`; backlog tylko odsyła do DoD w AGENTS.md.
5. `.gitignore`: usunąć wpisy dla narzędzi spoza stacku i duplikaty.
6. Workspaces: usunąć nieistniejące `packages/*` (package.json, AGENTS.md, wniosek).
7. `supabase/config.toml`: wyłączyć nieużywane usługi (Realtime, Storage, Edge Runtime, Analytics).
8. Weryfikacja: `vp check`, `vp test --coverage`, `vp build`, `vp run check:ai`, `supabase start`, `db reset`, `test db`, advisors.
9. Wnioski, commit, push, PR.

## Przebieg kroków

### Krok 1. Start

- **Co zrobiono:** założono gałąź `chore/setup-consistency` od `2042228` (drzewo czyste) i ten log. Przed zmianami: `vp run check:ai`, `vp check`, `vp test --coverage` (100%), `vp build` – zielone; `vp run ready` – błąd `Task "test" not found`.

### Krok 2. Skrypty, tsconfig, check-ai

- **Co zrobiono:** usunięto `ready` i `dev` z głównego `package.json`; `build` aplikacji web to samo `vp build`; usunięto `tsBuildInfoFile` (potrzebne tylko `tsc -b`). Główny `tsconfig.json`: flagi jak w `apps/web` (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, `erasableSyntaxOnly` itd.) oraz `include: ["scripts", "vite.config.ts"]` – wcześniej bez `include` obejmował też `apps/web`. `scripts/check-ai.ts`: data z `name.slice(...)` po `FILE_NAME.test` zamiast nieużywanych grup przechwytujących. Komentarz `ponytail:` zamieniony na zwykły.
- **Komendy:** `vp check`; kontrolnie stara wersja `check-ai.ts` z nowym `tsconfig.json`; `tsc -p tsconfig.json`.
- **Wynik:** nowy kod zielony; stara wersja daje `TS2345` w `vp check`, czyli `strict` jest teraz egzekwowany dla `scripts/`.

### Krok 3. Dokumenty, .gitignore, workspaces

- **Co zrobiono:** `engineering-standards.md` – wiersz „CI – baza” w 3.2 opisuje stan faktyczny (doradcy już w CI, kontrola typów od S-01), notatka o ochronie `master` z PR #1 odsyła do PR #2. `backlog.md` tylko linkuje do DoD w AGENTS.md. Usunięto workspace `packages/*` (`package.json`, AGENTS.md, wniosek o `test.projects`). `.gitignore`: usunięto wpisy dla pnpm/yarn/npm-debug (pokrywa je `*.log`), Vercel, Netlify, PWA `dev-dist`, Playwright, `.nyc_output`, `dist-ssr`, `build`, `*.tsbuildinfo`, iOS i zdublowaną sekcję Supabase (pokrywają ją globalne wzorce `.env*` i `supabase/.gitignore`).
- **Komendy:** `git status --short --ignored`.
- **Wynik:** ignorowane nadal tylko `node_modules`, `dist`, `coverage`, `.claude/`.

### Krok 4. Supabase config i baza

- **Co zrobiono:** w `supabase/config.toml` wyłączono Realtime, Storage, Edge Runtime i Analytics (komentarze mówią, kiedy włączyć). Przy restarcie użyto `supabase stop --all`, co zatrzymało wszystkie lokalne projekty Supabase na maszynie.
- **Komendy:** `vp exec supabase start`, `db reset`, `test db`, `db advisors --local --type all --fail-on warn`, `curl /auth/v1/health`, `curl` Studio.
- **Wynik:** działają `db`, `auth`, `inbucket`, `kong`, `rest`, `pg_meta`, `studio`; reset OK; pgTAP 3/3 PASS; advisors „No issues found”; Auth 200, Studio 307.

### Krok 5. Bramki jakości

- **Komendy:** `vp check --fix`, `vp check`, `vp test --coverage`, `vp build`, `vp -C apps/web run build`, `vp install --frozen-lockfile`, `node scripts/check-ai.ts`.
- **Wynik:** wszystko zielone; pokrycie 100% (69/69, 51/51, 9/9, 62/62); `bun.lock` bez zmian po usunięciu `packages/*`; `vp check --fix` przeformatował tabelę w standardach.

### Krok 6. Wnioski

- **Co zrobiono:** rozszerzono wniosek `2026-10-19-vite-plus-app-template-fixes` (główny `tsconfig`, uruchamianie wygenerowanych skryptów); nowy wniosek `2026-10-24-no-tool-specific-markers`.

## Decyzje i założenia

- Bez specyfikacji: zmiany nie wpływają na zachowanie aplikacji (narzędzia, konfiguracja lokalna, dokumentacja); zakres zaakceptował użytkownik.
- Szablon PR zachowuje checklistę DoD (narzędzie przeglądu); deduplikacja objęła tylko backlog.
- Próg 100% pokrycia dla każdego pliku pozostaje (decyzja użytkownika z PR #2); tylko zasygnalizowano koszt.
- Gałąź `chore/setup-consistency` zgodnie z konwencją AGENTS.md (zamiast `claude/...` utworzonej przez worktree).

## Problemy

- `vp run check:ai --no-cache` przekazał flagę do skryptu jako katalog; użyto `node scripts/check-ai.ts`.

## Status końcowy

completed – wszystkie poprawki z przeglądu wdrożone i zweryfikowane lokalnie, łącznie z bazą.

## Następne kroki

- Przegląd i scalenie PR.
- S-14: włączyć `edge_runtime`; etap 3: `storage`.
