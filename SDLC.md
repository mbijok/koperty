# Proces wytwarzania oprogramowania

## Cel

Ten plik opisuje, jak praca przechodzi od zgłoszenia do scalonego PR. Proces egzekwują skille agentów skonfigurowane w `.ai/agentic.config.json`; ludzie czytają go tutaj. PR-y są kierowane do `master`; zgłoszenia i PR-y są w GitHub, a każdą operację na trackerze, którą wykonują skille, definiuje `.ai/trackers/github.md` (ten plik edytujesz, żeby rozszerzyć lub zmienić zachowanie trackera).

[AGENTS.md](AGENTS.md) ma pierwszeństwo przed tym plikiem ([ADR 0010](docs/adr/0010-agent-pipeline-under-project-rules.md)): implementacja zaczyna się tylko od specyfikacji w `.ai/specs/` ze statusem `approved` (nadaje go człowiek), a agenci wypychają gałęzie, otwierają PR-y i scalają tylko na wyraźną prośbę. Zasady dla skilli są w `.ai/skills/project-rules.md`.

Praca trafia do procesu dwiema drogami: jako swobodny opis zadania przekazany agentowi albo jako zgłoszenie. Obie prowadzą do tej samej pętli przeglądu, tej samej bramki walidacji i tych samych bramek scalania.

Przed przyjęciem pracy nadaje się jej kształt: `om-brainstorm` zamienia pojedynczy pomysł lub pytanie w decyzję o dalszej drodze i krótki opis, a skille specyfikacji (`om-spec-writing`, `om-auto-write-spec`) zamieniają funkcjonalność w specyfikację, zanim cokolwiek powstanie. Te kroki zasilają tabelę poniżej, ale nie są częścią przepływu zgłoszenia.

## Role

- **Autor** – człowiek lub agent, który wprowadza zmianę. Odpowiada za zgłoszenie od przejęcia do PR gotowego do scalenia.
- **Recenzent** – czyta diff i akceptuje albo prosi o zmiany. Może to być człowiek albo skill `om-auto-review-pr`; w obu przypadkach obowiązuje checklista `om-code-review` i [CODE_REVIEW.md](CODE_REVIEW.md). Recenzent jest też drugą osobą wymaganą przy zmianie `risk-high` i zatwierdza specyfikację, gdy funkcjonalność jej wymaga.
- **Projektant** – odpowiada za przepływ i jego stany, zanim powstanie kod, oraz za kontrakt projektowy, który sprawdza przegląd UI. Może to być człowiek, `om-ux-shape` przy kształtowaniu albo `om-ux-review-pr` przy przeglądzie ekranów z PR.
- **Recenzent QA** – sprawdza zmiany widoczne dla użytkownika przed scaleniem: uruchamia aplikację raz przez `om-prepare-test-env` i przechodzi zmianę w prawdziwej przeglądarce przez `om-auto-qa-pr`. „Ręczne” znaczy, że wynik ocenia człowiek i to on nadaje `qa-approved`, a nie że pracuje bez wsparcia narzędzi. Zawsze wskazywany przez rolę, nigdy przez imię lub login: przydziały się zmieniają.
- **Opiekun** – odpowiada za ochronę gałęzi, taksonomię etykiet, konfigurację, ten dokument oraz zainstalowane skille z ich lokalnymi rozszerzeniami w `.ai/skills/`; rozstrzyga konflikty między bramkami. Pełni rolę osoby odpowiedzialnej za wydania, dopóki zespół nie wskaże innej.

## Cykl życia zgłoszenia

