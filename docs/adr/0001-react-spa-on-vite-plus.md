# ADR 0001: React SPA na Vite+

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Pierwszym klientem jest aplikacja webowa używana głównie na telefonie (PWA). Cała logika domenowa i autoryzacja są w Supabase, więc frontend nie potrzebuje własnego serwera. Hosting ma być darmowy i statyczny (Cloudflare Pages). Rozważane warianty: SPA (Vite), framework z renderowaniem po stronie serwera (Next.js, TanStack Start), Remix/React Router w trybie frameworka.

Projekt rozwijany jest z intensywnym udziałem agentów AI, więc liczy się mała liczba narzędzi i jedna spójna konfiguracja. Vite+ łączy Vite 8, Vitest, Oxlint, Oxfmt i zarządzanie zależnościami w jednym CLI (`vp`) z jednym plikiem konfiguracji.

## Decyzja

Aplikacja webowa jest SPA w React + TypeScript (`strict`), budowana i uruchamiana przez Vite+, bez renderowania po stronie serwera. Routing: TanStack Router, dane z backendu: TanStack Query, UI: Tailwind CSS i shadcn/ui. Repozytorium jest monorepo Vite+ z aplikacją w `apps/web`.

## Konsekwencje

**Pozytywne:**

- statyczny build hostowany za darmo, bez serwera aplikacyjnego,
- jedno narzędzie (`vp`) i jeden plik `vite.config.ts` do budowania, testów, lintu i formatowania,
- frontend pozostaje cienką warstwą prezentacji, co ułatwia dodanie klienta iOS.

**Negatywne i ryzyka:**

- brak SSR: gorsze SEO i dłuższy pierwszy render – akceptowalne dla aplikacji za logowaniem,
- Vite+ jest nowym narzędziem; wiedza agentów o nim może być niepełna, a dokumentacja się zmienia,
- brak ESLint/Prettier oznacza rezygnację z części ich ekosystemu wtyczek.

**Wpływ na pracę agentów i kod:**

- komendy wyłącznie przez `vp`; konfiguracja tylko w `vite.config.ts` z `defineConfig` z `vite-plus`; w razie wątpliwości dokumentacja https://viteplus.dev/llms-full.txt (zapisane w AGENTS.md).
