---
title: W hookach i skryptach używaj vp run, bo lokalne CLI Vite+ nie ma vp node
created: 2026-10-19
area: Vite+
---

# W hookach i skryptach używaj vp run, bo lokalne CLI Vite+ nie ma vp node

## Kontekst

Faza 0, etap 6: hook `.vite-hooks/pre-commit` z `vp staged` i regułą uruchamiającą kontrolę `.ai/`.

## Co się stało

Reguła `staged` z komendą `vp node scripts/check-ai.ts` zakończyła się błędem `Command 'node' not found` w hooku, choć ta sama komenda działała w terminalu.

## Przyczyna

W terminalu działa globalne CLI `vp`, które ma `vp node` i `vp env`. Hook i skrypty `package.json` uruchamiają lokalne CLI z `node_modules/.bin`, które tych komend nie ma.

## Wniosek

Komendy, które mają działać w hookach, skryptach i CI, definiuj jako skrypty `package.json` i wywołuj przez `vp run <skrypt>` (np. `vp run check:ai`). Nie używaj `vp node` ani `vp env` poza interaktywną pracą w terminalu.

## Jak go stosować

- Reguła `staged` dla poleceń sprawdzających cały katalog ma formę funkcji (`".ai/**": () => "vp run check:ai"`), żeby lint-staged nie dopisywał ścieżek plików jako argumentów.
- Hook testuj negatywnie: zindeksuj celowo błędny plik i sprawdź, że `git commit` zostaje zablokowany z właściwego powodu.
- `vp config` ustawia `core.hooksPath` w konfiguracji repozytorium wspólnej dla wszystkich worktree; hook zaczyna działać w danej kopii, gdy ma ona katalog `.vite-hooks/`.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 6 fazy 0
