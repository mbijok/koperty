# ADR 0010: Pipeline agentów `om-*` podporządkowany zasadom projektu

- **Status:** zaakceptowany
- **Data:** 2026-10-24

## Kontekst

Do repozytorium dodano kolekcję skilli `om-*` (źródło `open-mercato/skills`, wersje w `skills-lock.json`). Automatyzuje ona cykl od zgłoszenia do scalenia: zgłoszenia w GitHub Issues, specyfikacje, implementację w PR, przegląd, QA w przeglądarce, etykiety procesu i scalanie. Konfigurację zapisuje `.ai/agentic.config.json`, a proces opisują `SDLC.md`, `CODE_REVIEW.md` i `BACKWARD_COMPATIBILITY.md`.

Domyślne zachowanie skilli koliduje z procesem z [ADR 0006](0006-spec-driven-development-ai-memory.md) i z `AGENTS.md`:

- skille same wypychają gałęzie i scalają PR-y, a `AGENTS.md` zabrania push i scalania bez wyraźnej prośby,
- skille potrafią napisać specyfikację i od razu ją zaimplementować, a status `approved` nadaje wyłącznie człowiek,
- skille prowadzą backlog w zgłoszeniach, a projekt w `docs/backlog.md`,
- skille zapisują plany przebiegów w formacie niezgodnym z kontrolą `.ai/runs/` (`scripts/check-ai.ts`),
- nowe dokumenty procesu nie miały ustalonego miejsca w hierarchii zasad.

Rozważane warianty: pełne przyjęcie pipeline'u ze zmianą zasad projektu, przyjęcie z zasadami projektu jako nadrzędnymi oraz rezygnacja. Wybrano wariant drugi z backlogiem przeniesionym do zgłoszeń.

## Decyzja

- Używamy skilli `om-*` jako narzędzi wspierających proces z ADR 0006, nie jako jego zamiennika. Zasady z `AGENTS.md` są nadrzędne wobec każdego skilla.
- Zasady projektu dla skilli są zapisane w `.ai/skills/project-rules.md`. Każdy zainstalowany skill ma lokalne rozszerzenie `.ai/skills/<skill>/SKILL.md`, które je importuje (mechanizm rozszerzeń kolekcji pozwala zaostrzać reguły, nie luzować).
- Implementacja startuje tylko od specyfikacji `approved` w `.ai/specs/`. Skille tworzą specyfikacje wyłącznie w statusie `draft`, według `.ai/specs/_template.md`.
- Push wymaga potwierdzenia użytkownika w sesji. Scalenie odbywa się tylko wtedy, gdy użytkownik sam wywoła `om-approve-merge-pr` dla konkretnego PR albo wprost o nie poprosi.
- Backlog prowadzimy w GitHub Issues (zadanie zbiorcze „Backlog MVP” z kolejnością realizacji). `docs/backlog.md` zawiera zasady backlogu i odsyłacz.
- Plany przebiegów pipeline'u leżą w `.ai/pipeline-runs/`, a obowiązkowe logi przebiegów w `.ai/runs/` (log linkuje do planu).
- Hierarchia dokumentów: `AGENTS.md` → `docs/engineering-standards.md` → `CODE_REVIEW.md`, `BACKWARD_COMPATIBILITY.md`, `SDLC.md` → instrukcje skilli.
- Skille są wersjonowane w repozytorium: `.agents/skills/` (czytane m.in. przez Codex), dowiązania w `.claude/skills/` (Claude Code) i `skills-lock.json`. Pliki skilli podlegają formatowaniu i lintowi projektu.
- QA w przeglądarce korzysta z Playwright (`.ai/browsers/playwright.md`), zgodnie ze stackiem; instalacja Playwright jako zależności wymaga zgody (zadanie T-01).

## Konsekwencje

**Pozytywne:**

- przegląd, QA, higiena zgłoszeń i kontrola gotowości specyfikacji są zautomatyzowane bez utraty kontroli człowieka nad zakresem, pushem i scalaniem,
- zgłoszenia, PR-y i etykiety dają jeden widok stanu prac,
- wszyscy agenci (Claude Code, Codex) widzą te same skille w tej samej wersji.

**Negatywne i ryzyka:**

- zasady w `.ai/skills/` są instrukcjami dla agenta, a nie twardą blokadą; twardym zabezpieczeniem pozostaje ochrona gałęzi `master`,
- pliki skilli są przeformatowane przez Oxfmt, więc aktualizacja kolekcji daje szum w diffie, a lokalne poprawki (np. lint skryptu `om-share-this-session`) trzeba przenosić ręcznie,
- nowy skill dodany do kolekcji wymaga własnego rozszerzenia w `.ai/skills/`.

**Wpływ na pracę agentów i kod:**

- `AGENTS.md`: sekcje „Dokumenty procesu”, „Skille `om-*`”, zmieniony opis backlogu i katalogu `.ai/`,
- `docs/prompts/feature-workflow.md`: praca zaczyna się od zgłoszenia; samokontrola według `CODE_REVIEW.md` i `BACKWARD_COMPATIBILITY.md`,
- `.github/pull_request_template.md`: zgłoszenie, zgodność wsteczna i etykiety,
- `.ai/specs/_template.md`: pole `issue`.
