---
title: S-01 Logowanie e-mailem i profil użytkownika
status: approved
created: 2026-10-19
issue: 3
user_stories: [US-01, US-02, US-24]
adrs:
  [
    docs/adr/0002-supabase-client-independent-backend.md,
    docs/adr/0003-business-logic-in-database.md,
    docs/adr/0009-passwordless-email-auth.md,
    docs/adr/0011-component-tests-vitest-browser-playwright.md,
  ]
runs: []
---

# S-01 Logowanie e-mailem i profil użytkownika

## Cel

Użytkownik loguje się adresem e-mail bez hasła (link lub kod OTP), ma profil z nazwą wyświetlaną i może się wylogować. To pierwszy pionowy kawałek aplikacji: ustala wzorce (migracja, RLS, RPC, testy pgTAP, typowany klient, klucze zapytań, mapowanie błędów, ochrona tras), na których budują kolejne zadania z [backlogu](../../docs/backlog.md).

## Kontekst

- PRD: US-01 (logowanie), US-02 (wylogowanie), US-24 (nazwa wyświetlana), reguła 4.11.
- Architektura: tabela `profiles`, RPC `update_profile`, zasada „zapis wyłącznie przez RPC” ([architecture.md](../../docs/architecture.md), sekcje 2–4).
- ADR 0009: magic link i kod OTP, wiadomość zawiera oba.
- Stan wyjściowy: szkielet z fazy 0 (trasa `/`, `QueryClient`, nietypowany klient Supabase, brak migracji, test dymny pgTAP `supabase/tests/000-infrastructure.test.sql`, test tras `apps/web/src/routes.test.tsx` przez `renderToString`).
- Tabel budżetu jeszcze nie ma, więc polityka odczytu `profiles` obejmuje w tym zadaniu tylko własny profil; rozszerzenie o członków wspólnego budżetu należy do S-02.
- Próg 100% pokrycia (AGENTS.md, „Testy”) obejmuje trasy i komponenty, a `renderToString` nie wykonuje obsługi zdarzeń. Dlatego tryb przeglądarkowy Vitest z Playwrightem (standardy, P-11) wchodzi do tego zadania zamiast do T-01 ([ADR 0011](../../docs/adr/0011-component-tests-vitest-browser-playwright.md), decyzja z 2026-10-25). Raport gotowości: [.ai/analysis/pre-implement-email-login-profile.md](../analysis/pre-implement-email-login-profile.md).

## Zakres

**W zakresie:**

- migracja: tabela `profiles`, trigger tworzący profil przy rejestracji, RLS, uprawnienia, RPC `update_profile`,
- konfiguracja Auth (lokalnie): szablon wiadomości z linkiem i kodem OTP, adresy przekierowań,
- typy wygenerowane z bazy i typowany klient Supabase,
- ekran logowania (e-mail → kod lub link), ochrona tras, wylogowanie, ekran profilu z edycją nazwy,
- wspólne moduły frontendu: klucze zapytań, mapowanie kodów błędów RPC na komunikaty po polsku, kontekst sesji w routerze, fabryka routera,
- infrastruktura testów komponentów: tryb przeglądarkowy Vitest z Playwrightem (P-11, ADR 0011), także w CI.

**Poza zakresem:**

- widoczność nazw innych członków (S-02), usunięcie konta (S-14),
- testy E2E (T-01; w tym zadaniu weryfikacja ręczna z Mailpit; T-01 korzysta z Playwrighta dodanego tutaj),
- biblioteka walidacji Zod (P-08); parametr `redirect` waliduje zwykła funkcja,
- produkcyjny SMTP i wdrożenie (T-02),
- logowanie hasłem i OAuth (ADR 0009).

## Kryteria akceptacji

- **AC-1** (US-01)
  - **Given** osoba bez konta
  - **When** poda e-mail i wpisze otrzymany 6-cyfrowy kod
  - **Then** konto i profil zostają utworzone, osoba jest zalogowana i trafia na stronę główną
