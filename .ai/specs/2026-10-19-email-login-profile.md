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
    docs/adr/0012-design-system-package-storybook.md,
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
- Design system `@koperty/ui` ([ADR 0012](../../docs/adr/0012-design-system-package-storybook.md)) ma gotowe widoki S-01: `SignInForm`, `NameForm`, `AppShell` (Storybook: „Ekrany → Konto”). Specyfikacja korzysta z nich zamiast komponentów w `apps/web`.
- Mapa ekranów prototypu z odpowiedziami właściciela produktu na luki L01–L27 (2026-11-03): [prototypes/S-01/mapa-ekranow.md](../../prototypes/S-01/mapa-ekranow.md). Odwołania „(L..)” w tej specyfikacji wskazują tamte luki, „s0x” – ekrany mapy.
- Próg 100% pokrycia (AGENTS.md, „Testy”) obejmuje trasy i komponenty, a `renderToString` nie wykonuje obsługi zdarzeń. Dlatego tryb przeglądarkowy Vitest z Playwrightem (standardy, P-11) wchodzi do tego zadania zamiast do T-01 ([ADR 0011](../../docs/adr/0011-component-tests-vitest-browser-playwright.md), decyzja z 2026-10-25). Raport gotowości: [.ai/analysis/pre-implement-email-login-profile.md](../analysis/pre-implement-email-login-profile.md).

## Zakres

**W zakresie:**

- migracja: tabela `profiles`, trigger tworzący profil przy rejestracji, RLS, uprawnienia, RPC `update_profile`,
- konfiguracja Auth (lokalnie): szablon wiadomości z linkiem i kodem OTP, adresy przekierowań,
- typy wygenerowane z bazy i typowany klient Supabase,
- ekran logowania (e-mail → kod lub link) z komunikatem powodu wejścia, ekran logowania linkiem, ochrona tras, wylogowanie, strona główna, ekran profilu z edycją nazwy, ekran „Nie ma takiej strony”, komunikat braku sieci w powłoce,
- zmiany w design systemie `@koperty/ui` potrzebne tym ekranom (sekcja „Zmiany w design systemie”),
- wspólne moduły frontendu: klucze zapytań, mapowanie kodów błędów RPC na komunikaty po polsku, kontekst sesji w routerze z powodem wylogowania, fabryka routera,
- infrastruktura testów komponentów: tryb przeglądarkowy Vitest z Playwrightem (P-11, ADR 0011), także w CI.

**Poza zakresem:**

- widoczność nazw innych członków (S-02), usunięcie konta (S-14; profil w S-01 nie ma „Usuń konto…”, L24),
- nawigacja aplikacji (Koperty, Operacje, Podsumowanie), przełącznik budżetu i „Dodaj wydatek” w powłoce – dochodzą razem z trasami w S-02/S-03 (L23),
- start aplikacji bez połączenia i instalacja PWA (S-15; w S-01 tylko komunikat braku sieci w powłoce, L18),
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
  - **Then** trafia na `/login` z komunikatem „Link wygasł lub został już użyty. Wyślij nową wiadomość.” i może wysłać nową wiadomość (treść z DS, L25)
- **AC-4** (US-01)
  - **Given** niepoprawny format adresu e-mail
  - **When** użytkownik wyśle formularz
  - **Then** formularz pokazuje błąd i nie wysyła żądania
- **AC-5** (US-02)
  - **Given** zalogowany użytkownik
  - **When** wybierze „Wyloguj” (w menu konta albo na profilu)
  - **Then** sesja zostaje zakończona w tej przeglądarce, także gdy wylogowanie na serwerze się nie uda, np. bez sieci (L16); inne urządzenia pozostają zalogowane; osoba trafia na `/login` bez adresu powrotu z komunikatem „Wylogowano.” (L19, L21), po ponownym zalogowaniu na stronę główną; wejście na chronioną trasę przekierowuje do logowania
- **AC-6** (US-01, US-02)
  - **Given** niezalogowana osoba
  - **When** otworzy dowolną chronioną trasę
  - **Then** zostaje przekierowana do `/login` z komunikatem „Zaloguj się, żeby zobaczyć tę stronę.” (L19; bez komunikatu, gdy adresem powrotu jest strona główna), a po zalogowaniu kodem wraca na pierwotny adres (link z wiadomości zawsze prowadzi na stronę główną, AC-2)
