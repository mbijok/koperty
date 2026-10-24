# Zasady projektu dla skilli `om-*`

Wspólne rozszerzenie wszystkich skilli `om-*` w tym repozytorium ([ADR 0010](../../docs/adr/0010-agent-pipeline-under-project-rules.md)). Importuje je plik `.ai/skills/<skill>/SKILL.md` każdego skilla.

**Nadrzędność:** [AGENTS.md](../../AGENTS.md) → ten plik → instrukcje zainstalowanego skilla. Przy sprzeczności stosuj zasadę projektu, wykonuj dalej resztę skilla i odnotuj odstępstwo w raporcie. Te zasady tylko zaostrzają skille; nie zwalniają z żadnej reguły bezpieczeństwa skilla.

## Specyfikacje

- Implementację (kod, migracje, testy) zaczynasz wyłącznie od specyfikacji w `.ai/specs/` ze statusem `approved`. Przy innym statusie albo braku specyfikacji zatrzymaj się ze stanem `blocked` i wskaż, czego brakuje.
- Nową specyfikację tworzysz z `.ai/specs/_template.md` jako `.ai/specs/<date +%F>-<slug>.md`, ze statusem `draft` i numerem zgłoszenia w polu `issue`. Sekcje wymagane przez skill (np. plan implementacji, model danych) dopisujesz w ramach szablonu, nie zamiast niego.
- Statusu `approved` nigdy nie nadajesz. PR ze specyfikacją (np. z `om-auto-write-spec`) zostawia ją w `draft`; implementacja rusza dopiero po zatwierdzeniu przez człowieka.
- Cykl życia specyfikacji prowadzisz według `AGENTS.md`: `in-progress` na starcie implementacji, a w PR implementacji `implemented`, podsumowanie realizacji i przeniesienie do `.ai/specs/implemented/`. Odejście od specyfikacji oznacza zatrzymanie, powrót do `draft` i prośbę o ponowną akceptację.

## Git i PR

- Commitujesz tylko na gałęziach roboczych (`feat/...`, `fix/...`, `chore/...`, `docs/...`), w Conventional Commits po angielsku. Nie pomijasz hooków.
- **Push i utworzenie PR** wymagają potwierdzenia użytkownika w bieżącej sesji, z nazwą gałęzi. Bez użytkownika (przebieg nienadzorowany) nie wypychasz: zostawiasz commity lokalnie i kończysz przekazaniem pracy.
- **Scalanie** wykonujesz tylko wtedy, gdy użytkownik sam wywołał `om-approve-merge-pr` dla konkretnego PR albo wprost poprosił o scalenie. Żaden łańcuch skilli nie scala sam i nie włącza auto-merge. Scalanie zawsze przez squash merge.
- Tytuł PR w Conventional Commits. Opis PR po polsku według `.github/pull_request_template.md`; sekcje skilla (etykiety, dowody QA) dopisujesz pod szablonem.

## Katalog `.ai/`

- Przebieg autonomiczny ma plan pipeline'u w `.ai/pipeline-runs/` i obowiązkowy log w `.ai/runs/` według `.ai/runs/_template.md`, założony na starcie i linkujący do planu.
- Wnioski zapisujesz w `.ai/lessons/` i w indeksie `.ai/lessons.md`, zgodnie z `AGENTS.md`.
- Przed commitem zmian w `.ai/` uruchamiasz `vp run check:ai`.

## Zgłoszenia i komunikacja

- Backlog jest w GitHub Issues; kolejność realizacji wyznacza zgłoszenie zbiorcze „Backlog MVP”. Zadań spoza PRD i backlogu nie dodajesz bez zgody użytkownika.
- Zgłoszenia, komentarze, opisy PR i raporty piszesz po polsku; kod, commity i nazwy gałęzi po angielsku. Znaczników maszynowych skilli (`PR:`, `Issue:`, `Spec:`, komentarze z markerami) nie tłumaczysz.
- Zgłoszenie dotyczące funkcjonalności odwołuje się do user stories z `docs/prd.md` (`US-xx`).

## Narzędzia i dokumenty

- Komendy uruchamiasz przez `vp` według tabeli „Komendy” w `AGENTS.md`. Nigdy `npm`, `npx`, `pnpm` ani `yarn`: komendy z instrukcji skilli tłumaczysz na `vp`.
- Bramka walidacji to `validation.commands` z `.ai/agentic.config.json`.
- Nowe zależności (także Playwright) dodajesz tylko po zgodzie; decyzje architektoniczne proponujesz jako ADR.
- Przed pracą czytasz dokumenty wskazane w sekcji „Dokumenty procesu” w `AGENTS.md`: `CODE_REVIEW.md` przy przeglądzie, `BACKWARD_COMPATIBILITY.md` przy zmianach w `supabase/` i trasach, `SDLC.md` przy pracy ze zgłoszeniami, PR-ami i etykietami.
