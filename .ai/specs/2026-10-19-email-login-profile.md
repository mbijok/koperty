---
title: S-01 Logowanie e-mailem i profil użytkownika
status: draft
created: 2026-10-19
user_stories: [US-01, US-02, US-24]
adrs:
  [
    docs/adr/0002-supabase-client-independent-backend.md,
    docs/adr/0003-business-logic-in-database.md,
    docs/adr/0009-passwordless-email-auth.md,
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
- Stan wyjściowy: szkielet z fazy 0 (trasa `/`, `QueryClient`, nietypowany klient Supabase, brak migracji).
- Tabel budżetu jeszcze nie ma, więc polityka odczytu `profiles` obejmuje w tym zadaniu tylko własny profil; rozszerzenie o członków wspólnego budżetu należy do S-02.

## Zakres

**W zakresie:**

- migracja: tabela `profiles`, trigger tworzący profil przy rejestracji, RLS, uprawnienia, RPC `update_profile`,
- konfiguracja Auth (lokalnie): szablon wiadomości z linkiem i kodem OTP, adresy przekierowań,
- typy wygenerowane z bazy i typowany klient Supabase,
- ekran logowania (e-mail → kod lub link), ochrona tras, wylogowanie, ekran profilu z edycją nazwy,
- wspólne moduły frontendu: klucze zapytań, mapowanie kodów błędów RPC na komunikaty po polsku, kontekst sesji w routerze.

**Poza zakresem:**

- widoczność nazw innych członków (S-02), usunięcie konta (S-14),
- testy E2E (T-01; w tym zadaniu weryfikacja ręczna z Mailpit),
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
- **AC-4** (US-01)
  - **Given** niepoprawny format adresu e-mail
  - **When** użytkownik wyśle formularz
  - **Then** formularz pokazuje błąd i nie wysyła żądania
- **AC-5** (US-02)
  - **Given** zalogowany użytkownik
  - **When** wybierze „Wyloguj”
  - **Then** sesja zostaje zakończona, a wejście na chronioną trasę przekierowuje do logowania
- **AC-6** (US-01, US-02)
  - **Given** niezalogowana osoba
  - **When** otworzy dowolną chronioną trasę
  - **Then** zostaje przekierowana do `/login`, a po zalogowaniu wraca na pierwotny adres
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
create schema if not exists private;  -- niewystawiony przez PostgREST

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (display_name = btrim(display_name) and char_length(display_name) between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- Trigger `on_auth_user_created` (`after insert on auth.users`) wywołuje `private.handle_new_user()` (`security definer`, `set search_path = ''`), która wstawia profil z `left(split_part(new.email, '@', 1), 50)`.
- Profile użytkowników istniejących przed migracją: lokalnie i w testach baza jest pusta; na produkcji jeszcze nie ma użytkowników, więc backfill nie jest potrzebny.
- `updated_at` ustawia `update_profile`; osobny trigger `updated_at` nie jest potrzebny, bo zapis idzie tylko przez RPC.

### Funkcje RPC

| Funkcja          | Wejście               | Wynik  | Reguły i błędy                                                                                                                                                                         |
| ---------------- | --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update_profile` | `p_display_name text` | `void` | `security definer`, `set search_path = ''`; brak `auth.uid()` → `NOT_AUTHENTICATED`; `btrim`, długość 1–50 → inaczej `DISPLAY_NAME_INVALID`; aktualizuje wyłącznie profil wywołującego |

Uprawnienia: `revoke execute on function public.update_profile from public, anon; grant execute ... to authenticated`.

Kody błędów zgłaszane jako `raise exception '<KOD>' using errcode = 'P0001'`; klient mapuje `message` na komunikat po polsku.

### Polityki RLS

- `alter table public.profiles enable row level security;`
- `select` dla `authenticated`: `using (id = (select auth.uid()))`.
- Brak polityk `insert` / `update` / `delete`; dodatkowo `revoke insert, update, delete on public.profiles from anon, authenticated`.
- `anon`: brak polityk, więc brak dostępu.

### Edge Functions

Nie dotyczy.

### Konfiguracja Auth (`supabase/config.toml`)

- `[auth.email.template.magic_link]`: temat „Logowanie do Koperty”, `content_path = "./supabase/templates/magic-link.html"` – szablon po polsku z linkiem (`{{ .ConfirmationURL }}`) i kodem (`{{ .Token }}`); ten sam szablon dla `confirmation` (pierwsze logowanie nowego adresu).
- `site_url` i `additional_redirect_urls` już wskazują port 5173 (faza 0).
- Lokalnie wiadomości odczytujemy w Mailpit (`http://127.0.0.1:54324`).

### Interfejs

- **Klient:** `src/lib/database.types.ts` z `vp exec supabase gen types typescript --local`; `createClient<Database>` w `src/lib/supabase.ts`.
- **Sesja w routerze:** kontekst routera rozszerzony o `auth` (bieżąca sesja z `supabase.auth.getSession()`); `supabase.auth.onAuthStateChange` unieważnia router i czyści cache zapytań przy wylogowaniu.
- **Trasy (pliki w `src/routes/`):**
  - `login.tsx` – `/login?redirect=…`: krok 1 e-mail (`signInWithOtp({ email, options: { emailRedirectTo: origin } })`), krok 2 kod (`verifyOtp({ email, token, type: "email" })`) z przyciskiem „Wyślij ponownie”; zalogowanego przekierowuje dalej,
  - `_authenticated.tsx` – trasa układu z `beforeLoad`: brak sesji → `redirect({ to: "/login", search: { redirect: location.href } })`; nagłówek z nazwą i „Wyloguj”,
  - `_authenticated/index.tsx` – dotychczasowa strona główna, teraz chroniona („Cześć, {nazwa}”),
  - `_authenticated/profile.tsx` – edycja nazwy (RPC `update_profile` przez `useMutation`, po sukcesie unieważnienie klucza profilu).
- **Wspólne moduły:** `src/lib/query-keys.ts` (`queryKeys.profile.me()`), `src/lib/rpc-errors.ts` (mapa kod → komunikat, domyślny komunikat dla nieznanych błędów), `src/lib/email.ts` (walidacja formatu e-maila dla wygody UI).
- **Komponenty shadcn:** `input`, `label`, `card` (przez CLI; import `cn` z `@/lib/utils` – patrz wniosek o shadcn).
- Teksty po polsku, układ mobile first, etykiety pól i komunikaty błędów dostępne dla czytników ekranu.

## Wsteczna zgodność

Zmiana addytywna: nowy schemat `private`, nowa tabela, trigger i funkcja. Brak wcześniejszych klientów i danych.

## Plan implementacji

1. Testy pgTAP dla `profiles` (trigger, RLS, zakaz zapisu, `update_profile`) – czerwone.
2. Migracja `create_profiles`, `db reset`, testy zielone; wygenerowanie typów i typowany klient.
3. Szablon wiadomości i konfiguracja Auth; ręczne sprawdzenie wiadomości w Mailpit.
4. Moduły `query-keys`, `rpc-errors`, `email` z testami Vitest.
5. Kontekst sesji, trasa `_authenticated` z przekierowaniem, wylogowanie.
6. Ekran `/login` (e-mail → kod, link) z obsługą błędów i ponownej wysyłki.
7. Ekran profilu z edycją nazwy.
8. Weryfikacja końcowa (DoD) i ręczny przegląd ścieżek AC-1–AC-9 na szerokości 360 px.

## Strategia testów

- **pgTAP** (`supabase/tests/profiles.test.sql`):
  - utworzenie użytkownika w `auth.users` tworzy profil z nazwą z e-maila (AC-7), także dla długiej części lokalnej (obcięcie do 50),
  - A widzi tylko swój profil, B tylko swój, `anon` – zero wierszy (AC-10),
  - bezpośredni `insert` / `update` / `delete` jako `authenticated` odrzucony (AC-11),
  - `update_profile`: przycięcie spacji (AC-8), pusta, same spacje, 51 znaków → `DISPLAY_NAME_INVALID`, 50 znaków przechodzi (AC-9); wywołanie jako `anon` odrzucone; użytkownik nie może zmienić cudzego profilu.
- **Vitest:** mapowanie kodów błędów (znany, nieznany, brak kodu), walidacja e-maila (przypadki poprawne i błędne), funkcja budująca adres powrotu po zalogowaniu (tylko ścieżki wewnętrzne – ochrona przed open redirect).
- **E2E:** poza zakresem (T-01); ścieżki AC-1–AC-6 sprawdzone ręcznie z Mailpit i opisane w logu przebiegu.

## Ryzyka i otwarte pytania

- **Pytanie:** maksymalna długość nazwy wyświetlanej – proponuję 50 znaków.
- **Pytanie:** czy po pierwszym logowaniu pokazywać od razu ekran profilu (zachęta do zmiany nazwy), czy stronę główną? Propozycja: stronę główną; ekran tworzenia budżetu z S-02 i tak stanie się pierwszym krokiem.
- **Ryzyko:** link z wiadomości otwarty w innej przeglądarce niż PWA (szczególnie iOS) nie zaloguje w aplikacji – dlatego ekran logowania prowadzi głównie przez kod OTP.
- **Ryzyko:** limit wysyłki e-maili Auth (`email_sent = 2` na godzinę lokalnie) może utrudniać ręczne testy – w razie potrzeby podnieść limit w lokalnym `config.toml`.
- **Ryzyko:** open redirect przez parametr `redirect` – dopuszczamy wyłącznie ścieżki względne w obrębie aplikacji (test Vitest).

## Podsumowanie realizacji

<Wypełniane po zakończeniu.>

## Powód archiwizacji

<Wypełniane tylko przy archiwizacji.>