- **AC-6b** (US-02)
  - **Given** zalogowany użytkownik, którego sesja wygasła lub została zakończona w innej karcie
  - **When** aplikacja dostanie zdarzenie wylogowania albo RPC zwróci `NOT_AUTHENTICATED`
  - **Then** cache zapytań zostaje wyczyszczony, a użytkownik od razu trafia na `/login` z adresem powrotu do bieżącej strony i komunikatem: „Sesja wygasła. Zaloguj się ponownie.” (sesja wygasła albo `NOT_AUTHENTICATED`, L20) albo „Wylogowano Cię w innej karcie. Zaloguj się ponownie.” (wylogowanie w innej karcie, L19); niezapisane zmiany w formularzu przepadają (L14)
- **AC-7** (US-24)
  - **Given** nowe konto z adresem `ala@example.com`
  - **When** profil zostaje utworzony
  - **Then** nazwa wyświetlana to „ala”
- **AC-8** (US-24)
  - **Given** zalogowany użytkownik
  - **When** zmieni nazwę wyświetlaną na „ Ala K. ” i zapisze
  - **Then** zapisana nazwa to „Ala K.” (bez skrajnych spacji), pole i menu konta ją pokazują, pojawia się toast „Zapisano nazwę.”, a osoba zostaje na profilu (L12)
- **AC-9** (US-24)
  - **Given** pusta nazwa, same spacje albo nazwa dłuższa niż 50 znaków
  - **When** użytkownik zapisze
  - **Then** baza odrzuca zmianę (`DISPLAY_NAME_INVALID`), a UI pokazuje błąd przy polu: „Podaj nazwę wyświetlaną.” dla pustej nazwy (bez wysyłania) albo „Nazwa może mieć najwyżej 50 znaków.” (L13); podpowiedź pola mówi o limicie 50 znaków, pole nie blokuje wpisywania
- **AC-10** (dostęp)
  - **Given** użytkownicy A i B
  - **When** A odczytuje tabelę `profiles`
  - **Then** widzi tylko swój profil; osoba niezalogowana nie widzi żadnego
- **AC-11** (dostęp)
  - **Given** zalogowany użytkownik
  - **When** spróbuje bezpośrednio wstawić, zmienić lub usunąć wiersz w `profiles`
  - **Then** operacja jest odrzucona (zapis tylko przez RPC)
- **AC-12** (US-01; L03–L05)
  - **Given** osoba otwiera link z wiadomości
  - **When** aplikacja wymienia kod z linku na sesję
  - **Then** widzi nazwę produktu i „Logowanie…” zamiast formularza; jeśli link otwarto w innej przeglądarce niż ta, w której poproszono o kod, widzi krok 1 z komunikatem „Link działa tylko w przeglądarce, w której poproszono o kod. Wpisz kod z wiadomości albo wyślij nową.” i może wpisać kod z otrzymanej wiadomości bez wysyłania nowej; przy innym błędzie linku – krok 1 z „Nie udało się zalogować linkiem. Wpisz kod z wiadomości albo wyślij nową.”; bez sieci – komunikat o braku połączenia i „Spróbuj ponownie”, które ponawia wymianę tego samego linku
- **AC-13** (US-01; L06, L07)
  - **Given** osoba zalogowana na konto A
  - **When** otworzy ważny link logowania do konta B albo wygasły lub użyty link
  - **Then** przy ważnym linku do B sesja A kończy się w tej przeglądarce, cache zapytań zostaje wyczyszczony, a osoba trafia na stronę główną jako B; przy wygasłym lub użytym linku trafia na stronę główną bez komunikatu i zostaje zalogowana jako A
- **AC-14** (US-01; L09, L10, L11)
  - **Given** osoba poprosiła o kod
  - **When** otrzyma wiadomość albo wybierze „Wyślij nowy kod”
  - **Then** wiadomość mówi „Kod i link są ważne przez godzinę.”; po wysłaniu nowej wiadomości poprzedni kod i link przestają działać, a ekran pokazuje „Wysłaliśmy nową wiadomość. Poprzedni kod i link już nie działają.”; krok kodu podpowiada „Nie widzisz wiadomości? Sprawdź folder spam albo poprawność adresu.”
- **AC-15** (US-24; L15)
  - **Given** zalogowany użytkownik
  - **When** profilu nie da się wczytać (strona główna, profil)
  - **Then** powłoka zostaje, menu konta pokazuje adres e-mail z sesji zamiast nazwy, a w treści jest komunikat „Nie udało się wczytać danych. Sprawdź połączenie i spróbuj ponownie.” z przyciskiem „Spróbuj ponownie”
- **AC-16** (L17)
  - **Given** dowolna osoba
  - **When** otworzy nieznany adres aplikacji
  - **Then** widzi „Nie ma takiej strony” z linkiem do strony głównej – zalogowana w powłoce, niezalogowana w układzie publicznym
- **AC-17** (US-23 – część; L18)
  - **Given** zalogowany użytkownik
  - **When** przeglądarka straci połączenie
  - **Then** nad treścią pojawia się komunikat braku sieci (`OfflineBanner`), który znika po powrocie połączenia; wczytane dane zostają

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

