# Standardy inżynieryjne

> **Status:** sekcje 3–4 zatwierdzone (2026-10-19) i obowiązujące dla wszystkich agentów i ludzi; sekcja 5 to propozycje, wdrażane dopiero po akceptacji. Wdrożone po akceptacji: P-01 (konfiguracja; migracja w S-01), P-02, P-04 (doradcy; kontrola typów w S-01), P-05, P-06, P-12 (`sfw`, ochrona `master`, kontrola tytułu PR), a S-01 zaktualizowana o P-01, P-02, P-03 i P-07. Zaakceptowane do wdrożenia w S-01: P-11 (ADR 0011). Dokument rozwija zasady z [AGENTS.md](../AGENTS.md), które pozostają nadrzędne. Źródła researchu: sekcja 6.

## 1. Cel

Ustalić, jak budujemy aplikację w obecnym stacku, żeby kod pisany przez różnych agentów i ludzi był spójny, bezpieczny i łatwy w przeglądzie: jakie narzędzia zostają, jakie standardy obowiązują, jakich wzorców używamy i co warto zmienić teraz, a co później.

## 2. Ocena stacku

| Obszar                                                        | Decyzja                                                                                        | Uzasadnienie                                                                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Vite+ 1.3, Bun 1.4, Node 24 LTS                               | zostaje                                                                                        | jedno narzędzie do build, test, lint, fmt i hooków; wersje przypięte w `devEngines` i `catalog`                                 |
| React 19 + TypeScript 7 (`strict`)                            | zostaje, zaostrzyć TS ([P-06](#5-propozycje-zmian))                                            | dodatkowe flagi nie zgłaszają dziś żadnych błędów                                                                               |
| TanStack Router (plikowy) + TanStack Query 5                  | zostaje, ustalić wzorzec integracji ([P-07](#5-propozycje-zmian))                              | oficjalna integracja: `queryClient` w kontekście routera, wspólne `queryOptions` dla loadera i komponentu                       |
| Tailwind 4 + shadcn/ui (radix-nova) + `clsx`/`tailwind-merge` | zostaje                                                                                        | bez zmian; wniosek o imporcie `cn` obowiązuje                                                                                   |
| Walidacja danych                                              | brak – dodać Zod v4 ([P-08](#5-propozycje-zmian))                                              | jeden schemat dla parametrów URL, formularzy i danych z zewnątrz; Router przyjmuje Zod v4 bez adaptera                          |
| Formularze                                                    | bez biblioteki do S-07 ([P-09](#5-propozycje-zmian))                                           | proste formularze nie potrzebują biblioteki; decyzja przy formularzu podziału wydatku                                           |
| Daty                                                          | bez biblioteki, bez Temporal ([P-10](#5-propozycje-zmian))                                     | Temporal nie działa jeszcze w Safari (PWA na iOS)                                                                               |
| Supabase (Postgres 17, PostgREST, Auth)                       | zostaje, zaostrzyć uprawnienia domyślne ([P-01](#5-propozycje-zmian))                          | lokalnie nowe tabele i funkcje są domyślnie dostępne dla ról API, w nowych projektach chmurowych już nie                        |
| Migracje pisane ręcznie                                       | zostają                                                                                        | schematy deklaratywne (pg-delta) są w fazie alfa i zamieniają zmianę nazwy na usunięcie + dodanie ([P-15](#5-propozycje-zmian)) |
| pgTAP                                                         | zostaje, dodać własne helpery i testy niezmienników ([P-03](#5-propozycje-zmian))              | gotowe helpery basejump wymagają dbdev, `pg_tle` i `http` – zbyt wiele dla kilku funkcji                                        |
| Vitest                                                        | zostaje; testy komponentów w trybie przeglądarkowym razem z T-01 ([P-11](#5-propozycje-zmian)) | Vite+ ma wbudowany runtime trybu przeglądarkowego; provider Playwright współdzielony z E2E                                      |
| Playwright (E2E)                                              | zostaje (T-01)                                                                                 | –                                                                                                                               |
| GitHub Actions + setup-vp                                     | zostaje, dodać kontrole ([P-04](#5-propozycje-zmian), [P-12](#5-propozycje-zmian))             | doradcy bezpieczeństwa Supabase i kontrola typów są tanie                                                                       |
| Hosting: Cloudflare Pages                                     | do rewizji przy T-02 ([P-13](#5-propozycje-zmian))                                             | Cloudflare kieruje nowe projekty do Workers Static Assets; SPA wymaga tylko konfiguracji                                        |
| React Compiler                                                | nie teraz ([P-14](#5-propozycje-zmian))                                                        | natywny kompilator eksperymentalny, wariant Babel to 3 dodatkowe zależności; mała aplikacja                                     |

## 3. Standardy inżynieryjne

### 3.1. Przepływ pracy

- Każde zgłoszenie z backlogu w GitHub Issues ([zasady](backlog.md)) to osobna gałąź `feat/<slug>` od `master` i osobny PR; jeden PR realizuje jedną specyfikację.
- PR-y są małe: orientacyjnie do 400 zmienionych linii bez plików generowanych (`routeTree.gen.ts`, `database.types.ts`, `bun.lock`). Większe zadanie dzielimy na kroki ze specyfikacji.
- Scalanie przez **squash merge**; tytuł PR w formacie Conventional Commits, bo staje się wiadomością commita na `master`.
- `master` jest chroniony: wymagane zielone zadania CI (`Check, test, build`, `Database tests (pgTAP)`, `PR title`), brak bezpośrednich pushy.
- Specyfikacja, log przebiegu i wnioski są częścią PR (szablon `.github/pull_request_template.md`).

### 3.2. Bramki jakości

| Gdzie                    | Co                                                                                                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pre-commit (`vp staged`) | `vp check --fix` na zmienionych plikach, `vp run check:ai` przy zmianach w `.ai/`                                                                                                                        |
| CI – web                 | `vp run check:ai`, `vp check`, `vp test --coverage` (100% pokrycia na plik), `vp build`                                                                                                                  |
| CI – baza                | `supabase db start`, `supabase db reset`, `supabase test db`, doradcy bezpieczeństwa i wydajności (`db advisors --fail-on warn`); od S-01 także kontrola aktualności typów ([P-04](#5-propozycje-zmian)) |
| Przegląd PR              | checklista Definition of Done z szablonu PR                                                                                                                                                              |

### 3.3. Bezpieczeństwo

- Sekrety tylko w zmiennych środowiskowych i sekretach GitHub/Supabase; w kliencie wyłącznie zmienne `VITE_*` z wartościami publicznymi.
- Każda tabela: RLS włączone, jawne `grant` tylko dla potrzebnych ról, polityki `to authenticated` ([P-01](#5-propozycje-zmian)).
- Każda funkcja: jawne `grant execute` dla `authenticated`; brak uprawnień dla `anon` i `public`, chyba że funkcja jest celowo publiczna.
- Zależności dodajemy tylko po akceptacji; instalacja w CI z `--frozen-lockfile`, a po [P-12](#5-propozycje-zmian) przez Socket Firewall.
- Parametry przekierowań (np. `redirect` po logowaniu) przyjmują tylko ścieżki wewnętrzne aplikacji.

## 4. Coding standards i wzorce

### 4.1. TypeScript

- `strict` oraz `noUncheckedIndexedAccess` i `noImplicitOverride` ([P-06](#5-propozycje-zmian)); `erasableSyntaxOnly` jest już włączone, więc bez `enum`, `namespace` i właściwości w parametrach konstruktora – zamiast `enum` unia literałów lub obiekt `as const`.
- Bez `any` (reguła lintu) i bez `!` (non-null assertion) poza miejscami, gdzie typ obiektywnie nie może wyrazić gwarancji; wtedy komentarz z powodem.
- Typy danych z bazy tylko z wygenerowanego `Database` (`Tables<"envelopes">`, `Functions<"create_expense">["Args"]`); nie przepisujemy ich ręcznie.
- Importy przez alias `@/`; bez głębokich ścieżek względnych (`../../`). Eksporty nazwane; pliki tras eksportują `Route`.
- Nazwy plików `kebab-case`, komponenty `PascalCase`, hooki `useX`, fabryki zapytań `xQueryOptions`.
- Lint egzekwuje: `typescript/no-explicit-any`, `typescript/no-non-null-assertion`, `import/no-relative-parent-imports` (importy z katalogów nadrzędnych tylko przez `@/`), `import/no-default-export` (wyjątek: pliki konfiguracji narzędzi, np. `vite.config.ts`) i `unicorn/filename-case` (`kebab-case`). Pozostałe konwencje z tej sekcji sprawdza przegląd PR.

### 4.2. Struktura frontendu

```
apps/web/src/
├── routes/                 # cienkie trasy: loader, validateSearch, kompozycja komponentów
├── features/<feature>/     # np. envelopes, expenses
│   ├── api.ts              # queryOptions, mutacje, wywołania RPC – jedyne miejsce z supabase.*
│   ├── components/         # kontenery: podpinają dane z api.ts do widoków i komponentów z @koperty/ui
│   └── *.test.ts           # testy logiki funkcjonalności
└── lib/                    # infrastruktura: supabase, query-client, query-keys, rpc-errors

packages/ui/                # design system @koperty/ui (ADR 0012), dokumentacja w Storybooku
├── src/tokens/             # tokeny – jedyne miejsce z wartościami kolorów
├── src/primitives/         # komponenty bazowe (shadcn dostosowany do tokenów)
├── src/product/<epik>/     # komponenty produktu (prezentacyjne)
├── src/patterns/, src/views/  # wzorce i widoki ekranów (prezentacyjne, dane przez propsy)
└── docs/                   # strony MDX i bloki dokumentacji
```

- Wygląd powstaje wyłącznie w `packages/ui`; aplikacja składa ekrany z jego komponentów i nie definiuje własnych stylów poza układem.

- Komponenty nie wołają `supabase` bezpośrednio – tylko przez `features/*/api.ts`.
- Klucze zapytań pozostają w jednym module (`lib/query-keys.ts`, zgodnie z AGENTS.md), zbudowane hierarchicznie od budżetu: `["budgets", budgetId, "envelopes"]`, żeby zmiana w budżecie unieważniała wszystkie jego dane jednym wywołaniem.

### 4.3. Dane: Router + Query

- Router: `context: { queryClient, auth }`, `defaultPreload: "intent"`, `defaultPreloadStaleTime: 0` (świeżość danych kontroluje Query, nie cache routera), domyślne `defaultPendingComponent` i `defaultErrorComponent`.
- Odczyt: `xQueryOptions(...)` w `api.ts` → w trasie `loader: ({ context }) => context.queryClient.ensureQueryData(xQueryOptions(...))` → w komponencie `useSuspenseQuery(xQueryOptions(...))`. Bez pobierania danych w `useEffect`.
- Zapis: `useMutation` wywołuje RPC, a po sukcesie unieważnia klucze (`invalidateQueries({ queryKey: queryKeys.budget(budgetId) })`). Bez aktualizacji optymistycznych w MVP – salda i pulę liczy baza.
- Parametry URL walidowane schematem w `validateSearch` (z `.catch()` dla wartości domyślnych), np. wybrany miesiąc `?month=2026-10`.
- Błędy RPC zamieniane w jednym miejscu (`lib/rpc-errors.ts`) na `AppError { code, message }` z komunikatem po polsku; nieznany kod → komunikat ogólny i log w konsoli.
- Sesja w kontekście routera; ochrona tras w `beforeLoad` trasy układu `_authenticated`. Autoryzację zawsze egzekwuje baza (RLS i RPC), a nie klient.

### 4.4. Kwoty i daty

- Kwoty: `number` w groszach w całym kodzie; `@koperty/ui/lib/money` (pakiet design systemu, wspólny dla komponentów i aplikacji – decyzja E3-Q1 z 2026-10-30) zawiera jedyne funkcje `formatPLN(grosze)` (`Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", useGrouping: "always" })`, minus jako „−”), `formatAmountInput(grosze)` i `parsePLN(tekst)` (parsowanie tekstu na grosze bez arytmetyki zmiennoprzecinkowej, np. „1 234,56” → `123456`). Pola kwot: komponent `AmountInput` (`inputMode="decimal"`).
- Daty operacji: ciąg `YYYY-MM-DD` (tak zwraca PostgREST typ `date`), bez zamiany na `Date` w logice. `@koperty/ui/lib/dates`: `todayInWarsaw()` (przez `Intl.DateTimeFormat` ze strefą `Europe/Warsaw`), `formatDate()`, `formatDayHeading()`, `formatMonth()`, `monthOf()`, `addMonths()` na ciągach (miesiąc jako `YYYY-MM`). Temporal po osiągnięciu statusu Baseline (z Safari).

### 4.5. React i UI

- Komponenty funkcyjne; stan wyliczany zamiast synchronizowanego efektami; `useEffect` tylko dla integracji z zewnętrznymi API przeglądarki.
- Mobile first od 360 px; cele dotyku min. 44 px; jedno główne działanie na ekran.
- Dostępność: każde pole ma `<Label>`, błędy przez `aria-invalid` i `aria-describedby`, fokus przenoszony na pierwszy błąd, komunikaty dynamiczne w regionie `aria-live`. Lint `jsx-a11y` ([P-05](#5-propozycje-zmian)).
- Teksty interfejsu po polsku, bezpośrednio w komponentach; komunikaty błędów RPC w `lib/rpc-errors.ts`.
- Formularze do S-07: kontrolowane pola + walidacja schematem przy wysłaniu; walidacja w UI służy wygodzie, reguły egzekwuje baza.

### 4.6. SQL i migracje

- Jedna migracja = jeden spójny krok specyfikacji; nazwa w `snake_case` opisująca zmianę (`create_envelopes`, `add_envelope_archiving`).
- Każda migracja tworząca tabelę zawiera razem: tabelę z ograniczeniami, indeksy (zawsze na `budget_id` i kolumnach z polityk RLS), `enable row level security`, jawne `grant`, polityki.
- Konwencje: tabele w liczbie mnogiej, `id uuid primary key default gen_random_uuid()`, `budget_id uuid not null references public.budgets (id) on delete cascade`, `created_at` / `updated_at timestamptz not null default now()`, `created_by uuid references auth.users (id) on delete set null`; jawne `on delete` przy każdym kluczu obcym; kwoty `bigint` z `check`.
- Słowa kluczowe SQL małymi literami, pełne kwalifikowanie nazw (`public.envelopes`, `auth.uid()`) – wymagane przez `set search_path = ''`.

### 4.7. Wzorce w bazie

- **Funkcja-komenda (zapis):** `security definer`, `set search_path = ''`, kolejno: walidacja wejścia → autoryzacja (`private.require_member(p_budget_id)` / `private.require_owner(...)`, które zgłaszają błąd) → zapis → zwrot `id`. Jedna funkcja = jedna transakcja.
- **Funkcja-zapytanie (odczyt wyliczany):** `security invoker`, `stable`, `language sql` gdzie się da; podlega RLS, więc nie sprawdza członkostwa sama.
- **Pomocnicze funkcje autoryzacji** w schemacie `private` (niewystawionym przez API): `is_budget_member` / `is_budget_owner` (`boolean`, do polityk) i `require_*` (do funkcji-komend).
- **Polityki RLS:** zawsze `to authenticated`; `auth.uid()` i funkcje pomocnicze w podzapytaniu `(select ...)`, żeby liczyły się raz na zapytanie; nazwa `<tabela>_select_member`.
- **Spójność budżetu:** złożone klucze obce `(id, budget_id)`; niezmienniki między wierszami (suma części wydatku) przez odroczone triggery ograniczające.
- **Kontrakt błędów:** każdy błąd biznesowy ma stały kod w `message` i SQLSTATE z rodziny `PTxyz`, który PostgREST zamienia na status HTTP ([P-02](#5-propozycje-zmian)):

  ```sql
  raise exception 'ENVELOPE_ARCHIVED' using errcode = 'PT409';
  ```

  Kody są częścią API (także dla iOS) – katalog kodów w `docs/architecture.md`, nowych nie zmieniamy ani nie usuwamy. Nigdy SQLSTATE `40001` (PostgREST 14 ponawia transakcję w nieskończoność).

### 4.8. Testy

- **pgTAP:** plik na tabelę lub funkcję (`supabase/tests/<obszar>.test.sql`), struktura `begin; plan(n); … finish(); rollback;`. Dane przygotowujemy helperami jako właściciel bazy, działania wykonujemy jako `authenticated` przez `tests.authenticate_as(...)`. Asercje: `results_eq`, `is_empty`, `throws_ok(sql, 'PT409', 'ENVELOPE_ARCHIVED')`, `lives_ok`.
- **Testy niezmienników** (jeden plik, uruchamiany zawsze): każda tabela w `public` ma RLS; żadna funkcja w `public` nie jest wykonywalna przez `anon`; każda funkcja `security definer` ma ustawione `search_path`.
- **Vitest:** testy obok kodu (`money.test.ts`), funkcje czyste, przypadki tablicowe `it.each`; bez mockowania Supabase w testach logiki. Wyjątki: test modułu infrastruktury, który tylko tworzy klienta (np. `lib/supabase.ts`), może zastąpić konstruktor SDK mockiem; testy `features/*/api.ts` używają mocka klienta Supabase i sprawdzają tylko wywołaną metodę, jej argumenty i zamianę błędu na `AppError` (zadanie CI `web` nie uruchamia Supabase, a reguły domenowe testuje pgTAP; potwierdzone 2026-10-25 w S-01).
- **Komponenty:** od S-01 tryb przeglądarkowy Vitest z Playwrightem (pliki `*.browser.test.tsx`, [ADR 0011](adr/0011-component-tests-vitest-browser-playwright.md)) dla tras i komponentów; logika w czystych funkcjach testowanych w Node.
- **E2E:** od T-01 Playwright dla ścieżek użytkownika; tylko fikcyjne dane; kod OTP z API Mailpit.

### 4.9. Lint i formatowanie

- Oxfmt z ustawieniami domyślnymi (bez dyskusji o stylu); wyjątki tylko w głównym `vite.config.ts`.
- Oxlint: kategorie `correctness` (błąd), `suspicious` i `perf` (ostrzeżenie) oraz pluginy `typescript`, `react`, `import` (`no-cycle`), `promise`, `jsx-a11y`, `vitest` ([P-05](#5-propozycje-zmian)). Wyłączenia reguł tylko z komentarzem uzasadniającym.

## 5. Propozycje zmian

Priorytety: **teraz** – przed rozpoczęciem S-01 (małe zmiany, zweryfikowane lokalnie lub wpływające na pierwszą migrację); **z zadaniem** – w ramach wskazanej pozycji backlogu; **później** – rewizja, gdy zmienią się warunki.

| ID   | Propozycja                                                                                                                                                                                                                                                                                                                                                            | Kiedy                                                    | ADR                                                                     | Uwagi                                                                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P-01 | Uprawnienia jawne zamiast domyślnych: `auto_expose_new_tables = false` w `supabase/config.toml`; w pierwszej migracji globalne `alter default privileges revoke execute on functions from public` (wersja `in schema public` nie wystarcza – sprawdzone lokalnie); w każdej migracji jawne `grant select ... to authenticated` i `grant execute ... to authenticated` | teraz (config) i S-01 (migracja)                         | aktualizacja ADR 0003 i architektury (sekcja 3)                         | zgodność lokalnego środowiska z nowymi projektami Supabase; zastępuje obecny zapis `revoke insert, update, delete`                                                                                    |
| P-02 | Kody błędów RPC z SQLSTATE `PTxyz` (`PT400` walidacja, `PT401` brak sesji, `PT403` brak uprawnień, `PT404` brak obiektu, `PT409` konflikt stanu) + katalog kodów w architekturze                                                                                                                                                                                      | teraz (aktualizacja specyfikacji S-01 i architektury)    | nie                                                                     | klient dostaje poprawne statusy HTTP; zastępuje `P0001`                                                                                                                                               |
| P-03 | Własne helpery testów w `supabase/tests/000-setup-helpers.test.sql` (schemat `tests`: `create_user`, `authenticate_as`, `clear_authentication`) i plik testów niezmienników                                                                                                                                                                                           | S-01                                                     | nie                                                                     | kilkadziesiąt linii SQL zamiast dbdev + `pg_tle` + `http`                                                                                                                                             |
| P-04 | W zadaniu CI bazy: `supabase db advisors --local --type all --fail-on warn` oraz kontrola typów (`supabase gen types ... > database.types.ts` i `git diff --exit-code`)                                                                                                                                                                                               | teraz (advisors), S-01 (typy – gdy powstanie plik)       | nie                                                                     | wykrywa brak RLS, brak indeksów, niezabezpieczone funkcje                                                                                                                                             |
| P-05 | Ostrzejszy lint: pluginy `import`, `promise`, `jsx-a11y`, `vitest`; kategorie `correctness`/`suspicious`/`perf`; `import/no-cycle`; wyłączenie `react/react-in-jsx-scope` (nieaktualna przy nowym JSX transform) i dopuszczenie importów CSS w `import/no-unassigned-import`                                                                                          | teraz                                                    | nie                                                                     | sprawdzone lokalnie: 0 błędów, 10 ostrzeżeń z dwóch reguł do wyłączenia                                                                                                                               |
| P-06 | `noUncheckedIndexedAccess` i `noImplicitOverride` w `tsconfig.app.json` i `tsconfig.node.json`                                                                                                                                                                                                                                                                        | teraz                                                    | nie                                                                     | sprawdzone lokalnie: 0 błędów; `exactOptionalPropertyTypes` na razie pomijamy (dziś też 0 błędów, ale zmienia znaczenie pól opcjonalnych i bywa niezgodna z typami bibliotek – do rozważenia po S-01) |
| P-07 | Wzorzec Router + Query z sekcji 4.3 (`defaultPreload`, `defaultPreloadStaleTime: 0`, loader + `ensureQueryData` + `useSuspenseQuery`, domyślne komponenty ładowania i błędu)                                                                                                                                                                                          | S-01                                                     | nie                                                                     | ustala wzorzec dla wszystkich kolejnych ekranów                                                                                                                                                       |
| P-08 | Zod v4 jako jedyna biblioteka walidacji (parametry URL, formularze, dane z `localStorage`)                                                                                                                                                                                                                                                                            | S-02 lub później (nie w S-01)                            | tak (nowa zależność)                                                    | Router przyjmuje Zod v4 bez adaptera; alternatywa Valibot – mniejszy pakiet, mniej znany agentom                                                                                                      |
| P-09 | Formularze bez biblioteki; decyzja (React Hook Form vs TanStack Form) dopiero przy dynamicznym formularzu podziału wydatku                                                                                                                                                                                                                                            | S-07                                                     | tak, jeśli biblioteka                                                   | unikamy zależności, której proste formularze nie potrzebują                                                                                                                                           |
| P-10 | `@koperty/ui/lib/money` i `@koperty/ui/lib/dates` bez bibliotek, według sekcji 4.4                                                                                                                                                                                                                                                                                    | S-04 (kwoty), S-02/S-05 (daty)                           | nie                                                                     | Temporal po wsparciu w Safari                                                                                                                                                                         |
| P-11 | Testy komponentów w trybie przeglądarkowym Vitest (`vite-plus/test/browser-playwright`, `vitest-browser-react`), Playwright współdzielony z E2E                                                                                                                                                                                                                       | S-01 (krok 0)                                            | tak – [ADR 0011](adr/0011-component-tests-vitest-browser-playwright.md) | jsdom nie wykrywa problemów z fokusem i układem na telefonie                                                                                                                                          |
| P-12 | Łańcuch dostaw i repozytorium: `sfw: true` w setup-vp (Socket Firewall przy `vp install`), ochrona `master` z wymaganymi zadaniami CI, squash merge, kontrola tytułu PR (Conventional Commits), automatyczne aktualizacje zależności (Dependabot lub Renovate – do sprawdzenia obsługa `catalog:` z Bun)                                                              | teraz (`sfw`, ustawienia GitHub), później (aktualizacje) | nie                                                                     | ustawienia repozytorium GitHub zmienia właściciel                                                                                                                                                     |
| P-13 | Hosting na Cloudflare Workers Static Assets (`not_found_handling = "single-page-application"`) zamiast Pages                                                                                                                                                                                                                                                          | T-02                                                     | tak (zastąpienie ADR 0008)                                              | koszt i konfiguracja podobne; Workers to kierunek rozwoju Cloudflare                                                                                                                                  |
| P-14 | React Compiler                                                                                                                                                                                                                                                                                                                                                        | później                                                  | tak                                                                     | wrócić, gdy natywny kompilator w `@vitejs/plugin-react` przestanie być eksperymentalny                                                                                                                |
| P-15 | Schematy deklaratywne (pg-delta)                                                                                                                                                                                                                                                                                                                                      | później                                                  | tak                                                                     | wrócić po wyjściu pg-delta z fazy alfa                                                                                                                                                                |
| P-16 | Idempotentne funkcje tworzące (`p_id uuid` generowany przez klienta), żeby ponowienie żądania z telefonu nie zdublowało wydatku                                                                                                                                                                                                                                       | S-06                                                     | nie (wzorzec w architekturze)                                           | ważne przy słabym zasięgu i w przyszłej aplikacji iOS                                                                                                                                                 |

**Wdrożone 2026-10-19 (PR #1):** P-01 (config), P-02 (architektura, ADR 0003, AGENTS.md), P-04 (advisors w CI), P-05, P-06, P-12 (`sfw`) oraz aktualizacja specyfikacji S-01 o P-01, P-02, P-03 i P-07. Ochronę `master` (P-12) włączono w PR #2 (niżej).

**Wdrożone 2026-10-19 (PR #2):** próg 100% pokrycia testami jednostkowymi w CI, reguły lintu z sekcji 4.1, kontrola tytułu PR w formacie Conventional Commits (workflow `pr-title.yml`, P-12). `master` chroni ruleset „Master branch lock”: PR, squash merge, wymagane zadania `Check, test, build`, `Database tests (pgTAP)` i `PR title`.

## 6. Źródła

- Supabase: [tabele nieeksponowane automatycznie w Data API](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically), [RLS – wydajność i dobre praktyki](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv), [rozszerzone testy pgTAP](https://supabase.com/docs/guides/local-development/testing/pgtap-extended), [SQLSTATE 40001 w funkcjach RPC](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b), [Declarative Schemas 2.0](https://supabase.com/blog/declarative-schemas-2-0-pg-delta), [test helpers (basejump)](https://github.com/usebasejump/supabase-test-helpers), [domyślne uprawnienia funkcji `security definer`](https://dev.to/michelfaure/3-supabase-security-incidents-one-shared-root-cause-security-definer-inherits-execute-to-public-coa)
- PostgREST: [błędy i własne kody HTTP](https://docs.postgrest.org/en/v14/references/errors.html)
- TanStack: [integracja Router + Query](https://tanstack.com/router/latest/docs/framework/react/integrations/query), [parametry wyszukiwania i walidatory](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)
- Frontend: README `@vitejs/plugin-react` 6.1.2 (React Compiler), [Vitest browser mode i vitest-browser-react](https://github.com/vitest-dev/vitest-browser-react), [porównanie bibliotek formularzy (źródło drugorzędne)](https://blog.logrocket.com/tanstack-form-vs-react-hook-form/), [Zod v4 i Valibot (źródło drugorzędne)](https://www.pkgpulse.com/guides/valibot-vs-zod-v4-2026), [status Temporal (źródło drugorzędne)](https://www.w3schools.com/jsrEF/jsref_obj_temporal_duration.asp)
- Narzędzia: [dokumentacja Vite+](https://viteplus.dev/llms-full.txt), [setup-vp](https://github.com/voidzero-dev/setup-vp), [Oxlint – wbudowane pluginy](https://oxc.rs/docs/guide/usage/linter/plugins), [Cloudflare – migracja z Pages do Workers](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/), [Bun catalogs](https://bun.com/docs/pm/catalogs)
