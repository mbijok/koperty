# 🔍 Analiza przed implementacją: S-01 Logowanie e-mailem i profil użytkownika

**Gotowość: no-go**: implementacja rozpoczęta teraz nie spełniłaby Definition of Done. Ekranów logowania i profilu nie da się pokryć testami w 100% obecną infrastrukturą testów, a specyfikacja ma status `draft` i dwa otwarte pytania.
Specyfikacja: `.ai/specs/2026-10-19-email-login-profile.md` · zgłoszenie #3 · audyt z 2026-10-25 względem `BACKWARD_COMPATIBILITY.md` i szablonu `.ai/specs/_template.md`.

## ⛔ Blokady przed implementacją

1. **R1 – status `draft`.** Status `approved` nadaje właściciel po przeglądzie poprawionej specyfikacji.
2. **R2 – dwa otwarte pytania** (długość nazwy, ekran po pierwszym logowaniu). Rozstrzygnięte przez właściciela 2026-10-25: maksymalnie 50 znaków, po logowaniu strona główna. Do wpisania w specyfikację.
3. **Brak strategii testów komponentów (luka krytyczna, R3).** AGENTS.md („Testy”) wymaga 100% pokrycia każdego pliku TS, w tym tras i komponentów. Obecny test tras (`apps/web/src/routes.test.tsx`) korzysta z `renderToString`, które nie wykonuje obsługi zdarzeń. Standardy (4.8, P-11) przewidują testy komponentów w trybie przeglądarkowym Vitest dopiero od T-01. Decyzja właściciela z 2026-10-25: P-11 wchodzi do S-01 jako pierwszy krok, z ADR dla Playwright (nowe zależności deweloperskie).

## ⚠️ Decyzje dla właściciela specyfikacji

- **Zod (P-08) w S-01?** Rekomendacja: nie. Parametr `redirect` walidowany zwykłą funkcją z `lib/redirect.ts`, użytą w `validateSearch`. Decyzja o Zod przy pierwszym parametrze URL z wieloma polami (S-02 lub S-05). Kompromis: później ewentualna migracja jednej funkcji, w zamian brak nowej zależności teraz.
- **Testy `features/*/api.ts` z mockiem klienta Supabase.** Standardy 4.8 zakazują mockowania Supabase w testach logiki (wyjątek: moduł tworzący klienta), a próg 100% obejmuje `api.ts`. Zadanie CI `web` nie uruchamia Supabase. Rekomendacja: rozszerzyć wyjątek z 4.8 na `api.ts` (sprawdzamy wywołaną metodę, argumenty i zamianę błędu), a reguły domenowe zostawić pgTAP. Alternatywa: testy `api.ts` z lokalnym Supabase w CI, co oznacza wolniejsze CI i drugą kopię testów domeny.
  **Rozstrzygnięte 2026-10-25:** właściciel potwierdził wyjątek; dopisany w standardach 4.8 i w specyfikacji.
- **Lokalny limit e-maili Auth** (`email_sent = 2` na godzinę). Ręczne sprawdzenie AC-1–AC-6 wysyła kilka wiadomości. Rekomendacja: podnieść limit w lokalnym `config.toml` w kroku konfiguracji Auth, a nie dopiero „w razie potrzeby”.

## 📋 Bramka gotowości

| #   | Punkt                | Wynik | Dowód / poprawka                                                                                                                                                                                                                        |
| --- | -------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Status               | ❌    | `status: draft`; zatwierdza właściciel                                                                                                                                                                                                  |
| R2  | Brak otwartych pytań | ❌    | „Ryzyka i otwarte pytania”: dwa pytania; odpowiedzi znane, do wpisania                                                                                                                                                                  |
| R3  | Śledzenie wymagań    | ❌    | AC-1–AC-6 i AC-8–AC-9 (UI) nie mają wyroczni testowej spełniającej próg 100%; oracle AC-10 dla `anon` jest błędny (niżej)                                                                                                               |
| R4  | Kontrakty            | ✅    | `update_profile`, kody błędów (są już w katalogu `docs/architecture.md`), RLS, trasy i stany opisane                                                                                                                                    |
| R5  | Kroki dostarczalne   | ✅    | „Plan implementacji” 1–8, każdy krok testowalny; po decyzji P-11 potrzebny krok 0                                                                                                                                                       |
| R6  | Zgodność z kodem     | ✅    | Stan wyjściowy zgodny z repo: brak migracji, trasa `/`, nietypowany klient (`lib/supabase.ts`), `auto_expose_new_tables = false`, `site_url` na porcie 5173, `otp_length = 6`, Mailpit na 54324, advisors już w CI i w bramce walidacji |

