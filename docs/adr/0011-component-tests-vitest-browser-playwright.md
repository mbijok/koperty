# ADR 0011: Testy komponentów w trybie przeglądarkowym Vitest z Playwrightem

- **Status:** zaakceptowany
- **Data:** 2026-10-25

## Kontekst

AGENTS.md wymaga 100% pokrycia testami jednostkowymi każdego pliku TypeScript, w tym tras i komponentów. Wyjątki to tylko pliki generowane, shadcn/ui i `main.tsx`. Obecny test tras (`apps/web/src/routes.test.tsx`) renderuje je przez `renderToString` w Node. Nie wykonuje to obsługi zdarzeń, efektów ani formularzy. S-01 dodaje pierwsze interaktywne ekrany: logowanie kodem OTP, edycję profilu i wylogowanie. Bez testów komponentów nie da się ich pokryć w 100%.

Standardy inżynieryjne (4.8, propozycja P-11) zakładały testy komponentów w trybie przeglądarkowym Vitest dopiero w T-01, razem z Playwrightem do E2E. Rozważane warianty:

- **jsdom lub happy-dom z Testing Library:** szybkie, ale nie wykrywają problemów z fokusem i układem na telefonie, czyli tego, o co chodzi w P-11. Dwie nowe zależności, które w T-01 i tak zastąpiłby tryb przeglądarkowy.
- **Czasowe wykluczenie tras i komponentów z pomiaru pokrycia do T-01:** bez nowych zależności, ale ekrany S-01 do S-02 zostają bez testów, a wykluczenie łatwo zostawić na dłużej.
- **Tryb przeglądarkowy Vitest z Playwrightem już w S-01:** realna przeglądarka (Chromium), ten sam Playwright, którego używają E2E (T-01) i QA w pipeline'ie agentów (`.ai/browsers/playwright.md`, ADR 0010).

## Decyzja

- Testy komponentów i tras uruchamiamy w trybie przeglądarkowym Vitest z dostawcą Playwright (`vite-plus/test/browser-playwright`, przeglądarka Chromium). Pliki takich testów mają sufiks `*.browser.test.tsx`; pozostałe testy działają w Node.
- Zależności deweloperskie aplikacji: `playwright`, `@vitest/browser-playwright` (w wersji Vitest wbudowanego w Vite+) i `vitest-browser-react`, dodawane przez `vp -C apps/web add -D`.
- Zadanie CI `web` instaluje Chromium komendą `vp -C apps/web exec playwright install --with-deps chromium` (Playwright jest zależnością `apps/web`, a Bun instaluje pakiety w izolowanym magazynie, więc z katalogu głównego binarka może nie być widoczna) przed `vp test --coverage`.
- Wprowadzamy to w S-01 (krok 0), zamiast w T-01. T-01 dokłada tylko testy E2E na tym samym Playwrighcie.

## Konsekwencje

**Pozytywne:**

- próg 100% pokrycia obejmuje także ekrany, bez wykluczeń,
- testy widzą fokus, układ i zachowanie zbliżone do telefonu,
- jedna instalacja Playwrighta dla testów komponentów, E2E i QA agentów.

**Negatywne i ryzyka:**

- dłuższe zadanie CI `web` (pobranie Chromium) i wolniejsze testy komponentów niż w Node,
- pomiar pokrycia v8 w przeglądarce trzeba potwierdzić w Vite+ (krok 0 S-01, zanim powstaną ekrany),
- trzy nowe zależności deweloperskie do aktualizowania.

**Wpływ na pracę agentów i kod:**

- testy komponentów piszemy w `*.browser.test.tsx` obok komponentu; logikę wydzielamy do czystych funkcji testowanych w Node,
- po akceptacji: standardy 4.8 i P-11 oznaczone jako wdrożone w S-01, opis T-01 (#5) ograniczony do E2E.
