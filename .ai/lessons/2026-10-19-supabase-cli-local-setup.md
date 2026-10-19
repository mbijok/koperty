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

## Przyczyna

Domyślne wartości CLI zakładają inny układ projektu; środowisko testowe Supabase dostarcza pgTAP.

## Wniosek

Komendy Supabase uruchamiaj jako `vp exec supabase <komenda>` z katalogu głównego. Nie twórz `.gitkeep` w `supabase/migrations` i nie instaluj pgTAP w testach.

## Jak go stosować

- `project_id = "koperty"`, `site_url` i `additional_redirect_urls` wskazują na adresy aplikacji (lokalnie port 5173).
- Testy pgTAP: `begin; select plan(n); ... select * from finish(); rollback;` w `supabase/tests/*.test.sql`.
- Wartości lokalne do `apps/web/.env.local` bierz z `vp exec supabase status` (`API_URL`, `PUBLISHABLE_KEY`); nigdy nie kopiuj `SECRET_KEY` / `SERVICE_ROLE_KEY` do frontendu ani repozytorium.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 5 fazy 0