- **AC-2** (US-01)
  - **Given** osoba bez konta lub z kontem
  - **When** otworzy link z wiadomości w tej samej przeglądarce
  - **Then** jest zalogowana i trafia na stronę główną
- **AC-3** (US-01)
  - **Given** wygasły, błędny lub już użyty kod
  - **When** użytkownik go wpisze
  - **Then** logowanie się nie udaje, widzi komunikat po polsku i może wysłać nowy kod
- **AC-3b** (US-01)
  - **Given** wygasły lub już użyty link z wiadomości
  - **When** użytkownik go otworzy
  - **Then** trafia na `/login` z komunikatem „Link wygasł lub został już użyty” i może wysłać nową wiadomość
- **AC-4** (US-01)
  - **Given** niepoprawny format adresu e-mail
  - **When** użytkownik wyśle formularz
  - **Then** formularz pokazuje błąd i nie wysyła żądania
- **AC-5** (US-02)
  - **Given** zalogowany użytkownik
  - **When** wybierze „Wyloguj”
  - **Then** sesja zostaje zakończona na tym urządzeniu (inne urządzenia pozostają zalogowane), a wejście na chronioną trasę przekierowuje do logowania
- **AC-6** (US-01, US-02)
  - **Given** niezalogowana osoba
  - **When** otworzy dowolną chronioną trasę
  - **Then** zostaje przekierowana do `/login`, a po zalogowaniu kodem wraca na pierwotny adres (link z wiadomości zawsze prowadzi na stronę główną, AC-2)
- **AC-6b** (US-02)
  - **Given** zalogowany użytkownik, którego sesja wygasła lub została zakończona w innej karcie
  - **When** aplikacja dostanie zdarzenie wylogowania albo RPC zwróci `NOT_AUTHENTICATED`
  - **Then** cache zapytań zostaje wyczyszczony, a użytkownik trafia na `/login` z adresem powrotu do bieżącej strony
- **AC-7** (US-24)
  - **Given** nowe konto z adresem `ala@example.com`
  - **When** profil zostaje utworzony
  - **Then** nazwa wyświetlana to „ala”
- **AC-8** (US-24)
  - **Given** zalogowany użytkownik
  - **When** zmieni nazwę wyświetlaną na „ Ala K. ” i zapisze
  - **Then** zapisana nazwa to „Ala K.” (bez skrajnych spacji) i jest widoczna w aplikacji
- **AC-9** (US-24)
  - **Given** pusta nazwa, same spacje albo nazwa dłuższa niż 50 znaków
  - **When** użytkownik zapisze
  - **Then** baza odrzuca zmianę (`DISPLAY_NAME_INVALID`), a UI pokazuje komunikat
- **AC-10** (dostęp)
  - **Given** użytkownicy A i B
  - **When** A odczytuje tabelę `profiles`
  - **Then** widzi tylko swój profil; osoba niezalogowana nie widzi żadnego
- **AC-11** (dostęp)
  - **Given** zalogowany użytkownik
  - **When** spróbuje bezpośrednio wstawić, zmienić lub usunąć wiersz w `profiles`
  - **Then** operacja jest odrzucona (zapis tylko przez RPC)

## Projekt rozwiązania

### Zmiany w bazie

Migracja `vp exec supabase migration new create_profiles`:

```sql
-- Uprawnienia tylko jawne (engineering-standards P-01). Globalnie, bo domyślne EXECUTE dla PUBLIC
-- nie jest przypisane do schematu; sama wersja `in schema public` nie wystarcza (sprawdzone lokalnie).
alter default privileges revoke execute on functions from public;

create schema if not exists private;  -- niewystawiony przez PostgREST

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (display_name = btrim(display_name) and char_length(display_name) between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- Trigger `on_auth_user_created` (`after insert on auth.users`) wywołuje `private.handle_new_user()` (`security definer`, `set search_path = ''`), która wstawia profil z `btrim(left(split_part(new.email, '@', 1), 50))` (`btrim`, bo część lokalna w cudzysłowie może mieć spację na brzegu, a `check` by ją odrzucił i zablokował rejestrację).
- Profile użytkowników istniejących przed migracją: lokalnie i w testach baza jest pusta; na produkcji jeszcze nie ma użytkowników, więc backfill nie jest potrzebny.
- `updated_at` ustawia `update_profile`; osobny trigger `updated_at` nie jest potrzebny, bo zapis idzie tylko przez RPC.
- Uprawnienia: `grant select on public.profiles to authenticated;` – i nic więcej. `auto_expose_new_tables = false` (faza 0, P-01) sprawia, że bez tego `grant` tabela jest niedostępna dla ról API.

### Funkcje RPC

| Funkcja          | Wejście               | Wynik  | Reguły i błędy                                                                                                                                                                                             |
| ---------------- | --------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update_profile` | `p_display_name text` | `void` | `security definer`, `set search_path = ''`; brak `auth.uid()` → `NOT_AUTHENTICATED` (`PT401`); `btrim`, długość 1–50 → inaczej `DISPLAY_NAME_INVALID` (`PT400`); aktualizuje wyłącznie profil wywołującego |

Uprawnienia: `grant execute on function public.update_profile(text) to authenticated;` (domyślne `EXECUTE` dla `PUBLIC` wyłączone na początku migracji). Funkcja `private.handle_new_user()` nie dostaje żadnych uprawnień – wywołuje ją tylko trigger.

