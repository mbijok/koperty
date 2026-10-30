---
title: T-03 Design system z dokumentacją w Storybooku
status: implemented
created: 2026-10-29
issue:
user_stories:
  [
    US-01,
    US-02,
    US-03,
    US-04,
    US-05,
    US-06,
    US-07,
    US-08,
    US-09,
    US-10,
    US-11,
    US-12,
    US-13,
    US-14,
    US-15,
    US-16,
    US-17,
    US-18,
    US-19,
    US-20,
    US-21,
    US-22,
    US-23,
    US-24,
  ]
adrs:
  [
    docs/adr/0001-react-spa-on-vite-plus.md,
    docs/adr/0011-component-tests-vitest-browser-playwright.md,
    docs/adr/0012-design-system-package-storybook.md,
  ]
runs: [.ai/runs/2026-10-29-design-system-storybook.md]
---

# T-03 Design system z dokumentacją w Storybooku

## Cel

Developer albo agent AI buduje nowy ekran Koperty z dokumentacji bez zgadywania: wie, którego komponentu użyć i dlaczego, jak go złożyć z innymi, jakich tokenów użyć, jak zachowa się każdy stan i czego nie robić. Designer sprawdza zgodność ekranu z systemem w tym samym miejscu. Wygląd wynika z zatwierdzonego briefu stylu, a nie z domyślnej biblioteki.

## Kontekst

- Brief stylu i tokeny zatwierdzone 2026-10-29: [packages/ui/brief.md](../../packages/ui/brief.md) (C1, AC1–AC4, R01, W1–W5, K1–K6, P1–P8, T1), [packages/ui/tokeny.md](../../packages/ui/tokeny.md).
- Inwentaryzacja, decyzje Q1–Q5 i plan komponentów: [packages/ui/POSTEP.md](../../packages/ui/POSTEP.md).
- PRD: wymagania niefunkcjonalne (WCAG 2.1 AA, mobile first, `pl-PL`), reguły prezentacji ujemnych kwot (4.3, 4.5) i user stories, z których wynikają ekrany (US-01–US-24).
- Stan wyjściowy: Tailwind 4.3, shadcn `radix-nova` z motywem `neutral`, Geist, jeden komponent `apps/web/src/components/ui/button.tsx`. Brak Storybooka. Tryb przeglądarkowy Vitest z Playwrightem jest zaplanowany w S-01 (ADR 0011) i jeszcze niewdrożony.
- Ekrany mają specyfikację tylko w S-01; widoki pozostałych epików opierają się na user stories i są oznaczone jako wstępne.
- Zadanie spoza dotychczasowego backlogu MVP; identyfikator T-03 do potwierdzenia przy dodaniu zgłoszenia.

## Zakres

**W zakresie:**

- pakiet `packages/ui` (`@koperty/ui`) według ADR 0012, podłączony do `apps/web` (style i `Button` przeniesione z aplikacji),
- tokeny w trzech warstwach, jasny i ciemny motyw, mapowanie na `@theme` Tailwinda z wyłączoną domyślną paletą, font Oxanium dołączony do pakietu,
- Storybook 10.6 z dokumentacją MDX (`remark-gfm`), dodatkiem dostępności (`test: 'error'`), testami stories przez Vitest w obu motywach, przełącznikiem motywu na `document.documentElement`, nazwą „Koperty” w interfejsie, bez checklisty startowej i powiadomień o nowej wersji,
- skrypt `check:tokens` z testami,
- strony Fundamentów: kolor (role i zmierzona tabela kontrastu), typografia, odstępy i układ, kształt i głębia, ruch, ikony, motywy,
- komponenty bazowe z listy w POSTEP.md (21), każdy ze stroną o 13 sekcjach i stories (playground, warianty, macierz stanów z zamrożonym podglądem przez `data-preview-state`, długa treść i wąski ekran, test interakcji),
- komponenty produktu według epików, ze stanami danych (ładowanie, pusto, błąd, częściowe dane, dużo danych, długie teksty),
- wzorce: formularz (ze stanami odpowiedzi API), lista z filtrem miesiąca (Q5), widok szczegółów, potwierdzenie usunięcia i wzorce produktu z POSTEP.md,
- widoki kluczowych ekranów każdego epiku jako stories na pełny ekran z mapą stanów,
- strony uczące: Zacznij tutaj, Komponenty, Jak wybrać, Użycie i dostępność, Treść, Czego unikać, Czego brakuje, Jak zmieniać system, strona każdego epiku,
- skrót dla agentów `docs/design-system.md` z odwołaniem w `AGENTS.md`,
- aktualizacja `AGENTS.md`, standardów 4.2 i konfiguracji pokrycia według ADR 0012,
- kroki CI: `check:tokens`, build Storybooka i testy stories w zadaniu `web`.

