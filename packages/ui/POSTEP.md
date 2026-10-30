# Design system Koperty – postęp

Plik prowadzi agent budujący design system. Nowa sesja zaczyna od przeczytania tego pliku i kontynuuje od sekcji „Następny krok”.

- **Miejsce pracy:** worktree `.claude/worktrees/design-system-storybook-68d9d9`, gałąź `claude/design-system-storybook-68d9d9`. Do `master` zmiany trafią przez PR, dopiero po zgodzie właściciela projektu (bez `git push` bez prośby).
- **Katalog design systemu:** `packages/ui` (decyzja Q3).

## Etapy

| Etap                                   | Status                                          | Data       |
| -------------------------------------- | ----------------------------------------------- | ---------- |
| 0. Inwentaryzacja i plan               | zakończony                                      | 2026-10-29 |
| 1. Fundamenty                          | zakończony                                      | 2026-10-29 |
| 2. Komponenty bazowe                   | zakończony                                      | 2026-10-30 |
| 3. Komponenty produktu, wzorce, ekrany | zakończony                                      | 2026-10-30 |
| 4. Strony, które uczą                  | nie rozpoczęty                                  | –          |
| 5. Sprawdzenie i raport                | gotowy; test agentem przygotowany, nie wykonany | 2026-10-30 |

## Materiały źródłowe

**Są w repozytorium:**

| Materiał                                      | Co wnosi do design systemu                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| `docs/prd.md`                                 | user stories US-01–US-24, reguły domenowe, wymagania niefunkcjonalne (sekcja 6)   |
| `docs/backlog.md`                             | zadania S-01–S-15, T-01, T-02 i kolejność                                         |
| `.ai/specs/2026-10-19-email-login-profile.md` | jedyna specyfikacja z ekranami (S-01, `approved`): `/login`, nagłówek, `/profile` |
| `docs/engineering-standards.md` 4.2, 4.5      | struktura katalogów frontendu, zasady dostępności formularzy                      |
| `AGENTS.md`                                   | stack (Tailwind 4, shadcn/ui, lucide), `pl-PL`, PLN, mobile first, proces         |
| ADR 0001, 0011                                | SPA na Vite+, testy komponentów w Chromium przez Playwright                       |

**Nie ma w repozytorium (blokuje etap 1, zasada 1):** referencji (R01…), antyreferencji (A01…), pliku `tokeny.md`, briefu charakteru i stylu, makiet ani rozstrzygniętych konfliktów stylu.

## Decyzje źródłowe (cytowane w dokumentacji)

Słowa charakteru, antycharakter, kolumna „Bierzemy” i antyreferencje: **brak w materiałach** (Q1). Z dokumentów wynikają tylko decyzje funkcjonalne:

| ID     | Decyzja                                                                                              | Źródło                                 |
| ------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------- |
| DS-S01 | Dostępność WCAG 2.1 AA: kontrast, klawiatura, etykiety pól, czytelne błędy                           | PRD 6                                  |
| DS-S02 | Mobile first; testujemy od 320 px (PRD wymaga 360 px, 320 px jest surowsze i zgodne z WCAG 1.4.10)   | PRD 6, WCAG 1.4.10                     |
| DS-S03 | Ujemne saldo koperty i ujemna pula są wyraźnie oznaczone, nie tylko kolorem                          | PRD 4.3, 4.5, US-16, US-21, WCAG 1.4.1 |
| DS-S04 | Szybki zapis wydatku na telefonie, także w sklepie                                                   | US-17, persona członka (PRD 2)         |
| DS-S05 | Po otwarciu aplikacji od razu salda kopert i pula; nowy budżet pokazuje zachętę do pierwszej koperty | US-21                                  |
| DS-S06 | Interfejs po polsku; kwoty i daty `pl-PL`, waluta PLN, daty bez godzin                               | PRD 4.1, 6, AGENTS.md                  |
| DS-S07 | Brak sieci: czytelny komunikat, bez trybu offline                                                    | US-23                                  |
| DS-S08 | Operacje nieodwracalne (usunięcie konta, budżetu) wymagają potwierdzenia                             | US-03, US-06                           |
| DS-S09 | Ujemne salda mogą być mylące – prezentacja musi być czytelna                                         | PRD 8 (ryzyka)                         |
| DS-S10 | Baza komponentów: shadcn/ui (styl `radix-nova`), Radix, ikony lucide; bez wykresów w MVP             | AGENTS.md, PRD 3                       |

## Inwentaryzacja repozytorium

| Obszar            | Stan                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Menedżer pakietów | Bun 1.4.3 przez Vite+ (`vp`), monorepo z `workspaces: ["apps/*"]`                                                 |
| Framework         | React 19.3, TypeScript 7.0 `strict`, Vite+ 1.3 (Vite 8.3.4, Vitest 5.0.5), TanStack Router i Query                |
| Style             | Tailwind CSS 4.3.3 (`@tailwindcss/vite`), `tw-animate-css`, `shadcn/tailwind.css`                                 |
| Tokeny            | tylko domyślny motyw shadcn `neutral` w `apps/web/src/index.css` (jasny i `.dark`, tokeny `sidebar-*`, `chart-*`) |
| Komponenty        | `apps/web/src/components/ui/button.tsx` (shadcn, bez zmian), użyty na stronie `/`                                 |
| Font              | Geist Variable lokalnie (`@fontsource-variable/geist`), bez CDN                                                   |
| Ikony             | `lucide-react` 1.59                                                                                               |
| Storybook         | brak                                                                                                              |
| Testy komponentów | zaplanowane w S-01 (ADR 0011): tryb przeglądarkowy Vitest + Playwright; jeszcze niewdrożone                       |
| Pokrycie          | 100% na plik; `apps/web/src/components/ui/**` wykluczone jako generowane                                          |

## Otwarte pytania

Q1–Q5 rozstrzygnięte (sekcja „Zatwierdzone decyzje”). Otwarte:

- Dodanie zgłoszenia T-03 (design system) do backlogu w GitHub Issues, zgłoszenie zbiorcze #20 – czeka na zgodę właściciela.

## Plan techniczny (zatwierdzony; szczegóły w ADR 0012 i specyfikacji T-03)

- **Pakiet:** `packages/ui`, nazwa `@koperty/ui`, dodany do `workspaces` (`packages/*`). Kod źródłowy TS bez osobnego builda (Vite konsumuje źródła). Aplikacja importuje `@koperty/ui/styles.css` i komponenty.
- **Układ katalogu:** `src/tokens/` (surowe, znaczeniowe, komponentowe; jasny i ewentualnie ciemny), `src/styles.css` (mapowanie na `@theme` Tailwinda), `src/primitives/`, `src/product/<epik>/`, `src/patterns/`, `src/views/`, `.storybook/`, `docs/` (strony MDX i bloki pomocnicze, bez eksportu), `scripts/check-tokens.ts`, `components.json` (shadcn w trybie monorepo).
- **Storybook 10.6.x** z `@storybook/react-vite`. Zgodność z Vite+ (Vite 8.3.4 w `vite-plus-core`) do potwierdzenia na początku etapu 1.
- **Dodatki:** `@storybook/addon-docs` (MDX), `@storybook/addon-a11y` (`a11y: { test: 'error' }`), `@storybook/addon-vitest` (stories jako testy w Chromium; Playwright i `@vitest/browser-playwright` współdzielone z ADR 0011), `remark-gfm` (tabele w MDX).
- **Symulowanie API: bez MSW.** Komponenty i widoki dostają asynchroniczne funkcje (`onSubmit` i podobne); stories symulują odpowiedzi przez `fn()` z opóźnieniem lub odrzuceniem (sukces, oczekiwanie, błąd pola, błąd serwera, brak sieci). MSW dopiero wtedy, gdy stories mają renderować prawdziwe trasy z TanStack Query.
- **Toast:** `sonner` przez shadcn (po CLI usunąć `next-themes`, motyw z własnego przełącznika).
- **Motyw:** globalny przełącznik w pasku Storybooka ustawia klasę i `data-theme` na `document.documentElement`, więc portale Radix (dialogi, menu) dostają motyw.
- **Tokeny w Tailwindzie:** `@theme` z `--color-*: initial`, żeby klasy palety (`bg-zinc-900`) w ogóle się nie generowały; klasy tylko z tokenów znaczeniowych.
- **Branding:** motyw managera z `brandTitle: "Koperty"`, wyłączone powiadomienia o nowościach i checklista startowa; pochodzenie bazy w notatce technicznej.
- **Skrypty (`packages/ui`, wywoływane przez `vp run`):** `storybook`, `build-storybook`, `test-storybook`, `test-storybook:themes` (oba motywy, jeśli Q2 = tak), `check:tokens` (kolory spoza pliku tokenów, klasy palety, wartości arbitralne; kod wyjścia ≠ 0).
- **Pokrycie:** pliki pakietu objęte progiem 100%, liczonym z testów stories (addon Vitest). Wyłączenie `components/ui/**` przestaje pasować, bo komponenty bazowe będą edytowane ręcznie – do decyzji przy ADR.
- **CI (propozycja):** `check:tokens`, `build-storybook` i `test-storybook` w zadaniu `web`.

## Komponenty bazowe

Wyprowadzone z ekranów S-01 (specyfikacja) i user stories pozostałych zadań (specyfikacji jeszcze nie ma, więc mapowanie dla S-02–S-15 jest wstępne).

| Komponent                                                         | Ekrany, które go potrzebują                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Przycisk                                                          | wszystkie; S-01 „Wyślij kod”, „Wyloguj”, „Zapisz”                                                      |
| Akcja tekstowa i link                                             | S-01 „Wyślij ponownie”, nazwa w nagłówku jako link do profilu                                          |
| Pole tekstowe                                                     | S-01 e-mail, kod (`inputmode="numeric"`, `autocomplete="one-time-code"`), nazwa; S-02, S-03, S-06 opis |
| Pole formularza (etykieta, podpowiedź, błąd, wymagane/opcjonalne) | wszystkie formularze                                                                                   |
| Select                                                            | S-06, S-07 wybór koperty                                                                               |
| Przełącznik                                                       | S-07 „Podziel na kilka kopert” (propozycja), S-10 „Pokaż zarchiwizowane”                               |
| Karta / panel                                                     | S-01 ekran logowania, S-05 pula i koperty                                                              |
| Znacznik statusu                                                  | S-10 „Zarchiwizowana”, S-11 status zaproszenia, S-12 rola                                              |
| Awatar (inicjały)                                                 | S-08 autor operacji, S-12 członkowie                                                                   |
| Alert                                                             | S-01 „Link wygasł…” (AC-3b), S-05 ujemna pula, S-12 jedyny właściciel (US-10), S-15 brak sieci         |
| Dialog                                                            | S-03 zmiana nazwy koperty, S-05 przydział, S-11 nowe zaproszenie (propozycja)                          |
| Dialog potwierdzenia                                              | S-04, S-08 usunięcie operacji; S-11 unieważnienie; S-12 usunięcie członka, opuszczenie; S-13; S-14     |
| Menu                                                              | S-02 przełącznik budżetu; akcje wiersza w S-03, S-08, S-12                                             |
| Podpowiedź                                                        | etykiety przycisków ikonowych (S-03 kolejność, „Więcej akcji”)                                         |
| Tabela                                                            | S-09 podsumowanie miesiąca                                                                             |
| Szkielet ładowania                                                | S-05, S-08, S-09; domyślny komponent ładowania tras (S-01)                                             |
| Wskaźnik ładowania                                                | przyciski w trakcie wysyłania (S-01 i wszystkie formularze)                                            |
| Pusty stan                                                        | S-05 nowy budżet (US-21), S-08 brak operacji, S-11 brak zaproszeń                                      |
| Stan błędu                                                        | domyślny komponent błędu tras (S-01), błąd ładowania danych                                            |
| Toast                                                             | S-11 „Link skopiowany”, S-06 „Wydatek zapisany” (potwierdzenia bez wymaganego działania)               |
| Zakładki (propozycja)                                             | S-11/S-12 „Członkowie” i „Zaproszenia” w ustawieniach budżetu                                          |