| Etap                 | Co się dzieje                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Kto prowadzi                                                                                                       | Koniec, gdy                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Rozpoznanie          | Pomysł, pytanie lub problem zostaje omówiony, zanim powstanie jakikolwiek artefakt: kwestionujemy problem, rozważamy alternatywy (także niebudowanie niczego), a rozmowa kończy się decyzją – odpowiedzią, zgłoszeniem, opisem do specyfikacji albo bezpośrednią zmianą.                                                                                                                                                                                                                                            | `om-brainstorm` albo człowiek                                                                                      | Rozmowa ma decyzję; gdy praca idzie dalej, powstał opis                                           |
| Przyjęcie            | Zgłoszenie trafia do GitHub Issues z informacjami wystarczającymi do działania: co jest złe lub potrzebne, dla kogo i jak wygląda „zrobione”. Zadanie z backlogu MVP jest dopisywane do zgłoszenia zbiorczego „Backlog MVP” ([docs/backlog.md](docs/backlog.md)). `om-prepare-issue` zakłada zgłoszenie z etykietami SDLC.                                                                                                                                                                                          | Każdy, `om-prepare-issue`                                                                                          | Zgłoszenie istnieje                                                                               |
| Weryfikacja          | Potwierdzamy, że problem jest prawdziwy, nadal występuje na `master` i nie jest już przejęty ani objęty otwartym PR. Tylko odczyt; czysto przerywa łańcuch, gdy nie ma nic do zrobienia.                                                                                                                                                                                                                                                                                                                            | `om-verify-in-repo` albo człowiek                                                                                  | Potwierdzone do realizacji albo zamknięte bez działań                                             |
| Przejęcie            | Autor przejmuje zgłoszenie, żeby inni agenci się wycofali. Zobacz protokół przejęcia poniżej.                                                                                                                                                                                                                                                                                                                                                                                                                       | `om-fix` / `om-auto-create-pr` albo człowiek                                                                       | Przejęcie widoczne w zgłoszeniu                                                                   |
| Projekt              | Dla zmiany widocznej dla użytkownika przepływ i jego stany są ustalone przed kodem: co ekran robi, gdy jest pusty, ładuje się, ma błąd i gdy brak uprawnień, oraz czego zmiana celowo nie robi. Zgłoszenie bez UI pomija ten etap.                                                                                                                                                                                                                                                                                  | `om-ux-shape` albo projektant                                                                                      | Przepływ i stany ustalone albo zgłoszenie nie dotyczy UI                                          |
| Implementacja        | Najpierw specyfikacja `approved` w `.ai/specs/`. Potem wyznaczamy minimalny zakres zmiany (`om-root-cause`, tylko odczyt), implementujemy zmianę z testami regresji i uruchamiamy bramkę walidacji. Opisy zadań bez zgłoszenia idą przez `om-auto-create-pr`, który planuje, implementuje etapami w izolowanym worktree i uruchamia tę samą bramkę.                                                                                                                                                                 | `om-root-cause` + `om-fix`, `om-auto-create-pr` albo autor                                                         | Zmiana kompletna, bramka walidacji zielona                                                        |
| PR                   | Commit, push i otwarcie PR do `master` z uporządkowanymi etykietami; push i PR po potwierdzeniu przez człowieka. Na gałęzi prowadzonej ręcznie `om-check-and-commit` uruchamia bramkę, poprawia oczywiste rozjazdy i wypycha zmiany, gdy wszystko jest zielone.                                                                                                                                                                                                                                                     | `om-open-pr`, `om-auto-create-pr` albo `om-check-and-commit`                                                       | Otwarty PR z etykietami                                                                           |
| Pętla przeglądu      | Recenzent czyta diff według checklisty `om-code-review` i akceptuje albo prosi o zmiany. Prośby są realizowane (`om-auto-continue-pr` wznawia PR-y agentów z planu, a PR bez planu przejmuje, odtwarzając plan z jego kontekstu), a PR wraca do przeglądu aż do akceptacji. Zmiana widoczna dla użytkownika dostaje też przegląd projektowy: `om-ux-review-pr` przechodzi zmienione ekrany i zgłasza uwagi według wpływu na użytkownika. Ten przegląd jest doradczy – informuje recenzję, ale nie blokuje scalenia. | `om-auto-review-pr` (jeden PR), `om-review-prs` (wszystkie), `om-ux-review-pr` (przegląd projektowy) albo człowiek | Recenzja akceptująca złożona                                                                      |
| QA                   | PR z `needs-qa` czeka na QA. Recenzent uruchamia aplikację raz przez `om-prepare-test-env`, przechodzi zmianę w prawdziwej przeglądarce przez `om-auto-qa-pr` – który dołącza zrzuty ekranu i raport pass/fail, a domyślnie nie zmienia etykiet – i zapisuje wynik. Przepływ wart utrwalenia trafia do testów `om-integration-tests`. Zobacz bramkę QA poniżej.                                                                                                                                                     | Recenzent QA z `om-prepare-test-env`, `om-auto-qa-pr`, `om-integration-tests`                                      | `qa-approved` nadane przez recenzenta QA albo w dozwolonym wyjątku self-QA; `qa-failed` odsyła PR |
| Scalenie             | `om-merge-buddy` raportuje (tylko odczyt), które PR-y można scalić teraz, a które są blisko, ale zablokowane. `om-approve-merge-pr` ponownie sprawdza wszystkie bramki, akceptuje i scala przez squash merge – tylko wywołany przez człowieka dla konkretnego PR.                                                                                                                                                                                                                                                   | `om-merge-buddy` + `om-approve-merge-pr` albo człowiek                                                             | PR scalony do `master` przez squash merge                                                         |
| Porządki po scaleniu | Zamykamy zgłoszenia naprawione przez scalony PR, komentujemy zgłoszenia, których PR-y zamknięto bez scalenia, a pozostałe prośby i uwagi z przeglądu zamieniamy w zgłoszenia uzupełniające. Zadanie z backlogu odhaczamy w „Backlog MVP”.                                                                                                                                                                                                                                                                           | `om-close-fixed-issues`, `om-followup-issue-from-pr`                                                               | Tracker uzgodniony, zgłoszenia uzupełniające założone                                             |