**Poza zakresem:**

- trasy, zapytania i logika aplikacji dla S-02–S-15 (widoki są prezentacyjne; podpięcie danych należy do zadań backlogu),
- zmiana ekranów S-01 w aplikacji (S-01 skorzysta z pakietu przy swojej implementacji),
- komponenty spoza listy z POSTEP.md (pole wielowierszowe, checkbox, grupa radio, popover, panel dolny): trafiają na stronę „Czego brakuje”,
- MSW, filtry operacji inne niż miesiąc, publikacja Storybooka,
- test agentem nowego ekranu (przygotowany w etapie 5, wykonywany w osobnej sesji).

## Kryteria akceptacji

- **AC-1** (brief, zasada wartości z tokenów)
  - **Given** kod pakietu i aplikacji
  - **When** uruchomię `vp run check:tokens`
  - **Then** skrypt kończy się kodem 0; po dodaniu do komponentu koloru w hex, `oklch()`, klasy `bg-zinc-900`, `text-white` albo `p-[13px]` kończy się błędem z plikiem i linią
- **AC-2** (PRD 6, WCAG 2.1 AA)
  - **Given** wszystkie stories
  - **When** uruchomię testy stories w jasnym i ciemnym motywie
  - **Then** nie ma naruszeń dostępności, albo każdy wyjątek jest opisany przy story i na stronie „Czego brakuje”
- **AC-3** (T1)
  - **Given** Storybook w ciemnym motywie
  - **When** otworzę dialog, menu, podpowiedź albo toast
  - **Then** nakładka renderowana poza story ma ciemny motyw
- **AC-4** (zasada 2, R01, W1–W5)
  - **Given** dowolny komponent bazowy
  - **When** porównam go z domyślnym shadcn `radix-nova`
  - **Then** wysokość kontrolek, promienie, obramowania, fokus, typografia i cienie odpowiadają `tokeny.md`, a różnica jest opisana na stronie komponentu z identyfikatorem decyzji
- **AC-5** (dokumentacja komponentu)
  - **Given** strona dokumentacji dowolnego komponentu bazowego lub produktu
  - **When** ją otworzę w zbudowanym Storybooku
  - **Then** ma wszystkie 13 sekcji (sekcja, która nie dotyczy, mówi dlaczego), macierz stanów i test interakcji głównego zachowania
- **AC-6** (zasada źródeł)
  - **Given** dowolna reguła w dokumentacji
  - **When** ją przeczytam
  - **Then** ma źródło (ID z briefu, DS-S z POSTEP.md, PRD, WCAG lub WAI-ARIA) albo jest oznaczona jako propozycja i wypisana w raporcie
- **AC-7** (formularz, standardy 4.5)
  - **Given** wzorzec formularza
  - **When** przejrzę jego stories
  - **Then** są osobne stories dla odpowiedzi: sukces, oczekiwanie, błąd pola, błąd serwera i brak sieci; po nieudanym wysłaniu fokus trafia na pierwszy błąd, dane zostają, a podwójne wysłanie jest zablokowane (sprawdzone testem interakcji)
- **AC-8** (US-20, Q5)
  - **Given** wzorzec listy z filtrem miesiąca
  - **When** przejrzę jego stories
  - **Then** są osobne stany „brak operacji w tym miesiącu” (z akcją zmiany miesiąca) i „jeszcze nic tu nie ma” (z akcją dodania operacji), licznik wyników i widoczny aktywny filtr
- **AC-9** (PRD 4.3, 4.5, K3)
  - **Given** kwota ujemna w komponencie kwoty, wierszu koperty i podsumowaniu puli
  - **When** wyświetlę ją w obu motywach i odczytam czytnikiem ekranu
  - **Then** ma znak minus i znacznik „Debet”, bez koloru znaczeniowego, a czytnik ogłasza debet
- **AC-10** (US-21–US-23, ekrany)
  - **Given** strona epiku
  - **When** ją otworzę
  - **Then** widzę kroki przepływu, listę ekranów ze stories, mapę stanów (który stan pokazuje która story), pliki źródłowe i pracę, która zostaje w produkcie