**Pominięte z minimalnego zestawu (brak ekranu, który ich potrzebuje):** pole wielowierszowe (opis wydatku jest krótki), checkbox, grupa radio, popover (data przez natywne `input type="date"`). Trafią na stronę „Czego brakuje”. Do decyzji: panel dolny (`sheet`) dla szybkiego wydatku na telefonie (DS-S04).

## Komponenty produktu (epiki = sekcje user stories w PRD)

| Epik (zadania)                                 | Komponent                                                             | Ekran                                           |
| ---------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| Konto (S-01, S-14)                             | Nagłówek aplikacji                                                    | S-01 układ `_authenticated`                     |
| Budżety i członkostwo (S-02, S-11, S-12, S-13) | Przełącznik budżetu                                                   | S-02                                            |
|                                                | Wiersz członka, znacznik roli                                         | S-12                                            |
|                                                | Wiersz zaproszenia                                                    | S-11 lista aktywnych                            |
|                                                | Panel linku zaproszenia                                               | S-11 kopiuj / udostępnij                        |
|                                                | Karta dołączenia                                                      | S-11 stany: ważny, wygasły, zużyty, już członek |
| Koperty (S-03, S-10)                           | Wiersz koperty (z kolejnością, archiwum)                              | S-03, S-05, S-10                                |
| Przychody i przydziały (S-04, S-05)            | Kwota (z oznaczeniem ujemnej)                                         | wszystkie z kwotami                             |
|                                                | Pole kwoty (PLN → grosze)                                             | S-04, S-05, S-06, S-07                          |
|                                                | Podsumowanie puli                                                     | S-04, S-05                                      |
|                                                | Przełącznik miesiąca                                                  | S-05, S-08, S-09                                |
| Wydatki (S-06, S-07, S-08)                     | Edytor podziału, wiersz podziału                                      | S-07                                            |
|                                                | Wiersz operacji, lista dni                                            | S-08                                            |
| Przegląd budżetu (S-05, S-09)                  | Tabela podsumowania miesiąca                                          | S-09                                            |
| Aplikacja na telefonie (S-15)                  | Komunikat braku sieci                                                 | S-15                                            |
| wspólne                                        | Powłoka aplikacji z nawigacją (propozycja: PRD nie opisuje nawigacji) | wszystkie po zalogowaniu                        |

## Wzorce

| Wzorzec                                    | Gdzie w produkcie                                        |
| ------------------------------------------ | -------------------------------------------------------- |
| Formularz (ze stanami odpowiedzi API)      | S-01 profil, S-02, S-04, S-06                            |
| Lista z filtrami                           | S-08 lista operacji (zakres: Q5)                         |
| Widok szczegółów                           | S-08 wydatek (US-19), z „nie istnieje albo brak dostępu” |
| Potwierdzenie usunięcia                    | S-08, S-12, S-13, S-14                                   |
| Kwota ujemna i debet                       | US-16, US-17, US-21, US-22                               |
| Podział wydatku                            | US-18                                                    |
| Nawigacja po miesiącach (także przyszłych) | US-16, US-20, US-22                                      |
| Logowanie kodem w dwóch krokach            | S-01                                                     |
| Udostępnienie i otwarcie zaproszenia       | US-07, US-08                                             |
| Pierwsze uruchomienie i pusty budżet       | US-04, US-21                                             |
| Brak sieci i wygasła sesja                 | US-23, S-01 AC-6b                                        |

## Drzewo menu Storybooka (nazwy po polsku, zgodnie z dokumentacją)

```
Design system
  Zacznij tutaj
  Komponenty
  Jak wybrać
  Użycie i dostępność
  Treść
  Czego unikać
  Czego brakuje
  Jak zmieniać system
  Epik: Konto · Budżety i członkostwo · Koperty · Przychody i przydziały · Wydatki · Przegląd budżetu · Aplikacja na telefonie
Fundamenty: Kolor · Typografia · Odstępy i układ · Kształt i głębia · Ruch · Ikony · Motywy
Komponenty bazowe: (21 komponentów)
Komponenty produktu: grupy według epików
Wzorce: (11 wzorców)
Ekrany: kluczowe ekrany epików na pełny ekran
```

**Szacunek:** około 75 stron dokumentacji (9 stron systemu, 7 epików, 7 fundamentów, około 50 stron komponentów i wzorców) i około 380 stories (bazowe ok. 140, produktu ok. 115, wzorce ok. 65, ekrany ok. 60).

## Istniejące elementy (do decyzji, zasada 12)

| Element                                                                                                         | Propozycja    | Uzasadnienie                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind 4, `components.json` (`radix-nova`, lucide), `cn` w `@/lib/utils`, `radix-ui`, `cva`, `tw-animate-css` | zostaje       | to ustalona baza (AGENTS.md); zmienia się tylko miejsce `components.json` (Q3)                                                           |
| Font Geist (lokalnie)                                                                                           | zostaje do Q1 | już bez CDN; zmiana tylko, jeśli brief wskaże inny krój                                                                                  |
| Motyw `neutral` w `apps/web/src/index.css`                                                                      | zmiana        | domyślny wygląd bazy nie jest stylem produktu (zasada 2); zastąpią go tokeny z pakietu                                                   |
| `button.tsx` w `apps/web`                                                                                       | zmiana        | przeniesienie do pakietu i dostosowanie do tokenów (zasady 2, 3); dziś `h-8`, `rounded-lg`, `hover:bg-[color-mix…]` – wartość arbitralna |
| Tokeny `sidebar-*` i `chart-*`                                                                                  | usunięcie     | produkt nie ma paska bocznego, wykresy są poza MVP (PRD 3)                                                                               |
| Wariant `.dark`                                                                                                 | zależy od Q2  | zostaje i dostaje tokeny produktu albo jest usuwany                                                                                      |
| Przycisk „Zaczynamy” na `/`                                                                                     | bez zmian     | usuwa go S-01; poza zakresem design systemu (zasada 11)                                                                                  |

## Warsztat stylu (odpowiedź na Q1)

**Runda 1 – charakter i referencje (2026-10-29), odpowiedzi właściciela:**

| ID  | Decyzja                                                                                             |
| --- | --------------------------------------------------------------------------------------------------- |
| C1  | Słowa charakteru: **precyzyjny, zwarty, „księgowy”**                                                |
| AC1 | Antycharakter: krzykliwy fintech – neony, gradienty, animacje dla efektu                            |
| AC2 | Antycharakter: infantylna grywalizacja – odznaki, konfetti, maskotki                                |
| AC3 | Antycharakter: surowy arkusz kalkulacyjny – siatka liczb bez hierarchii                             |
| AC4 | Antycharakter: aplikacja, która straszy – czerwień i alarmy przy każdym debecie                     |
| R01 | Referencja: widoki shadcn create z presetem `b2CiCkMHw` (szczegóły niżej)                           |
| –   | Antyreferencje (A01…): nie podano; rolę antywzorców pełnią AC1–AC4                                  |
| T1  | Ciemny motyw: jest; domyślnie według ustawień systemu, z przełącznikiem w aplikacji (rozstrzyga Q2) |

**R01 rozkodowany** (`decodePreset` z pakietu `shadcn` 4.22.1 i payload `https://ui.shadcn.com/init` dla tego presetu):

| Parametr | Wartość R01                        | Obecnie w repozytorium |
| -------- | ---------------------------------- | ---------------------- |
| Styl     | `radix-mira` (zwarty)              | `radix-nova`           |
| Kolor    | motyw `emerald` na bazie `neutral` | `neutral`              |
| Font     | Oxanium (także nagłówki)           | Geist                  |
| Promień  | `small`, `--radius: 0.45rem`       | `0.625rem`             |
| Ikony    | lucide                             | lucide                 |
| Menu     | `default`, akcent `subtle`         | to samo                |

- **R01.1 Gęstość:** przycisk i pole mają 28 px wysokości (`h-7`); tekst przycisku 12 px; tekst pola 14 px, a od `md` 12 px.
- **R01.2 Kolor akcji:** szmaragd (`primary` jasny `oklch(0.508 0.118 165.612)`, ciemny `oklch(0.432 0.095 166.913)`), reszta neutralna.
- **R01.3 Kształt:** mały promień, obramowania i pierścień fokusu zamiast cieni.
- **R01.4 Typografia:** Oxanium – geometryczny, techniczny krój.

**Kontrast wartości R01 (zmierzony, WCAG 2.1):**

| Para                                       | Jasny | Ciemny | Próg | Wynik                                                               |
| ------------------------------------------ | ----- | ------ | ---- | ------------------------------------------------------------------- |
| tekst przycisku głównego na `primary`      | 5,09  | 7,19   | 4,5  | OK                                                                  |
| `muted-foreground` na tle                  | 4,73  | 7,63   | 4,5  | OK                                                                  |
| `muted-foreground` na `muted`              | 4,34  | –      | 4,5  | **za mało (jasny)**                                                 |
| `destructive` jako tekst na tle            | 4,76  | 6,84   | 4,5  | OK                                                                  |
| `primary` jako tekst lub link na tle       | 5,37  | 2,61   | 4,5  | **za mało (ciemny)**                                                |
| pierścień fokusu (`ring`) na tle           | 2,59  | 4,18   | 3    | **za mało (jasny)**, a R01 używa go jeszcze z przezroczystością 30% |
| obramowanie pola (`border`/`input`) na tle | 1,26  | –      | 3    | **za mało** (granica pola, WCAG 1.4.11)                             |

**Runda 2 – parametry wizualne (2026-10-29), odpowiedzi właściciela:** 1c – większe kontrolki wszędzie (W1); 2 tak – poprawki kontrastu w tych samych odcieniach, fokus szmaragdowy (W2); 3a – Oxanium wszędzie (W3); 4c – kwoty bez koloru, dodatnie i ujemne (W4); 5b – delikatne cienie kart (W5).

**Runda 3 – brief i tokeny:** zapisane w [brief.md](brief.md) i [tokeny.md](tokeny.md), zatwierdzone 2026-10-29. Wartości bez źródła w materiałach są oznaczone P1–P8.

## Etap 1 – wynik (2026-10-29)

**Zbudowane:**

- pakiet `packages/ui` (`@koperty/ui`) w workspace; aplikacja importuje `@koperty/ui/styles.css` i `Button` z pakietu; `components.json` przeniesiony do pakietu (styl `radix-mira`, aliasy `@koperty/ui/...`),
- tokeny w trzech warstwach w `src/tokens/tokens.css` (jedyny plik z wartościami kolorów), oba motywy przez `light-dark()` i `color-scheme`,
- `src/styles.css`: mapowanie tokenów na `@theme` Tailwinda; domyślna paleta, skala odstępów, rozmiary tekstu, promienie, cienie i fonty Tailwinda wyłączone, więc istnieją tylko klasy z tokenów (`bg-surface-card`, `text-muted`, `p-panel`, `h-control`…); globalny fokus i `prefers-reduced-motion`,
- `cn` w `src/lib/utils.ts` z tailwind-merge rozszerzonym o nazwy tokenów (bez tego `text-meta` i `text-muted` się wykluczały),
- font Oxanium z pakietu (bez CDN),
- Storybook 10.6.5: MDX z `remark-gfm`, a11y z `test: 'error'`, addon Vitest, przełącznik motywu na `<html>` (dekorator i kanał globali, więc działa też na stronach MDX), nazwa „Koperty” w panelu i tytule karty, bez checklisty startowej i powiadomień o nowościach, kolejność menu,
- strony Fundamentów: Kolor (role i zmierzona tabela kontrastu w obu motywach), Typografia, Odstępy i układ, Kształt i głębia, Ruch, Ikony, Motywy; bloki dokumentacji w `docs/blocks/` (bez eksportu z pakietu) z testami,
- `vp run check:tokens` (kolory spoza pliku tokenów, klasy palety, wartości i właściwości arbitralne, `dark:`) z testami; na oryginalnym `button.tsx` z shadcn znajduje 6 wartości arbitralnych i warianty `dark:`,
- skrypty: `vp -C packages/ui run storybook`, `vp -C packages/ui run build-storybook`, `vp run test:storybook` (projekty `ui` i `ui-dark`), `vp run check:tokens`; kroki CI: tokeny, instalacja Chromium, build Storybooka,
- `Button` przeniesiony z klasami tokenów (pełne dostosowanie i dokumentacja w etapie 2).