- `[auth.email.template.magic_link]`: temat „Logowanie do Koperty”, `content_path = "./supabase/templates/magic-link.html"` – szablon po polsku z linkiem (`{{ .ConfirmationURL }}`), kodem (`{{ .Token }}`) i zdaniem „Kod i link są ważne przez godzinę.” (AC-14); ten sam szablon dla `confirmation` (pierwsze logowanie nowego adresu).
- Ważność kodu i linku: `otp_expiry = 3600` (60 minut, L09) – już tak lokalnie; ta sama wartość na produkcji (T-02).
- `site_url` i `additional_redirect_urls` już wskazują port 5173 (faza 0). Link z wiadomości wraca na `/login` (`emailRedirectTo: ${origin}/login`), więc do `additional_redirect_urls` dochodzą `http://localhost:5173/**` i `http://127.0.0.1:5173/**`.
- Lokalnie wiadomości odczytujemy w Mailpit (`http://127.0.0.1:54324`).
- `[auth.rate_limit] email_sent = 30` (z 2) – tylko lokalnie, żeby ręczne sprawdzenie AC-1–AC-6 nie blokowało się po dwóch wiadomościach; limity produkcyjne ustala T-02.

### Interfejs

- **Klient:** `src/lib/database.types.ts` z `vp exec supabase gen types typescript --local`; `createClient<Database>(url, key, { auth: { flowType: "pkce", detectSessionInUrl: false } })` w `src/lib/supabase.ts`. PKCE zamiast domyślnego `implicit`: link odsyła jednorazowy `?code=` zamiast tokenów sesji w adresie (nie trafiają do historii przeglądarki); wymaga tej samej przeglądarki, co zakłada AC-2. Kod z linku wymienia jawnie trasa `/login` przez `exchangeCodeForSession(code)` zamiast automatycznej wymiany przy starcie (`detectSessionInUrl: false`), bo tylko wtedy dostaje błąd i może rozróżnić stany z AC-12 (inna przeglądarka, inny błąd, brak sieci) oraz pokazać „Logowanie…”.
- **Sesja w routerze:** kontekst routera rozszerzony o `auth` (sesja i powód ostatniego wylogowania). `beforeLoad` czyta sesję przez `supabase.auth.getSession()` (lokalnie, bez zapytania do serwera – to wygoda UI, dostęp egzekwują RLS i RPC). `supabase.auth.onAuthStateChange`:
  - `SIGNED_OUT`: czyści cache zapytań (`queryClient.clear()`), zapisuje powód w kontekście i wywołuje `router.invalidate()`, więc `beforeLoad` przenosi na `/login?redirect=<bieżąca strona>&reason=<powód>` (AC-6b),
  - `SIGNED_IN` z innym użytkownikiem niż poprzednio: czyści cache zapytań (AC-13, zmiana konta linkiem).