- **AC-11** (szerokości, DS-S02)
  - **Given** dowolna strona ekranu lub wzorca
  - **When** wyświetlę ją przy 320, 768 i 1440 px
  - **Then** nie ma poziomego przewijania strony, a treść mieści się w `content-max`
- **AC-12** (Definition of Done)
  - **Given** zakończone zadanie
  - **When** uruchomię `vp check`, `vp test --coverage`, `vp build` i build Storybooka
  - **Then** wszystkie przechodzą, a pliki pakietu mają 100% pokrycia

## Projekt rozwiązania

### Zmiany w bazie

Nie dotyczy.

### Funkcje RPC

Nie dotyczy.

### Polityki RLS

Nie dotyczy.

### Edge Functions

Nie dotyczy.

### Interfejs

**Struktura pakietu:**

```
packages/ui/
├── package.json            # @koperty/ui; exports: komponenty, ./styles.css
├── components.json         # shadcn (radix, aliasy na src/primitives)
├── POSTEP.md, brief.md, tokeny.md
├── src/
│   ├── tokens/             # surowe, znaczeniowe (jasny, ciemny), komponentowe – jedyne miejsce z wartościami kolorów
│   ├── styles.css          # Tailwind, @theme z tokenów, wyłączona paleta, font
│   ├── primitives/         # komponenty bazowe (shadcn dostosowany)
│   ├── product/<epik>/     # komponenty produktu
│   ├── patterns/           # wzorce
│   ├── views/<epik>/       # widoki ekranów (prezentacyjne)
│   └── lib/                # cn, formatowanie kwot i dat pl-PL (jeśli nie ma ich jeszcze w aplikacji)
├── .storybook/             # main.ts, preview.tsx, manager.ts, style podglądu stanów
├── docs/                   # strony MDX i bloki pomocnicze (bez eksportu z pakietu)
└── scripts/check-tokens.ts
```

**Storybook:** menu po polsku (Design system, Fundamenty, Komponenty bazowe, Komponenty produktu, Wzorce, Ekrany) według drzewa z POSTEP.md. Przełącznik motywu w pasku narzędzi ustawia klasę `dark` i `data-theme` na `document.documentElement`; domyślnie motyw z `prefers-color-scheme`. Podgląd stanów najechania i fokusu: te same deklaracje co w `:hover` i `:focus-visible`, podpięte w CSS Storybooka pod `[data-preview-state]`.

**Aplikacja:** `apps/web` importuje `@koperty/ui/styles.css` zamiast obecnego `index.css` z motywem shadcn i `Button` z pakietu. Trasa `/` zostaje bez zmian funkcjonalnych.

## Wsteczna zgodność

Zmiana addytywna dla backendu i adresów aplikacji: brak zmian w `supabase/` i w trasach. Zmienia się tylko wygląd strony `/` (nowe tokeny i font) i miejsce komponentów. `BACKWARD_COMPATIBILITY.md` nie wymaga działań.

## Plan implementacji

Każdy etap kończy się zatrzymaniem i raportem; kolejny zaczyna się po „dalej” właściciela. Postęp prowadzi `packages/ui/POSTEP.md`, a log przebiegu `.ai/runs/`.

1. **Fundamenty:** pakiet i workspace; Storybook z dodatkami i skryptami (`storybook`, `build-storybook`, `test-storybook`, `test-storybook:themes`); potwierdzenie zgodności z Vite+; tokeny w kodzie z ponownie policzonym kontrastem; `@theme` i font; przełącznik motywu; strony Fundamentów w blokach `Unstyled`; `check:tokens` z testami; przeniesienie stylów i `Button` z `apps/web`.
2. **Komponenty bazowe:** najpierw lista różnic kształtu, gęstości i stanów względem `radix-nova` z identyfikatorami decyzji; potem partie po około sześć komponentów, każda z dokumentacją i stories, z zatrzymaniem po partii. Po każdej komendzie shadcn kontrola `package.json`.
3. **Komponenty produktu, wzorce, widoki:** według epików, ze stanami danych; wzorce ze wszystkimi stanami; widoki ekranów z mapą stanów.
4. **Strony uczące** i `docs/design-system.md` z odwołaniem w `AGENTS.md`; aktualizacja standardów 4.2.
5. **Sprawdzenie i raport:** build, typy, lint, `check:tokens`, dostępność wszystkich stories, przegląd w przeglądarce (320, 768, 1440 px, oba motywy, klawiatura, nakładki), przygotowanie testu agentem w POSTEP.md, liczby stron, komponentów, stories i testów; kroki CI.

