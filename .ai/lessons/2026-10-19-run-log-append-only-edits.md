---
title: Logi przebiegów edytuj wyłącznie przez dopisywanie, nigdy masowym zastępowaniem
created: 2026-10-19
area: Proces
---

# Logi przebiegów edytuj wyłącznie przez dopisywanie, nigdy masowym zastępowaniem

## Kontekst

Faza 0, etap 4: aktualizacja odwołań do US w kilku plikach jedną komendą `sed`.

## Co się stało

Komenda `sed` poprawiająca liczbę user stories objęła także `.ai/runs/2026-10-19-project-bootstrap.md` i zmieniła wcześniejszy wpis logu. Zmianę cofnięto (`git checkout` pliku logu) przed commitem.

## Przyczyna

Masowe zastępowanie tekstu w wielu plikach nie odróżnia dokumentów żywych (PRD, architektura) od historii (logi przebiegów).

## Wniosek

Logi w `.ai/runs/` zmieniaj wyłącznie przez dopisywanie nowych wpisów; korekty faktów zapisuj jako nowy wpis, a nie edycję starego.

Wyjątek (2026-10-31, przebieg T-03): nagłówek YAML, „Status końcowy” i „Następne kroki” opisują stan bieżący i je aktualizujesz – przy samym dopisywaniu „Następne kroki” zamieniły się w listę nieaktualnych pozycji, a nagłówek wskazywał zły status i starą ścieżkę specyfikacji.

## Jak go stosować

- Przy zmianach wieloplikowych (`sed`, skrypty) wykluczaj `.ai/runs/` albo wskazuj pliki jawnie.
- Przed commitem sprawdź `git diff .ai/runs/` – zmienione linie mogą być tylko w nagłówku, „Statusie końcowym” i „Następnych krokach”; w pozostałych sekcjach wyłącznie dodane.
- Status `completed` ustawiasz po scaleniu PR zamykającego przebieg; wcześniej `partial` z listą tego, co czeka.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: brak (zmiana cofnięta przed commitem)
- Doprecyzowanie: .ai/runs/2026-10-29-design-system-storybook.md (krok 19), AGENTS.md („Logi przebiegów”)
