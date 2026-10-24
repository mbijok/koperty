---
title: Nie zostawiaj w repozytorium znaczników z wtyczek i trybów narzędzi
created: 2026-10-24
area: Proces
---

# Nie zostawiaj w repozytorium znaczników z wtyczek i trybów narzędzi

## Kontekst

Przegląd spójności setupu projektu (2026-10-24).

## Co się stało

W `apps/web/src/lib/supabase.ts` był komentarz `// ponytail: ...`. Ten prefiks pochodzi z wtyczki Claude Code, która każe nim oznaczać celowe uproszczenia. Projekt nie ma takiej konwencji, a inni agenci (Codex, Cursor) ani ludzie nie wiedzą, co ten znacznik oznacza.

## Przyczyna

Wtyczka lub tryb pracy jednego narzędzia (prywatna konfiguracja użytkownika) narzucił swoją konwencję w kodzie wspólnym dla wszystkich agentów.

## Wniosek

Konwencje w kodzie wynikają wyłącznie z AGENTS.md i `docs/engineering-standards.md`, nie z wtyczek, skilli ani trybów narzędzia.

## Jak go stosować

- Gdy wtyczka lub skill każe dodać znacznik w kodzie (`ponytail:`, `AI:` itp.), napisz zwykły komentarz po angielsku, który wyjaśnia powód i wskazuje zadanie, np. `// Untyped until the first migration; ... (S-01).`.
- Odroczone prace zapisuj w specyfikacji lub backlogu, a nie w znacznikach do późniejszego wyszukiwania.

## Powiązania

- Specyfikacja: brak
- Log przebiegu: .ai/runs/2026-10-24-setup-consistency-fixes.md
- Commit: chore/setup-consistency