## Strategia testów

- **pgTAP:** nie dotyczy.
- **Vitest (Node):** `check:tokens` (wykrywa hex, `rgb()`, `hsl()`, `oklch()` poza plikiem tokenów, klasy palety Tailwinda, wartości arbitralne; ignoruje plik tokenów), funkcje formatowania kwot i dat, jeśli powstaną w pakiecie.
- **Stories jako testy (`@storybook/addon-vitest`, Chromium):** każda story przechodzi sprawdzenie a11y (`test: 'error'`) w obu motywach; testy interakcji w `play` dla głównego zachowania każdego komponentu i wzorca (kliknięcie, klawiatura, walidacja, fokus po błędzie, blokada podwójnego wysłania, nakładki w ciemnym motywie). Pokrycie plików pakietu liczone z tych testów, próg 100% na plik.
- **Przegląd w przeglądarce (etap 5):** zbudowany Storybook, szerokości 320, 768, 1440 px, oba motywy, obsługa klawiaturą, tabele MDX wyrenderowane jako tabele.
- **E2E:** nie dotyczy.

## Ryzyka i otwarte pytania

- **Ryzyko:** zgodność Storybooka 10.6 z Vite+ (Vite 8.3.4 jako `vite-plus-core`) i z Vitest 5.0.5 wbudowanym w Vite+. Sprawdzane jako pierwszy krok etapu 1; przy niezgodności zatrzymuję się i wracam z wariantami.
- **Ryzyko:** pokrycie v8 liczone z testów stories w przeglądarce może nie łączyć się z pokryciem pozostałych projektów. Sprawdzane w etapie 1, zanim powstaną komponenty.
- **Ryzyko:** widoki S-02–S-15 powstają przed specyfikacjami tych zadań; ich późniejsze specyfikacje mogą je zmienić. Widoki są oznaczone jako wstępne, a różnice trafiają na stronę „Czego brakuje”.
- **Ryzyko:** wymiana fontu i motywu zmienia wygląd istniejącej strony `/`; zmiana jest celowa (brief), bez wpływu na zachowanie.
- **Otwarte:** dodanie zgłoszenia T-03 do backlogu w GitHub Issues (zgłoszenie zbiorcze #20) – po zgodzie właściciela.

## Podsumowanie realizacji

Zrealizowane 2026-10-30 w etapach 0–5 z akceptacją właściciela po każdym etapie i partii; przebieg: [log](../../runs/2026-10-29-design-system-storybook.md), postęp i decyzje: `packages/ui/POSTEP.md`.

- Pakiet `packages/ui` (`@koperty/ui`): tokeny w trzech warstwach z dwoma motywami, 19 komponentów bazowych, 17 komponentów produktu, 7 widoków, 3 wzorce w kodzie, 5 modułów `lib`; `check:tokens`; `Button` i `cn` przeniesione z `apps/web`.
- Storybook 10.6: 79 stron dokumentacji (Design system, Fundamenty, komponenty z 13 sekcjami, wzorce, mapy stanów ekranów), 341 stories (w tym 52 ekrany na pełny ekran), axe w obu motywach; `docs/design-system.md` z odwołaniem w AGENTS.md.
- AC-1–AC-12 spełnione: `vp check`, `vp test --coverage` (800 testów, 100% w każdym pliku), `vp build`, build Storybooka, `check:tokens`; axe bez naruszeń poza 8 opisanymi wyjątkami `aria-hidden-focus` (AC-2); kontrola w przeglądarce przy 320, 768 i 1440 px w obu motywach, klawiatura i nakładki.
- Test agentem (świeży kontekst) zbudował ekran „Edycja wydatku” z dokumentacji; 10 miejsc zgadywania uzupełnionych w dokumentacji albo wpisanych na stronę „Czego brakuje” (E5-P1–E5-P5).
- Otwarte poza zakresem: zgłoszenie T-03 w GitHub Issues, aktualizacja specyfikacji S-01 (komponenty z pakietu), wariant E5-P4 przy S-08, sprawdzenie w Safari na iPhonie.

## Powód archiwizacji

<Wypełniane tylko przy archiwizacji.>
