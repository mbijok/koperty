---
title: Skille w repozytorium formatuj przez vp check --fix i sprawdzaj lint po formatowaniu
created: 2026-10-24
area: Vite+
---

# Skille w repozytorium formatuj przez vp check --fix i sprawdzaj lint po formatowaniu

## Kontekst

Konfiguracja pipeline'u `om-*` (ADR 0010): kolekcja skilli trafiła do repozytorium w `.agents/skills/` z dowiązaniami w `.claude/skills/`.

## Co się stało

`vp check` zgłosił błędy formatowania w 240 plikach Markdown skilli. Dopiero po `vp check --fix` pojawił się błąd lintu (nieużywany import w `om-share-this-session/scripts/prepare-share-bundle.mjs`) i ostrzeżenia, każde podwójnie: lint przechodzi także przez dowiązania w `.claude/skills/`. Wcześniejsze `vp check --fix` przeformatowało też skopiowane deskryptory w `.ai/trackers/`.

## Przyczyna

Oxfmt formatuje także Markdown w całym repozytorium, a `vp check` przy błędach formatowania nie pokazuje wyników lintu. Skille z zewnętrznej kolekcji nie są pisane pod Oxfmt i Oxlint projektu.

## Wniosek

Po dodaniu lub aktualizacji skilli uruchom `vp check --fix`, a potem ponownie `vp check`, i popraw uwagi lintu bez zmiany zachowania skryptów.

## Jak go stosować

- Po `skills add` / aktualizacji: `vp check --fix`, `vp check`; poprawki lintu sprawdź, uruchamiając skrypt przed i po zmianie.
- Lokalne poprawki skilli (lista w logu przebiegu) przenoś ręcznie przy każdej aktualizacji kolekcji.
- Nie licz zgłoszeń lintu podwójnie: ta sama uwaga dla `.agents/skills/` i `.claude/skills/` to jeden plik.

## Powiązania

- Specyfikacja: brak (konfiguracja narzędzi, ADR 0010)
- Log przebiegu: .ai/runs/2026-10-24-agent-pipeline-setup.md
- Commit: brak