**Sprawdzone:**

- `vp check`, `vp run check:ai`, `vp run check:tokens` – bez uwag,
- `vp test --coverage` – 51 testów, 100% we wszystkich metrykach (stories w obu motywach w Chromium),
- `vp build` i build Storybooka – bez błędów,
- kontrast ponownie policzony dla zapisanych wartości (skrypt na `tokens.css`) i zmierzony w przeglądarce: 25 par × 2 motywy spełnia progi; test story kończy się błędem, gdy para spadnie poniżej progu,
- test a11y naprawdę kończy się błędem (sprawdzone próbną story z pustym przyciskiem), motyw `ui-dark` faktycznie ciemny,
- 7 stron Fundamentów × szerokości 320, 768 i 1440 px (Playwright bez okna): tabele MDX renderują się jako tabele, brak poziomego przewijania strony, motyw na `<html>`, w interfejsie brak słowa „Storybook”.

**Nie sprawdzone w tym etapie:** ręczny przegląd w oknie przeglądarki (wbudowana przeglądarka blokowała `localhost`; zrzuty z Playwrighta), obsługa klawiaturą w panelu Storybooka, kroki CI na GitHubie (nic nie wypchnięte).

**Do decyzji właściciela:**

1. **Nowe wykluczenie z pomiaru pokrycia:** `**/*.stories.tsx` (stories są testami, nie kodem testowanym). AGENTS.md wymaga na to zgody.
2. **Martwe wykluczenie** `apps/web/src/components/ui/**` (katalog już nie istnieje) – propozycja: usunąć.
3. **`apps/web/src/lib/utils.ts`** (`cn` bez nazw tokenów) i zależności `clsx`, `tailwind-merge` w aplikacji nie są już używane przez komponenty – propozycja: usunąć i używać `cn` z `@koperty/ui/lib/utils`.
4. **Warianty `Button`:** przeniesiony bez rozmiarów `xs`, `lg`, `icon-xs`, `icon-lg` (brak tokenów, P2 przewiduje tylko 40 i 32 px). Ostateczny zestaw w etapie 2.
5. **Propozycje w dokumentacji (oznaczone):** kwoty w kolumnach wyrównane do prawej (Typografia), akcja główna ekranu zawsze z tekstem (Ikony).
6. **Elementy Storybooka, których nie da się wyłączyć konfiguracją:** angielskie napisy panelu („Find components”, „Run tests”), favicon Storybooka i ekran „About” w menu ustawień. Produkt nie ma własnej ikony (potrzebna też w S-15) – brak w „Czego brakuje”.
7. **`light-dark()`:** Safari od 17.5, Chrome od 123, Firefox od 120; w starszej przeglądarce strona pokazuje domyślne kolory przeglądarki (czytelne). Do akceptacji albo zamiana na zdublowany blok `.dark`.

**Notatka techniczna (zasada 10):** baza komponentów to shadcn/ui (Radix, styl `radix-mira`) z ikonami lucide; w interfejsie Storybooka widać tylko nazwę „Koperty”. Ta notatka trafi też na stronę „Jak zmieniać system” (etap 4).

## Etap 2 – różnice względem bazy (przed pierwszą partią)

Baza porównania: shadcn `radix-nova` (stan repozytorium przed T-03), wartości z rejestru `ui.shadcn.com/r/styles/radix-nova/*.json` (2026-10-29).

| Obszar                                      | `radix-nova`                                       | Koperty                                                                             | Decyzja                          |
| ------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------- |
| Wysokość przycisku, pola, selecta, zakładek | 32 px (`h-8`)                                      | 40 px (`h-control`); 32 px (`h-control-sm`) tylko w akcjach wiersza                 | W1, P2, K1                       |
| Wysokość pozycji menu                       | ok. 28 px (`py-1`)                                 | 40 px (`h-menu-item`)                                                               | W1                               |
| Wnętrze przycisku                           | 10 px (`px-2.5`)                                   | 12 px (`px-control-x`)                                                              | P2                               |
| Promień kontrolek                           | 10 px (`rounded-lg`, `--radius` 0,625 rem)         | ok. 5,8 px (`rounded-control`)                                                      | R01.3                            |
| Promień karty                               | 14 px (`rounded-xl`)                               | ok. 7,2 px (`rounded-card`)                                                         | R01.3                            |
| Promień dialogu                             | 14 px (`rounded-xl`)                               | 10 px (`rounded-overlay`)                                                           | R01.3                            |
| Znacznik                                    | pigułka (`rounded-4xl`), tekst 12 px               | promień kontrolki, tekst 12 px, 20 px wysokości                                     | K6, P1                           |
| Obramowanie pola                            | `border-input` 1,26 : 1                            | `border-control` 3,36 : 1 (jasny), 4,25 : 1 (ciemny)                                | K2, WCAG 1.4.11                  |
| Oddzielenie karty                           | `ring-1` 10% koloru tekstu, bez cienia             | `border-subtle` i `shadow-card`                                                     | W5, K4                           |
| Fokus                                       | pierścień 3 px, szary 50% przezroczysty (2,59 : 1) | linia 2 px `focus-ring` (szmaragd) z odstępem 2 px, globalnie                       | W2, WCAG 2.4.7                   |
| Najechanie na przycisk główny               | `primary/80` (przezroczystość)                     | `action-primary-hover` (kontrast 6,44 : 1)                                          | K2                               |
| Wciśnięcie                                  | przesunięcie o 1 px                                | kolor `action-primary-pressed`, bez przesunięcia                                    | K2, AC1                          |
| Pole z błędem                               | `border-destructive` i pierścień 20%               | `border-invalid`, tekst błędu i ikona pod polem, `aria-invalid`, `aria-describedby` | WCAG 1.4.1, 3.3.1, standardy 4.5 |
| Tekst w polu                                | 16 px na telefonie, 14 px od `md`                  | zawsze 16 px (`text-input`)                                                         | K1                               |
| Tekst przycisku, etykiety                   | 14 px, Geist                                       | 14 px / 500 (`text-label`), Oxanium                                                 | P3, W3                           |
| Podpowiedź (tooltip)                        | 12 px, odwrócone kolory                            | 12 px (`text-meta`), tło `surface-overlay`, `border-subtle`, `shadow-overlay`       | P3, W5 – propozycja kolorów      |
| Tło pod dialogiem                           | `bg-black/10` z `backdrop-blur-xs`                 | `surface-scrim` 50% / 70%, bez rozmycia                                             | K5                               |
| Cień nakładek                               | `shadow-md` / `shadow-lg`                          | `shadow-overlay`                                                                    | W5                               |
| Ciemny motyw w komponentach                 | klasy `dark:`                                      | tylko tokeny; `dark:` odrzuca `check:tokens`                                        | T1                               |
| Debet                                       | brak                                               | wariant neutralny znacznika „Debet” obok kwoty ze znakiem minus                     | K3, W4                           |
| Awatar                                      | zdjęcie, `size-8`                                  | tylko inicjały (PRD nie ma zdjęć profilu), 32 px, jedyny element w kształcie koła   | PRD 4.11, K6                     |
| Font                                        | Geist                                              | Oxanium                                                                             | W3                               |

**Materiały milczą – pytania przed partią 1 (E2-Q1–E2-Q5):**

- **E2-Q1. Zablokowane kontrolki.** Propozycja: przycisk wysyłania formularza nigdy nie jest zablokowany (walidacja po kliknięciu pokazuje, co poprawić); blokujemy tylko akcję, która jest niemożliwa (np. archiwizacja koperty z saldem różnym od 0 zł, US-13), zawsze z tekstem wyjaśnienia obok. Wygląd: przezroczystość 50% jak w bazie.
- **E2-Q2. Ładowanie w przycisku.** Propozycja: wskaźnik ładowania przed tekstem, tekst zmienia się na czynność w toku („Zapisywanie…”), szerokość przycisku się nie zmienia, `aria-busy`, ponowne kliknięcie nic nie robi (blokada podwójnego wysłania).
- **E2-Q3. Przełącznik.** Baza ma 32 × 18 px. Propozycja: tor 44 × 24 px, kciuk 20 px, cały wiersz z etykietą klikalny.
- **E2-Q4. Toast.** Propozycja: jeden na raz, na dole ekranu (na telefonie w zasięgu kciuka), 5 s, tylko potwierdzenia, które nie wymagają działania („Link skopiowany”); błąd wymagający działania nigdy nie jest toastem.
- **E2-Q5. Pusty stan.** Baza ma przerywaną ramkę. Propozycja: bez ramki, ikona 20 px w kolorze `text-muted`, tytuł `text-section`, jedno zdanie „dlaczego pusto” i jedna akcja.

**Partie (propozycja):**

1. Przycisk (z akcją tekstową i linkiem), Pole tekstowe, Etykieta i Pole formularza, Select, Przełącznik, Karta.
2. Znacznik, Awatar, Alert, Dialog, Dialog potwierdzenia, Menu.
3. Podpowiedź, Zakładki, Tabela, Szkielet ładowania, Wskaźnik ładowania.
4. Pusty stan, Stan błędu, Toast.

## Etap 2 – partia 1 – wynik (2026-10-29)

**Zbudowane:** Przycisk (`primary`, `secondary`, `ghost`, `danger`, `link`; rozmiary `default`, `sm`, `icon`, `icon-sm`, `inline`; stany ładowania i zablokowania), Akcja tekstowa i link (ten sam komponent), Pole tekstowe, Pole formularza (`FormField`, `FieldGroup`, `FieldDescription`, `FieldError`, `Label`), Select, Przełącznik (44 × 24 px, nowe tokeny komponentu), Karta. Każdy ma stronę „Dokumentacja” z 13 sekcjami i stories: Playground, warianty, macierz stanów (zamrożone najechanie, fokus i wciśnięcie przez `data-preview-state`, zdefiniowane wyłącznie w CSS Storybooka), długa treść i ekran 320 px, testy interakcji.

**CLI shadcn:** `add input field label select switch card` (styl `radix-mira`). Dodał zależność `cn` (usunięta) i komponent `separator` (usunięty razem z `FieldSeparator`; poza planem). `field` skrócony do części potrzebnych w produkcie.

**Sprawdzone:**

- `vp check`, `check:tokens`, `check:ai` – bez uwag; `vp test --coverage` – 124 testy, 100%; `vp build` i build Storybooka – bez błędów,
- 7 stron dokumentacji × 320 / 768 / 1440 px (Playwright): 13 sekcji, tabele jako tabele, bez poziomego przewijania, bez błędów w konsoli,
- zamrożone najechanie daje ten sam kolor co prawdziwe `:hover` (porównanie w przeglądarce), fokus 2 px,
- otwarty select w ciemnym motywie renderuje się w portalu z ciemnym tłem nakładki (zasada 9).

**Wyjątek dostępności:** story „Select / Otwarty” wyłącza regułę axe `aria-hidden-focus` (opis na stronie Select). Pozostałe stories przechodzą bez wyjątków w obu motywach.

**Propozycje do decyzji (oznaczone w dokumentacji):**

