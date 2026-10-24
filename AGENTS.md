# AGENTS.md

Instrukcje dla agentów kodujących pracujących w tym repozytorium. Opis produktu i kontekst znajdziesz w [README.md](README.md), wymagania w [docs/prd.md](docs/prd.md), architekturę w [docs/architecture.md](docs/architecture.md), uzasadnienia decyzji w [docs/adr/](docs/adr/), plan prac w [docs/backlog.md](docs/backlog.md), a obowiązujące standardy kodu i wzorce w [docs/engineering-standards.md](docs/engineering-standards.md). Specyfikacje, logi przebiegów i wnioski z pracy agentów znajdują się w katalogu `.ai/` (zasady w sekcji „Katalog `.ai/`” poniżej).

Ten plik jest jedynym źródłem zasad projektu dla wszystkich agentów (Claude Code, Codex, Cursor i innych). Pliki specyficzne dla narzędzi, takie jak `CLAUDE.md`, tylko go importują i dodają mechanikę danego narzędzia. Nowe zasady projektu dopisuj wyłącznie tutaj.

## Kontekst w skrócie

Aplikacja webowa do budżetu domowego metodą kopertową. Wiele niezależnych budżetów, każdy z jednym lub kilkoma członkami. Backend (Supabase) jest niezależny od klienta: aplikacja webowa jest pierwszym klientem, natywna aplikacja na iOS powstanie później i będzie korzystać z tych samych danych i reguł.

**Aktualna faza:** 1, czyli MVP aplikacji webowej (faza 0 – fundamenty – zakończona). Zadania realizuj w kolejności z [docs/backlog.md](docs/backlog.md) według [docs/prompts/feature-workflow.md](docs/prompts/feature-workflow.md), każde na podstawie zatwierdzonej specyfikacji. Nie implementuj funkcjonalności spoza PRD i backlogu.

## Język

- Komunikacja ze mną: po polsku.
- Kod, nazwy w bazie, identyfikatory, komentarze w kodzie i commity: po angielsku. Nazwy domenowe zgodnie ze słownikiem w README (np. `envelope`, `allocation`, `expense_split`).
- Dokumentacja projektowa (`docs/`) i teksty w interfejsie: po polsku.
- Kwoty i daty formatuj w locale `pl-PL`, waluta PLN.

## Sposób pracy

- Na początku każdej sesji przeczytaj `.ai/lessons.md` i stosuj zapisane tam wnioski.
- Stosuj sekcje 3–4 [docs/engineering-standards.md](docs/engineering-standards.md) (przepływ pracy, bramki jakości, bezpieczeństwo, coding standards i wzorce); są obowiązujące. Sekcja 5 zawiera propozycje, które wdrażasz dopiero po mojej akceptacji. Przy sprzeczności z tym plikiem obowiązuje ten plik, a sprzeczność zgłoś.
- Przed zmianą przeczytaj dokumenty powiązane z zadaniem. Nie zgaduj wymagań: jeśli czegoś brakuje albo coś jest niejasne, zapytaj.
- Funkcjonalności i zmiany nietrywialne realizujesz wyłącznie na podstawie zatwierdzonej specyfikacji w `.ai/specs/`. Pozostałe zadania wieloetapowe zaczynasz od przedstawienia planu (zakres zmian, pliki, testy, ryzyka) i czekasz na akceptację.
- Pracuj małymi krokami. Każdy krok kończy się działającym kodem i zielonymi testami.
- Nie rozszerzaj zakresu ponad zadanie. Zauważone dodatkowe problemy zgłoś, zamiast je od razu naprawiać.
- Decyzje architektoniczne (nowa biblioteka, zmiana wzorca, zmiana modelu danych) proponuj jako ADR w `docs/adr/` i nie wdrażaj ich bez akceptacji.
- Prompty procesowe znajdują się w `docs/prompts/`. Gdy zadanie się do nich odwołuje, wykonuj je etapami i zatrzymuj się w punktach kontrolnych.
- Jeśli instrukcja w tym pliku jest sprzeczna z dokumentacją narzędzia albo dobrą praktyką, zgłoś to, zamiast po cichu jej nie przestrzegać.
- Nie wykonuj `git push`, nie scalaj gałęzi i nie usuwaj danych bez wyraźnej prośby.

