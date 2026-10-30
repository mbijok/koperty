---
title: T-03 Design system z dokumentacją w Storybooku
started: 2026-10-29
spec: .ai/specs/2026-10-29-design-system-storybook.md
status: in-progress
---

# T-03 Design system z dokumentacją w Storybooku

## Cel

Zbudować design system Koperty w pakiecie `packages/ui` z dokumentacją w Storybooku, według [specyfikacji](../specs/2026-10-29-design-system-storybook.md) i [ADR 0012](../../docs/adr/0012-design-system-package-storybook.md). Postęp etapów i decyzje: [packages/ui/POSTEP.md](../../packages/ui/POSTEP.md). Po każdym etapie zatrzymanie i akceptacja właściciela.

## Plan

1. Etap 1 – fundamenty: pakiet, Storybook, zgodność z Vite+, tokeny, Tailwind, font, motyw, strony Fundamentów, `check:tokens`.
2. Etap 2 – komponenty bazowe w partiach.
3. Etap 3 – komponenty produktu, wzorce, widoki ekranów.
4. Etap 4 – strony uczące i `docs/design-system.md`.
5. Etap 5 – sprawdzenie i raport.

## Przebieg kroków

### Krok 0. Etap 0 i warsztat stylu (2026-10-29)

- **Co zrobiono:** inwentaryzacja repozytorium i materiałów, warsztat stylu w trzech rundach, brief i tokeny (`packages/ui/brief.md`, `packages/ui/tokeny.md`), ADR 0012 i specyfikacja T-03.
- **Wynik:** właściciel zatwierdził brief, tokeny (z P1–P8), decyzje Q1–Q5, zależności, ADR 0012 i specyfikację (status `approved` → `in-progress`).

### Krok 1. Etap 1 – fundamenty (2026-10-29)

- **Co zrobiono:** pakiet `packages/ui` i workspace `packages/*`; zależności przez `vp -C packages/ui add` (tylko zatwierdzone, jedyny plik blokady `bun.lock`); usunięte z `apps/web`: `@fontsource-variable/geist`, `radix-ui`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, `shadcn`. Tokeny (`src/tokens/tokens.css`), `src/styles.css`, `cn` z tokenami, Storybook 10.6.5 (main, preview, manager), strony Fundamentów i bloki w `docs/`, `scripts/check-tokens.ts`, przeniesienie `Button` i `components.json`, konfiguracja Vitest (projekty `ui`, `ui-dark`, `scripts`), pokrycie i lint dla pakietu, kroki CI, komendy w AGENTS.md, `.claude/launch.json` (serwer Storybooka).
- **Komendy:**
  ```bash
  vp -C packages/ui add …; vp -C packages/ui exec playwright install chromium
  vp exec storybook build   # zgodność z Vite+ (Vite 8.3.4 z vite-plus-core) – OK
  vp check; vp run check:ai; vp run check:tokens
  vp test --coverage        # 51 testów, 100% we wszystkich metrykach
  vp build; vp -C packages/ui run build-storybook
  node <scratchpad>/check.mjs   # Playwright: 7 stron × 320/768/1440 px
  ```
- **Wynik:** wszystko zielone. Kontrast zapisanych wartości policzony ponownie (25 par × 2 motywy, wszystkie powyżej progu) i mierzony testem story w przeglądarce.

### Krok 2. Decyzje z etapu 1 i przygotowanie etapu 2 (2026-10-29)

- **Co zrobiono:** właściciel zaakceptował decyzje 1–7. Usunięto `apps/web/src/lib/utils.ts` z testem oraz `clsx` i `tailwind-merge` z aplikacji, martwe wykluczenie `apps/web/src/components/ui/**` (pokrycie i lint); AGENTS.md (UI, wykluczenia z pomiaru) i standardy 4.2 (struktura z `packages/ui`) zaktualizowane. Pobrano wartości `radix-nova` z rejestru shadcn i spisano różnice oraz pytania E2-Q1–E2-Q5 w POSTEP.md.
- **Komendy:** `vp -C apps/web remove clsx tailwind-merge`; `vp check`; `vp run check:tokens`; `vp run check:ai`; `vp test --coverage` (50 testów, 100%); `vp build`.
- **Wynik:** zielone.