1. **E2-P1:** pola opcjonalne oznaczamy „(opcjonalnie)”, wymagane bez znaku (z `aria-required`).
2. **E2-P2:** zasady treści: etykieta przycisku najwyżej 3 słowa / około 24 znaków; etykieta pola – rzeczownik 1–3 słowa; placeholder selecta „Wybierz…”; etykieta przełącznika opisuje stan włączony.
3. **E2-P4:** jedna czynność główna (`primary`) na sekcję; akcja tekstowa dla małych czynności; najechanie na link pogrubia podkreślenie; pole tekstowe bez stanu najechania, tylko do odczytu z tłem `surface-muted`; select z tłem przy najechaniu.
4. **E2-P5:** na 320 px przyciski formularza na pełną szerokość, główny pierwszy; od 768 px obok siebie.
5. **E2-P6:** select do około 15 pozycji; dłuższe listy wymagają pola z wyszukiwaniem (brak w planie).
6. **E2-P7:** karta nie jest klikalna; akcje są przyciskami w środku.
7. **Warianty przycisku:** usunięty `outline` z bazy (zastępuje go `secondary`), `destructive` → `danger`; dodany rozmiar `inline` dla linku w zdaniu.
8. **Karta:** `CardAction` z bazy zastąpiony propem `action` w `CardHeader` (układ bez wartości arbitralnych), `CardTitle` jest nagłówkiem `h3` z `asChild`.

**Uwagi:**

- Natywne pole daty pokazuje format według języka przeglądarki (w teście `en-US`: „10/29/2026”); wartość zawsze `RRRR-MM-DD`. Polski format zobaczy użytkownik z polską przeglądarką – do „Czego brakuje”, jeśli potrzebny jest format niezależny od przeglądarki.
- Do strony „Czego brakuje”: pole wielowierszowe, checkbox, grupa radio, popover, pole z wyszukiwaniem, ikona produktu, angielskie napisy panelu Storybooka.

## Etap 2 – partia 2 – wynik (2026-10-29)

**Zbudowane:** Znacznik, Awatar, Alert, Dialog, Dialog potwierdzenia, Menu – każdy ze stroną „Dokumentacja” (13 sekcji), macierzą stanów, długą treścią, 320 px i testami interakcji (klawiatura, fokus w dialogu i powrót fokusu, Escape, oczekiwanie na serwer w dialogu potwierdzenia, nawigacja strzałkami w menu).

**CLI shadcn:** `add badge avatar alert dialog alert-dialog dropdown-menu`. Znowu dodał `cn` (usunięty). Przy `dialog` i `alert-dialog` pytał o nadpisanie `button.tsx` – odpowiedź „nie”, przycisk bez zmian.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 168 testów, 100%; `vp build`, build Storybooka; 13 stron dokumentacji × 320 / 768 / 1440 px (13 sekcji na każdej, bez przewijania, bez błędów); dialog, dialog potwierdzenia i menu w ciemnym motywie w portalu (tło `surface-overlay` ciemne), dialog przy 320 px z marginesem 16 px z obu stron.

**Wyjątki dostępności:** stories z otwartą nakładką (Dialog: Otwarty, Długa treść; Dialog potwierdzenia: Otwarty, Oczekiwanie; Menu: Otwarte, Przełącznik budżetu) wyłączają regułę `aria-hidden-focus` z tego samego powodu co Select / Otwarty (opis na stronach).

**Propozycje do decyzji:**

1. **E2-P8:** dialog tylko dla krótkich czynności w jednym kroku (zmiana nazwy, przydział, zaproszenie); dłuższe formularze, w tym wydatek z podziałem, na osobnej stronie; bez dialogu w dialogu.
2. **E2-P9:** menu dopiero od trzech akcji (jedna lub dwie widoczne w wierszu); „Usuń…” z wielokropkiem, na końcu, po separatorze, otwiera dialog potwierdzenia.
3. **Znacznik:** jeden neutralny wygląd, bez wariantów kolorystycznych (z bazy usunięte `secondary`, `destructive`, `outline`, `ghost`, `link`).
4. **Awatar:** bez Radix i bez zdjęć – sam element z inicjałami (`initials(name)`), zawsze dekoracyjny obok nazwy.
5. **Alert:** warianty `default` (`role="status"`) i `danger` (`role="alert"`); akcje przez prop `action` zamiast `AlertAction`.
6. **Dialog potwierdzenia:** `AlertDialogAction` domyślnie `danger`, `AlertDialogCancel` – `secondary`; z bazy usunięte `AlertDialogMedia` i rozmiar `sm`; przycisk akcji obsługuje `loading` (czekanie na serwer).
7. **Menu:** z bazy usunięte pozycje-checkboxy, podmenu, skróty i grupy; zostały pozycje, pozycje wyboru (przełącznik budżetu), etykieta i separator; wariant pozycji `destructive` → `danger`.
8. **Dobrze i źle dla nakładek:** dla dialogu, dialogu potwierdzenia i menu pary są tabelą tekstową, bo otwarte nakładki przykryłyby stronę dokumentacji; wygląd pokazują stories w osobnych ramkach.

**Uwagi:**

- Menu przy 320 px może dotykać krawędzi ekranu, gdy pozycja jest długa (odstęp od krawędzi w Radix to liczba w JS, nie token). Do „Czego brakuje”, jeśli ma być zachowany margines strony.
- Nowe tokeny komponentów: `overlay-max-height` (wysokość dialogu z marginesem strony), `avatar-size`.

## Etap 2 – partia 3 – wynik (2026-10-29)

**Zbudowane:** Podpowiedź, Zakładki, Tabela, Szkielet ładowania, Wskaźnik ładowania – każdy ze stroną „Dokumentacja” (13 sekcji), stanami, 320 px i testami (podpowiedź przy fokusie z klawiatury i Escape, strzałki w zakładkach, nagłówki wierszy i kolumn w tabeli, tekst stanu przy szkielecie i wskaźniku). `Button` używa teraz wspólnego `Spinner`.

**CLI shadcn:** `add tooltip tabs table skeleton spinner`; `cn` znowu usunięty.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 200 testów, 100%; `vp build`, build Storybooka; 18 stron komponentów × 3 szerokości (13 sekcji, bez przewijania strony), 7 stron Fundamentów bez zmian; region tabeli dostaje fokus Tabem i przewija się strzałką przy 320 px; podpowiedź w ciemnym motywie w portalu.

**Błędy znalezione i poprawione w tej partii:** tabela przewijana w bok była niedostępna z klawiatury (axe `scrollable-region-focusable`); macierz stanów zakładek bez panelu (`aria-valid-attr-value`); przykład „Dobrze i źle” rozpychał stronę przy 320 px (element siatki bez `min-w-0`); długa podpowiedź wychodziła 90 px poza ekran 320 px.

**Propozycje do decyzji:**

1. **E2-P10 Zakładki:** jeden wygląd – podkreślenie 2 px w kolorze tekstu (nowy token komponentu `tabs-indicator`, bo szmaragd oznacza tylko akcję); tylko dla równorzędnych części ekranu (Członkowie / Zaproszenia), najwyżej 4, nigdy jako główna nawigacja; liczba w nawiasie, gdy pomaga. Z bazy usunięty wariant „pigułkowy” i orientacja pionowa.
2. **E2-P11 Tabela:** tylko podsumowanie miesiąca; lista operacji to lista wierszy (etap 3).
3. **E2-P12 Szkielet:** przy pierwszym wczytaniu list i kart; bez szkieletu przy ponownym pobraniu danych, które już są na ekranie; liczba szkieletów zbliżona do spodziewanej.
4. **Tabela – wymagany prop `label`:** przewijany region `<section>` z nazwą i fokusem. Wymagało to zmiany konfiguracji lintu: reguła `jsx-a11y/no-noninteractive-tabindex` dopuszcza `tabIndex` na `<section>` (główny `vite.config.ts`).
5. **Wskaźnik ładowania:** z `label` – `<output aria-live="polite">` (lint projektu wymaga `<output>` zamiast `role="status"`), bez `label` – dekoracja.
6. **Podpowiedź:** bez strzałki i bez zerowego opóźnienia z bazy (domyślne opóźnienie Radix), szerokość ograniczona do ekranu.

**Uwagi:** podpowiedź i menu przy 320 px mogą dotykać krawędzi ekranu (odstęp od krawędzi w Radix to liczba w JS) – do „Czego brakuje” razem z uwagą z partii 2.

## Etap 2 – partia 4 – wynik (2026-10-30)

**Zbudowane:** Pusty stan (`EmptyState`), Stan błędu (`ErrorState`), Toast (`Toaster`, `showToast`) – strony z 13 sekcjami, stany, 320 px, testy (akcja pustego stanu, `role="alert"` i ponowna próba w stanie błędu, ogłoszenie toastu w regionie „Powiadomienia”, jeden toast naraz).

**CLI shadcn:** `add empty sonner`. Dodał `cn` i `next-themes` (usunięte) oraz zatwierdzony `sonner` 2.0.8. Plik `sonner.tsx` przemianowany na `toast.tsx`.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 218 testów, 100%; `vp build`, build Storybooka; 21 stron komponentów × 3 szerokości (13 sekcji, bez przewijania strony); toast w ciemnym motywie przy 320 px – pełna szerokość z marginesem 16 px, 16 px od dołu, krój Oxanium (`sonner` narzucał krój systemowy – poprawione `font-sans`).

**Propozycje do decyzji:**

1. **Pusty stan i stan błędu jako gotowe komponenty** (`EmptyState`, `ErrorState`: ikona, tytuł, opis, akcja) zamiast części `Empty*` z bazy; wyrównane do początku, bez obramowania (E2-Q5). `ErrorState` ma `role="alert"`; „nie istnieje” i „brak dostępu” to jeden komunikat (nie zdradza istnienia budżetu).
2. **Toast tylko przez `showToast(message)`** – bez wariantów błędu, ostrzeżenia i akcji, więc błąd wymagający działania nie trafi do toastu; ustawienia E2-Q4 wbudowane w `Toaster`. Czas 5 s jest stałą w kodzie (zachowanie, nie wartość wyglądu). Nazwa regionu „Powiadomienia” – `sonner` dopisuje do niej skrót „alt+T”.
3. **E2-P13 Treść toastu:** czasownik w czasie przeszłym i obiekt („Zapisano wydatek”); bez toastu, gdy wynik i tak widać na ekranie.

## Etap 2 – podsumowanie (2026-10-30)

- **Komponenty bazowe (21 stron dokumentacji):** Przycisk, Akcja tekstowa i link, Pole tekstowe, Pole formularza, Select, Przełącznik, Karta, Znacznik, Awatar, Alert, Dialog, Dialog potwierdzenia, Menu, Podpowiedź, Zakładki, Tabela, Szkielet ładowania, Wskaźnik ładowania, Pusty stan, Stan błędu, Toast.
- **Liczby:** 28 stron dokumentacji (21 komponentów + 7 Fundamentów), 92 stories, 38 testów interakcji w `play`, 218 testów łącznie (stories w obu motywach i testy Node), pokrycie 100%.
- **Wyjątki dostępności (7 stories):** reguła `aria-hidden-focus` w stories z otwartą nakładką (Select: Otwarty; Dialog: Otwarty, Długa treść; Dialog potwierdzenia: Otwarty, Oczekiwanie; Menu: Otwarte, Przełącznik budżetu), opisane na stronach komponentów.
- **Do „Czego brakuje” (etap 4):** pole wielowierszowe, checkbox, grupa radio, popover, pole z wyszukiwaniem, format daty niezależny od przeglądarki, margines menu i podpowiedzi przy krawędzi 320 px, ikona produktu, angielskie napisy panelu Storybooka.

## Etap 3 – plan (2026-10-30, do akceptacji)

Komponenty produktu są prezentacyjne: dostają dane i funkcje przez propsy, nie wołają API (ADR 0012). Każdy ma stany danych z polecenia: ładowanie, pusto, błąd, częściowe dane, dużo danych, długie teksty – i stronę dokumentacji jak komponenty bazowe. Widoki ekranów S-02–S-15 są wstępne (brak specyfikacji tych zadań), oznaczone tak w dokumentacji.

