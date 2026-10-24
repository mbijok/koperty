---
title: Konfiguracja pipeline'u agentów om-*
started: 2026-10-24
spec: brak – konfiguracja narzędzi i dokumentacja procesu, bez zmiany zachowania aplikacji
status: completed
---

# Konfiguracja pipeline'u agentów om-\*

## Cel

Uruchomienie skilla `om-setup-agent-pipeline`: zapis `.ai/agentic.config.json`, instalacja deskryptorów trackera i przeglądarki, etykiety w GitHub, brakujące dokumenty procesu.

## Plan

1. Wykrycie gałęzi bazowej, trackera i komend walidacji.
2. Decyzje użytkownika (walidacja, ścieżka planów, etykiety i QA, dokumenty).
3. Deskryptory, etykiety, dokumenty, konfiguracja.
4. Weryfikacja (`vp check`, `vp run check:ai`) i kontrola pokrycia skilli.

## Przebieg kroków

### Krok 1. Wykrycie

- **Co zrobiono:** gałąź bazowa `master` (`origin/HEAD`), tracker GitHub (`gh` zalogowany), komendy z `.github/workflows/ci.yml`, opisy PR po polsku.
- **Wynik:** `AGENTS.md` i `CLAUDE.md` istnieją – nie generowano ich.

### Krok 2. Decyzje użytkownika

- Walidacja: web + baza jak w CI (z doradcami bazy).
- `paths.runs`: `.ai/pipeline-runs`, bo pliki i katalogi planów pipeline'u nie spełniają reguł `check:ai` dla `.ai/runs`.
- Pełna taksonomia etykiet i bramka QA.
- Dokumenty: `SDLC.md`, `CODE_REVIEW.md`, `BACKWARD_COMPATIBILITY.md`.

### Krok 3. Instalacja

- **Co zrobiono:** skopiowano `.ai/trackers/github.md` i `.ai/browsers/agent-browser.md`; utworzono 25 etykiet (`bug` i `documentation` już istniały); wygenerowano `SDLC.md` z szablonu (po angielsku, jak szablon), `CODE_REVIEW.md` i `BACKWARD_COMPATIBILITY.md` (po polsku, wyprowadzone z `AGENTS.md`, `docs/architecture.md` i `docs/engineering-standards.md`); zapisano konfigurację z `closeKeywords` po polsku; dopisano artefakty QA do `.gitignore`.
- **Komendy:**
  ```bash
  gh label create <nazwa> --color <kolor> --description <opis>
  ```
- **Wynik:** sukces.

### Krok 4. Weryfikacja

- **Komendy:**
  ```bash
  vp check --fix
  vp run check:ai
  ```
- **Wynik:** opisany w podsumowaniu sesji i w commicie.

## Decyzje i założenia

- Wpis w „Otwarte decyzje” w `AGENTS.md`: przyjęcie pipeline'u wymaga ADR i pogodzenia z zakazem push/scalania; do decyzji użytkownika.
- Dostawca przeglądarki `agent-browser` (domyślny skilla) – do potwierdzenia w ADR.

## Problemy

- Hook bezpieczeństwa zgłosił „prompt injection” w dokumentacji skilla – fałszywy alarm (cytat przykładu, nic nie wykonano).

## Status końcowy

completed – konfiguracja zapisana, nic nie zostało zacommitowane bez zgody użytkownika.

## Następne kroki

- ADR dla pipeline'u `om-*` i rozstrzygnięcie wpisu w „Otwarte decyzje”.
- Commit zmian po akceptacji.

## Uzupełnienie 2026-10-24: zmiana dostawcy przeglądarki

- **Co zrobiono:** na prośbę użytkownika zamieniono `agent-browser` na `playwright`: `browser.provider` w konfiguracji, deskryptor `.ai/browsers/playwright.md` zamiast `agent-browser.md`, sekcja „Repository specifics” w deskryptorze (zgoda przed instalacją, `vp add -D` / `vp exec`, bez `npm`/`npx`, wspólna konfiguracja z przyszłymi testami E2E); zaktualizowano wpis w „Otwarte decyzje” w `AGENTS.md`.
- **Powód:** Playwright jest już zaplanowany do E2E (`docs/engineering-standards.md`, 4.8), więc stack nie zyskuje nowego narzędzia.
- **Komendy:**
  ```bash
  vp check --fix
  vp run check:ai
  ```