## Katalog `.ai/` (obowiązkowe)

Katalog `.ai/` to wspólna, wersjonowana pamięć projektu dla wszystkich agentów. Korzystanie z niego nie jest opcjonalne.

```
.ai/
├── specs/                # specyfikacje SDD w toku (draft, approved, in-progress)
│   ├── _template.md
│   ├── implemented/      # specyfikacje zrealizowane
│   └── archive/          # specyfikacje porzucone lub zastąpione
├── runs/                 # logi autonomicznych przebiegów AI
│   └── _template.md
├── lessons.md            # indeks wniosków, czytany na początku każdej sesji
└── lessons/              # szczegółowe opisy wniosków
    └── _template.md
```

**Nazewnictwo plików**

- Pliki w `specs/` (wraz z podkatalogami), `runs/` i `lessons/` mają nazwę w formacie `YYYY-MM-DD-slug.md`, np. `2026-10-20-envelope-allocation.md`.
- Datę pobierz z systemu (`date +%F`), nigdy jej nie zgaduj. W specyfikacjach jest to data utworzenia i nie zmienia się przy przenoszeniu pliku.
- Slug: kebab-case, małe litery, tylko ASCII, po angielsku, od 2 do 5 słów opisujących temat.
- Jeśli plik o takiej nazwie już istnieje, dodaj sufiks `-2`, `-3` itd.
- Pliki `_template.md` są wzorcami i nie podlegają tej konwencji. Nowe pliki zawsze twórz na ich podstawie.
- Treść plików piszesz po polsku.

**Specyfikacje (`specs/`)**

- Każda funkcjonalność i każda zmiana nietrywialna (nowa lub zmieniona tabela, funkcja RPC, polityka RLS, Edge Function, nowy ekran, zmiana zachowania aplikacji) zaczyna się od specyfikacji w `.ai/specs/`.
- Bez specyfikacji o statusie `approved` nie zaczynasz implementacji. Status `approved` nadaję wyłącznie ja; nie zmieniaj go samodzielnie.
- Cykl statusów (pole `status` w nagłówku YAML): `draft` → `approved` → `in-progress` → `implemented`, albo `archived` na dowolnym etapie.
- Plan przedstawiony tylko w rozmowie, także w trybie planowania wbudowanym w narzędzie, nie zastępuje specyfikacji. Jeśli plan prowadzi do implementacji funkcjonalności lub zmiany nietrywialnej, zapisz go jako specyfikację.
- Specyfikacja jest źródłem prawdy podczas implementacji. Jeśli w trakcie pracy okaże się, że trzeba od niej odejść, zatrzymaj się, zaktualizuj specyfikację, przywróć status `draft` i poproś o ponowną akceptację.
- Po spełnieniu Definition of Done ustaw status `implemented`, uzupełnij sekcję podsumowania realizacji (z linkami do logów przebiegów) i przenieś plik bez zmiany nazwy do `.ai/specs/implemented/`.
- Specyfikację porzuconą lub zastąpioną oznacz jako `archived`, dopisz powód (i link do specyfikacji, która ją zastępuje) i przenieś do `.ai/specs/archive/`.
- Specyfikacja odwołuje się do user stories z PRD (`US-xx`) i do powiązanych ADR.
- Specyfikacji nie wymagają wyłącznie drobne zmiany bez wpływu na zachowanie aplikacji: literówki, formatowanie, poprawki dokumentacji.

**Logi przebiegów (`runs/`)**

- Każdy autonomiczny przebieg ma log w `.ai/runs/`. Przebieg autonomiczny to praca, w której wykonujesz kilka kroków bez mojej akceptacji każdego z nich, np. implementacja zatwierdzonej specyfikacji, wieloetapowa naprawa błędu, refaktoryzacja, przygotowanie szkieletu projektu.
- Log zakładasz na początku przebiegu, nie po fakcie, i aktualizujesz go po każdym istotnym kroku. Jeśli przebieg zostanie przerwany, log musi pozwolić go wznowić.
- Log zawiera: cel i link do specyfikacji, plan, kolejne kroki (co zrobiono, jakie komendy uruchomiono i z jakim wynikiem), podjęte decyzje i założenia, napotkane problemy, status końcowy (`completed`, `partial`, `failed` lub `aborted`) i proponowane następne kroki.
- Log jest obowiązkowy także w trybach z automatyczną akceptacją zmian. Jeśli korzystasz z subagentów lub agentów działających równolegle, log prowadzi sesja główna i dopisuje do niego wyniki ich pracy.
- Logi tylko uzupełniasz. Po zakończeniu przebiegu nie przepisujesz ich historii.