**Partia A – pieniądze i koperty** (Przychody i przydziały, Koperty, Przegląd budżetu)

| Element                                                                | Co robi                                                                               | Źródło                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| `lib/money`: `formatPLN(grosze)`, `parsePLN(tekst)`                    | formatowanie i parsowanie kwot bez liczb zmiennoprzecinkowych (miejsce: E3-Q1)        | standardy 4.4, PRD 4.1 |
| `lib/dates`: `formatDate`, `formatMonth`, `addMonths`, `todayInWarsaw` | daty `RRRR-MM-DD` i miesiące po polsku (miejsce: E3-Q1)                               | standardy 4.4, DS-S06  |
| Kwota (`Amount`)                                                       | kwota w `pl-PL`; ujemna ze znakiem minus i „Debet”; „+” tylko dla przychodu na liście | K3, W4, P7             |
| Pole kwoty (`AmountInput`)                                             | pole z „zł”, `inputMode="decimal"`, przyjmuje „120,50”, „120.50”, „1 234”             | US-14, US-17           |
| Przełącznik miesiąca (`MonthSwitcher`)                                 | poprzedni / następny miesiąc, także przyszłe                                          | US-16, US-20, US-22    |
| Podsumowanie puli (`PoolSummary`)                                      | „Do rozdysponowania”, ujemna pula z wyjaśnieniem                                      | US-14, US-16, US-21    |
| Karta koperty (`EnvelopeCard`)                                         | nazwa i saldo (PRD 4.5), akcje w menu, tryb zmiany kolejności, archiwum               | US-11–US-13, US-21     |

**Partia B – wydatki**

| Element                                            | Co robi                                                                                              | Źródło         |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| Wiersz operacji (`OperationRow`)                   | przychód lub wydatek: kwota, opis, koperty, autor (awatar), akcje                                    | US-20, US-19   |
| Lista operacji (`OperationList`)                   | grupy dni od najnowszych, nagłówki dat                                                               | US-20          |
| Edytor podziału (`SplitEditor`)                    | części: koperta i kwota, „Podziel po równo” (reszta groszy do pierwszej części), „Do podziału: … zł” | US-18, PRD 4.6 |
| Tabela podsumowania miesiąca (`MonthSummaryTable`) | saldo na początek, przydział, wydatki, saldo na koniec, przychody i pula                             | US-22          |

**Partia C – konto, budżety i członkostwo, aplikacja**

| Element                                     | Co robi                                                                        | Źródło       |
| ------------------------------------------- | ------------------------------------------------------------------------------ | ------------ |
| Powłoka aplikacji (`AppShell`)              | nagłówek z przełącznikiem budżetu i menu użytkownika, nawigacja (układ: E3-Q2) | S-01, US-05  |
| Przełącznik budżetu (`BudgetSwitcher`)      | menu z budżetami i „Utwórz budżet”                                             | US-04, US-05 |
| Wiersz członka (`MemberRow`)                | awatar, nazwa, rola, akcje właściciela                                         | US-09, US-10 |
| Wiersz zaproszenia (`InvitationRow`)        | ważność, „Unieważnij”                                                          | US-07        |
| Panel linku zaproszenia (`InviteLinkPanel`) | link w kroju o stałej szerokości, „Kopiuj link”, „Udostępnij”                  | US-07, P8    |
| Karta dołączenia (`JoinBudgetCard`)         | ważny, wygasły, zużyty, już członek                                            | US-08        |

**Partia D – wzorce** (każdy stan jako osobna story): formularz z odpowiedziami API (sukces, oczekiwanie, błąd pola, błąd serwera, brak sieci; fokus na pierwszym błędzie, dane zostają, blokada podwójnego wysłania, sukces po potwierdzeniu), lista z filtrem miesiąca (licznik, aktywny filtr, „brak operacji w miesiącu” i „jeszcze nic tu nie ma”), widok szczegółów wydatku (z „nie istnieje albo brak dostępu”), potwierdzenie usunięcia, kwota ujemna i debet, podział wydatku, nawigacja po miesiącach, logowanie kodem w dwóch krokach, udostępnienie i otwarcie zaproszenia, pierwsze uruchomienie, brak sieci i wygasła sesja.

**Partia E – widoki ekranów** na pełny ekran z mapą stanów (który stan pokazuje która story), po jednym zestawie na epik: Konto (logowanie, profil), Budżety i członkostwo (utworzenie budżetu, ustawienia: członkowie i zaproszenia, dołączenie), Koperty (widok kopert z pulą, zarządzanie kopertami), Przychody i przydziały (przychód, przydział), Wydatki (nowy wydatek, lista operacji, szczegóły), Przegląd budżetu (podsumowanie miesiąca), Aplikacja na telefonie (brak sieci).

**Pytania (E3-Q1–E3-Q4):**

- **E3-Q1. Gdzie formatowanie kwot i dat?** Propozycja: `@koperty/ui/lib/money` i `@koperty/ui/lib/dates` (jedno miejsce dla pakietu i aplikacji) zamiast `apps/web/src/lib/` ze standardów 4.4; zmiana standardów 4.2 i 4.4.
- **E3-Q2. Nawigacja aplikacji** (PRD jej nie opisuje). Propozycja: nagłówek z przełącznikiem budżetu i menu użytkownika (Profil, Wyloguj); na telefonie dolny pasek z linkami Koperty, Operacje, Podsumowanie i przyciskiem „Dodaj wydatek” w zasięgu kciuka (DS-S04); od 768 px te same linki w nagłówku.
- **E3-Q3. Zmiana kolejności kopert** (US-12). Propozycja: tryb „Zmień kolejność” z przyciskami „Przesuń w górę / w dół” przy każdej kopercie – bez nowej zależności i w pełni z klawiatury; bez przeciągania.
- **E3-Q4. Formularz wydatku** (US-17). Propozycja: osobna strona (E2-P8), pola w kolejności: kwota (z fokusem na start), koperta, data (domyślnie dziś), opis (opcjonalny); przełącznik „Podziel wydatek na kilka kopert” pokazuje edytor podziału.

## Etap 3 – partia A – wynik (2026-10-30)

**Zbudowane:**

- `@koperty/ui/lib/money` (`formatPLN`, `formatAmountInput`, `parsePLN`) i `@koperty/ui/lib/dates` (`todayInWarsaw`, `formatDate`, `formatDayHeading`, `formatMonth`, `monthOf`, `addMonths`) z testami tablicowymi; standardy 4.2 i 4.4 zaktualizowane (E3-Q1).
- Przychody i przydziały: Kwota (`Amount`), Pole kwoty (`AmountInput`), Przełącznik miesiąca (`MonthSwitcher`), Podsumowanie puli (`PoolSummary`).
- Koperty: Karta koperty (`EnvelopeCard`, `EnvelopeCardSkeleton`) i Lista kopert (`EnvelopeList`).
- 6 stron „Dokumentacja” (13 sekcji), stories ze stanami danych (ładowanie, pusto, błąd, dużo danych, długie teksty) i testy: debet, porządkowanie kwoty po opuszczeniu pola, zmiana miesiąca i przejście roku, ponowna próba, zablokowana archiwizacja z wyjaśnieniem, przywracanie, zmiana kolejności z zachowaniem fokusu, akcje kart z identyfikatorem koperty.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 319 testów, 100%; `vp build`, build Storybooka (34 strony dokumentacji, 127 stories); 27 stron komponentów × 3 szerokości (13 sekcji, bez przewijania); zrzuty listy kopert przy 320 px i puli w ciemnym motywie. Poprawione po kontroli: wyrównanie nazwy i salda w karcie koperty; asercje tekstu z twardą spacją w testach.

**Propozycje do decyzji:**

1. **E3-P1 Format kwot:** grupowanie tysięcy zawsze („1 250,00 zł”; `Intl` w `pl-PL` domyślnie nie grupuje czterech cyfr) i minus jako „−” zamiast łącznika.
2. **E3-P2 Pole kwoty:** po opuszczeniu pola poprawna kwota jest porządkowana do „1 234,50”, niepoprawna zostaje do poprawy; komunikat „Podaj kwotę z najwyżej dwoma miejscami po przecinku, np. 12,34.”.
3. **E3-P3 Stany danych:** pula bez kwoty pokazuje „0,00 zł”; lista kopert bez stronicowania (kilkanaście kopert gospodarstwa domowego).
4. **Lista kopert jako osobny komponent** (poza listą planu): dopiero na poziomie listy da się pokazać stany ładowania, pusto, błędu i dużo danych.
5. **Karta koperty:** tylko nazwa i saldo (PRD 4.5, US-21); akcje w menu: „Przydziel środki”, „Zmień nazwę”, „Zarchiwizuj” (zablokowane z wyjaśnieniem przy saldzie różnym od 0) albo „Przywróć”; tryb kolejności włącza podanie `onMove`.
6. **Pula:** tytuł „Do rozdysponowania” jako nagłówek `h2`.

## Etap 3 – partia B – wynik (2026-10-30)

**Zbudowane:**

- `@koperty/ui/lib/split`: `splitEvenly(total, parts)` (reszta groszy w pierwszej części, PRD 4.6) i `remainingToSplit(total, amounts)` z testami.
- Wydatki: Wiersz operacji (`OperationRow`), Lista operacji (`OperationList`, grupy dni, dwa puste stany), Edytor podziału (`SplitEditor`).
- Przegląd budżetu: Tabela podsumowania miesiąca (`MonthSummaryTable`, sumy miesiąca i tabela kopert).
- 4 strony „Dokumentacja” (13 sekcji); przykładowe operacje w `docs/data/operations.ts` (tylko dokumentacja, import `#docs/*`).
- Testy: akcje wiersza z nazwą operacji, kolejność dni, dwa puste stany z akcjami, ponowna próba, podział po równo 100,00 zł na 3 (33,34 / 33,33 / 33,33), aktualizacja „Do podziału” po wpisaniu kwoty, blokada koperty użytej w innej części, blokada „Podziel po równo” bez kwoty z wyjaśnieniem, tabela z nagłówkami wierszy i „Debet”.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 388 testów, 100%; `vp build`, build Storybooka (38 stron dokumentacji, 158 stories); 31 stron komponentów × 3 szerokości (13 sekcji, bez przewijania); zrzuty listy operacji (320 px), edytora podziału (ciemny, 320 px) i tabeli podsumowania (1000 px).

**Błędy znalezione i poprawione:** dane przykładowe w `src/product` jako `.ts` nie mieściły się w eksporcie `./product/*` (`.tsx`) i nakładka błędu Vite psuła inne testy – przeniesione do `docs/data`; test selecta w edytorze podziału sprawdzał dostępność przed zamknięciem listy; niedostępne gałęzie w „Podziel po równo” – `splitEvenly` zwraca pary część–kwota.

**Propozycje do decyzji:**

1. **E3-P4 Treść list:** operacja bez opisu jako „Wydatek bez opisu” / „Przychód bez opisu” w kolorze drugorzędnym; pusty miesiąc: „Brak operacji w wybranym miesiącu” z opisem „Listopad 2026: nikt jeszcze nic nie zapisał.” (bez odmiany nazwy miesiąca); tabela bez sum miesiąca, gdy nie przyszły.
2. **Wiersz operacji:** dwie akcje „Edytuj” i „Usuń” jako widoczne przyciski ikonowe 32 px z podpowiedzią (E2-P9); podział w metadanych jako „Podział: Jedzenie, Chemia”.
3. **Lista operacji:** kolejność z API (od najnowszych), komponent tylko grupuje dni; wybór pustego stanu przez `budgetHasOperations`.
4. **E3-P5 Edytor podziału:** „Usuń część” dopiero od dwóch części; koperty użyte w innych częściach zablokowane w liście; komunikat „Wybierz kopertę.”.
5. **Tabela podsumowania:** bez wiersza sumy kolumn (kwoty wylicza baza; sumy przychodów, przydziałów i pula jako osobne pola nad tabelą zgodnie z US-22).