Po scaleniu ten proces się kończy. Wdrożenie, testy dymne, monitoring i wycofanie należą do procesu wydawania, a nie do tego dokumentu: opiekun (albo osoba odpowiedzialna za wydania, jeśli zespół ją wskaże) przygotowuje changelog przez `om-auto-update-changelog` i porządkuje tracker przez `om-close-fixed-issues`, a `om-pipeline-retro` analizuje zakończone przebiegi i wskazuje, ile kosztują poprawki. Ten dokument kończy się na scaleniu; dostarczenie zmiany użytkownikom to osobny proces zespołu.

## Maszyna stanów etykiet

Etykiety pipeline'u wykluczają się wzajemnie: PR ma najwyżej jedną i wskazuje ona, na którym etapie przepływu jest PR.

- Gotowy PR (nie szkic) ma `review`.
- Recenzent go przesuwa: prośba o zmiany → `changes-requested`; po poprawkach wraca do `review`; akceptacja → `merge-queue`.
- `merge-queue` oznacza kolejkę, a nie dowód QA: PR z `needs-qa` może tam legalnie czekać, aż QA go zatwierdzi.
- Etykietę `qa` ustawia tylko recenzent QA. Podczas testów przenosi PR z `needs-qa` z `merge-queue` do `qa`, a potem z powrotem do `merge-queue` z `qa-approved`, gdy test przejdzie, albo do `qa-failed`, gdy nie przejdzie. Skille automatyczne proszą o QA etykietą `needs-qa`; nigdy nie ustawiają `qa`.
- `blocked` i `do-not-merge` ustawiają i zdejmują ludzie; zatrzymują przepływ w dowolnym miejscu.

| Grupa     | Etykiety                                                                                   | Wykluczanie                 | Znaczenie             |
| --------- | ------------------------------------------------------------------------------------------ | --------------------------- | --------------------- |
| Pipeline  | `review`, `changes-requested`, `qa`, `qa-failed`, `merge-queue`, `blocked`, `do-not-merge` | jedna naraz                 | Stan przepływu        |
| Kategoria | `bug`, `feature`, `refactor`, `security`, `dependencies`, `documentation`                  | łączą się                   | Rodzaj zmiany         |
| Meta      | `needs-qa`, `skip-qa`, `qa-approved`, `qa-self-verified`, `in-progress`, `ci-monitoring`   | łączą się                   | Sygnały procesu       |
| Priorytet | `priority-low`, `priority-medium`, `priority-high`, `priority-extreme`                     | jedna naraz; brak = średni  | Pilność pracy         |
| Ryzyko    | `risk-low`, `risk-medium`, `risk-high`                                                     | jedna naraz; brak = średnie | Zasięg skutków zmiany |

Priorytet mówi, jak pilna jest praca, a ryzyko – jak niebezpieczne jest wdrożenie zmiany. Jednolinijkowa poprawka awarii może mieć `priority-extreme` i `risk-low`; duża refaktoryzacja uwierzytelniania, która może poczekać, może mieć `priority-low` i `risk-high`. PR dziedziczy obie etykiety ze zgłoszenia, chyba że zakres wyraźnie się zmienił. Gdy skill automatyczny dodaje lub zmienia etykietę pipeline'u lub meta, zostawia krótki komentarz z uzasadnieniem.

Gdy brak etykiety priorytetu, wyznacz ją:

- `priority-extreme` – awaria produkcji, utrata danych albo trwający incydent bezpieczeństwa.
- `priority-high` – wzmocnienie bezpieczeństwa albo regresja blokująca wydanie.
- `priority-medium` – zwykłe poprawki błędów i nowe funkcjonalności (także domyślne znaczenie braku etykiety).
- `priority-low` – kosmetyka, tylko dokumentacja, aktualizacje zależności, porządki uzupełniające.

Gdy brak etykiety ryzyka, wyznacz ją:

- `risk-high` – uwierzytelnianie i sesje, izolacja danych (RLS, członkostwo w budżecie), pieniądze (kwoty, salda, przydziały), migracje schematu, wspólne kontrakty albo szerokie zmiany przekrojowe.
- `risk-medium` – zwykła zmiana w jednym obszarze, dostarczona z testami (także domyślne znaczenie braku etykiety).
- `risk-low` – tylko dokumentacja, tylko testy, literówki albo odizolowane zmiany kosmetyczne.

Gdy sygnały są sprzeczne, wybierz wyższą etykietę i uzasadnij to w komentarzu do etykiet. PR z `risk-high` nie tylko „zasługuje na dokładniejszy przegląd” – uruchamia bramki:

| Obszar za `risk-high`                | Co musi zawierać PR                                                                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uwierzytelnianie, sesje, uprawnienia | test integracyjny ścieżki odmowy i odczytu z cudzego zakresu; przegląd drugiej osoby                                                                             |
| Izolacja danych                      | test izolacji potwierdzający, że jeden budżet nie odczyta danych drugiego (pgTAP)                                                                                |
| Pieniądze                            | testy ścieżek błędu, ponowienia i idempotencji; przegląd drugiej osoby                                                                                           |
| Migracje schematu                    | migracja przechodząca na świeżej bazie (`vp exec supabase db reset`) z testami pgTAP oraz plan wycofania w opisie PR (migracje Supabase nie mają wersji „w dół”) |
| Wspólne kontrakty                    | sprawdzona strona konsumenta, zgodnie z `BACKWARD_COMPATIBILITY.md`                                                                                              |
| Każdy `risk-high`                    | `needs-qa`, gdy zmiana jest widoczna dla użytkownika; bez self-QA; `om-code-review` blokuje bez powyższych dowodów, chyba że opiekun zwolni z tego w PR          |

Jedna etykieta jest poza tą taksonomią: `do-not-close`, którą ludzie nadają zgłoszeniom, których skille porządkowe nigdy nie mogą zamknąć automatycznie (np. „Backlog MVP”). Skille tylko ją odczytują.

## Bramka QA

Jedyna twarda reguła tego procesu: **PR z `needs-qa` nie może zostać scalony, dopóki nie ma też `qa-approved`, nawet gdy wszystkie inne kontrole są zielone.** `om-merge-buddy` klasyfikuje taki PR jako zablokowany, a `om-approve-merge-pr` odmawia scalenia.