## 💥 Wsteczna zgodność

Wszystkie zmiany są addytywne. Nie ma jeszcze żadnych klientów ani danych.

| #   | Powierzchnia             | Krok | Zmiana                                                                                   | Ocena      | Ścieżka                                                                   |
| --- | ------------------------ | ---- | ---------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| 1   | Tabele i kolumny         | 2    | nowa tabela `profiles`                                                                   | addytywna  | –                                                                         |
| 2   | Funkcje RPC              | 2    | nowa `update_profile(text)`                                                              | addytywna  | –                                                                         |
| 3   | Kody błędów              | 2    | używa `NOT_AUTHENTICATED`, `DISPLAY_NAME_INVALID` (już w katalogu)                       | bez zmiany | –                                                                         |
| 4   | Typy klienta             | 2    | pierwszy `database.types.ts`, generowany                                                 | addytywna  | kontrola aktualności w CI (P-04), zgodnie ze specyfikacją                 |
| 5   | Adresy aplikacji webowej | 5–7  | `/` przechodzi pod układ `_authenticated` (ścieżka bez zmian), nowe `/login`, `/profile` | addytywna  | `/` jest celem magic linku (`emailRedirectTo: origin`), więc nie zmieniać |

Edge Functions, zastosowane migracje i format danych: bez zmian. Format `.ai/`: bez zmian.

## 📝 Kompletność specyfikacji

| Sekcja                 | Braki                                                                                                      | Skutek                                                               | Co dodać                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Strategia testów       | brak testów tras i komponentów (`login`, `_authenticated`, `profile`, `features/*/api.ts`, kontekst sesji) | `vp test --coverage` nie przejdzie                                   | testy w trybie przeglądarkowym Vitest dla każdego ekranu i stanu (ładowanie, błąd, sukces) |
| Strategia testów       | „`anon` – zero wierszy” (AC-10)                                                                            | test będzie czerwony: `anon` nie ma `select` (brak `grant`)          | `throws_ok(..., '42501')` dla `anon`                                                       |
| Plan implementacji     | brak aktualizacji `apps/web/src/routes.test.tsx`                                                           | istniejący test oczekuje treści `/` bez sesji i kontekstu bez `auth` | przepisać test na nowy kontekst routera i przekierowanie do `/login`                       |
| Plan implementacji     | `lib/redirect.ts` jest w „Interfejsie” i testach, brak go w kroku 4                                        | drobna niespójność                                                   | dopisać do kroku 4                                                                         |
| Kryteria akceptacji    | AC-6 („wraca na pierwotny adres”) nie mówi, którą ścieżką                                                  | magic link prowadzi zawsze na `/` (`emailRedirectTo: origin`)        | doprecyzować: powrót dotyczy logowania kodem; link prowadzi na stronę główną               |
| Projekt (dokumentacja) | limit 50 znaków to nowa reguła względem PRD 4.11 i `architecture.md` (`update_profile`: „niepusta nazwa”)  | dokumentacja rozjedzie się z bazą                                    | w kroku domknięcia zaktualizować PRD 4.11 i tabelę RPC w architekturze                     |

## 🔍 Zgodność z zasadami repo

| Reguła (źródło)                                                     | Miejsce w specyfikacji                                                         | Poprawka                                                                                          | Waga      |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | --------- |
| 100% pokrycia każdego pliku TS (AGENTS.md „Testy”)                  | Strategia testów, Plan                                                         | krok 0: tryb przeglądarkowy Vitest + Playwright (P-11) z ADR, testy komponentów w każdym kroku UI | Krytyczna |
| Nowe zależności i narzędzia tylko z ADR i zgodą (AGENTS.md „Stack”) | P-11 wymaga `playwright`, `@vitest/browser-playwright`, `vitest-browser-react` | ADR 0011 (proponowany) przed implementacją; zgoda zapisana w specyfikacji                         | Ważna     |
| `validateSearch` dla parametrów URL (standardy 4.3)                 | trasa `login.tsx`                                                              | nazwać `validateSearch` z `lib/redirect.ts`                                                       | Ważna     |
| Domyślne komponenty ładowania i błędu routera (standardy 4.3, P-07) | konfiguracja `createRouter` w `main.tsx` (wyłączony z pokrycia)                | wydzielić fabrykę routera (`lib/router.tsx`) testowaną w Vitest; `main.tsx` tylko ją wywołuje     | Ważna     |