### Krok 3. Etap 2, partia 1 (2026-10-29)

- **Co zrobiono:** właściciel zaakceptował E2-Q1–E2-Q5 i partie. `vp -C packages/ui dlx shadcn@latest add input field label select switch card --yes` (po dodaniu `paths` w `packages/ui/tsconfig.json`); usunięte `cn` i `separator`. Komponenty przepisane na tokeny, tokeny przełącznika, warianty podglądu stanów w `.storybook/preview.css`, import `#docs/*` dla bloków dokumentacji, bloki `StateGrid`, `NarrowScreen`, `DoDont`, stories i 7 stron MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (124 testy, 100%); `vp build`; `vp -C packages/ui run build-storybook`; Playwright: strony × 3 szerokości, porównanie `:hover` z podglądem, motyw nakładki.
- **Wynik:** zielone; jeden opisany wyjątek a11y (Select / Otwarty).

### Krok 4. Etap 2, partia 2 (2026-10-29)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii 1. `shadcn add badge avatar alert dialog alert-dialog dropdown-menu` (pytanie o nadpisanie `button.tsx` – „nie”; `cn` usunięty), komponenty na tokenach, tokeny `overlay-max-height` i `avatar-size`, `initials()` z testem, stories i 6 stron MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (168 testów, 100%); `vp build`; build Storybooka; Playwright: 13 stron × 3 szerokości, nakładki w ciemnym motywie i przy 320 px.
- **Wynik:** zielone; wyjątki a11y `aria-hidden-focus` dla stories z otwartą nakładką, opisane.

### Krok 5. Etap 2, partia 3 (2026-10-29)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii 2. `shadcn add tooltip tabs table skeleton spinner` (`cn` usunięty), komponenty na tokenach, token `tabs-indicator`, `Button` na wspólnym `Spinner`, reguła lintu dla przewijanego `<section>`, stories i 5 stron MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (200 testów, 100%); `vp build`; build Storybooka; Playwright: 18 stron × 3 szerokości, fokus i przewijanie regionu tabeli, podpowiedź przy 320 px.
- **Wynik:** zielone.

### Krok 6. Etap 2, partia 4 i koniec etapu 2 (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii 3. `shadcn add empty sonner` (`cn`, `next-themes` usunięte, `sonner` 2.0.8 zostaje), `EmptyState`, `ErrorState`, `Toaster` i `showToast` na tokenach, stories i 3 strony MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (218 testów, 100%); `vp build`; build Storybooka (28 stron dokumentacji, 92 stories); Playwright: 21 stron × 3 szerokości, toast przy 320 i 1440 px w ciemnym motywie.
- **Wynik:** zielone; `sonner` narzucał krój systemowy – dodane `font-sans`. Etap 2 zakończony, czeka na „dalej”.

### Krok 7. Etap 3 – plan (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował partię 4 i „dalej”. Rozpisano komponenty produktu, wzorce i widoki w partiach A–E oraz pytania E3-Q1–E3-Q4 (POSTEP.md, „Etap 3 – plan”). Wykryta rozbieżność: standardy 4.4 umieszczają `formatPLN`/`parsePLN` i funkcje dat w `apps/web/src/lib/`, a potrzebują ich komponenty pakietu (E3-Q1).
- **Wynik:** czeka na decyzje.

### Krok 8. Etap 3, partia A (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował plan etapu 3 i E3-Q1–E3-Q4. `lib/money`, `lib/dates` z testami; standardy 4.2 i 4.4; `Amount`, `AmountInput`, `MonthSwitcher`, `PoolSummary`, `EnvelopeCard`, `EnvelopeList` z eksportem `./product/*`, stories ze stanami danych, 6 stron MDX, kolejność epików w menu.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (319 testów, 100%); `vp build`; build Storybooka (34 strony, 127 stories); Playwright: 27 stron × 3 szerokości, zrzuty.
- **Wynik:** zielone.