## Etap 3 – partia C – wynik (2026-10-30)

**Zbudowane:**

- Konto: Powłoka aplikacji (`AppShell`) – nagłówek z przełącznikiem budżetu i menu konta (Profil, Wyloguj), linki i „Dodaj wydatek” w nagłówku od 768 px, dolny pasek na telefonie, link „Przejdź do treści”, linki przez `renderLink` (router aplikacji); tokeny `safe-area-bottom` i `bottom-nav-height`.
- Budżety i członkostwo: Przełącznik budżetu (`BudgetSwitcher`), Wiersz członka (`MemberRow`), Wiersz zaproszenia (`InvitationRow`), Panel linku zaproszenia (`InviteLinkPanel`), Karta dołączenia (`JoinBudgetCard`).
- 6 stron „Dokumentacja” (13 sekcji), stories ze stanami i testy: `aria-current` bieżącej strony, menu konta, `renderLink`, wybór budżetu i „Utwórz budżet”, zmiana roli i usunięcie członka, zablokowane opuszczenie budżetu z wyjaśnieniem, unieważnienie zaproszenia, generowanie, kopiowanie i udostępnianie linku, dołączanie z ładowaniem, trzy rodzaje nieważnego linku.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 450 testów, 100%; `vp build`, build Storybooka (44 strony dokumentacji, 189 stories); 37 stron komponentów × 3 szerokości (13 sekcji, bez przewijania); powłoka przy 320 px (dolny pasek, jedna widoczna nawigacja) i 1440 px w ciemnym motywie; pierwszy Tab trafia w „Przejdź do treści”.

**Błędy znalezione i poprawione:** nazwa przycisku konta z `aria-label` nie zawierała widocznego tekstu (axe `label-content-name-mismatch`, WCAG 2.5.3) – nazwa budowana z treści; prop `role` wiersza członka lint brał za atrybut ARIA – zmieniony na `memberRole`; zaznaczanie linku przy fokusie kasował `mouseup` – funkcja usunięta (jest „Kopiuj link”); brak kluczy linków nawigacji w nagłówku.

**Propozycje do decyzji:**

1. **E3-P6 Powłoka:** w dolnym pasku krótki podpis akcji głównej („Wydatek” / „Dodaj”), bieżąca strona pogrubiona i z `aria-current`, w nagłówku z tłem `surface-muted`; nagłówek przyklejony do góry; menu konta z nazwą użytkownika jako etykietą.
2. **Linki przez `renderLink`** – komponenty produktu nie zależą od routera.
3. **Wiersz członka:** akcje jako widoczne przyciski `sm` (najwyżej dwie, E2-P9); „(Ty)” przy zalogowanej osobie; przy jedynym właścicielu „Opuść budżet…” zablokowane z wyjaśnieniem.
4. **Zaproszenia:** tylko aktywne zaproszenia na liście; „autor: …” zamiast form rodzajowych; „Udostępnij” tylko tam, gdzie działa `navigator.share`; brak zaznaczania linku po kliknięciu.
5. **Karta dołączenia:** osobne komunikaty dla wygasłego, użytego i unieważnionego linku; „już członek” bez karty (przekierowanie, US-08); bez nazwy zapraszającego „Zaproszono Cię…”; przełącznik budżetu bez wybranego budżetu pokazuje „Wybierz budżet”.

## Etap 3 – partia D1 – wynik (2026-10-30)

**Zbudowane:**

- Hak `useFormSubmit` (`@koperty/ui/patterns/use-form-submit`): walidacja pola po opuszczeniu i całości przy wysłaniu, fokus na pierwszym błędzie, dane zostają, blokada podwójnego wysłania, sukces dopiero po odpowiedzi serwera, błędy pól i formularza z kontraktu błędów, osobne komunikaty błędu serwera i braku sieci.
- Formularz przychodu (`IncomeForm`, `@koperty/ui/views/funds/income-form`) jako przykład referencyjny wzorca (US-14, US-15).
- Lista z filtrem miesiąca (`OperationsPanel`): licznik w `aria-live`, widoczny filtr, „Wróć do bieżącego miesiąca”, osobne „brak wyników dla filtra” i „jeszcze nic tu nie ma”.
- Widok szczegółów wydatku (`ExpenseDetails`): kwota i akcje w pierwszym ekranie, podział na koperty, stan „nie istnieje albo brak dostępu” (PT404).
- Potwierdzenie usunięcia (`ConfirmDeleteDialog`, `@koperty/ui/patterns/confirm-delete-dialog`): pytanie z nazwą obiektu, oczekiwanie, błąd w otwartym dialogu, zamknięcie po potwierdzeniu z serwera, powrót fokusu.
- 4 strony „Dokumentacja” w sekcji Wzorce (13 sekcji, mapa stanów: stan → story → zachowanie → źródło) i 33 stories, każdy stan osobno z testem; odpowiedzi API symulowane funkcjami `submit` / `onConfirm` (sukces, oczekiwanie, błąd pola, błąd formularza, błąd serwera, brak sieci przez `navigator.onLine`).

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 516 testów, 100%; `vp build`; build Storybooka (48 stron dokumentacji, 222 stories); Playwright: 48 stron × 3 szerokości (320 jasny, 768 ciemny, 1440 jasny) – 13 sekcji, bez surowych tabel, bez przewijania, motyw na `<html>`; wszystkie 215 stories komponentów i wzorców przy 320 px bez przewijania; akcje widoku szczegółów przy 320 × 568 kończą się na 168–269 px (w pierwszym ekranie).

**Błędy znalezione i poprawione (także sprzed tej partii):**

- Motyw na stronach z historiami we własnej ramce (dialog, dialog potwierdzenia, menu, podpowiedź, toast, wzorzec usunięcia) był gubiony: ramka zagnieżdżona startowała z motywem domyślnym i wysyłała go stronie dokumentacji. Teraz przejmuje motyw strony dokumentacji i śledzi jego zmiany (`.storybook/preview.tsx`); sprawdzone także przełączenie motywu w trakcie.
- Szkielety z szerokością `w-content` wychodziły poza ekran 320 px w 6 stories (lista kopert, karta koperty, podsumowanie puli, szkielet ładowania): `Skeleton` ma teraz `max-w-full`, a komórki `StateGrid` też `max-w-full`. Wcześniejsza kontrola obejmowała tylko strony dokumentacji, nie pojedyncze stories.
- Dialog bez przycisku Radix (otwierany z wiersza listy) nie zwracał fokusu – zapamiętuje element sprzed otwarcia.
- Martwa gałąź `?? 0` w formularzu przychodu (pokrycie) – kwota parsowana po walidacji.

**Propozycje do decyzji:**

1. **E3-P7 Brak sieci:** rozpoznawany przez `navigator.onLine` po nieudanym wywołaniu; komunikaty „Brak połączenia z internetem. Wpisane dane zostały w formularzu – wyślij je ponownie, gdy połączenie wróci.” i „Nie udało się zapisać. Wpisane dane zostały w formularzu – spróbuj ponownie za chwilę.”.
2. **E3-P8 Lista z filtrem:** licznik „Liczba operacji: N” (bez odmiany liczebnika), ukryty przy ładowaniu i błędzie; „Wróć do bieżącego miesiąca” tylko poza bieżącym miesiącem.
3. **Walidacja bez biblioteki:** `validate` to zwykła funkcja zwracająca błędy pól. Standardy 4.5 mówią „walidacja schematem przy wysłaniu” – traktuję funkcję jako schemat (bez nowej zależności, P-09). Do potwierdzenia albo poprawki brzmienia standardów.
4. **Widok szczegółów:** brak obiektu po wczytaniu oznacza „nie istnieje albo brak dostępu” (bez osobnego propa); akcje „Edytuj wydatek” i „Usuń wydatek…” pod kwotą; widok ma nagłówek `h1`.
5. **Potwierdzenie usunięcia:** kontrolowany `ConfirmDeleteDialog` z `onConfirm: () => Promise<void>`; toast sukcesu wyświetla ekran, nie dialog; po błędzie dialog zostaje otwarty, a zamknięcie czyści komunikat.

## Etap 3 – partia D2 – wynik (2026-10-30)

**Zbudowane:**

- Logowanie kodem (`SignInForm`, `@koperty/ui/views/account/sign-in-form`): e-mail, potem 6-cyfrowy kod (S-01 AC-1, AC-3, AC-4), „Wyślij nowy kod” bez ponownego wpisywania adresu, „Zmień adres e-mail”, komunikat powodu (`notice`) dla wygasłego linku (AC-3b), wygasłej sesji (AC-6b) i zaproszenia (US-08).
- Pierwsze uruchomienie (`CreateBudgetForm`, US-04) i pusty budżet: pula 0 zł z „Dodaj przychód” i lista kopert z „Dodaj kopertę” (US-21).
- Podział wydatku (`ExpenseForm`, US-17–US-19, E3-Q4): kwota, koperta, przełącznik podziału z edytorem podziału, data, opis; błędy przy każdej części, błąd sumy, mapowanie `ENVELOPE_ARCHIVED` i `SPLITS_INVALID`.
- Kwota ujemna i debet (`AllocationForm`, US-16): podgląd „Pula po zapisie”, pula ujemna dozwolona i oznaczona, zmniejszenie przydziału, przyszły miesiąc; złożenie debetu w kopercie i puli.
- Nawigacja po miesiącach i zaproszenie: złożenia istniejących komponentów (bez nowych komponentów); zaproszenie z unieważnieniem przez potwierdzenie usunięcia.
- Brak sieci i wygasła sesja: `useOnline` (`@koperty/ui/lib/online`) i komponent `OfflineBanner` (Komponenty produktu → Aplikacja na telefonie, US-23).
- 7 stron wzorców i strona komponentu „Komunikat braku sieci” (13 sekcji, mapa stanów), 60 nowych stories z testami.

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 636 testów, 100%; `vp build`; build Storybooka (56 stron dokumentacji, 282 stories); Playwright: 56 stron × 3 szerokości (13 sekcji, bez surowych tabel, bez przewijania, motyw) i 275 stories przy 320 px bez przewijania.

**Błędy znalezione i poprawione:**

- Edytor podziału (partia B): `legend` części nie była pierwszym dzieckiem `fieldset`, więc grupy „Część N” nie miały nazwy dostępnej (WCAG 1.3.1) – teraz `aria-labelledby`; strona komponentu zaktualizowana.
- Pole `type="email"` samo przycina spacje – usunięte zbędne `trim()`.
- Martwa gałąź przy wyłączaniu podziału – koperta po wyłączeniu to pierwsza wybrana w częściach.
- Wspólna funkcja `failureMessage` (brak sieci albo komunikat zapasowy) zamiast powielonego tekstu w dialogu usunięcia i w ponownej wysyłce kodu.

**Propozycje do decyzji:**