## Uzupełnienie 2026-10-24: skille w repozytorium

- **Co zrobiono:** skille zainstalowane na `master` (nieśledzone `.agents/skills`, dowiązania `.claude/skills`, `skills-lock.json`) skopiowano do worktree i usunięto z głównego katalogu na prośbę użytkownika. Skille i deskryptory sformatowano przez `vp check --fix` (decyzja użytkownika: formatowanie ważniejsze niż czyste diffy przy aktualizacjach skilli). W `om-share-this-session/scripts/prepare-share-bundle.mjs` poprawiono uwagi lintu bez zmiany zachowania: usunięty nieużywany import `tmpdir`, `sort` → `toSorted`, `return fail(...)` w `catch`.
- **Komendy:**
  ```bash
  vp check --fix
  vp check
  vp run check:ai
  vp test --coverage
  ```
- **Wynik:** wszystko przechodzi; kontrola pokrycia skilli `SKILL_COVERAGE_OK` (58/58).

## Uzupełnienie 2026-10-24: wdrożenie ADR 0010 (punkty 1–6)

- **Co zrobiono:**
  - [ADR 0010](../../docs/adr/0010-agent-pipeline-under-project-rules.md) (zaakceptowany przez użytkownika w rozmowie): skille `om-*` podporządkowane `AGENTS.md`.
  - `.ai/skills/project-rules.md` i lokalne rozszerzenie `.ai/skills/<skill>/SKILL.md` dla wszystkich 58 skilli (specyfikacja `approved` przed implementacją, push i PR po potwierdzeniu, scalanie na wyraźną prośbę, log w `.ai/runs/`, komunikacja po polsku).
  - `AGENTS.md`: sekcje „Dokumenty procesu” i „Skille `om-*`”, backlog w Issues, opis katalogu `.ai/`, „Otwarte decyzje” znów puste.
  - `docs/prompts/feature-workflow.md`, `.github/pull_request_template.md`, `.ai/specs/_template.md` (pole `issue`), `README.md`; `CODE_REVIEW.md` skrócony do odesłań do standardów.
  - Backlog: 17 niezrealizowanych zadań jako zgłoszenia #3–#19 (`feature` dla S-xx) i zgłoszenie zbiorcze #20 „Backlog MVP” (`do-not-close`); `docs/backlog.md` zawiera zasady i tabelę z odnośnikami; specyfikacja S-01 dostała `issue: 3`.
  - Wnioski: nowy `.ai/lessons/2026-10-24-vendored-skills-vp-check.md`, uzupełniony wniosek o worktree.
- **Komendy:**
  ```bash
  gh issue create -R mbijok/koperty ...   # 18 zgłoszeń, skrypt z próbnym przebiegiem przed utworzeniem
  vp check --fix && vp check
  vp run check:ai
  vp test --coverage
  vp build
  ```
- **Wynik:** wszystko przechodzi. Nic nie jest zacommitowane.

## Uzupełnienie 2026-10-24: SDLC.md po polsku

- **Co zrobiono:** przetłumaczono `SDLC.md` na polski. Nazwy etykiet, skilli i znaczniki maszynowe (`QA head: <sha>`, `PR: #<number> (link: <url>)`) bez zmian. Przy okazji dopasowano treść do ADR 0010 i projektu: push, PR i scalanie po potwierdzeniu, specyfikacja `approved` przed implementacją, backlog w „Backlog MVP”, bramka `risk-high` dla migracji bez wersji „w dół” (świeża baza + pgTAP + plan wycofania), przykłady izolacji danych i pieniędzy z domeny.
- **Komendy:**
  ```bash
  vp check --fix && vp check
  vp run check:ai
  ```