### Krok 9. Etap 3, partia B (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii A. `lib/split` z testami, `OperationRow`, `OperationList`, `SplitEditor`, `MonthSummaryTable`, przykładowe dane w `docs/data`, stories ze stanami danych, 4 strony MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (388 testów, 100%); `vp build`; build Storybooka (38 stron, 166 stories); Playwright: 31 stron × 3 szerokości, zrzuty.
- **Wynik:** zielone.
- **Korekta:** build Storybooka ma 158 stories (wyżej omyłkowo 166).

### Krok 10. Etap 3, partia C (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii B. `AppShell`, `BudgetSwitcher`, `MemberRow`, `InvitationRow`, `InviteLinkPanel`, `JoinBudgetCard`, tokeny dolnego paska, stories, 6 stron MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp test --coverage` (450 testów, 100%); `vp build`; build Storybooka (44 strony, 189 stories); Playwright: 37 stron × 3 szerokości, powłoka przy 320 i 1440 px, link „Przejdź do treści”.
- **Wynik:** zielone.

### Krok 11. Etap 3, partia D1 (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii C. `useFormSubmit`, `IncomeForm`, `OperationsPanel`, `ExpenseDetails`, `ConfirmDeleteDialog`, 33 stories z testami stanów, 4 strony MDX w sekcji Wzorce. Poprawki sprzed partii: motyw w ramkach zagnieżdżonych (`preview.tsx`), `max-w-full` w `Skeleton` i `StateGrid`.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp run check:ai`; `vp test --coverage` (516 testów, 100%); `vp build`; build Storybooka (48 stron, 222 stories); Playwright: 48 stron × 3 szerokości, 215 stories przy 320 px, przełączenie motywu w managerze.
- **Wynik:** zielone.

### Krok 12. Etap 3, partia D2 (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii D1. `SignInForm`, `CreateBudgetForm`, `ExpenseForm`, `AllocationForm`, `OfflineBanner`, `useOnline`, `failureMessage`; stories wzorców (w tym złożenia w `docs/wzorce/*.stories.tsx`), 7 stron wzorców i strona komponentu. Poprawka nazwy części w edytorze podziału.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp run check:ai`; `vp test --coverage` (636 testów, 100%); `vp build`; build Storybooka (56 stron); Playwright: 56 stron × 3 szerokości, 275 stories przy 320 px.
- **Wynik:** zielone.

### Krok 13. Etap 3, partia E (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z partii D2. Ekrany 7 epików (50 stories na pełny ekran), 7 stron „Mapa stanów”, `NameForm` (z `CreateBudgetForm` na nim), ramka ekranów w `docs/ekrany/`. Poprawki nagłówków: `h2` w `OperationsPanel`, „Salda kopert” na ekranach, `h1` ekranów dołączenia.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp run check:ai`; `vp test --coverage` (736 testów, 100%); `vp build`; build Storybooka (64 strony, 332 stories); Playwright: mapy stanów × 3 szerokości, 50 ekranów przy 320 i 1440 px, 325 stories przy 320 px, strony dokumentacji × 3 szerokości.
- **Wynik:** zielone.
- **Korekta:** ekranów (stories w `docs/ekrany/`) jest 45, nie 50 – liczba sprawdzona po zapisie kroku.

### Krok 14. Etap 4: strony uczące (2026-10-30)

- **Co zrobiono:** właściciel zapytał o skalę zmian i wybrał wariant 1 (zostawić całość, dalej etap 4). 15 stron w sekcji Design system (8 stron uczących i 7 stron epików), katalog z danymi wspólnymi i testem spójności, `docs/design-system.md`, odwołania w AGENTS.md. Poprawki nieaktualnych odwołań na 23 stronach, przykładu alertu, parametrów RPC w przykładach i znaczników list w MDX.
- **Komendy:** `vp check`; `vp run check:tokens`; `vp run check:ai`; `vp test --coverage` (786 testów, 100%); `vp build`; build Storybooka (79 stron, 334 stories); Playwright: 79 stron × 3 szerokości, linki katalogu, nawigacja z katalogu w managerze.
- **Wynik:** zielone.
- **Uwaga:** przy liczeniu statystyk zmian `git add -N` i `git reset` zdjęły z indeksu przygotowane wcześniej usunięcia w `apps/web` i przeniesienie `components.json`; indeks przywrócony do stanu sprzed komendy (`git rm --cached`, `git update-index --cacheinfo` z treścią z `HEAD`), pliki robocze bez zmian.