- **Powód wejścia na logowanie** (parametr `reason` w `/login`, L19): `session_expired` – „Sesja wygasła. Zaloguj się ponownie.” (`SIGNED_OUT` bez sygnału z innej karty albo `NOT_AUTHENTICATED` z RPC); `signed_out_elsewhere` – „Wylogowano Cię w innej karcie. Zaloguj się ponownie.”; `auth_required` – „Zaloguj się, żeby zobaczyć tę stronę.” (gość na chronionej trasie bez wcześniejszego zdarzenia; bez komunikatu, gdy adresem powrotu jest `/`); `signed_out` – „Wylogowano.” (własne wylogowanie, bez `redirect`). Karta, w której ktoś wybiera „Wyloguj”, przed `signOut` wysyła wiadomość na `BroadcastChannel("koperty-auth")`; pozostałe karty po jej odebraniu traktują najbliższe `SIGNED_OUT` jako `signed_out_elsewhere`. auth-js rozsyła `SIGNED_OUT` własnym kanałem, więc kolejność obu wiadomości nie jest gwarantowana: wiadomość z `koperty-auth`, która przyjdzie już po przejściu na `/login?reason=session_expired`, zamienia w adresie `reason` na `signed_out_elsewhere` (`replace`, bez nowego wpisu w historii). Nieznana wartość `reason` → brak komunikatu.
- **Wylogowanie:** `supabase.auth.signOut({ scope: "local" })` – tylko ta przeglądarka (domyślne `global` wylogowałoby wszystkie urządzenia; „Wyloguj wszędzie” nie ma w PRD). Potem przejście na `/login?reason=signed_out` bez `redirect` (L21); obsługa `SIGNED_OUT` w tej karcie nie dokleja wtedy adresu powrotu. Gdy `signOut` zwróci błąd (np. brak sieci), klient ignoruje go i przechodzi na logowanie, bez komunikatu o błędzie (L16): auth-js usuwa lokalną sesję także wtedy, gdy wylogowanie na serwerze się nie uda (`@supabase/auth-js@2.118.0`, `GoTrueClient._signOut`), więc dodatkowe czyszczenie nie jest potrzebne.
- **Wzorzec Router + Query** ([engineering-standards](../../docs/engineering-standards.md) 4.3, P-07), ustalany w tym zadaniu dla wszystkich kolejnych ekranów:
  - `createRouter({ routeTree, context: { queryClient, auth }, defaultPreload: "intent", defaultPreloadStaleTime: 0, defaultPendingComponent, defaultErrorComponent, defaultNotFoundComponent })` w fabryce `createAppRouter()` w `src/lib/router.tsx` (testowanej; `main.tsx` jest wyłączony z pomiaru pokrycia i tylko ją wywołuje),
  - odczyt profilu: `profileQueryOptions()` w `src/features/profile/api.ts` → `loader` tras potomnych `_authenticated` (`index`, `profile`) wywołuje `context.queryClient.ensureQueryData(profileQueryOptions())` → ich komponenty używają `useSuspenseQuery(profileQueryOptions())`; błąd wczytania trafia do komponentu błędu trasy potomnej, który renderuje się w `Outlet` powłoki, więc powłoka zostaje (AC-15),
  - powłoka (`_authenticated`) czyta profil przez `useQuery(profileQueryOptions())` bez zawieszania i pokazuje w menu konta `display_name`, a do czasu wczytania lub przy błędzie – adres e-mail z sesji (AC-15, L15a),
  - zapis: `useMutation` z RPC, po sukcesie `invalidateQueries({ queryKey: queryKeys.profile.me() })`,
  - wywołania `supabase.*` wyłącznie w `src/features/*/api.ts` (`profile`, `auth`).
- **Trasy (pliki w `src/routes/`):**
  - `__root.tsx` – `Toaster` raz w aplikacji; komponent „Nie ma takiej strony” z linkiem do `/` (AC-16): przy sesji w `AppShell`, bez sesji w układzie publicznym,
  - `login.tsx` – `/login?redirect=…&reason=…` (`validateSearch` przez funkcje z `src/lib/redirect.ts`: niebezpieczny lub brakujący adres → `/`; `reason` tylko ze znanych wartości; zachowuje też `error_code` i `code` z powrotu z linku). Kolejność:
    1. jest `code` → widok „Logowanie…” (AC-12) i `exchangeCodeForSession(code)` także przy istniejącej sesji (zmiana konta, AC-13); sukces → `/` (AC-2); błąd przy istniejącej sesji (np. stary adres z historii przeglądarki) → jak punkt 2, bez komunikatu (AC-13); błąd bez sesji → krok 1 z komunikatem z AC-12 (brak weryfikatora PKCE: inna przeglądarka; błąd sieci: „Spróbuj ponownie” ponawia wymianę; pozostałe: komunikat ogólny),
    2. jest sesja → przekierowanie na `redirect` (także przy `error_code` – bez komunikatu, AC-13),
    3. w pozostałych przypadkach `SignInForm` z `notice` według `error_code` (`otp_expired` → AC-3b) albo `reason`: krok 1 e-mail (``signInWithOtp({ email, options: { emailRedirectTo: `${origin}/login` } })``), krok 2 kod (`verifyOtp({ email, token, type: "email" })`) z „Wyślij nowy kod” i „Zmień adres e-mail” (L25),
  - `_authenticated.tsx` – trasa układu z `beforeLoad`: brak sesji → `redirect({ to: "/login", search: { redirect: location.href, reason } })`; `AppShell` bez nawigacji, przełącznika budżetu i akcji głównej (L23), z menu konta „Profil” i „Wyloguj” (L22) i `OfflineBanner` nad treścią (AC-17),
  - `_authenticated/index.tsx` – dotychczasowa strona główna, teraz chroniona: `h1` „Cześć, {nazwa}” (L23); martwy przycisk „Zaczynamy” usunięty (S-02 doda tu tworzenie budżetu),
  - `_authenticated/profile.tsx` – `h1` „Profil”; `NameForm` z etykietą „Nazwa wyświetlana”, podpowiedzią „Do 50 znaków. Tak zobaczą Cię inni członkowie budżetu jako autora operacji.” i przyciskiem „Zapisz nazwę” (RPC `update_profile` przez `useMutation`, po sukcesie unieważnienie klucza profilu i `showToast("Zapisano nazwę.")`, AC-8); sekcja „Konto” z tekstem „Logujesz się adresem {e-mail}.” i przyciskiem „Wyloguj” (L24); `NOT_AUTHENTICATED` → od razu logowanie z `reason=session_expired`, bez komunikatu na profilu (L14).