- `needs-qa` nadaj zmianom UI, nowym funkcjonalnościom i innym zachowaniom widocznym dla użytkownika, które trzeba sprawdzić ręcznie.
- Dla zmiany UI QA obejmuje więcej niż „działa”: macierz stanów (domyślny, pusty, ładowanie, błąd, brak uprawnień, długa treść, wąski ekran od 360 px) wchodzi w ocenę pass/fail, podobnie jak zgodność z kontraktem projektowym w `.uxproof/`, jeśli repozytorium go ma. Brakujący stan oznacza niezaliczone QA. `om-ux-review-pr` pozostaje doradczym przeglądem projektowym; jego obiektywne kontrole wykonuje QA.
- `skip-qa` to jawna rezygnacja z QA dla zmian tylko w dokumentacji, zależnościach, CI lub testach i podobnie niskiego ryzyka, niewidocznych dla użytkownika. Nigdy nie łącz jej z `needs-qa`.
- `qa-failed`, `do-not-merge` i `blocked` twardo blokują niezależnie od innych sygnałów. Aktywna etykieta `qa` oznacza, że tester właśnie pracuje nad PR – nigdy nie scalaj w trakcie testów.
- Bramka jest spełniona, gdy recenzent QA przetestuje PR i nada `qa-approved`.
- **`qa-approved` jest przypięte do commita.** Komentarz, który je nadaje – notatka recenzenta QA albo komentarz z dowodami self-QA – zawiera linię `QA head: <sha>` z przetestowanym commitem. Push po tej linii zostawia etykietę, ale ją unieważnia: `om-merge-buddy` zgłasza „QA evidence older than head”, a `om-approve-merge-pr` prosi o potwierdzenie przed scaleniem. Wyjściem jest ponowny test przez recenzenta QA albo stwierdzenie w PR, że nowe commity nie dotykają przetestowanego zakresu, z nową linią `QA head:`.
- **Wyjątek self-QA**: gdy żaden recenzent QA nie zdąży, każdy inżynier – albo `om-auto-qa-pr --self-qa-signoff` – może zatwierdzić QA sam, wyłącznie dla PR `risk-low` lub `risk-medium`. Dowody dołączone do PR wymieniają sprawdzony scenariusz, środowisko, dane testowe (tylko fikcyjne), zaobserwowany wynik, sprawdzone przypadki negatywne i linię `QA head:`. Potem nadaj `qa-approved` (żeby bramka przeszła) i `qa-self-verified` (żeby wyjątek był audytowalny). Bez dowodów nie ma `qa-approved`.
- **Bez self-QA dla `risk-high`.** PR z `risk-high` albo taki, którego diff dotyka uwierzytelniania, sesji, izolacji danych, pieniędzy, migracji schematu lub wspólnych kontraktów (wyznaczanie `risk-high` powyżej), wymaga recenzenta QA albo jawnego wyjątku opiekuna zapisanego w PR; `om-auto-qa-pr` nie zatwierdza takiego PR i publikuje tylko dowody. Zmiana uwierzytelniania lub pieniędzy wymaga też przeglądu drugiej osoby niezależnie od ścieżki QA.

## Protokół przejęcia

Zanim agent zmieni zgłoszenie lub PR, przejmuje je wszystkimi trzema sygnałami: przypisuje się do niego, dodaje etykietę `in-progress` i publikuje komentarz z informacją, co robi. Agent, który znajdzie istniejące przejęcie, wycofuje się zamiast wchodzić w konflikt. PR z `in-progress` jest też pomijany przez narzędzia scalania.

`in-progress` oznacza **aktywną pracę**. Gdy agent skończy pracę i w pełni ją zaraportuje – etykiety nadane, recenzja złożona, komentarze opublikowane – zamienia `in-progress` na `ci-monitoring`, jeśli zamierza jeszcze zaraportować wynik CI. `ci-monitoring` **nie jest** przejęciem i nikogo nie blokuje: mówi tylko, że komentarz z wynikiem CI jest jeszcze winny, więc inny agent albo człowiek może swobodnie działać na PR. To rozróżnienie jest ważne, bo CI trwa długo: agent, który zaraportował pracę i przerwał działanie podczas obserwowania przebiegu, zostawia uczciwy, samoopisujący się stan zamiast blokady, której nikt nie trzyma. Etykieta znika, gdy pojawi się komentarz z wynikiem, albo gdy agent przestanie czekać po `ci.maxWaitMinutes` i to zgłosi.

Przejęcie zwalnia się po zakończeniu pracy – zarówno po sukcesie, jak i po porażce. Nieaktualne `in-progress` bez niedawnej aktywności może usunąć opiekun.

### Raportowanie niezależne od CI

Agenci nadają etykiety, składają recenzje i publikują komentarze **od razu po zakończeniu pracy**, bez czekania na zielone CI. Recenzja złożona w trakcie trwania kontroli mówi o tym w treści: faktyczne scalenie wstrzymują ochrona gałęzi i bramka QA, a akceptacja dotyczy kodu, a nie zielonego przebiegu. Wynik CI przychodzi później jako komentarz uzupełniający, który koryguje też etykietę pipeline'u, jeśli wynik zmienia werdykt.

Czekanie na ten wynik ogranicza `ci.maxWaitMinutes` (domyślnie 40). Gdy czas minie, a kontrole nadal trwają, agent przestaje czekać, uruchamia lokalną bramkę walidacji jako własny dowód, publikuje go razem z nazwami trwających kontroli i jawną informacją, że kolejnego komentarza nie będzie, zdejmuje `ci-monitoring` i kończy.

Czerwony sygnał też nie skraca przeglądu. Nieprzechodząca wymagana kontrola albo konflikt z gałęzią bazową są zbierane jako **uwaga blokująca** i raportowane razem z pełnym przeglądem kodu, nigdy zamiast niego: jeden cykl przeglądu daje autorowi nieprzechodzącą kontrolę, konflikt i wszystkie uwagi do kodu naraz, zamiast najpierw najtańszego czerwonego sygnału i kolejnego cyklu na resztę. Taki werdykt to nadal `changes-requested` – zmieniła się kompletność, nie bramka.