## ⚠️ Ryzyka

| Ryzyko                                                                                                                                          | Poziom | Skutek                                         | Ograniczenie                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Tryb przeglądarkowy Vitest w CI: instalacja Chromium wydłuża zadanie `web`, a pomiar pokrycia v8 w przeglądarce może działać inaczej niż w Node | Średni | wolniejsze CI, możliwe różnice w pokryciu      | `vp exec playwright install --with-deps chromium` w CI; w kroku 0 sprawdzić `vp test --coverage` na jednym komponencie |
| Trigger `on_auth_user_created` w testach odpala `postgres`, a w działającej aplikacji `supabase_auth_admin`                                     | Niski  | błąd uprawnień widoczny dopiero przy logowaniu | ręczna ścieżka AC-1 z Mailpit (już w planie)                                                                           |
| Część lokalna e-maila w cudzysłowie ze spacją na brzegu złamie `check (display_name = btrim(...))` i rejestrację                                | Niski  | błąd 500 przy pierwszym logowaniu              | `btrim(left(split_part(...), 50))` w `handle_new_user`, przypadek w pgTAP                                              |
| Limit `email_sent = 2` na godzinę lokalnie                                                                                                      | Niski  | blokada ręcznych testów                        | podnieść limit lokalnie w kroku 3                                                                                      |

## 🔍 Luki

- **Krytyczna**: strategia testów komponentów; rozstrzygnięta decyzją P-11 w S-01, do wpisania w specyfikację i ADR.
- **Ważna**: wyrocznia AC-10 dla `anon` (`42501` zamiast pustego wyniku).
- **Ważna**: aktualizacja `routes.test.tsx` i fabryka routera testowana poza `main.tsx`.
- **Ważna**: `validateSearch` bez Zod (decyzja wyżej).
- **Drobna**: istniejący `supabase/tests/000-infrastructure.test.sql` nie jest wspomniany; nowe pliki `000-setup-helpers` i `001-invariants` sortują się po nim poprawnie.

## 📋 Plan naprawy

1. **Przed implementacją**: wpisać odpowiedzi na pytania; dodać krok 0 (P-11) i ADR 0011; poprawić wyrocznię `anon`; doprecyzować AC-6; dopisać `routes.test.tsx`, `lib/redirect.ts` i fabrykę routera do planu; zatwierdzić ADR i specyfikację.
2. **W trakcie implementacji**: podnieść lokalny limit e-maili; `btrim` w `handle_new_user`; przy domknięciu zaktualizować PRD 4.11 i tabelę RPC w `docs/architecture.md`.
3. **Po implementacji**: T-01 korzysta z Playwrighta z S-01 i dokłada tylko E2E. Zaktualizować opis T-01 (#5).

## 🧪 Ograniczenia audytu

- Przeszukano `apps/web/src`, `supabase/` (config, tests), `.github/workflows/ci.yml`, główny i aplikacyjny `vite.config.ts`, `package.json`, `docs/prd.md` (4.11, US-01, US-02, US-24), `docs/architecture.md` (sekcje 2–5), `docs/engineering-standards.md` (sekcje 3–5), ADR 0009, `BACKWARD_COMPATIBILITY.md` i wniosek o lokalnym wystawianiu API. Stan: gałąź `claude/plan-next-tasks-72dc76` = `master` (`cddb17c`).
- Brak `product-brief.md` i kontraktu `.uxproof/`. Kontrola zgodności UI opiera się tylko na standardach 4.5.
- Nie uruchamiano bazy. Zachowanie `anon` wynika z wniosku `2026-10-19-supabase-local-api-exposure` (sprawdzone lokalnie przy researchu), a nie z nowego testu.
