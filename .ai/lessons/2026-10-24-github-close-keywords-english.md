---
title: Zgłoszenie zamykaj w opisie PR angielskim „Closes #N”, nie polskim „Zamyka #N”
created: 2026-10-24
area: Proces
---

# Zgłoszenie zamykaj w opisie PR angielskim „Closes #N”, nie polskim „Zamyka #N”

## Kontekst

Przegląd scalonego PR #21 (pipeline `om-*`, ADR 0010), który przeniósł backlog do GitHub Issues.

## Co się stało

Szablon PR, `docs/backlog.md` i `docs/prompts/feature-workflow.md` kazały pisać „Zamyka #<numer>”, „żeby scalenie zamknęło zgłoszenie”. GitHub nie zamyka zgłoszenia po polskim słowie, więc zgłoszenia z backlogu zostałyby otwarte po scaleniu. Zamknąłby je dopiero ręcznie uruchomiony `om-close-fixed-issues` (dzięki `closeKeywords` w `.ai/agentic.config.json`).

## Przyczyna

GitHub rozpoznaje tylko angielskie słowa kluczowe (`close(s|d)`, `fix(es|ed)`, `resolve(s|d)`) przed `#N`; `closingIssuesReferences` też jest wyłącznie angielskie. Opis PR po polsku nie zmienia tego, że słowo kluczowe jest znacznikiem maszynowym.

## Wniosek

W opisie PR zamykaj zgłoszenie przez `Closes #<numer>`, także w polskim tekście. `closeKeywords` traktuj tylko jako zabezpieczenie dla `om-close-fixed-issues`.

## Jak go stosować

- Pole „Zgłoszenie” w `.github/pull_request_template.md`: `Closes #12` albo „nie dotyczy”.
- Odwołanie bez zamykania: samo `#12` albo link.
- Pisząc dokumentację procesu, nie tłumacz znaczników maszynowych (`Closes #N`, `PR: #N`, `QA head:`).

## Powiązania

- Specyfikacja: brak (dokumentacja procesu)
- Log przebiegu: .ai/runs/2026-10-24-pr21-review-fixes.md
- Commit: brak
