---
title: Poprawki z przeglądu PR #21
started: 2026-10-24
spec: brak – dokumentacja procesu, konfiguracja bramki walidacji i CI, bez zmiany zachowania aplikacji
status: completed
---

# Poprawki z przeglądu PR #21

## Cel

Naprawić uwagi minor i nit z przeglądu `om-code-review` scalonego PR #21 (konfiguracja pipeline'u `om-*`, ADR 0010), na prośbę użytkownika. PR otwiera użytkownik.

## Plan

1. Słowo zamykające zgłoszenie: `Closes #<numer>` zamiast „Zamyka #<numer>” w szablonie PR, `docs/prompts/feature-workflow.md` i `docs/backlog.md`.
2. Bramka walidacji: `vp exec supabase db reset` po `db start` w `.ai/agentic.config.json` i w CI.
3. Domknięcie logu `.ai/runs/2026-10-24-agent-pipeline-setup.md` (dopisanie sekcji).
4. Nit: odwołanie do backlogu w `docs/engineering-standards.md`.
5. Wnioski w `.ai/lessons/`.
6. Weryfikacja i commit na gałęzi `chore/pr21-review-fixes` (bez push).

## Przebieg kroków

### Krok 1. Gałąź i log

- **Co zrobiono:** gałąź `chore/pr21-review-fixes` od `73b698c` (`origin/master`), ten log.
- **Komendy:**
  ```bash
  git switch -c chore/pr21-review-fixes
  ```
- **Wynik:** sukces.

### Krok 2. Słowo zamykające zgłoszenie

- **Co zrobiono:** `Closes #<numer>` w `.github/pull_request_template.md`, `docs/prompts/feature-workflow.md`, `docs/backlog.md`.
- **Wynik:** sukces.

### Krok 3. `db reset` w bramce walidacji

- **Co zrobiono:** `vp exec supabase db reset` po `db start` w `.ai/agentic.config.json`, `.github/workflows/ci.yml` (nowy krok „Reset local database”), w liście bramki w `SDLC.md` i w tabeli bramek w `docs/engineering-standards.md` (`SDLC.md` wymaga zmiany listy w obu miejscach jednocześnie).
- **Wynik:** sukces.

### Krok 4. Domknięcie starego logu i nit

- **Co zrobiono:** dopisana sekcja zamykająca w `.ai/runs/2026-10-24-agent-pipeline-setup.md`; w `docs/engineering-standards.md` (wiersz o gałęziach) odwołanie do backlogu w GitHub Issues.
- **Wynik:** sukces.

### Krok 5. Wnioski

- **Co zrobiono:** nowy `.ai/lessons/2026-10-24-github-close-keywords-english.md`; uzupełniony `.ai/lessons/2026-10-19-supabase-cli-local-setup.md` (`db start` nie odświeża działającej bazy); oba wpisy w `.ai/lessons.md`.
- **Wynik:** sukces.

### Krok 6. Weryfikacja

- **Komendy:**
  ```bash
  vp run check:ai
  vp check            # najpierw błąd formatowania tabeli w engineering-standards.md, poprawione przez vp check --fix
  vp test --coverage
  vp build
  vp exec supabase test db
  vp exec supabase db advisors --local --type all --fail-on warn
  ```
- **Wynik:** wszystko przechodzi (15/15 testów, 100% pokrycia; pgTAP 3/3; doradcy bez uwag). `db reset` nieuruchomiony lokalnie: wyczyściłby wspólną bazę głównej kopii, a zmiana nie dotyka `supabase/`. Nowy krok CI zweryfikuje się w PR.

## Decyzje i założenia

- `Closes #<numer>` (angielskie słowo kluczowe GitHub) zamiast polskiego: tylko ono zamyka zgłoszenie przy scaleniu. To znacznik maszynowy, więc nie tłumaczymy go (`.ai/skills/project-rules.md`). `closeKeywords` w konfiguracji zostają dla starszych opisów PR.
- `db reset` dodany także w CI, żeby bramka lokalna i CI były tą samą listą komend (`CODE_REVIEW.md`); na świeżej bazie w CI to tylko ponowne zastosowanie migracji i seed.
- Propozycja z przeglądu (jawne zwolnienie zmian narzędzi i procesu z ADR ze specyfikacji w `AGENTS.md`) jest poza zakresem: to zmiana zasad projektu do decyzji użytkownika.

## Problemy

- `vp check` zgłosił formatowanie tabeli po wydłużeniu wiersza „CI – baza”; poprawione przez `vp check --fix`.

## Status końcowy

completed – poprawki zacommitowane lokalnie na `chore/pr21-review-fixes`, bez push; PR otwiera użytkownik.

## Następne kroki

- Push i PR (użytkownik); sprawdzić w CI nowy krok „Reset local database”.
- Decyzja użytkownika: czy dopisać w `AGENTS.md` zwolnienie ze specyfikacji dla zmian narzędzi i procesu z zaakceptowanym ADR.

## Uzupełnienie 2026-10-24: push i PR

- **Co zrobiono:** na prośbę użytkownika (`/om-open-pr`, potwierdzenie gałęzi w sesji) wypchnięto `chore/pr21-review-fixes` i otwarto gotowy PR #23 do `master`. Etykiety: `review`, `documentation`, `skip-qa`, `priority-low`, `risk-low`, z jednym komentarzem uzasadniającym.
- **Komendy:**
  ```bash
  git push -u origin chore/pr21-review-fixes
  gh pr create --base master --title "chore: address review findings from pr 21" --body-file <plik>
  ```
- **Wynik:** sukces; https://github.com/mbijok/koperty/pull/23. Status końcowy bez zmian (completed); do sprawdzenia: krok CI „Reset local database”.

## Uzupełnienie 2026-10-24: przegląd PR #23 (`om-auto-review-pr`)

- **Co zrobiono:** przejęcie PR (przypisanie, `in-progress`, komentarz), pełna bramka walidacji na `c6535fe` — 8/8 PASS, w tym `db reset` za zgodą użytkownika w sesji. Werdykt: approve z jedną uwagą minor (`db reset` w bramce kasuje lokalne dane wspólnej bazy; dopisać to w `SDLC.md`). GitHub odrzucił samozatwierdzenie, więc recenzja ma typ komentarz. Etykiety: `merge-queue`, `documentation`, `skip-qa`, `priority-low`, `risk-low`; blokada zwolniona.
- **CI:** 3/3 kontrole i 2/2 przebiegi workflow na `c6535fe` zielone, krok „Reset local database” wykonany w CI.
- **Status końcowy:** completed; scalenie tylko na prośbę użytkownika.