- **Komunikaty domyślnych komponentów routera:** ładowanie – `Skeleton` w kształcie treści; błąd – `ErrorState` „Nie udało się wczytać danych. Sprawdź połączenie i spróbuj ponownie.” z „Spróbuj ponownie” (`router.invalidate()`), AC-15.
- **Wspólne moduły:** `src/lib/query-keys.ts` (`queryKeys.profile.me()`), `src/lib/rpc-errors.ts` (jedna funkcja `toAppError()` zamienia na `AppError { code, message }` z komunikatem po polsku zarówno błąd PostgREST z kodem RPC w `message`, jak i błąd Auth z `code`, oraz błąd sieci; domyślny komunikat dla nieznanych kodów). Co najmniej: `otp_expired` → „Kod jest błędny albo wygasł. Wpisz go ponownie albo wyślij nowy kod.”; `over_email_send_rate_limit` → „Wysłaliśmy już kilka wiadomości. Poczekaj chwilę przed kolejną próbą.” (L08, bez czasu oczekiwania); `pkce_code_verifier_not_found` → komunikat z AC-12; `DISPLAY_NAME_INVALID` → „Nazwa może mieć najwyżej 50 znaków.” (pusta nazwa nie dochodzi do RPC, AC-9); `NOT_AUTHENTICATED` → „Sesja wygasła. Zaloguj się ponownie.”. Dalej `src/lib/email.ts` (walidacja formatu e-maila dla wygody UI) i `src/lib/redirect.ts` (bezpieczny adres powrotu: tylko ścieżki wewnętrzne; znane wartości `reason`).
- **Komponenty:** wyłącznie z `@koperty/ui` ([docs/design-system.md](../../docs/design-system.md)): `SignInForm`, `NameForm`, `AppShell`, `OfflineBanner`, `Skeleton`, `ErrorState`, `Button`, `Toaster` / `showToast` oraz nowe elementy z sekcji niżej. Bez komponentów shadcn w `apps/web` (L26).
- Teksty po polsku, układ mobile first, etykiety pól i komunikaty błędów dostępne dla czytników ekranu.

### Zmiany w design systemie (`packages/ui`)

Każda zmiana ze stories w obu motywach, stroną dokumentacji, wpisem w `docs/blocks/catalog-data.tsx` i w `docs/design-system.md` (wymóg `catalog.test.ts`). Numery luk z mapy ekranów.

| Zmiana                                                                                                                                                                                                  | Luka     | AC                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------- |
| `SignInForm`: ścieżka „Mam już kod” z kroku 1 do kroku 2 bez wysyłania nowej wiadomości (po poprawnym adresie)                                                                                          | D13      | AC-12                   |
| `SignInForm`: podpowiedź „Nie widzisz wiadomości? Sprawdź folder spam albo poprawność adresu.” w kroku 2; treść po ponownej wysyłce „Wysłaliśmy nową wiadomość. Poprzedni kod i link już nie działają.” | D14, L10 | AC-14                   |
| Widok logowania linkiem: nazwa produktu, nagłówek, „Logowanie…”; wariant błędu sieci z „Spróbuj ponownie”                                                                                               | D1       | AC-12                   |
| `AppShell`: `navigation` opcjonalne; bez pozycji nie ma dolnego paska ani nawigacji w nagłówku                                                                                                          | D3       | AC-5, AC-17             |
| Widok „Nie ma takiej strony” z linkiem do strony głównej                                                                                                                                                | D12      | AC-16                   |
| Stories ekranów: strona główna S-01, profil (błąd wczytania, zapisano, nazwa ponad 50 znaków, bez „Usuń konto…” w S-01), logowanie z czterema komunikatami powodu i treścią bez obietnicy powrotu (L20) | D7, D8   | AC-6–AC-9, AC-15        |
| Układ ekranów publicznych (np. `PublicLayout`): nazwa produktu, `h1`, treść o szerokości `max-w-content`, bez powłoki                                                                                   | D2       | AC-1–AC-4, AC-12, AC-16 |

Układ ekranów publicznych (logowanie, logowanie linkiem, „Nie ma takiej strony” dla gościa) to nowy komponent pakietu (D2, rozstrzygnięte 2026-11-03); `PublicScreen` z dokumentacji przechodzi na niego.

## Wsteczna zgodność

Zmiana addytywna: nowy schemat `private`, nowa tabela, trigger i funkcja. Brak wcześniejszych klientów i danych.

