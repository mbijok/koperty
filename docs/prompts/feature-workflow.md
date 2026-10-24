# Realizacja jednej funkcjonalności

Prompt wielokrotnego użytku dla agenta kodującego. Prowadzi przez realizację jednego zgłoszenia z backlogu w GitHub Issues ([zasady backlogu](../backlog.md)) zgodnie z [AGENTS.md](../../AGENTS.md). Użycie: wklej prompt i uzupełnij pole „Zadanie”. Skille `om-*` (np. `om-auto-write-spec`, `om-auto-implement-spec`) realizują te same etapy z zasadami z `.ai/skills/project-rules.md`.

---

**Zadanie:** `<numer zgłoszenia, np. #12>` – `<identyfikator i nazwa, np. S-03 Koperty>`

Realizujesz jedno zgłoszenie z backlogu. Pracujesz etapami. Po każdym punkcie kontrolnym zatrzymaj się, podsumuj w 3–5 zdaniach, co zrobiłeś i jakie pliki zmieniłeś, i czekaj na moją akceptację. Gdy czegoś brakuje albo coś jest niejasne, pytaj zamiast zakładać.

## Etap 1. Przygotowanie

1. Przeczytaj `.ai/lessons.md` i stosuj zapisane wnioski.
2. Przeczytaj zgłoszenie (`gh issue view <numer>`), powiązane user stories w `docs/prd.md`, odpowiednie sekcje `docs/architecture.md` i ADR, do których się odwołują, oraz `BACKWARD_COMPATIBILITY.md`, jeśli zadanie zmienia `supabase/` lub trasy aplikacji.
3. Sprawdź `.ai/specs/`: czy specyfikacja tego zadania już istnieje (np. w statusie `draft` lub `approved`).
4. Upewnij się, że zgłoszenia, od których to zależy, są zamknięte, a ich specyfikacje leżą w `.ai/specs/implemented/`.
5. Utwórz gałąź `feat/<slug>` od aktualnego `master`.

## Etap 2. Specyfikacja

1. Jeśli specyfikacji nie ma, utwórz ją z `.ai/specs/_template.md` jako `.ai/specs/<date +%F>-<slug>.md` ze statusem `draft` i numerem zgłoszenia w polu `issue`. Jeśli jest, przejrzyj ją i zaktualizuj.
2. Kryteria akceptacji przepisz z PRD w formacie Given/When/Then i uzupełnij o przypadki brzegowe (zera, kwoty ujemne, przekroczenie puli, zaokrąglenia) oraz dostęp (członek budżetu A vs B, `member` vs `owner`, osoba niezalogowana).
3. Opisz zmiany w bazie, funkcje RPC (wejście, wynik, reguły, kody błędów), polityki RLS, Edge Functions, interfejs, wsteczną zgodność, plan w małych krokach i strategię testów.
4. Wypisz ryzyka i otwarte pytania. Nowe decyzje architektoniczne zaproponuj jako ADR w `docs/adr/` (status „proponowany”).
5. Uruchom `vp run check:ai`.

**Punkt kontrolny:** czekam na przegląd specyfikacji. Status `approved` nadaję ja; nie zmieniaj go samodzielnie i nie zaczynaj implementacji przed zatwierdzeniem.

## Etap 3. Start implementacji

1. Załóż log przebiegu z `.ai/runs/_template.md` jako `.ai/runs/<date +%F>-<slug>.md` (status `in-progress`, link do specyfikacji).
2. Ustaw w specyfikacji status `in-progress` i dopisz log w polu `runs`.
3. Od tej chwili po każdym istotnym kroku dopisuj do logu: co zrobiono, jakie komendy uruchomiono i z jakim wynikiem, decyzje, problemy.

## Etap 4. Testy, implementacja i weryfikacja

Dla każdego kroku planu ze specyfikacji:

1. Najpierw testy wynikające z kryteriów akceptacji: pgTAP w `supabase/tests/` dla reguł domenowych i RLS, Vitest dla logiki frontendu.
2. Implementacja:
   - schemat tylko przez `vp exec supabase migration new <nazwa>`; nigdy nie edytuj zastosowanej migracji,
   - reguły domenowe w Postgresie, zapis wyłącznie przez RPC, RLS na każdej tabeli z `budget_id`,
   - kwoty w groszach, daty jako `date`,
   - po zmianie schematu: `vp exec supabase db reset` i wygenerowanie typów (bez ręcznej edycji),
   - frontend tylko wywołuje RPC i prezentuje wyniki; dane przez TanStack Query z kluczami z jednego miejsca; teksty po polsku, mobile first.
3. Weryfikacja kroku: `vp check`, `vp test --coverage` (100% pokrycia), `vp exec supabase test db`. Krok kończy się zielonymi testami.

Jeśli okaże się, że trzeba odejść od specyfikacji: zatrzymaj się, zaktualizuj specyfikację, przywróć status `draft` i poproś o ponowną akceptację.

Na koniec: `vp check`, `vp test --coverage`, `vp build`, `vp exec supabase db reset`, `vp exec supabase test db`, `vp run check:ai`. Potem samokontrola zmian według `CODE_REVIEW.md` i `BACKWARD_COMPATIBILITY.md`.

**Punkt kontrolny:** czekam na podsumowanie i wyniki weryfikacji.

## Etap 5. Domknięcie

1. Zapisz wnioski (naprawione błędy, moje korekty, nieoczywiste zachowania narzędzi, nieudane podejścia) w `.ai/lessons/` i dopisz je do `.ai/lessons.md`. Sprawdź najpierw, czy podobny wniosek już istnieje.
2. Zaktualizuj dokumentację, jeśli zmiana na nią wpływa: PRD, `docs/architecture.md`, ADR, `AGENTS.md`.
3. W specyfikacji ustaw status `implemented`, uzupełnij „Podsumowanie realizacji” (z linkami do logów i commitów) i przenieś plik bez zmiany nazwy do `.ai/specs/implemented/`.
4. Zamknij log przebiegu: status końcowy (`completed`, `partial`, `failed` lub `aborted`) i następne kroki.
5. Uruchom `vp run check:ai`, zacommituj zmiany (Conventional Commits, po angielsku) razem z plikami `.ai/` i przygotuj opis PR według `.github/pull_request_template.md` (z „Closes #<numer>”: GitHub zamyka zgłoszenie przy scaleniu tylko po angielskim słowie kluczowym).

**Punkt kontrolny:** krótkie podsumowanie: co zmieniono, jak to zweryfikowano, co zostało otwarte. Nie wykonuj `git push` ani scalenia bez mojej prośby.