1. **E3-P9 Przydział:** podgląd „Pula po zapisie” liczony w kliencie tylko dla wygody (pula + obecny przydział − nowy); zero usuwa przydział; przy puli ujemnej wyjaśnienie „Możesz to zapisać – pula będzie ujemna.”, bez blokady.
2. **E3-P10 Treści logowania i pierwszego uruchomienia:** „Wysłaliśmy nowy kod. Poprzedni już nie działa.”, „Sesja wygasła. Zaloguj się ponownie, a wrócisz do miejsca, w którym byłeś.”, podpowiedź nazwy budżetu „Np. Dom albo Wspólne wakacje. Zobaczą ją osoby, które zaprosisz.”; spacje i myślniki w kodzie usuwane przy wpisywaniu.
3. **E3-P11 Brak sieci i zaproszenia:** jeden komunikat braku sieci w układzie ekranów („Widzisz dane wczytane wcześniej. Zapis zadziała, gdy połączenie wróci.”), start bez połączenia jako stan błędu z „Spróbuj ponownie”; członek widzi aktywne zaproszenia z wyjaśnieniem, kto je tworzy; unieważnienie przez potwierdzenie z datą ważności linku.
4. **E3-P12 Formularz wydatku:** włączenie podziału przenosi wybraną kopertę do pierwszej części; błąd sumy jako alert pod edytorem (fokus zostaje, komunikat ogłaszany od razu); fokus na kwocie przy otwarciu tylko przez `focusAmountOnOpen` (żeby strony dokumentacji nie przeskakiwały).
5. **Zakres wzorców:** nawigacja po miesiącach i zaproszenie bez nowych komponentów – złożenia w stories; `InvitationsPanel` i ekran ustawień powstaną w partii E, jeśli ekrany ich potrzebują.

## Etap 3 – partia E – wynik (2026-10-30)

**Zbudowane:**

- Ekrany epików na pełny ekran (`docs/ekrany/*.stories.tsx`, sekcja Ekrany), 45 stories – każdy stan osobno:
  - Konto: logowanie (e-mail, kod, link wygasł, sesja wygasła), profil (gotowy, pusta nazwa, ładowanie);
  - Budżety i członkostwo: utworzenie budżetu (pierwszy, kolejny), ustawienia (właściciel, jedyny właściciel, członek), dołączenie (ważny link, sprawdzanie, link wygasł, bez zalogowania);
  - Koperty: widok kopert (dane, pusty budżet, ładowanie, błąd), zarządzanie (kolejność, archiwum, nowa koperta, nazwa zajęta);
  - Przychody i przydziały: przychód (nowy, edycja), przydział (zmiana, pula poniżej zera, przyszły miesiąc);
  - Wydatki: nowy wydatek (pusty, z podziałem), operacje (dane, pusty miesiąc, pusty budżet, ładowanie, błąd), szczegóły (pełne, nie istnieje);
  - Przegląd budżetu: podsumowanie (bieżący, przyszły, bez kopert, ładowanie, błąd);
  - Aplikacja na telefonie: brak sieci w trakcie pracy i przy starcie.
- 7 stron „Mapa stanów” (stan → story → co widać → źródło, użyte elementy).
- `NameForm` (`@koperty/ui/patterns/name-form`): jeden formularz nazwy dla budżetu, koperty i nazwy wyświetlanej; `CreateBudgetForm` korzysta z niego (API bez zmian); strona „Formularz nazwy”.
- Ramka ekranów w dokumentacji (`docs/ekrany/screen.tsx`): powłoka z nawigacją z E3-Q2 i strona bez powłoki (logowanie, dołączenie).

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 736 testów, 100%; `vp build`; build Storybooka (64 strony dokumentacji, 332 stories); Playwright: 7 stron map × 3 szerokości (tabele, motyw także w ramkach ekranów, bez przewijania), 45 ekranów przy 320 i 1440 px (jeden `h1` na ekran, bez przewijania), 325 stories przy 320 px bez przewijania, strony dokumentacji komponentów i wzorców × 3 szerokości.

**Błędy znalezione i poprawione:**

- `OperationsPanel` (partia D1): na ekranie po `h1` dni listy (`h3`) przeskakiwały poziom (axe `heading-order`) – sekcja ma ukryty nagłówek `h2` „Operacje: <miesiąc>”; strona wzorca zaktualizowana.
- Lista kopert pod `h1` ekranu: karty są `h3`, więc ekrany dają nagłówek `h2` „Salda kopert”; zapisane na mapie stanów.
- Ekrany dołączenia bez ważnego linku nie miały `h1` – tytuł strony „Zaproszenie do budżetu”.

**Propozycje do decyzji:**

1. **E3-P13 Nagłówki ekranów:** ekran daje `h1` (tytuł) i `h2` nad listą kopert („Salda kopert”); komponenty list zostają na `h3`. Widok szczegółów ma własny `h1` (opis wydatku).
2. **E3-P14 Pierwsze uruchomienie bez powłoki:** osoba bez budżetu widzi stronę bez nawigacji (nie ma jeszcze gdzie przejść) z podpowiedzią o zaproszeniu.
3. **E3-P15 Profil:** nazwa wyświetlana, adres logowania, „Wyloguj” i „Usuń konto…”; usunięcie konta jedynego właściciela czeka na decyzję [Z5] w PRD.
4. **E3-P16 Ustawienia budżetu na jednej stronie:** nazwa, członkowie, zaproszenia, usunięcie budżetu (właściciel); członek widzi członków i aktywne zaproszenia i może opuścić budżet.
5. **Ramka ekranów tylko w dokumentacji:** nagłówek strony (`h1` + opis) nie jest komponentem pakietu; jeśli aplikacja potrzebuje go w wielu trasach, dopiszę go do strony „Czego brakuje” w etapie 4.

## Etap 4 – wynik (2026-10-30)

**Zbudowane (sekcja Design system):**

