---
title: Na starcie sesji w worktree powiedz, gdzie trafiają zmiany i jak dotrą do master
created: 2026-10-19
area: Proces
---

# Na starcie sesji w worktree powiedz, gdzie trafiają zmiany i jak dotrą do master

## Kontekst

Faza 0: sesja Claude Code w aplikacji desktopowej działała w worktree `.claude/worktrees/<nazwa>` na osobnej gałęzi, a plik `00-bootstrap.md` leżał w głównej kopii repozytorium.

## Co się stało

Po etapie 5 użytkownik zapytał, dlaczego zmiany są w `.claude`, a nie w głównym katalogu, i czy to nie było przyczyną problemów z aliasami. Nie było (przyczyną była konfiguracja monorepo Vite+), ale lokalizacja pracy nie została wyjaśniona na początku. Worktree miał też skutki uboczne: `supabase init` wziął `project_id` z nazwy katalogu worktree, a `core.hooksPath` ustawiony przez `vp config` jest wspólny dla wszystkich kopii repozytorium.

## Przyczyna

Agent założył, że użytkownik zna mechanikę worktree i to, że główna kopia (`master`) nie widzi zmian do czasu scalenia.

## Wniosek

Gdy sesja działa w worktree, w pierwszym podsumowaniu podaj ścieżkę, gałąź i sposób przeniesienia zmian (scalenie lub PR), a narzędzia wyprowadzające nazwy z katalogu (np. `supabase init`) sprawdzaj pod kątem nazwy worktree.

## Jak go stosować

- Pierwsze podsumowanie sesji: „pracuję w `<ścieżka>` na gałęzi `<gałąź>`; zmiany trafią do `master` po scaleniu lub PR”.
- Po komendach generujących konfigurację przejrzyj wartości zależne od nazwy katalogu.
- Pliki wejściowe z głównej kopii (np. prompty) przenoś do repozytorium w worktree, zanim zaczniesz pracę.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: brak (wniosek procesowy)