### Krok 15. Etap 5: sprawdzenie i raport (2026-10-30)

- **Co zrobiono:** właściciel zaakceptował propozycje z etapu 4. Build Storybooka, `vp check`, `vp build`, `check:tokens`, axe wszystkich stories w obu motywach, kontrola w przeglądarce (szerokości, motywy, klawiatura, nakładki, toast), opis wyjątków axe na stronie „Czego brakuje” (AC-2), test agentem przygotowany w POSTEP.md (ekran „Edycja wydatku”, S-08), liczby i raport.
- **Komendy:** `vp check`; `vp -C packages/ui run build-storybook`; `vp build`; `vp run check:tokens`; `vp test --coverage` (786 testów, 100%); Playwright: 36 przebiegów klawiatury i nakładek, 334 stories przy 320 px, toast w obu motywach.
- **Wynik:** zielone po poprawce menu (wystawało 30 px poza ekran 320 px; `max-w` z dostępnej szerokości w `DropdownMenuContent`).

## Decyzje i założenia

- Właściciel: pakiet `packages/ui`, Storybook 10.6, bez MSW, `sonner`, Oxanium, filtr listy tylko po miesiącu (POSTEP.md, „Zatwierdzone decyzje”).
- Agent: kolory obu motywów w `light-dark()` zamiast zdublowanego bloku `.dark` (jedno miejsce definicji; zgodność przeglądarek do akceptacji, POSTEP.md, decyzja 7).
- Agent: wyłączone domyślne skale Tailwinda (paleta, odstępy, tekst, promienie, cienie, fonty), żeby klasy spoza tokenów w ogóle nie istniały.
- Agent: testy Node pakietu w projekcie `scripts`, stories w `ui` i `ui-dark`; stories wykluczone z pomiaru pokrycia (wymaga zgody, POSTEP.md, decyzja 1).

## Problemy

