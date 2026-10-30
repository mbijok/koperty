---
title: Statystyki zmian licz bez ruszania indeksu, a liczby w logu przepisuj z wyniku komendy
created: 2026-10-31
area: Proces
---

# Statystyki zmian licz bez ruszania indeksu, a liczby w logu przepisuj z wyniku komendy

## Kontekst

T-03 (design system): raport o skali zmian dla właściciela i liczby stories, testów i stron w logu przebiegu po każdej partii.

## Co się stało

- Do policzenia zmian razem z nieśledzonymi plikami użyto `git add -N .`, a potem `git reset`. Reset zdjął z indeksu przygotowane wcześniej usunięcia w `apps/web` i przeniesienie `components.json`; indeks trzeba było odtwarzać ręcznie (`git rm --cached`, `git update-index --cacheinfo`).
- Dwa razy liczba zapisana w logu była zła i wymagała korekty (166 zamiast 158 stories, 50 zamiast 45 ekranów): zapisano ją z pamięci albo z wcześniejszego wyniku, a nie z komendy uruchomionej w tym kroku.

## Przyczyna

`git reset` bez ścieżek przywraca cały indeks do `HEAD`, łącznie ze zmianami przygotowanymi przez kogoś wcześniej. Liczby w logu powstawały przed sprawdzeniem, a nie z wyniku.

## Wniosek

Statystyki zmian licz komendami tylko do odczytu; liczby do logu i raportu przepisuj z wyniku komendy uruchomionej w tym samym kroku.

## Jak go stosować

- Śledzone: `git diff --stat HEAD`; nieśledzone: `git ls-files --others --exclude-standard` (z `wc -l` dla linii). Nie używaj `git add -N` ani `git reset` do liczenia.
- Liczbę stories bierz z `index.json` zbudowanego Storybooka, testów z wyniku `vp test`, stron z listy wpisów `docs` – w tym samym kroku, w którym ją zapisujesz.

## Powiązania

- Log przebiegu: .ai/runs/2026-10-29-design-system-storybook.md (kroki 9, 13, 14, 19)
