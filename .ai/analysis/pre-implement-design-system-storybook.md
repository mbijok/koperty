# 🔍 Analiza przed implementacją: T-03 Design system z dokumentacją w Storybooku

**Readiness: no-go** – specyfikacja nie jest wiarygodnym źródłem prawdy: opisuje skrypty, mechanizm motywu i oznaczenie widoków, których w kodzie nie ma, a pytanie o zgłoszenie T-03 jest nadal otwarte. Kto oprze się na niej przy kolejnej zmianie design systemu, dostanie błędne instrukcje.
Spec: `.ai/specs/implemented/2026-10-29-design-system-storybook.md` · audyt 2026-10-30 (po realizacji, na commicie `f5d3a07`) według `BACKWARD_COMPATIBILITY.md`, szablon `.ai/specs/_template.md`.

> Audyt jest **retrospektywny**: implementacja jest gotowa i sprawdzona (bramka zielona, AC-1–AC-12 potwierdzone w logu przebiegu). Werdykt dotyczy dokumentu, a nie kodu. Wszystkie blokery da się usunąć edycją tekstu specyfikacji i jedną decyzją właściciela, bez zmian w kodzie.

## ⛔ Blokery

1. **R2 – otwarte pytanie:** „dodanie zgłoszenia T-03 do backlogu w GitHub Issues (#20) – po zgodzie właściciela” nadal bez odpowiedzi; pole `issue:` jest puste. Naprawa: decyzja właściciela (utworzyć zgłoszenie T-03 i wpisać na listę #20 albo zapisać w specyfikacji, że zadanie świadomie jest poza backlogiem), uzupełnić `issue:` i usunąć pozycję z „Otwarte” ([Decyzje](#️-decyzje-dla-właściciela-specyfikacji)).
2. **R6 – rozbieżności z kodem (4 miejsca):** skrypty `test-storybook` / `test-storybook:themes`, przełącznik motywu z `data-theme`, „widoki oznaczone jako wstępne” i baza `radix-nova` w AC-4 opisują coś innego niż kod. Naprawa: poprawić tekst specyfikacji według tabeli w [Zgodność z kodem](#-zgodność-z-kodem-r6).
3. **R3 – zakres bez kryterium i wyroczni:** kroki CI, `docs/design-system.md` z odwołaniem w AGENTS.md, strony uczące (poza stroną epiku) i strony Fundamentów nie mają kryterium akceptacji ani testu, który ktoś inny mógłby sprawdzić. Naprawa: dopisać AC-13–AC-15 ([Kompletność](#-kompletność-specyfikacji)).

## ⚠️ Decyzje dla właściciela specyfikacji

- **Zgłoszenie T-03.** Pytanie: czy design system ma być zadaniem w backlogu? Rekomendacja: tak – utworzyć zgłoszenie T-03, wpisać je na listę #20 i zamknąć je przez `Closes #<numer>` w PR. Za: AGENTS.md („Nie implementuj funkcjonalności spoza PRD i backlogu”, „PR zamyka zgłoszenie”), ślad decyzji w backlogu. Przeciw: dodatkowe zgłoszenie dla pracy już wykonanej.
- **Wariant E5-P4** (zarchiwizowana koperta w edytowanym wydatku) jest otwarty na stronie „Czego brakuje”, ale nie w specyfikacji. Rekomendacja: zostawić decyzję w specyfikacji S-08 i dopisać w T-03 jedno zdanie „przekazane do S-08”.

## 📋 Bramka gotowości

| #   | Punkt                | Wynik | Dowód / naprawa                                                                                                                                                                                                      |
| --- | -------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Status               | ✅    | Zatwierdzona przed implementacją (`POSTEP.md`, „Zatwierdzone decyzje”, 2026-10-29: `approved` → `in-progress`); teraz `implemented` i w `.ai/specs/implemented/`.                                                    |
| R2  | Brak otwartych pytań | ❌    | „Ryzyka i otwarte pytania”: „Otwarte: dodanie zgłoszenia T-03…”; `issue:` puste. Naprawa: bloker 1.                                                                                                                  |
| R3  | Śledzalność          | ❌    | Pozycje „Zakresu” bez AC i wyroczni: kroki CI, `docs/design-system.md` + AGENTS.md, strony uczące poza epikami, Fundamenty. Naprawa: bloker 3.                                                                       |
| R4  | Kontrakty            | ✅    | Brak API i RPC („Nie dotyczy”); interfejs: referencja R01 (`brief.md`), prymitywy shadcn/Radix, stany danych i oba motywy w zakresie i AC-2, AC-3, AC-7, AC-8; treść po polsku (repo nie ma mechanizmu lokalizacji). |
| R5  | Etapy dostarczalne   | ✅    | „Plan implementacji”: 5 etapów, kolejność = zależności, każdy kończy się raportem i akceptacją; bramka AC-12. Uwaga: wyjście etapów 1–4 opisane procesem („dalej” właściciela), nie mierzalnym warunkiem – drobne.   |
| R6  | Zgodność z kodem     | ❌    | 4 rozbieżności, tabela niżej. Naprawa: bloker 2.                                                                                                                                                                     |

### 🔍 Zgodność z kodem (R6)

| Miejsce w specyfikacji       | Specyfikacja mówi                                                                             | Kod                                                                                                                                                                | Naprawa                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| „Plan implementacji”, etap 1 | skrypty `storybook`, `build-storybook`, `test-storybook`, `test-storybook:themes`             | `packages/ui/package.json`: tylko `storybook`, `build-storybook`; w głównym `package.json`: `test:storybook` (`vp test --project ui --project ui-dark`)            | zastąpić nazwami z kodu                                                                                      |
| „Interfejs” → Storybook      | przełącznik ustawia klasę `dark` i `data-theme` na `<html>`, domyślnie `prefers-color-scheme` | `.storybook/preview.tsx`: klasy `light` / `dark` (bez `data-theme`), wartości „Systemowy / Jasny / Ciemny”; ramki zagnieżdżone przejmują motyw strony dokumentacji | opisać klasy `light`/`dark`, opcję systemową i dziedziczenie motywu w ramkach                                |
| „Ryzyka”, 3. punkt           | „Widoki są oznaczone jako wstępne”                                                            | w `packages/ui/docs` i `packages/ui/src` nie ma oznaczenia „wstępne” (przeszukane słowo „wstępn”)                                                                  | oznaczyć widoki S-02–S-15 jako wstępne (np. zdanie na stronach epików) albo zmienić mitygację w specyfikacji |
| „Kontekst” i AC-4            | porównanie z domyślnym shadcn `radix-nova`                                                    | baza po warsztacie: `radix-mira` (`packages/ui/components.json`, `brief.md` R01); `radix-nova` to tylko stan wyjściowy aplikacji                                   | w AC-4 wskazać `radix-mira` (preset R01) jako punkt odniesienia; w `POSTEP.md` DS-S10 to samo                |

Drobne, bez wpływu na werdykt: podgląd stanów działa przez `@custom-variant` (`preview.css`), a nie „te same deklaracje pod `[data-preview-state]`” – efekt ten sam; tabela podsumowania rozszerza się do `content-max-wide`, a AC-11 mówi o `content-max`.

## 💥 Wsteczna zgodność

Żadna chroniona powierzchnia z `BACKWARD_COMPATIBILITY.md` nie jest naruszona (sprawdzone wszystkie 9 × 5 etapów): brak zmian w `supabase/`, katalogu kodów błędów, Edge Functions i typach klienta; trasa `/` zachowana (`apps/web/src/routes/index.tsx` zmienia tylko import `Button`); format `.ai/` bez zmian (nowe pliki według istniejących konwencji, `check:ai` przechodzi). Tabela tras E5-P1 proponuje wyłącznie nowe trasy – dozwolone bez dodatkowej ścieżki.

## 📝 Kompletność specyfikacji

| Sekcja                   | Brak / niepełne                                                      | Skutek                                                  | Co dopisać                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nagłówek YAML: `issue`   | puste                                                                | brak powiązania z backlogiem; PR nie zamknie zgłoszenia | numer zgłoszenia T-03 (po decyzji)                                                                                                                                                                                                                                                                                                     |
| Kryteria akceptacji      | brak AC dla CI, `docs/design-system.md`, stron uczących, Fundamentów | części zakresu nie da się odebrać według specyfikacji   | **AC-13** CI: PR z wartością spoza tokenów albo naruszeniem axe kończy się czerwonym jobem „Check, test, build”; **AC-14** każdy moduł pakietu jest w katalogu i w `docs/design-system.md` (`catalog.test.ts`); **AC-15** strony Design system i Fundamenty renderują się przy 320/768/1440 px bez przewijania, z działającymi linkami |
| Ryzyka i otwarte pytania | E5-P4 i S-01 tylko w `POSTEP.md`                                     | otwarte sprawy znikną razem z zamknięciem zadania       | zdanie o przekazaniu E5-P4 do S-08 i o potrzebie aktualizacji specyfikacji S-01                                                                                                                                                                                                                                                        |

## 🔍 Zgodność z zasadami repozytorium

| Zasada (źródło)                                                                                                | Miejsce                                       | Naprawa                                                                       | Waga         |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- | ------------ |
| Specyfikacja jest źródłem prawdy; odejście = aktualizacja specyfikacji (AGENTS.md, „Specyfikacje”)             | rozbieżności z R6                             | poprawić specyfikację w PR (zmiany opisowe, bez zmiany zakresu)               | Important    |
| Zadania tylko z backlogu; nowe zadanie jako zgłoszenie na liście #20 (AGENTS.md „Kontekst”, `docs/backlog.md`) | nagłówek `issue`, „Otwarte”                   | zgłoszenie T-03 przed PR albo zapisana decyzja właściciela                    | Important    |
| Gałęzie robocze `feat/...`, `fix/...` (AGENTS.md „Git”, `.ai/skills/project-rules.md`)                         | gałąź `claude/design-system-storybook-68d9d9` | przed push utworzyć `feat/design-system-storybook` z tych samych commitów     | Important    |
| Dokumentacja odzwierciedla zmiany (AGENTS.md „Definition of Done”)                                             | `docs/engineering-standards.md` 4.5           | „walidacja schematem” → funkcja `validate` jako schemat (decyzja z partii D1) | Nice-to-have |

## ⚠️ Ryzyka

| Ryzyko                                                                                  | Poziom | Skutek                                                                           | Mitygacja                                                                                                                                                             |
| --------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Specyfikacja S-01 (`approved`) planuje komponenty `input`, `label`, `card` w `apps/web` | High   | implementacja S-01 według specyfikacji ominie design system i powieli komponenty | zaktualizować S-01 (komponenty i `SignInForm`, `NameForm` z pakietu) i przywrócić jej `draft` do ponownej akceptacji przed realizacją; w T-03 nie jest to zmitygowane |
| Widoki S-02–S-15 powstały przed specyfikacjami tych zadań                               | Medium | późniejsze specyfikacje zmienią widoki albo zostaną do nich nagięte              | oznaczyć widoki jako wstępne (mitygacja ze specyfikacji, niewykonana – R6) i w każdej specyfikacji S-xx sekcja „różnice względem widoku”                              |
| Jeden PR ~24 tys. linii (w większości dokumentacja i stories)                           | Medium | przegląd powierzchowny                                                           | opis PR z mapą katalogów i listą decyzji; przegląd według etapów (commity) albo podział na PR „pakiet i tokeny” + „dokumentacja”                                      |
| Testy stories w Chromium w CI (~668 przebiegów)                                         | Low    | dłuższy job „Check, test, build”                                                 | zmierzyć czas na pierwszym PR; w razie potrzeby osobny job                                                                                                            |

## 🔍 Luki

- **Important** – wyrocznia dla CI (AC-13): dziś nikt poza autorem nie sprawdzi, że PR z naruszeniem jest blokowany; potrzebny jeden PR próbny albo opis kontroli w specyfikacji („Strategia testów”).
- **Important** – decyzja o zgłoszeniu T-03 (bloker 1).
- **Nice-to-have** – `BACKWARD_COMPATIBILITY.md` nie wymienia eksportów `@koperty/ui` (ścieżki `@koperty/ui/<warstwa>/<moduł>`) jako powierzchni; po podpięciu ekranów w `apps/web` zmiana nazwy modułu złamie import – rozważyć wpis „tylko addytywnie w obrębie PR, aplikacja i pakiet zmieniane razem”.
- **Nice-to-have** – sprawdzenie w Safari na iPhonie (pola 16 px, dolny pasek, `safe-area`), dziś tylko Chromium.

## 📋 Plan naprawy

1. **Przed PR (zmiany w specyfikacji):** decyzja i pole `issue` (bloker 1); poprawki R6 (bloker 2); AC-13–AC-15 i wyrocznie w „Strategii testów” (bloker 3); zdanie o E5-P4 → S-08 i o aktualizacji S-01. Zmiana opisowa w specyfikacji `implemented` – bez zmiany zakresu i statusu.
2. **Razem z PR:** gałąź `feat/design-system-storybook`; oznaczenie widoków jako wstępnych (albo zmiana mitygacji); standardy 4.5.
3. **Po PR:** aktualizacja specyfikacji S-01 przed jej realizacją (High); Safari na iPhonie; ewentualny wpis eksportów pakietu w `BACKWARD_COMPATIBILITY.md` (ADR, jeśli zmienia zasady).

## 🧪 Ograniczenia audytu

- Audyt po implementacji: sprawdzałem specyfikację względem kodu na commicie `f5d3a07` w gałęzi `claude/design-system-storybook-68d9d9`, nie względem `master`.
- Przeszukane: `packages/ui` (`package.json`, `components.json`, `.storybook/preview.tsx`, `preview.css`, `docs/`, `src/`), główny `package.json`, `docs/engineering-standards.md`, `BACKWARD_COMPATIBILITY.md`, ADR 0011 i 0012, `.ai/specs/_template.md`, `CODE_REVIEW.md`, `.ai/skills/project-rules.md`. Brak oznaczenia „wstępne” stwierdzony wyszukaniem „wstępn” w `packages/ui/docs` i `packages/ui/src`.
- Nie uruchamiałem ponownie bramki walidacji (ostatni wynik: 800 testów, 100%, zielone `vp check`, `vp build`, build Storybooka – log przebiegu, krok 17); nie sprawdzałem CI na GitHubie (gałąź nie jest wypchnięta).
- Brak `product-brief.md` i `.uxproof/` w repozytorium; `reviewChecklist` nie ustawiony – użyty `CODE_REVIEW.md`. Brak `knowledge.sources`.
- Werdykt `no-go` wynika mechanicznie z R2, R3 i R6; dotyczy dokumentu, nie działania kodu.