- CLI shadcn w pakiecie wymaga aliasów w `tsconfig.json` („Could not resolve the following aliases”); dodano `paths`.
- Strony MDX z `<Meta of>` dostają nazwę z pliku (bez polskich znaków); ustawiono `name="Dokumentacja"`.
- Tekst ładowania dłuższy od etykiety wychodził poza przycisk; zasada w dokumentacji i poprawione stories.
- `shadcn add` z komponentem zależnym od istniejącego `button` czeka na pytanie o nadpisanie mimo `--yes`; uruchamiane z odpowiedzią „n” na wejściu.
- Dialog przy 320 px wychodził poza ekran (`w-full` przy marginesach z obu stron); usunięte `w-full`.
- MDX potraktował `{nazwa}` w tekście tabeli jako wyrażenie i strona Menu się nie renderowała; tekst poprawiony.
- Etap 5: `DropdownMenuContent` bez maksymalnej szerokości wystawał poza ekran 320 px – poprawione; wzorzec usunięcia bez wyzwalacza Radix wymagał rozpoznania przycisku po tekście w skrypcie kontroli.
- Etap 4: style dokumentacji Storybooka nadpisywały krój i odstępy komponentów w blokach (rozwiązanie: `sb-unstyled`); preflight Tailwinda usuwał numery list w MDX; ramki ładowane leniwie dawały fałszywe alarmy motywu w kontroli; katalog skryptów w katalogu tymczasowym zniknął po restarcie sesji (odtworzone).
- Partia E etapu 3: przeskok nagłówków `h1` → `h3` na ekranach z listą operacji i kopert (axe `heading-order`), ekrany dołączenia bez `h1`; kontrola `h1` liczyła ukryte nagłówki Storybooka („No Preview”) – zawężona do `#storybook-root`.
- Partia D2 etapu 3: części edytora podziału bez nazwy dostępnej (`legend` nie jako pierwsze dziecko `fieldset`); `type="email"` przycina wartość sam; martwa gałąź przy wyłączaniu podziału – poprawione.
- Partia D1 etapu 3: story we własnej ramce (`docs.story.inline: false`) wysyłała stronie dokumentacji motyw domyślny i strona go przejmowała; szkielety `w-content` przewijały stories przy 320 px (wcześniejsza kontrola obejmowała tylko strony dokumentacji); dialog bez przycisku Radix nie zwracał fokusu – poprawione.
- Partia C etapu 3: `aria-label` przycisku konta bez widocznego tekstu (WCAG 2.5.3), prop `role` mylony z atrybutem ARIA, zaznaczanie przy fokusie kasowane przez `mouseup`, brak kluczy w nawigacji – poprawione. Kontrola „pierwszy Tab” na story z `play` dawała fałszywy wynik (test zostawiał fokus) – sprawdzane na story bez `play`.
- Partia B etapu 3: plik `.ts` w `src/product` poza eksportem `./product/*` (`.tsx`) – dane przykładowe przeniesione do `docs/data`; test a11y przed zamknięciem listy selecta; niedostępne gałęzie przy podziale po równo.
- Partia A etapu 3: dopasowania tekstu w testach zamieniają twardą spację na zwykłą (asercje przez `\s`); formatter zamienia zapis `\u00a0` w kodzie na znak; nazwa i saldo karty koperty nierówno wyrównane – poprawione.
- Partia 3: przewijana tabela niedostępna z klawiatury, zakładki bez panelu, element siatki bez `min-w-0` rozpychał stronę, podpowiedź szersza niż ekran – poprawione (POSTEP.md).

- Pokrycie `button.tsx` 87,5% gałęzi: pomocnik zgodności CommonJS dla `import * as React`; naprawione importem typów (wniosek 2026-10-29-storybook-vite-plus-setup).
- Test a11y wykazał zły kontrast w kolumnie ciemnego motywu w tabeli kontrastu (komórka bez tła); dodano `bg-surface-page`.
- Motyw nie działał na stronach MDX (dekoratory się nie uruchamiają); dodano nasłuch globali.
- Tytuł karty z „⋅ Storybook”; podmiana w `manager.ts`.
- Poziome przewijanie przy 320 px: długi kod w tekście i `sr-only` poza kontenerem tabeli; poprawione CSS dokumentacji i `relative`.
- Wbudowana przeglądarka nie otworzyła `localhost` (sprawdzanie zasad); weryfikacja przez Playwright bez okna.

## Status końcowy

`partial` (2026-10-30): etapy 0–5 wykonane i sprawdzone (bramka zielona: `vp check`, `vp test --coverage` 786 testów i 100%, `vp build`, build Storybooka, `check:tokens`). Nie wykonano: testu agentem (zgodnie z poleceniem – nowa sesja), commitu i PR (czeka na decyzję), zmiany statusu specyfikacji T-03 na `implemented` (po teście agentem).

## Następne kroki

- Decyzje do propozycji 1–5 z partii C (POSTEP.md), potem partia D (wzorce).
- Decyzje do propozycji 1–5 z partii D1 (POSTEP.md), potem partia D2 (wzorce produktu).
- Decyzje do propozycji 1–5 z partii D2 (POSTEP.md), potem partia E (ekrany).
- Decyzje do propozycji 1–5 z partii E (POSTEP.md), potem etap 4 (strony uczące, `docs/design-system.md`).
- Decyzje do propozycji 1–5 z etapu 4 (POSTEP.md), potem etap 5 (sprawdzenie, raport, przygotowanie testu agentem).
- Test agentem w nowej sesji (prompt w POSTEP.md), uzupełnienie braków, decyzje z raportu etapu 5 (commit i PR, zgłoszenie T-03, aktualizacja specyfikacji S-01), potem specyfikacja T-03 → `implemented`.
