# ADR 0012: Design system w pakiecie `@koperty/ui` z dokumentacją w Storybooku

- **Status:** zaakceptowany
- **Data:** 2026-10-29

## Kontekst

Aplikacja ma dziś domyślny motyw shadcn (`radix-nova`, `neutral`, Geist) i jeden komponent (`button.tsx`). Ekrany MVP (S-01–S-15) będą budowane w dużej części przez agentów AI. Bez wspólnego systemu każdy ekran wybierałby komponenty, odstępy i stany po swojemu, a wygląd zostałby domyślnym wyglądem biblioteki.

Właściciel projektu zatwierdził 2026-10-29 brief stylu i tokeny ([packages/ui/brief.md](../../packages/ui/brief.md), [packages/ui/tokeny.md](../../packages/ui/tokeny.md)). Potrzebny jest design system z dokumentacją, z której developer albo agent zbuduje ekran bez zgadywania: który komponent, jakie tokeny, jakie stany, czego unikać. Dokumentacja musi renderować prawdziwe komponenty i być sprawdzana automatycznie (dostępność, wartości spoza tokenów).

Rozważane warianty:

- **Komponenty w `apps/web` i Storybook w aplikacji:** najmniej konfiguracji, ale bez granicy między systemem a aplikacją; zależności Storybooka trafiają do aplikacji, a skrypt pilnujący tokenów musiałby rozróżniać katalogi.
- **Osobny pakiet w monorepo z Storybookiem:** wyraźna granica (tokeny, komponenty, dokumentacja w jednym miejscu), aplikacja tylko importuje. Wymaga drugiego katalogu w `workspaces` i zmiany struktury z [standardów 4.2](../engineering-standards.md#42-struktura-frontendu).
- **Sama dokumentacja w Markdownie bez Storybooka:** brak podglądu stanów, brak testów dostępności i interakcji na prawdziwych komponentach.

## Decyzja

- Design system jest pakietem `packages/ui` o nazwie `@koperty/ui`. Do `workspaces` w głównym `package.json` dochodzi `packages/*`. Pakiet jest źródłem TypeScript bez osobnego builda; aplikacja importuje komponenty i arkusz stylów (`@koperty/ui/styles.css`) przez `workspace:*`.
- Pakiet zawiera: tokeny w trzech warstwach (surowe, znaczeniowe, komponentowe; jasny i ciemny motyw), komponenty bazowe (shadcn/ui przez CLI, `components.json` w pakiecie), komponenty produktu pogrupowane według epików, wzorce i widoki ekranów jako komponenty prezentacyjne. W aplikacji w `features/*` zostają zapytania, mutacje i podpięcie danych (`api.ts`, kontenery), a trasy składają widoki z danymi.
- Dokumentacją jest Storybook 10.6 (`@storybook/react-vite`) w pakiecie, z dodatkami `@storybook/addon-docs` (MDX, z `remark-gfm` dla tabel), `@storybook/addon-a11y` (naruszenia kończą test błędem) i `@storybook/addon-vitest` (stories uruchamiane jako testy w Chromium przez Playwright z [ADR 0011](0011-component-tests-vitest-browser-playwright.md)).
- Odpowiedzi API w stories symulujemy funkcjami-atrapami przekazywanymi do komponentów (`fn()` z opóźnieniem lub odrzuceniem). Bez MSW, dopóki stories nie muszą renderować prawdziwych tras z TanStack Query.
- Toasty: `sonner` (komponent shadcn), bez `next-themes`; motyw ustawia własny przełącznik na `document.documentElement`.
- Font: Oxanium (`@fontsource-variable/oxanium`, podzbiory `latin` i `latin-ext`) zamiast Geist; `@fontsource-variable/geist` usuwamy po przeniesieniu stylów.
- Kolory, odstępy i promienie w komponentach pochodzą wyłącznie z tokenów. Domyślna paleta Tailwinda jest wyłączona w `@theme`, a skrypt `check:tokens` (w CI) odrzuca kolory spoza pliku tokenów, klasy palety i wartości arbitralne.

## Konsekwencje

**Pozytywne:**

- jedno źródło wyglądu i zachowania dla wszystkich ekranów; agent czyta skrót w `docs/design-system.md` i dokumentację w Storybooku,
- stany komponentów i ekranów są widoczne i testowane (dostępność, interakcje) bez uruchamiania Supabase,
- granica pakietu ułatwia egzekwowanie zasad (skrypt tokenów, lint) tylko tam, gdzie powstaje wygląd.

**Negatywne i ryzyka:**

- nowe zależności deweloperskie do aktualizowania: `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-vitest`, `remark-gfm`; zależności pakietu: `sonner`, `@fontsource-variable/oxanium`,
- Storybook oficjalnie wspiera Vite do wersji 8; Vite+ 1.3 dostarcza Vite 8.3.4 jako `@voidzero-dev/vite-plus-core`. Zgodność trzeba potwierdzić na początku wdrożenia,
- zadanie CI `web` wydłuża się o build Storybooka i testy stories,
- komponenty bazowe są edytowane ręcznie, więc dotychczasowe wykluczenie `components/ui/**` z pomiaru pokrycia przestaje pasować; pakiet wchodzi pod próg 100%, liczony z testów stories,
- pliki stories i konfiguracji Storybooka wymagają eksportu domyślnego, więc lint dostaje dla nich wyjątek od `import/no-default-export`.

**Wpływ na pracę agentów i kod:**

- nowe komponenty i warianty dodaje się tylko według zasad strony „Jak zmieniać system” w Storybooku; `docs/design-system.md` jest pierwszym plikiem czytanym przed budową ekranu (odwołanie w `AGENTS.md`),
- komponenty shadcn dodaje się komendą `vp -C packages/ui dlx shadcn@latest add <komponent>`, a po każdej komendzie sprawdza `package.json`,
- aktualizacja przy wdrożeniu: `AGENTS.md` (stack, komendy, odwołanie do skrótu), [standardy 4.2](../engineering-standards.md#42-struktura-frontendu) (struktura z pakietem), wykluczenia pokrycia w głównym `vite.config.ts`.