**Wnioski (`lessons.md` i `lessons/`)**

- `.ai/lessons.md` to krótki indeks: jedna linia na wniosek, sformułowana jako reguła do stosowania, z linkiem do szczegółów w `.ai/lessons/`. Wpisy grupujesz według obszarów (Baza i Supabase, Frontend, Vite+, Testy, Proces).
- Wniosek zapisujesz obowiązkowo: po naprawieniu błędu (przyczyna i sposób unikania), po mojej korekcie Twojego podejścia, po odkryciu nieoczywistego zachowania narzędzia lub biblioteki, po nieudanym podejściu, którego nie warto powtarzać, oraz zawsze, gdy poproszę, żebyś coś zapamiętał.
- Szczegóły zapisujesz w `.ai/lessons/YYYY-MM-DD-slug.md` według wzorca: kontekst, co się stało, przyczyna, wniosek, jak go stosować, powiązania (specyfikacja, log, commit).
- Przed dodaniem sprawdź, czy podobny wniosek już istnieje. Jeśli tak, zaktualizuj go zamiast tworzyć duplikat.
- Utrzymuj `lessons.md` zwięzłym (orientacyjnie do 100 linii). Gdy się rozrasta, zaproponuj konsolidację.
- Wnioski zapisujesz w `.ai/`, nawet jeśli Twoje narzędzie ma własną, wbudowaną pamięć. Pamięć narzędzia nie jest współdzielona z innymi agentami i nie trafia do repozytorium, więc nie może być jedynym miejscem zapisu.
- Jeśli wniosek powinien stać się stałą zasadą projektu, zaproponuj odpowiednią zmianę w tym pliku.

**Zasady wspólne**

- W `.ai/` nie zapisujesz sekretów, kluczy, haseł ani prawdziwych danych osobowych lub finansowych.
- Zmiany w `.ai/` commitujesz razem ze zmianami w kodzie, których dotyczą.

## Zasady architektoniczne (obowiązkowe)

**Logika biznesowa**