- „Zacznij tutaj”: charakter w trzech zdaniach i słowa charakteru, pięć kroków budowy ekranu, tabela wszystkich komponentów (nazwa z linkiem, import, kiedy, kiedy nie).
- „Komponenty”: katalog 51 pozycji – małe komponenty z działającym podglądem, duże jako prawdziwy komponent `inert`, przycięty do karty; grupa, jedno zdanie, link do strony.
- „Jak wybrać”: tabele „jeśli… to użyj…” z przykładami z produktu dla wszystkich par z polecenia (brakujące elementy wskazane wprost).
- „Użycie i dostępność”: klawiatura i fokus, formularze, kolor, ruch, treść, układ i reguły produktu pilnowane przez interfejs – każda reguła ze źródłem.
- „Treść”: ton (trzy zdania „mówi” i „nie mówi”), przyciski, błędy, puste stany, formaty, długie teksty.
- „Czego unikać”: antywzorce z briefu, generyczny wygląd AI, błędy implementacji – przy każdym punkcie rozpoznanie w kodzie, powód i zamiennik.
- „Czego brakuje”: pokrycie backlogu S-01–S-15 i T-01–T-02 (priorytet = kolejność z #20) oraz 13 elementów, których system nie ma.
- „Jak zmieniać system”: komponent, wariant czy nic; co musi mieć nowy komponent; zmiana tokenu; kto zatwierdza; komendy; notatka techniczna o bazie shadcn.
- 7 stron epików: kroki przepływu, ekrany i stories (link do mapy stanów), pliki źródłowe, praca w produkcie (zadania z backlogu i funkcje RPC z `docs/architecture.md`).
- `docs/design-system.md` (skrót dla agentów: charakter, kroki, tabele komponentów i tokenów, „jeśli… to użyj…”, czego unikać, treść, komendy) i odwołania w AGENTS.md (lista dokumentów na górze i zasada UI).
- Wspólne dane katalogu (`docs/blocks/catalog-data.tsx`) i test `catalog.test.ts`: każdy moduł pakietu musi być w katalogu i w `docs/design-system.md`.

**Poprawione przy okazji:**

- Nieaktualne odwołania na 23 stronach („(etap 3)”, „(partia B)”, „lista z separatorami”, „zakładka Zaproszenia”), „Wyślij kod ponownie” → „Wyślij nowy kod” zgodnie z `SignInForm`.
- Strona i stories alertu pokazywały komunikat wygasłego linku jako `danger` z „Wyślij nowy link”, a wzorzec logowania (D2) używa komunikatu `default` nad formularzem – przykład alertu zmieniony na błąd wczytania puli z „Spróbuj ponownie”; usunięte zmyślone „linki działają przez godzinę”.
- Przykłady kodu RPC: `p_period` zamiast `p_month`, `p_occurred_on` zamiast `p_date` (zgodnie z `docs/architecture.md`).
- Tailwind preflight usuwał numery i punktory list w MDX na wszystkich stronach – przywrócone w CSS Storybooka (tylko listy treści).

**Sprawdzone:** `vp check`, `check:tokens`, `check:ai`; `vp test --coverage` – 786 testów, 100%; `vp build`; build Storybooka (79 stron dokumentacji, 334 stories); Playwright: 79 stron × 3 szerokości (13 sekcji na stronach komponentów, bez surowych tabel, bez przewijania, motyw także w ramkach – 6 ramek ładowanych leniwie sprawdzonych po przewinięciu), 15 stron Design system z kontrolą linków (wszystkie prowadzą do istniejących stron; kliknięcie otwiera stronę w managerze).

**Propozycje do decyzji:**

1. **Zakładki bez użycia:** komponent jest gotowy (E2-P10), ale ustawienia budżetu są jedną stroną (E3-P16) i żaden ekran go nie używa. Propozycja: zostawić (strona i testy już są) albo usunąć z pakietu – Twoja decyzja.
2. **Przykład alertu:** komunikat wygasłego linku jako `default` nad formularzem logowania (tak działa `SignInForm`), a przykład `danger` z akcją to błąd wczytania z „Spróbuj ponownie”.
3. **Katalog z podglądem statycznym:** duże komponenty (formularze, listy, powłoka) jako prawdziwy komponent `inert`, przycięty do karty (`.catalog-static` w CSS Storybooka, wysokość z tokenu).
4. **Jedno źródło listy komponentów:** `catalog-data.tsx` zasila „Zacznij tutaj” i „Komponenty”; `docs/design-system.md` jest utrzymywany ręcznie, a test pilnuje, by zawierał każdy moduł.
5. **Priorytety na „Czego brakuje”:** kolejność z backlogu (#20); elementy bez potrzeby w MVP oznaczone „brak potrzeby w MVP”.

## Etap 5 – test agentem (przygotowany, do wykonania w nowej sesji)

**Ekran:** edycja wydatku (`/expenses/<id>/edit`) – zadanie S-08 „Lista operacji, edycja i usuwanie wydatków” (#11), US-19. W Storybooku nie ma tego ekranu: są tylko części (formularz wydatku z `initial`, widok szczegółów, potwierdzenie usunięcia). Ekran sprawdza, czy z dokumentacji da się złożyć nowy ekran ze stanami bez zgadywania.

**Co agent ma zbudować:** stories ekranu „Edycja wydatku” w `packages/ui/docs/ekrany/expenses-screens.stories.tsx` i wiersze na mapie stanów `packages/ui/docs/ekrany/wydatki.mdx`, ze stanami: ładowanie wydatku, edycja wydatku z jedną kopertą, edycja wydatku z podziałem, wydatek nie istnieje albo brak dostępu, zapisywanie, błąd serwera, sukces (powrót do szczegółów). Bez zmian w komponentach pakietu; jeśli czegoś brakuje – wpis na stronę „Czego brakuje” zamiast nowego komponentu.

**Czego agent nie czyta:** `packages/ui/POSTEP.md`, `.ai/runs/`, `.ai/specs/2026-10-29-design-system-storybook.md` i historia tej rozmowy (tam są odpowiedzi, których nie ma w dokumentacji).

**Prompt do wklejenia w nowej sesji:**

```
Zbuduj w Storybooku ekran „Edycja wydatku” (S-08, US-19) na podstawie wyłącznie
docs/design-system.md, AGENTS.md, docs/prd.md, docs/architecture.md i Storybooka
(vp -C packages/ui run storybook). Nie czytaj packages/ui/POSTEP.md, .ai/runs/ ani
.ai/specs/2026-10-29-design-system-storybook.md.
Dodaj stories na pełny ekran w packages/ui/docs/ekrany/expenses-screens.stories.tsx
i wiersze mapy stanów w packages/ui/docs/ekrany/wydatki.mdx: ładowanie, jedna koperta,
podział, nie istnieje albo brak dostępu, zapisywanie, błąd serwera, sukces.
Nie zmieniaj komponentów pakietu i nie dodawaj zależności. Na koniec uruchom vp check,
vp run check:tokens i vp test --coverage.
W raporcie wypisz każde miejsce, w którym musiałeś zgadywać albo szukać poza
docs/design-system.md i Storybookiem: co, gdzie szukałeś, jaką decyzję podjąłeś.
Niczego nie commituj.
```

**Ocena:** każde miejsce zgadywania uzupełniam w dokumentacji albo wpisuję na stronę „Czego brakuje”. Test zalicza gotowość design systemu, gdy agent nie zgadywał w sprawach, które dokumentacja powinna rozstrzygać (komponenty, stany, tokeny, treść).

## Etap 5 – raport (2026-10-30)

**Co zbudowałem (etapy 0–5):** pakiet `packages/ui` (`@koperty/ui`) z tokenami w trzech warstwach i dwoma motywami, 19 komponentów bazowych (shadcn dostosowany do tokenów, plus wewnętrzny `label`), 17 komponentów produktu w 7 epikach, 7 widoków, 3 wzorce w kodzie (`useFormSubmit`, `ConfirmDeleteDialog`, `NameForm`), 5 modułów `lib` (kwoty, daty, podział, sieć, `cn`), Storybook 10.6 z 79 stronami dokumentacji (15 Design system, 7 Fundamenty, 21 komponentów bazowych, 17 komponentów produktu, 12 wzorców, 7 map stanów ekranów), skrypt `check:tokens`, `docs/design-system.md` z odwołaniem w AGENTS.md.

**Liczby:**

| Co                                   | Liczba                                                |
| ------------------------------------ | ----------------------------------------------------- |
| Strony dokumentacji                  | 79                                                    |
| Komponenty publiczne (pliki modułów) | 45 komponentów i hak `useFormSubmit`; 5 modułów `lib` |
| Pozycje katalogu                     | 51                                                    |
| Pliki stories                        | 59                                                    |
| Stories                              | 334 (w tym 45 ekranów na pełny ekran)                 |
| Testy interakcji (`play`)            | 176 stories, każda w dwóch motywach (352 przebiegi)   |
| Sprawdzenia axe                      | 668 (334 stories × 2 motywy)                          |
| Testy jednostkowe Node               | 111 (pakiet `ui`) + 7 (aplikacja)                     |
| Wszystkie testy `vp test`            | 786, pokrycie 100% w każdym pliku                     |

**Co sprawdziłem:**

1. Build Storybooka, `vp check` (typy, lint, formatowanie), `vp build` – przechodzą. Ostrzeżenia buildu Storybooka: duży fragment JS (`error-state.stories-*.js`, podział kodu Storybooka) i ostrzeżenie Node o `module.register()` – oba z narzędzi, bez wpływu na działanie.
2. `vp run check:tokens` – zero wartości spoza tokenów (`packages/ui/src`, `packages/ui/docs`, `packages/ui/.storybook`, `apps/web/src`).
3. Dostępność wszystkich 334 stories w obu motywach (axe, `test: "error"`) – bez naruszeń. Udokumentowany wyjątek `aria-hidden-focus` w 8 stories ze statycznie otwartą nakładką (opis przy story i na stronie „Czego brakuje”).
4. Przeglądarka (Playwright, zbudowany Storybook w trybie deweloperskim):
   - 79 stron × 320, 768, 1440 px (strony komponentów z 13 sekcjami, bez surowych tabel, bez przewijania, motyw także w ramkach stories);
   - 334 stories przy 320 px w ciemnym motywie – bez przewijania w poziomie;
   - 45 ekranów przy 320 i 1440 px – jeden `h1`, bez przewijania;
   - klawiatura i nakładki: dialog, dialog potwierdzenia, menu, select, podpowiedź, przełącznik budżetu, menu karty koperty, wzorzec usunięcia, menu konta – 320 i 1440 px, oba motywy (36 przebiegów): Tab do wyzwalacza, otwarcie klawiszem, fokus w nakładce, nakładka w ekranie i w motywie, Escape zamyka i zwraca fokus; pierwszy Tab w powłoce trafia w „Przejdź do treści”; toast w obu motywach.

**Błąd znaleziony w etapie 5 i poprawiony:** menu przełącznika budżetu wystawało 30 px poza ekran 320 px – `DropdownMenuContent` miał tylko minimalną szerokość; dodane ograniczenie do dostępnej szerokości (`--radix-dropdown-menu-content-available-width`), jak w podpowiedzi. Dotyczy wszystkich menu.

**Czego nie sprawdziłem:**

- Prawdziwego czytnika ekranu (VoiceOver, NVDA) – tylko drzewo dostępności i axe.
- Safari i Firefoksa – wszystkie kontrole w Chromium (Playwright); iOS Safari ważny dla pól 16 px i dolnego paska.
- Fizycznego telefonu i bezpiecznego obszaru iPhone'a (`safe-area-inset-bottom`).
- `prefers-reduced-motion` w przeglądarce – tylko w CSS i dokumentacji.
- Działania z prawdziwymi danymi i Supabase – komponenty nie są jeszcze podpięte w `apps/web`.
- Testu agentem – przygotowany wyżej, do wykonania w nowej sesji.
- CI na GitHubie – kroki są w `.github/workflows/ci.yml` (tokeny, Chromium, build Storybooka), ale nic nie zostało wysłane.

**Propozycje do decyzji:**

1. **Commit i PR:** zmiany (ok. 21 tys. linii, w większości dokumentacja i stories) nie są scommitowane. Proponuję jeden PR „feat(ui): add design system package with storybook” po teście agentem, albo teraz, a test agentem w kolejnym kroku.
2. **Zgłoszenie T-03** w GitHub Issues i wpis na liście #20 (otwarte od etapu 0) – po Twojej zgodzie.
3. **Specyfikacja S-01** (`approved`) planuje komponenty `input`, `label`, `card` w `apps/web` – do aktualizacji przed jej realizacją, żeby korzystała z pakietu.
4. **Specyfikacja T-03** zostaje `in-progress` do testu agentem; po nim: uzupełnienie dokumentacji, status `implemented` i przeniesienie do `.ai/specs/implemented/`.
5. **Sprawdzenie w Safari na iPhonie** przed pierwszym ekranem w aplikacji (S-01).

**Lista braków:** strona „Czego brakuje” (pokrycie backlogu i 14 pozycji, w tym wyjątek axe i test agentem).

## Zatwierdzone decyzje

- 2026-10-29: Q1 – brak materiałów stylu; brief i tokeny powstają w warsztacie i wymagają zatwierdzenia.
- 2026-10-29: Q2 – ciemny motyw według systemu, z przełącznikiem (T1).
- 2026-10-29: brief stylu i tokeny zatwierdzone, razem z propozycjami P1–P8 (Q1 zamknięte).
- 2026-10-29: Q3 – pakiet `packages/ui` (`@koperty/ui`) z tokenami, komponentami bazowymi, komponentami produktu i widokami; aplikacja zostawia w `features/*` zapytania i podpięcie danych.
- 2026-10-29: Q4 – najpierw ADR 0012 i specyfikacja (`draft`), potem etap 1 z logiem w `.ai/runs/`. Zatwierdzone zależności: Storybook 10.6 (`storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-vitest`), `remark-gfm`, `sonner` (bez `next-themes`), `@fontsource-variable/oxanium`. Bez MSW.
- 2026-10-29: Q5 – lista z filtrami: filtrem jest tylko miesiąc (US-20).
- 2026-10-29: ADR 0012 zaakceptowany, specyfikacja T-03 zatwierdzona (`approved` → `in-progress`).
- 2026-10-29: decyzje 1–7 z etapu 1 zaakceptowane: wykluczenie `**/*.stories.tsx` z pomiaru, usunięcie martwego wykluczenia `components/ui`, usunięcie `cn` i `clsx`/`tailwind-merge` z aplikacji, rozmiary `Button` do ustalenia w etapie 2, propozycje w dokumentacji, ograniczenia interfejsu Storybooka, `light-dark()`.
- 2026-10-29: E2-Q1–E2-Q5 (zablokowane kontrolki, ładowanie w przycisku, przełącznik 44 × 24 px, toast, pusty stan) i podział na partie zaakceptowane.
- 2026-10-29: propozycje 1–8 z partii 1 zaakceptowane (E2-P1, E2-P2, E2-P4–E2-P7, warianty przycisku, nagłówek karty).
- 2026-10-29: propozycje 1–8 z partii 2 zaakceptowane (E2-P8, E2-P9, znacznik, awatar, alert, dialog potwierdzenia, menu, „Dobrze i źle” dla nakładek).
- 2026-10-30: propozycje 1–6 z partii 3 zaakceptowane (E2-P10–E2-P12, `label` tabeli i reguła lintu dla `<section>`, wskaźnik ładowania, podpowiedź).
- 2026-10-30: propozycje 1–3 z partii 4 zaakceptowane (gotowe `EmptyState` i `ErrorState`, toast tylko przez `showToast`, E2-P13); etap 2 zakończony, „dalej” do etapu 3.
- 2026-10-30: plan etapu 3 i E3-Q1–E3-Q4 zaakceptowane: kwoty i daty w `@koperty/ui/lib/money` i `@koperty/ui/lib/dates`; nawigacja: nagłówek (przełącznik budżetu, menu użytkownika) i na telefonie dolny pasek (Koperty, Operacje, Podsumowanie, „Dodaj wydatek”); kolejność kopert przyciskami „Przesuń w górę / w dół”; wydatek na osobnej stronie (kwota, koperta, data, opis, przełącznik podziału).
- 2026-10-30: propozycje 1–6 z partii A etapu 3 zaakceptowane (E3-P1–E3-P3, lista kopert, karta koperty, nagłówek puli).
- 2026-10-30: propozycje 1–5 z partii B etapu 3 zaakceptowane (E3-P4, wiersz i lista operacji, E3-P5, tabela podsumowania bez sumy kolumn).
- 2026-10-30: propozycje 1–5 z partii C etapu 3 zaakceptowane (E3-P6, `renderLink`, wiersz członka, zaproszenia, karta dołączenia).
- 2026-10-30: propozycje 1–5 z partii D1 zaakceptowane (E3-P7, E3-P8, walidacja funkcją `validate` jako schemat bez biblioteki, widok szczegółów, potwierdzenie usunięcia).
- 2026-10-30: propozycje 1–5 z partii D2 zaakceptowane (E3-P9–E3-P12, nawigacja po miesiącach i zaproszenie jako złożenia).
- 2026-10-30: właściciel zapytał o skalę zmian (ok. 21 tys. linii); wybrał wariant 1 – zostawić całość i przejść do etapu 4. Propozycje 1–5 z partii E przyjęte wraz z przejściem (etap 3 zakończony).
- 2026-10-30: propozycje 1–5 z etapu 4 zaakceptowane (zakładki zostają w pakiecie, przykład alertu, podgląd statyczny w katalogu, jedno źródło listy komponentów z testem, priorytety według backlogu); etap 4 zakończony.
- 2026-10-30: partia D podzielona na D1 (formularz, lista z filtrem miesiąca, widok szczegółów, potwierdzenie usunięcia) i D2 (wzorce produktu).

## Uwagi i ryzyka

- S-01 (`approved`) dodaje komponenty `input`, `label`, `card` w `apps/web`. Jeśli design system powstanie wcześniej, S-01 korzysta z pakietu; specyfikacja S-01 wymaga wtedy drobnej aktualizacji.
- Ekrany S-02–S-15 nie mają specyfikacji; ich stories w etapie 3 opierają się na user stories z PRD i są oznaczone jako wstępne.
- Komponenty produktu i widoki w pakiecie zmieniają strukturę z standardów 4.2 (`features/*/components`) – wymaga ADR (Q3).

## Następny krok

Etapy 0–5 wykonane. Następny krok: test agentem w nowej sesji (prompt w sekcji „Etap 5 – test agentem”), potem uzupełnienie braków, status specyfikacji i commit – po decyzjach z raportu etapu 5.