Nic z tego nie zmienia bramek scalania. Wczesne raportowanie jest bezpieczne, wczesne scalanie nie – wymagane kontrole nadal pilnują każdego scalenia, a narzędzia scalania odmawiają, dopóki kontrole nie są naprawdę zielone.

## Kontrakt automatyzacji

Skille `om-auto-*` prowadzą ten proces bez nadzoru i można je łączyć w łańcuchy: każdy przyjmuje artefakt poprzedniego (numer zgłoszenia, ścieżkę specyfikacji albo numer PR z linii referencyjnej `PR: #<number> (link: <url>)`, którą emituje każdy skill tworzący PR), a każdy wykrywa już rozpoczętą pracę – otwarty PR odwołujący się do zgłoszenia lub planu – i kontynuuje ją zamiast otwierać duplikat. W tym repozytorium przebieg bez nadzoru kończy się przed pushem: commity zostają lokalnie, a push i PR następują po potwierdzeniu człowieka (`.ai/skills/project-rules.md`). Zakończony przebieg zostawia **gotowy** (nie szkic), w pełni oznaczony PR – jedna etykieta pipeline'u, kategoria, meta QA, jeden priorytet, jedno ryzyko – z komentarzem podsumowującym przebieg i, dla zmian widocznych dla użytkownika, zrzutami ekranu z działającej aplikacji jako dowodami w PR. Szkice PR są zarezerwowane dla stanów jawnie niekompletnych: PR-ów tylko ze specyfikacją, przerwanych przekazań albo domyślnych decyzji agenta oznaczonych do potwierdzenia przez człowieka. Automatyzacja nadaje `qa-approved` tylko w wyjątku self-QA (`om-auto-qa-pr --self-qa-signoff`, zawsze razem z `qa-self-verified`, nigdy dla PR `risk-high`); żaden skill tworzący kod, przeglądający ani scalający jej nie nadaje.

## Bramka walidacji

Każdy PR przechodzi pełną bramkę walidacji przed akceptacją recenzji, w tej kolejności:

- `vp run check:ai`
- `vp check`
- `vp test --coverage`
- `vp build`
- `vp exec supabase db start`
- `vp exec supabase db reset`
- `vp exec supabase test db`
- `vp exec supabase db advisors --local --type all --fail-on warn`

`vp exec supabase db reset` celowo odtwarza lokalną bazę z migracji i seed, żeby bramka testowała aktualny schemat tak jak CI. Kasuje przy tym lokalne dane deweloperskie, a baza jest wspólna dla wszystkich worktree.

Każdy niezerowy kod wyjścia oznacza niezaliczoną bramkę i blokuje PR. Skille implementujące uruchamiają bramkę przed otwarciem PR, a `om-check-and-commit` przed wypchnięciem gałęzi prowadzonej ręcznie. Lista komend jest w `.ai/agentic.config.json`; gdy się zmienia, aktualizuj ją tam i w tej sekcji jednocześnie.

## Zmiany tego procesu

Ten dokument i `.ai/agentic.config.json` opisują ten sam proces: zmieniaj je razem i uruchom ponownie skill `om-setup-agent-pipeline`, gdy zmienia się zestaw narzędzi albo taksonomia etykiet.

Kontrakt projektowy, który czytają etapy Projekt i Pętla przeglądu, ustawia się raz: `om-ux-setup` wyodrębnia go z repozytorium i uruchamia się go ponownie, gdy zmienia się system projektowy.

Odstępstwa dla poszczególnych skilli – dodatkowe reguły przeglądu, inny szablon opisu PR, dodatkowy krok bramki – należą do lokalnego skilla o tej samej nazwie w `.ai/skills/<skill-name>/SKILL.md`, który ma pierwszeństwo przed zainstalowanym skillem (i może go importować przez `@` lub się do niego odwoływać, żeby go rozszerzyć, a nie zastąpić). Reguły lokalne wygrywają, ale lokalny skill nie może pozwolić na to, czego zabraniają reguły bezpieczeństwa zainstalowanego skilla. Wspólne zasady projektu dla wszystkich skilli są w `.ai/skills/project-rules.md`.
