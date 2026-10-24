---
title: Supabase CLI uruchamiaj przez vp exec; pgTAP jest preinstalowany, a katalog migracji nie potrzebuje .gitkeep
created: 2026-10-19
area: Baza i Supabase
---

# Supabase CLI uruchamiaj przez vp exec; pgTAP jest preinstalowany, a katalog migracji nie potrzebuje .gitkeep

## Kontekst

Faza 0, etap 5: Supabase CLI jako zależność deweloperska (`vp add -D supabase`), `supabase init`, pierwszy test pgTAP.

## Co się stało

- `supabase init` wpisał do `config.toml` `project_id` z nazwy katalogu (nazwa worktree), a `site_url` na port 3000 zamiast portu Vite (5173).
- `.gitkeep` w `supabase/migrations` powodował ostrzeżenie „Skipping migration .gitkeep” przy każdym starcie i resecie.
- `create extension pgtap` w teście dawał NOTICE „already exists” – obraz Supabase ma pgTAP zainstalowany.
- `supabase status` uruchomiony bez terminala wypisuje JSON (klucze `API_URL`, `PUBLISHABLE_KEY`), a nie tabelę.
- Pakiet `supabase` zainstalowany przez Bun działał od razu (bez `vp pm approve-builds`).
- 2026-10-24 (przegląd PR #21): `vp exec supabase db start` na już działającej bazie kończy się `already-running` i nie stosuje nowych migracji. Wszystkie worktree mają wspólne `project_id = "koperty"`, więc `test db` i `db advisors` w worktree sprawdzały schemat z głównej kopii.

## Przyczyna

Domyślne wartości CLI zakładają inny układ projektu; środowisko testowe Supabase dostarcza pgTAP. `db start` tylko uruchamia kontenery; migracje i seed stosuje wyłącznie przy pierwszym starcie albo przez `db reset`.

## Wniosek

Komendy Supabase uruchamiaj jako `vp exec supabase <komenda>` z katalogu głównego. Nie twórz `.gitkeep` w `supabase/migrations` i nie instaluj pgTAP w testach. Przed `test db` i `db advisors` wykonaj `db reset`, bo `db start` nie odświeża działającej bazy.

## Jak go stosować

- `project_id = "koperty"`, `site_url` i `additional_redirect_urls` wskazują na adresy aplikacji (lokalnie port 5173).
- Bramka walidacji (`.ai/agentic.config.json`, CI): `db start`, potem `db reset`, dopiero potem `test db` i `db advisors`. Reset czyści lokalne dane deweloperskie.
- Testy pgTAP: `begin; select plan(n); ... select * from finish(); rollback;` w `supabase/tests/*.test.sql`.
- Wartości lokalne do `apps/web/.env.local` bierz z `vp exec supabase status` (`API_URL`, `PUBLISHABLE_KEY`); nigdy nie kopiuj `SECRET_KEY` / `SERVICE_ROLE_KEY` do frontendu ani repozytorium.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 5 fazy 0
