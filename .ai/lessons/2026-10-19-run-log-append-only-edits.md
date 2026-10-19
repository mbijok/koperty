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

## Jak go stosować

- Przy zmianach wieloplikowych (`sed`, skrypty) wykluczaj `.ai/runs/` albo wskazuj pliki jawnie.
- Przed commitem sprawdź `git diff .ai/runs/` – powinny być wyłącznie dodane linie.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: brak (zmiana cofnięta przed commitem)