Błędy według [kontraktu błędów](../../docs/architecture.md#kontrakt-błędów): `raise exception '<KOD>' using errcode = 'PT<status>'`; klient mapuje `message` na komunikat po polsku. Pierwsze kody w katalogu: `NOT_AUTHENTICATED`, `DISPLAY_NAME_INVALID`.

### Polityki RLS

- `alter table public.profiles enable row level security;`
- `select` dla `authenticated`: `using (id = (select auth.uid()))`.
- Brak polityk `insert` / `update` / `delete` i brak uprawnień zapisu (jedynym `grant` jest `select` dla `authenticated`).
- `anon`: brak polityk, więc brak dostępu.

### Edge Functions

Nie dotyczy.

### Konfiguracja Auth (`supabase/config.toml`)

- `[auth.email.template.magic_link]`: temat „Logowanie do Koperty”, `content_path = "./supabase/templates/magic-link.html"` – szablon po polsku z linkiem (`{{ .ConfirmationURL }}`) i kodem (`{{ .Token }}`); ten sam szablon dla `confirmation` (pierwsze logowanie nowego adresu).
- `site_url` i `additional_redirect_urls` już wskazują port 5173 (faza 0). Link z wiadomości wraca na `/login` (`emailRedirectTo: ${origin}/login`), więc do `additional_redirect_urls` dochodzą `http://localhost:5173/**` i `http://127.0.0.1:5173/**`.
- Lokalnie wiadomości odczytujemy w Mailpit (`http://127.0.0.1:54324`).
- `[auth.rate_limit] email_sent = 30` (z 2) – tylko lokalnie, żeby ręczne sprawdzenie AC-1–AC-6 nie blokowało się po dwóch wiadomościach; limity produkcyjne ustala T-02.

### Interfejs

- **Klient:** `src/lib/database.types.ts` z `vp exec supabase gen types typescript --local`; `createClient<Database>(url, key, { auth: { flowType: "pkce" } })` w `src/lib/supabase.ts`. PKCE zamiast domyślnego `implicit`: link odsyła jednorazowy `?code=` zamiast tokenów sesji w adresie (nie trafiają do historii przeglądarki); wymaga tej samej przeglądarki, co zakłada AC-2. Klient sam wymienia kod na sesję przy starcie (`detectSessionInUrl`).
- **Sesja w routerze:** kontekst routera rozszerzony o `auth`; `beforeLoad` czyta sesję przez `supabase.auth.getSession()` (lokalnie, bez zapytania do serwera – to wygoda UI, dostęp egzekwują RLS i RPC). `supabase.auth.onAuthStateChange`: przy `SIGNED_OUT` czyści cache zapytań (`queryClient.clear()`) i wywołuje `router.invalidate()`, więc `beforeLoad` przenosi na `/login?redirect=<bieżąca strona>` (AC-6b). Mutacja, która dostanie `NOT_AUTHENTICATED`, pokazuje komunikat i wywołuje to samo.
- **Wylogowanie:** `supabase.auth.signOut({ scope: "local" })` – tylko bieżące urządzenie (domyślne `global` wylogowałoby wszystkie urządzenia; „Wyloguj wszędzie” nie ma w PRD).
- **Wzorzec Router + Query** ([engineering-standards](../../docs/engineering-standards.md) 4.3, P-07), ustalany w tym zadaniu dla wszystkich kolejnych ekranów:
  - `createRouter({ routeTree, context: { queryClient, auth }, defaultPreload: "intent", defaultPreloadStaleTime: 0, defaultPendingComponent, defaultErrorComponent })` w fabryce `createAppRouter()` w `src/lib/router.tsx` (testowanej; `main.tsx` jest wyłączony z pomiaru pokrycia i tylko ją wywołuje),
  - odczyt profilu: `profileQueryOptions()` w `src/features/profile/api.ts` → `loader` trasy `_authenticated` wywołuje `context.queryClient.ensureQueryData(profileQueryOptions())` → komponenty używają `useSuspenseQuery(profileQueryOptions())`,
  - zapis: `useMutation` z RPC, po sukcesie `invalidateQueries({ queryKey: queryKeys.profile.me() })`,
  - wywołania `supabase.*` wyłącznie w `src/features/*/api.ts` (`profile`, `auth`).
- **Trasy (pliki w `src/routes/`):**
  - `login.tsx` – `/login?redirect=…` (`validateSearch` przez funkcję z `src/lib/redirect.ts`: niebezpieczny lub brakujący adres → `/`; zachowuje też `error_code` z powrotu z linku): krok 1 e-mail (`signInWithOtp({ email, options: { emailRedirectTo: `${origin}/login` } })`), krok 2 kod (`verifyOtp({ email, token, type: "email" })`) z przyciskiem „Wyślij ponownie”; zalogowanego przekierowuje dalej; `error_code` z linku (np. `otp_expired`) → komunikat z AC-3b nad krokiem 1,
  - `_authenticated.tsx` – trasa układu z `beforeLoad`: brak sesji → `redirect({ to: "/login", search: { redirect: location.href } })`; nagłówek z nazwą wyświetlaną jako linkiem do `/profile` i przyciskiem „Wyloguj”,
  - `_authenticated/index.tsx` – dotychczasowa strona główna, teraz chroniona („Cześć, {nazwa}”); martwy przycisk „Zaczynamy” usunięty (S-02 doda tu tworzenie budżetu),
  - `_authenticated/profile.tsx` – edycja nazwy (RPC `update_profile` przez `useMutation`, po sukcesie unieważnienie klucza profilu).
- **Wspólne moduły:** `src/lib/query-keys.ts` (`queryKeys.profile.me()`), `src/lib/rpc-errors.ts` (jedna funkcja `toAppError()` zamienia na `AppError { code, message }` z komunikatem po polsku zarówno błąd PostgREST z kodem RPC w `message`, jak i błąd Auth z `code` – co najmniej `otp_expired`, `over_email_send_rate_limit` – oraz błąd sieci; domyślny komunikat dla nieznanych kodów), `src/lib/email.ts` (walidacja formatu e-maila dla wygody UI), `src/lib/redirect.ts` (bezpieczny adres powrotu: tylko ścieżki wewnętrzne).
- **Komponenty shadcn:** `input`, `label`, `card` (przez CLI; import `cn` z `@/lib/utils` – patrz wniosek o shadcn).
- Teksty po polsku, układ mobile first, etykiety pól i komunikaty błędów dostępne dla czytników ekranu.

## Wsteczna zgodność

Zmiana addytywna: nowy schemat `private`, nowa tabela, trigger i funkcja. Brak wcześniejszych klientów i danych.

## Plan implementacji

0. Infrastruktura testów komponentów (po akceptacji ADR 0011): zależności deweloperskie `playwright`, `@vitest/browser-playwright` (wersja Vitest wbudowanego w Vite+) i `vitest-browser-react` przez `vp add -D`; tryb przeglądarkowy (`vite-plus/test/browser-playwright`, Chromium) dla plików `*.browser.test.tsx`, pozostałe testy w Node; instalacja Chromium w zadaniu CI `web` (`vp exec playwright install --with-deps chromium`). Wyjście: obecny `routes.test.tsx` przeniesiony do trybu przeglądarkowego, `vp test --coverage` zielone lokalnie i w CI.
1. Helpery testów `supabase/tests/000-setup-helpers.test.sql` i testy niezmienników `supabase/tests/001-invariants.test.sql`; testy pgTAP dla `profiles` (trigger, RLS, zakaz zapisu, `update_profile`) – czerwone.
2. Migracja `create_profiles`, `db reset`, testy zielone; wygenerowanie typów i typowany klient; kontrola aktualności typów w CI.
3. Szablon wiadomości i konfiguracja Auth (lokalny limit e-maili, adresy przekierowań z `/login`); ręczne sprawdzenie wiadomości w Mailpit.
4. Moduły `query-keys`, `rpc-errors`, `email`, `redirect` z testami Vitest.
5. Kontekst sesji, fabryka routera, trasa `_authenticated` z przekierowaniem, wylogowanie; test tras przepisany na nowy kontekst (`/` bez sesji → `/login`, z sesją → strona główna).
6. Ekran `/login` (e-mail → kod, link) z obsługą błędów i ponownej wysyłki.
7. Ekran profilu z edycją nazwy.
8. Weryfikacja końcowa (DoD), aktualizacja PRD 4.11 (nazwa do 50 znaków) i tabeli RPC w `docs/architecture.md` (`update_profile`: 1–50 znaków po przycięciu), ręczny przegląd ścieżek AC-1–AC-9 (w tym AC-3b i AC-6b) na szerokości 360 px.

Kroki 5–7 obejmują testy komponentów (`*.browser.test.tsx`) dla każdego dodanego pliku trasy i komponentu, tak aby każdy krok kończył się 100% pokrycia.

## Strategia testów

- **Helpery pgTAP** (P-03) w `supabase/tests/000-setup-helpers.test.sql` – plik bez `rollback`, uruchamiany jako pierwszy, tworzy schemat `tests` (tylko w bazie testowej/lokalnej, nie w migracjach):
  - `tests.create_user(email text) returns uuid` – wstawia użytkownika do `auth.users` (uruchamia trigger profilu),
  - `tests.authenticate_as(user_id uuid)` – `set local role authenticated` i `request.jwt.claims` z `sub`,
  - `tests.clear_authentication()` – powrót do roli `anon` bez claims.
- **Niezmienniki** (`supabase/tests/001-invariants.test.sql`): każda tabela w `public` ma włączone RLS; żadna funkcja w `public` nie ma `EXECUTE` dla `anon`; każda funkcja `security definer` w `public` i `private` ma ustawione `search_path`; `authenticated` nie ma `insert` / `update` / `delete` na tabelach `public`.
- **pgTAP** (`supabase/tests/profiles.test.sql`):
  - utworzenie użytkownika w `auth.users` tworzy profil z nazwą z e-maila (AC-7), także dla długiej części lokalnej (obcięcie do 50),
  - A widzi tylko swój profil, B tylko swój; `select` jako `anon` → `throws_ok(..., '42501')`, bo `anon` nie ma `grant select` (AC-10),
  - część lokalna e-maila dłuższa niż 50 znaków jest obcinana, a spacje na brzegach usuwane (AC-7),
  - bezpośredni `insert` / `update` / `delete` jako `authenticated` odrzucony (AC-11),
  - `update_profile`: przycięcie spacji (AC-8), pusta, same spacje, 51 znaków → `throws_ok(..., 'PT400', 'DISPLAY_NAME_INVALID')`, 50 znaków przechodzi (AC-9); wywołanie jako `anon` odrzucone (brak `EXECUTE`); użytkownik nie może zmienić cudzego profilu.
- **CI:** zadanie bazy uruchamia też `supabase db advisors --local --type all --fail-on warn` (P-04) i – po powstaniu `database.types.ts` – kontrolę aktualności typów (`gen types` + `git diff --exit-code`), dodawaną w tym zadaniu.
- **Vitest:** `toAppError()` (kod RPC znany i nieznany, brak kodu, błąd Auth `otp_expired` i `over_email_send_rate_limit`, nieznany kod Auth, błąd sieci), walidacja e-maila (przypadki poprawne i błędne), funkcja budująca adres powrotu po zalogowaniu (tylko ścieżki wewnętrzne – ochrona przed open redirect).
- **Komponenty (tryb przeglądarkowy Vitest, `*.browser.test.tsx`):** `/login` (walidacja e-maila, przejście do kroku kodu, błędny lub wygasły kod z komunikatem, ponowna wysyłka, przekierowanie zalogowanego, `error_code` z wygasłego linku – AC-3b), `_authenticated` (przekierowanie bez sesji z `redirect`, nagłówek z linkiem do profilu, wylogowanie z `scope: "local"`, reakcja na `SIGNED_OUT` – AC-6b), strona główna, `/profile` (zapis, `DISPLAY_NAME_INVALID`, `NOT_AUTHENTICATED` → przekierowanie, stan zapisywania), domyślne komponenty ładowania i błędu, fabryka routera. Wywołania `features/*/api.ts` w testach komponentów zastępujemy mockiem modułu. Same `api.ts` testujemy z mockiem klienta Supabase (sprawdzamy, którą metodę i z jakimi argumentami wołają oraz jak zamieniają błąd na `AppError`). To wyjątek ze standardów 4.8 (potwierdzony 2026-10-25 i tam dopisany), bo zadanie CI `web` nie uruchamia Supabase; reguły domenowe i tak testuje pgTAP.
- **E2E:** poza zakresem (T-01); ścieżki AC-1–AC-6b sprawdzone ręcznie z Mailpit i opisane w logu przebiegu.

## Ryzyka i otwarte pytania

- **Rozstrzygnięte (2026-10-25):** maksymalna długość nazwy wyświetlanej – 50 znaków.
- **Rozstrzygnięte (2026-10-25):** po pierwszym logowaniu użytkownik trafia na stronę główną (nie na ekran profilu); ekran tworzenia budżetu z S-02 stanie się pierwszym krokiem.
- **Rozstrzygnięte (2026-10-25):** testy komponentów w trybie przeglądarkowym Vitest z Playwrightem już w S-01 (ADR 0011); Zod (P-08) nie wchodzi do S-01; testy `features/*/api.ts` z mockiem klienta Supabase (wyjątek w standardach 4.8).
- **Rozstrzygnięte (2026-10-25, przegląd specyfikacji):** obsługa wygasłego lub użytego linku (AC-3b); tryb PKCE; wylogowanie tylko z bieżącego urządzenia (`scope: "local"`); błędy Auth tłumaczone w tym samym `toAppError()` co błędy RPC; nazwa w nagłówku jako link do profilu, bez przycisku „Zaczynamy”; `getSession()` w `beforeLoad`; natychmiastowe przekierowanie po wygaśnięciu sesji (AC-6b).
- **Ryzyko:** tryb przeglądarkowy wydłuża zadanie CI `web` (instalacja Chromium), a pomiar pokrycia v8 w przeglądarce może różnić się od Node – krok 0 sprawdza `vp test --coverage` lokalnie i w CI, zanim powstaną ekrany.
- **Ryzyko:** link z wiadomości otwarty w innej przeglądarce niż PWA (szczególnie iOS) nie zaloguje w aplikacji – dlatego ekran logowania prowadzi głównie przez kod OTP.
- **Ryzyko:** open redirect przez parametr `redirect` – dopuszczamy wyłącznie ścieżki względne w obrębie aplikacji (test Vitest).

## Podsumowanie realizacji

<Wypełniane po zakończeniu.>

## Powód archiwizacji

<Wypełniane tylko przy archiwizacji.>