- Reguły domenowe (przydziały, salda, przesunięcia, walidacje kwot) realizuj w Postgresie: funkcje wywoływane przez RPC, ograniczenia (`CHECK`, klucze obce), triggery tam, gdzie to uzasadnione. Operacje wieloetapowe muszą być atomowe (jedna funkcja, jedna transakcja).
- Klient (web, w przyszłości iOS) tylko wywołuje te funkcje i prezentuje wyniki. Nie powielaj reguł domenowych w komponentach React. Walidacja w UI służy wyłącznie wygodzie użytkownika.
- Zapis danych budżetu odbywa się wyłącznie przez funkcje RPC (`security definer`, `set search_path = ''`, z jawnym sprawdzeniem `auth.uid()` i roli w budżecie). Tabele nie mają polityk zapisu, a odczyt idzie przez polityki RLS `select` ([ADR 0003](docs/adr/0003-business-logic-in-database.md)).
- Błędy biznesowe funkcji RPC zgłaszaj jako `raise exception '<KOD>' using errcode = 'PT<status>'` ze stałym kodem z katalogu w [docs/architecture.md](docs/architecture.md#kontrakt-błędów); kodów nie zmieniaj ani nie usuwaj. Nigdy nie używaj SQLSTATE `40001`.
- Logika wymagająca sekretów lub zewnętrznych API (np. model AI w etapie 3) trafia do Edge Functions.
- Salda kopert wyliczaj z historii operacji (widoki lub funkcje), zamiast przechowywać je jako ręcznie edytowalne pola. Odstępstwo wymaga ADR.

**Dane i bezpieczeństwo**

- Każda tabela z danymi budżetu ma kolumnę `budget_id` i włączone RLS z politykami sprawdzającymi członkostwo w budżecie. Nigdy nie wyłączaj RLS.
- Uprawnienia nadawaj wyłącznie jawnie w migracjach: `grant select` na tabelach i `grant execute` na funkcjach tylko dla `authenticated`; `anon` nie dostaje nic. Nie polegaj na domyślnych uprawnieniach (`auto_expose_new_tables = false`, domyślne `EXECUTE` dla `PUBLIC` wyłączone w pierwszej migracji).
- Klucz `service_role` nigdy nie trafia do frontendu ani do repozytorium. Frontend korzysta wyłącznie z klucza publicznego i polityk RLS.
- Kwoty przechowuj jako liczby całkowite w groszach (`bigint` w bazie, `number` w TypeScript). Nigdy nie używaj liczb zmiennoprzecinkowych do pieniędzy. Formatowanie na złotówki tylko w warstwie prezentacji.
- Daty operacji przechowuj jako `date` (data lokalna), a nie znacznik czasu, żeby uniknąć przesunięć stref czasowych. Strefa domyślna: `Europe/Warsaw`.

**Schemat bazy jako kontrakt**

- Zmiany schematu tylko przez migracje Supabase CLI (`supabase migration new`). Nigdy nie edytuj migracji, która została już zastosowana; dodaj nową.
- Zmiany muszą być wstecznie zgodne (dodawanie zamiast zmieniania lub usuwania). Zmiana łamiąca kontrakt wymaga ADR i planu migracji.
- Po każdej zmianie schematu wygeneruj na nowo typy TypeScript. Nie edytuj wygenerowanych typów ręcznie.

## Stack i konwencje

**Aplikacja webowa (`apps/web`)**

- React + TypeScript w trybie `strict`. Bez `any`; jeśli typ jest naprawdę nieznany, użyj `unknown` i zawężaj.
- Aplikacja jest SPA, bez renderowania po stronie serwera.
- Routing: TanStack Router. Dane z backendu: TanStack Query (bez pobierania danych w `useEffect`). Klucze zapytań definiuj w jednym miejscu.
- UI: Tailwind CSS i shadcn/ui. Komponenty shadcn dodawaj przez jego CLI, a nie przepisuj ręcznie. Interfejs musi działać dobrze na telefonie (mobile first).
- Nie dodawaj nowych zależności bez uzasadnienia i mojej zgody.

**Vite+**

- Projekt używa Vite+, a nie samodzielnego Vite. Komendy uruchamiaj przez `vp`.
- Repozytorium jest monorepo Vite+ (workspaces w `package.json`, obecnie tylko `apps/*`). Konfiguracja jest w plikach `vite.config.ts` z `defineConfig` importowanym z `vite-plus`: główny `vite.config.ts` zawiera lint, formatowanie, `test.projects` i `defaultPackage`, a `vite.config.ts` pakietu (np. `apps/web`) tylko pluginy, aliasy i blok `test`. Ustawienia lintu i formatowania dla pakietów dodawaj przez `lint.overrides` / `fmt.overrides` w pliku głównym. Nie twórz osobnych konfiguracji dla Oxlint, Oxfmt ani Vitest i nie dodawaj ESLint ani Prettier.
- Vite+ jest nowym narzędziem i Twoja wiedza o nim może być niepełna. W razie wątpliwości sprawdź dokumentację: https://viteplus.dev/llms-full.txt, zamiast zakładać konfigurację znaną z klasycznego Vite.

**Menedżer pakietów: Bun**

- Menedżerem pakietów projektu jest Bun. Wybór jest zapisany w `package.json` (pole `devEngines.packageManager`), więc komendy `vp` do zarządzania zależnościami automatycznie korzystają z Bun.
- Zależności instalujesz, dodajesz i usuwasz przez `vp install`, `vp add`, `vp remove`. Jednorazowe narzędzia (np. CLI shadcn) uruchamiasz przez `vp dlx`. Bezpośrednio `bun` / `bunx` wywołujesz tylko wtedy, gdy `vp` nie ma odpowiednika.
- Nigdy nie używaj `npm`, `npx`, `pnpm` ani `yarn`, także w dokumentacji, skryptach i CI. Jeśli instrukcja z zewnętrznej dokumentacji podaje komendę `npx ...` lub `npm install ...`, przetłumacz ją na odpowiednik `vp` (lub `bunx` / `bun add`).
- Jedynym plikiem blokady zależności jest `bun.lock` i jest commitowany. Gdyby pojawił się `package-lock.json`, `pnpm-lock.yaml` lub `yarn.lock`, usuń go i zgłoś, skąd się wziął.
- Bun pełni rolę menedżera pakietów, a nie zestawu narzędzi deweloperskich: testy uruchamiasz przez `vp test` (Vitest), nie `bun test`, a serwer deweloperski i build przez `vp dev` i `vp build`.

**Backend (`supabase/`)**

- Migracje w `supabase/migrations`, testy bazy (pgTAP) w `supabase/tests`, Edge Functions w `supabase/functions`, dane testowe w `supabase/seed.sql`.
- Nazwy tabel i kolumn w `snake_case`, tabele w liczbie mnogiej (np. `envelopes`, `expense_splits`).

## Komendy

Wszystkie komendy uruchamiasz z katalogu głównego repozytorium. Komendy Supabase wymagają działającego Dockera.

| Cel                                                              | Komenda                                                                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Instalacja zależności (przez Bun)                                | `vp install`                                                                                    |
| Dodanie / usunięcie zależności aplikacji                         | `vp -C apps/web add <pakiet>` / `vp -C apps/web remove <pakiet>` (`-D` dla dev)                 |
| Dodanie zależności narzędziowej do katalogu głównego             | `vp add -D <pakiet>`                                                                            |
| Jednorazowe uruchomienie narzędzia                               | `vp dlx <pakiet>`                                                                               |
| Dodanie komponentu shadcn/ui                                     | `vp -C apps/web dlx shadcn@latest add <komponent>`                                              |
| Serwer deweloperski                                              | `vp dev` (z dodatkowymi flagami: `vp -C apps/web dev --port <port>`)                            |
| Formatowanie, lint, typy                                         | `vp check` (poprawki: `vp check --fix`)                                                         |
| Testy jednostkowe                                                | `vp test`                                                                                       |
| Testy jednostkowe z progiem pokrycia 100% (jak w CI)             | `vp test --coverage`                                                                            |
| Kontrola katalogu `.ai/` (nazwy, statusy, indeks wniosków)       | `vp run check:ai`                                                                               |
| Hook pre-commit (`vp staged`: `vp check --fix`, kontrola `.ai/`) | instalowany przez `vp install` (skrypt `prepare` → `vp config`); wyłączenie: `vp hooks disable` |
| Build produkcyjny                                                | `vp build`                                                                                      |
| Lokalny Supabase (start / stop / adresy i klucze)                | `vp exec supabase start` / `vp exec supabase stop` / `vp exec supabase status`                  |
| Nowa migracja                                                    | `vp exec supabase migration new <nazwa>`                                                        |
| Odtworzenie bazy z migracji i seed                               | `vp exec supabase db reset`                                                                     |
| Testy bazy (pgTAP)                                               | `vp exec supabase test db`                                                                      |
| Generowanie typów                                                | `vp exec supabase gen types typescript --local > apps/web/src/lib/database.types.ts`            |
| Testy E2E                                                        | do ustalenia                                                                                    |

## Testy

- Każda reguła domenowa ma testy na poziomie bazy (pgTAP), łącznie z przypadkami brzegowymi: zera, kwoty ujemne, przekroczenie puli, zaokrąglenia przy podziale.
- Każda tabela z danymi budżetu ma testy RLS potwierdzające, że członek budżetu A nie widzi ani nie modyfikuje danych budżetu B, a osoba niezalogowana nie ma dostępu do niczego.
- Logikę po stronie frontendu (formatowanie, mapowanie danych, hooki) testuj w Vitest.
- Każda nowa funkcja i każdy zmieniony kod TypeScript (moduły, funkcje, hooki, komponenty, skrypty) muszą mieć 100% pokrycia testami jednostkowymi we wszystkich metrykach: linie, gałęzie, funkcje i instrukcje. Próg jest liczony dla każdego pliku osobno i egzekwowany w CI przez `vp test --coverage`; zadanie z pokryciem poniżej 100% nie jest skończone. Wykluczenia z pomiaru (wyłącznie pliki generowane, komponenty shadcn/ui i punkt wejścia `main.tsx`) są w `test.coverage.exclude` w głównym `vite.config.ts`. Nowe wykluczenie lub komentarz wyłączający pomiar (`v8 ignore`) wymaga uzasadnienia i mojej zgody.
- Kluczowe ścieżki użytkownika obejmij testami E2E (Playwright), gdy powstaną.
- Testy piszesz na podstawie kryteriów akceptacji z PRD. Jeśli kryteria nie pozwalają jednoznacznie ustalić oczekiwanego wyniku, zapytaj.

## Definition of Done

Zadanie jest skończone, gdy:

- `vp check`, `vp test --coverage` (100% pokrycia) i `vp build` przechodzą bez błędów,
- przy zmianach w bazie: `supabase db reset` i `supabase test db` przechodzą, a typy są wygenerowane na nowo,
- nowa logika ma testy, w tym przypadki brzegowe i testy dostępu,
- dokumentacja (PRD, architektura, ADR, ten plik) odzwierciedla wprowadzone zmiany,
- specyfikacja ma status `implemented`, uzupełnione podsumowanie realizacji i leży w `.ai/specs/implemented/`,
- log przebiegu w `.ai/runs/` jest kompletny i ma status końcowy,
- wnioski z zadania (jeśli były) są zapisane w `.ai/lessons/` i dopisane do `.ai/lessons.md`,
- w repozytorium nie ma sekretów ani danych osobowych,
- przedstawiłeś krótkie podsumowanie: co zmieniono, jak to zweryfikowano, co zostało otwarte.

## Git

- Commity w formacie Conventional Commits, po angielsku (np. `feat(envelopes): add allocation rpc`).
- Tytuł PR też w formacie Conventional Commits (przy squash merge staje się wiadomością commita na `master`); sprawdza go CI (`pr-title.yml`).
- Praca na gałęziach (`feat/...`, `fix/...`, `chore/...`, `docs/...`), małe i spójne zmiany.
- Nie commituj plików `.env`. Wymagane zmienne opisuj w `.env.example`.

## Rozstrzygnięte decyzje

Ustalone w [docs/prd.md](docs/prd.md). Zmiana którejkolwiek wymaga aktualizacji PRD (a dla decyzji architektonicznych także ADR):

- niewykorzystane środki: saldo koperty w całości przechodzi na kolejny miesiąc (zwrot reszty do puli jako opcja per koperta – etap 2),
- saldo koperty i pula „do rozdysponowania” mogą być ujemne; interfejs wyraźnie to oznacza,
- jedna osoba może należeć do wielu budżetów,
- role: `owner` (zarządza budżetem, członkami i zaproszeniami; może być kilku) i `member` (pełne operacje na kopertach, przychodach, przydziałach i wydatkach),
- logowanie: e-mail z magic linkiem lub kodem OTP, bez haseł; dodanie dostawców OAuth (np. Google) wymaga także Sign in with Apple ze względu na aplikację iOS,
- zaproszenia: jednorazowy link z tokenem ważnym 7 dni, z możliwością unieważnienia,
- hosting frontendu: Cloudflare Pages.

## Otwarte decyzje

Brak. Nowe decyzje produktowe lub architektoniczne, które wyjdą w trakcie pracy, dopisz tutaj i nie rozstrzygaj ich samodzielnie; ustalenia trafiają do PRD lub ADR.

## Czego nie robić

- Nie zaczynaj implementacji bez specyfikacji o statusie `approved` i nie zatwierdzaj specyfikacji samodzielnie.
- Nie pracuj autonomicznie bez logu przebiegu i nie przepisuj historii zakończonych logów.
- Nie kończ zadania bez zapisania wniosków, jeśli naprawiałeś błąd lub zostałeś skorygowany.
- Nie umieszczaj logiki domenowej w komponentach React.
- Nie używaj liczb zmiennoprzecinkowych do kwot.
- Nie wyłączaj RLS i nie omijaj go kluczem `service_role` w kodzie klienta.
- Nie edytuj zastosowanych migracji ani wygenerowanych typów.
- Nie używaj `npm`, `npx`, `pnpm` ani `yarn` i nie dopuszczaj do powstania ich plików blokady.
- Nie dodawaj bibliotek ani narzędzi spoza ustalonego stacku bez ADR.
- Nie implementuj funkcji spoza aktualnego zadania lub etapu.