Trasa `/login` staje się celem linków zewnętrznych (link z wiadomości, `emailRedirectTo`), czyli powierzchnią „Adresy aplikacji webowej” z `BACKWARD_COMPATIBILITY.md`: jej późniejsza zmiana wymaga przekierowania ze starej ścieżki. Parametry `/login` (`redirect`, `reason`, `error_code`, `code`) są częścią tej powierzchni: kolejne zadania mogą dodawać wartości `reason`, ale nie zmieniać ani nie usuwać istniejących. Trasa `/` zostaje bez zmian.

Zmiany w `@koperty/ui` są addytywne: `navigation` w `AppShell` staje się opcjonalne (istniejące wywołania działają bez zmian), `SignInForm` dostaje nową ścieżkę i treści, nowe widoki dochodzą obok istniejących.

## Plan implementacji

0. Infrastruktura testów komponentów (po akceptacji ADR 0011): zależności deweloperskie `playwright`, `@vitest/browser-playwright` (wersja Vitest wbudowanego w Vite+) i `vitest-browser-react` przez `vp -C apps/web add -D` (zależności aplikacji, nie narzędzia głównego); tryb przeglądarkowy (`vite-plus/test/browser-playwright`, Chromium) dla plików `*.browser.test.tsx`, pozostałe testy w Node; instalacja Chromium w zadaniu CI `web` (`vp -C apps/web exec playwright install --with-deps chromium`). Wyjście: obecny `routes.test.tsx` przeniesiony do trybu przeglądarkowego, `vp test --coverage` zielone lokalnie i w CI.
1. Helpery testów `supabase/tests/000-setup-helpers.test.sql` i testy niezmienników `supabase/tests/001-invariants.test.sql`; testy pgTAP dla `profiles` (trigger, RLS, zakaz zapisu, `update_profile`) – czerwone.
2. Migracja `create_profiles`, `db reset`, testy zielone; wygenerowanie typów i typowany klient; kontrola aktualności typów w CI.
3. Szablon wiadomości (ze zdaniem o ważności, AC-14) i konfiguracja Auth (lokalny limit e-maili, adresy przekierowań z `/login`); ręczne sprawdzenie wiadomości w Mailpit, w tym że nowa wiadomość unieważnia poprzedni kod i link (L10).
4. Moduły `query-keys`, `rpc-errors`, `email`, `redirect` (z wartościami `reason`) z testami Vitest.
5. Zmiany w `@koperty/ui` z sekcji „Zmiany w design systemie”: stories, dokumentacja, katalog, `docs/design-system.md`; `vp run test:storybook`, `vp run check:tokens`, `vp run check:storybook`.
6. Kontekst sesji z powodem wylogowania (`BroadcastChannel`), fabryka routera, trasa `_authenticated` z przekierowaniem i `AppShell` bez nawigacji, `OfflineBanner`, wylogowanie z obsługą błędu, komponent „Nie ma takiej strony”, `Toaster`; test tras przepisany na nowy kontekst (`/` bez sesji → `/login`, z sesją → strona główna).
7. Ekran `/login`: kolejność `code` → sesja → formularz, widok „Logowanie…”, komunikaty powodu, obsługa błędów i ponownej wysyłki.
8. Strona główna i ekran profilu (nazwa, adres logowania, „Wyloguj”, toast, błąd wczytania w powłoce).
9. Weryfikacja końcowa (DoD), aktualizacja PRD 4.11 (nazwa do 50 znaków) i tabeli RPC w `docs/architecture.md` (`update_profile`: 1–50 znaków po przycięciu), ręczny przegląd ścieżek AC-1–AC-17 na szerokości 360 px; AC-5 (inne urządzenie) w osobnym kontekście przeglądarki, AC-6b (inna karta) w drugiej karcie ([wniosek](../lessons/2026-11-03-browser-tabs-share-session.md)).

