# ADR 0006: Spec-driven development i katalog `.ai/` jako pamięć projektu

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Projekt jest wytwarzany z intensywnym udziałem agentów AI różnych narzędzi (Claude Code, Codex, Cursor). Agenci nie pamiętają poprzednich sesji, łatwo rozszerzają zakres i powtarzają te same błędy. Plan omówiony tylko w rozmowie przepada, a wbudowana pamięć narzędzi nie jest współdzielona ani wersjonowana.

## Decyzja

Stosujemy spec-driven development: każda funkcjonalność i zmiana nietrywialna zaczyna się od specyfikacji w `.ai/specs/`, a implementacja zaczyna się dopiero po nadaniu przez człowieka statusu `approved`. Katalog `.ai/` jest wspólną, wersjonowaną pamięcią projektu:

- `specs/` – specyfikacje z cyklem `draft` → `approved` → `in-progress` → `implemented` (lub `archived`),
- `runs/` – logi autonomicznych przebiegów, zakładane na początku i uzupełniane na bieżąco,
- `lessons.md` + `lessons/` – wnioski, czytane na początku każdej sesji.

Zasady są opisane w `AGENTS.md` (jedyne źródło zasad dla wszystkich agentów); pliki narzędzi (np. `CLAUDE.md`) tylko go importują.

## Konsekwencje

**Pozytywne:**

- decyzje i plany przetrwają między sesjami i narzędziami,
- człowiek kontroluje zakres przed implementacją,
- przerwany przebieg można wznowić z logu; błędy nie powtarzają się dzięki wnioskom.

**Negatywne i ryzyka:**

- narzut dokumentacyjny przy każdej zmianie,
- ryzyko rozjazdu specyfikacji z kodem, jeśli nie jest aktualizowana (łagodzone regułą „odejście od specyfikacji = powrót do `draft`”),
- `lessons.md` może się rozrosnąć (limit ~100 linii i konsolidacja).

**Wpływ na pracę agentów i kod:**

- format i nazewnictwo plików kontroluje skrypt uruchamiany w CI (etap 6 fazy 0),
- szablon PR zawiera pozycje dotyczące specyfikacji, logu i wniosków.