Kroki 5–8 obejmują testy (stories w pakiecie, `*.browser.test.tsx` w aplikacji) dla każdego dodanego pliku trasy i komponentu, tak aby każdy krok kończył się 100% pokrycia.

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
- **Vitest:** `toAppError()` (kod RPC znany i nieznany, brak kodu, błąd Auth `otp_expired`, `over_email_send_rate_limit` i `pkce_code_verifier_not_found`, `DISPLAY_NAME_INVALID`, `NOT_AUTHENTICATED`, nieznany kod Auth, błąd sieci), walidacja e-maila (przypadki poprawne i błędne), funkcja budująca adres powrotu po zalogowaniu (tylko ścieżki wewnętrzne – ochrona przed open redirect), walidacja `reason` (znane wartości, nieznana → brak komunikatu).
- **Design system (stories z testami interakcji w obu motywach):** `SignInForm` („Mam już kod”, podpowiedź o niedostarczonej wiadomości, nowa treść po ponownej wysyłce, cztery komunikaty powodu), widok logowania linkiem (oczekiwanie, błąd sieci z „Spróbuj ponownie”), `AppShell` bez nawigacji (brak dolnego paska przy 320 px), widok „Nie ma takiej strony”.
- **Komponenty (tryb przeglądarkowy Vitest, `*.browser.test.tsx`):** `/login` (walidacja e-maila, przejście do kroku kodu, błędny lub wygasły kod z komunikatem, ponowna wysyłka, „Mam już kod”, przekierowanie zalogowanego także przy `error_code` – AC-13, `error_code` z wygasłego linku – AC-3b, komunikat dla każdej wartości `reason` i brak komunikatu `auth_required` przy powrocie na `/`, `code`: „Logowanie…”, sukces → `/`, brak weryfikatora PKCE, inny błąd, błąd sieci i ponowienie – AC-12, `code` przy istniejącej sesji innego konta i nieudana wymiana przy istniejącej sesji → przekierowanie bez komunikatu – AC-13), `_authenticated` (przekierowanie bez sesji z `redirect` i `reason`, menu konta z nazwą albo adresem e-mail przy błędzie profilu – AC-15, wylogowanie z `scope: "local"` na `/login?reason=signed_out` bez `redirect`, wylogowanie przy błędzie `signOut` – AC-5, reakcja na `SIGNED_OUT` z wiadomością z innej karty i bez niej oraz wiadomość spóźniona po przekierowaniu (zamiana `reason`) – AC-6b, czyszczenie cache przy zmianie użytkownika – AC-13, `OfflineBanner` – AC-17), strona główna („Cześć, {nazwa}”, błąd wczytania w powłoce – AC-15), `/profile` (zapis z toastem i pozostaniem na profilu, `DISPLAY_NAME_INVALID` przy polu, `NOT_AUTHENTICATED` → od razu logowanie z `reason=session_expired`, stan zapisywania, adres logowania, „Wyloguj”), „Nie ma takiej strony” z sesją i bez – AC-16, domyślne komponenty ładowania i błędu, fabryka routera. Wywołania `features/*/api.ts` w testach komponentów zastępujemy mockiem modułu. Same `api.ts` testujemy z mockiem klienta Supabase (sprawdzamy, którą metodę i z jakimi argumentami wołają oraz jak zamieniają błąd na `AppError`). To wyjątek ze standardów 4.8 (potwierdzony 2026-10-25 i tam dopisany), bo zadanie CI `web` nie uruchamia Supabase; reguły domenowe i tak testuje pgTAP.
- **E2E:** poza zakresem (T-01); ścieżki AC-1–AC-17 sprawdzone ręcznie z Mailpit i opisane w logu przebiegu.

## Ryzyka i otwarte pytania

- **Rozstrzygnięte (2026-10-25):** maksymalna długość nazwy wyświetlanej – 50 znaków.
- **Rozstrzygnięte (2026-10-25):** po pierwszym logowaniu użytkownik trafia na stronę główną (nie na ekran profilu); ekran tworzenia budżetu z S-02 stanie się pierwszym krokiem.
- **Rozstrzygnięte (2026-10-25):** testy komponentów w trybie przeglądarkowym Vitest z Playwrightem już w S-01 (ADR 0011); Zod (P-08) nie wchodzi do S-01; testy `features/*/api.ts` z mockiem klienta Supabase (wyjątek w standardach 4.8).
- **Rozstrzygnięte (2026-10-25, przegląd specyfikacji):** obsługa wygasłego lub użytego linku (AC-3b); tryb PKCE; wylogowanie tylko z bieżącego urządzenia (`scope: "local"`); błędy Auth tłumaczone w tym samym `toAppError()` co błędy RPC; nazwa w nagłówku jako link do profilu (zmienione 2026-11-03 na menu konta, L22), bez przycisku „Zaczynamy”; `getSession()` w `beforeLoad`; natychmiastowe przekierowanie po wygaśnięciu sesji (AC-6b).
- **Rozstrzygnięte (2026-11-03, mapa ekranów prototypu, luki L01–L27):** komponenty z `@koperty/ui` zamiast shadcn w `apps/web` (L26); menu konta z `AppShell` (L22); strona główna „Cześć, {nazwa}” w powłoce bez nawigacji (L23); profil z nazwą, adresem logowania i „Wyloguj”, bez „Usuń konto…” (L24); treści z DS: „Wyślij nowy kod”, „Zmień adres e-mail”, pełny komunikat AC-3b (L25); komunikat powodu wejścia na logowanie w czterech sytuacjach (L19), bez obietnicy powrotu (L20); po własnym wylogowaniu bez adresu powrotu (L21) i zawsze lokalnie, także przy błędzie (L16); widok „Logowanie…” i komunikaty błędów linku (L03–L05); link do innego konta przełącza konto, wygasły link u zalogowanego – bez komunikatu (L06, L07); limit wiadomości bez czasu oczekiwania (L08); ważność 60 minut podana w wiadomości (L09); nowa wiadomość unieważnia poprzedni kod i link (L10); podpowiedź o niedostarczonej wiadomości (L11); toast po zapisie nazwy (L12); limit 50 znaków w podpowiedzi i błędzie, bez blokady i licznika (L13); `NOT_AUTHENTICATED` – od razu logowanie, bez komunikatu na profilu (L14); błąd wczytania profilu w powłoce, menu z adresem e-mail (L15, L15a); ekran „Nie ma takiej strony” (L17); `OfflineBanner` już w S-01 (L18). Odpowiedzi: [mapa ekranów](../../prototypes/S-01/mapa-ekranow.md).
- **Rozstrzygnięte (2026-11-03, akceptacja specyfikacji):** przyjęte propozycje:
  - treści komunikatów powodu, których nie podano w odpowiedzi na L19: „Wylogowano Cię w innej karcie. Zaloguj się ponownie.”, „Zaloguj się, żeby zobaczyć tę stronę.”, „Wylogowano.”;
  - brak komunikatu `auth_required`, gdy adresem powrotu jest strona główna – inaczej każde pierwsze wejście do aplikacji zaczynałoby się od „Zaloguj się, żeby zobaczyć tę stronę.”;
  - ścieżka „Mam już kod” w kroku 1 `SignInForm` jako sposób na wpisanie kodu bez wysyłania nowej wiadomości (D13, wynika z L04 i L10);
  - układ ekranów publicznych (D2): eksportowany komponent w `@koperty/ui` (np. `PublicLayout`) ze stories – jedno źródło dla logowania, „Logowanie…”, „Nie ma takiej strony” dla gościa i przyszłego ekranu dołączania (S-11).
- **Ryzyko:** tryb przeglądarkowy wydłuża zadanie CI `web` (instalacja Chromium), a pomiar pokrycia v8 w przeglądarce może różnić się od Node – krok 0 sprawdza `vp test --coverage` lokalnie i w CI, zanim powstaną ekrany.
- **Ryzyko:** link z wiadomości otwarty w innej przeglądarce niż PWA (szczególnie iOS) nie zaloguje w aplikacji – dlatego ekran logowania prowadzi głównie przez kod OTP.
- **Ryzyko:** powrót z linku ląduje na `/login?code=…`. `validateSearch` zachowuje `code`, a wymianę wykonuje trasa (`exchangeCodeForSession`, `detectSessionInUrl: false`); gdyby router zgubił `code` przed wymianą, logowanie linkiem po cichu by się nie udało. Krok 7 sprawdza to testem komponentu: wymiana dostaje `code` z adresu, a po zalogowaniu następuje przekierowanie dalej.
- **Sprawdzone (2026-11-03, `@supabase/auth-js@2.118.0`):** `signOut` przy błędzie innym niż 401/403/404 usuwa lokalną sesję i dopiero potem zwraca błąd (`GoTrueClient._signOut`), więc AC-5 (sesja znika zawsze) nie wymaga obejścia; brak weryfikatora PKCE to `AuthPKCECodeVerifierMissingError` z kodem `pkce_code_verifier_not_found` (`lib/errors.js`). Przy aktualizacji auth-js test komponentu wylogowania i test `toAppError()` pilnują obu zachowań.
- **Ryzyko (do sprawdzenia w kroku 3):** unieważnianie poprzedniego kodu i linku po nowej wiadomości (L10) zależy od Supabase Auth – potwierdzamy je lokalnie w Mailpit, zanim powstanie komunikat z AC-14.
- **Ryzyko:** rozróżnienie wylogowania w innej karcie od wygaśnięcia sesji opiera się na `BroadcastChannel`; zdarzenie `SIGNED_OUT` bez wiadomości z innej karty traktujemy jako wygaśnięcie, a spóźniona wiadomość poprawia powód w adresie (Interfejs → Powód wejścia na logowanie). Przy wylogowaniu w innej przeglądarce tej samej osoby nic się nie dzieje (inna sesja, AC-5).
- **Ryzyko:** open redirect przez parametr `redirect` – dopuszczamy wyłącznie ścieżki względne w obrębie aplikacji (test Vitest).

## Podsumowanie realizacji

<Wypełniane po zakończeniu.>

## Powód archiwizacji

<Wypełniane tylko przy archiwizacji.>
