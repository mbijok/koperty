# ADR 0007: Bun jako menedżer pakietów w połączeniu z Vite+

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Vite+ zarządza zależnościami przez komendy `vp install` / `vp add` / `vp remove`, delegując do wybranego menedżera pakietów. Wybór zapisuje się w `package.json` (pole `devEngines.packageManager`). Rozważane warianty: pnpm, npm, Bun. Mieszanie menedżerów (różne pliki blokady) prowadzi do niepowtarzalnych instalacji.

## Decyzja

Menedżerem pakietów jest Bun, wskazany w `devEngines.packageManager`. Zależności zarządzamy przez `vp install` / `vp add` / `vp remove`, a jednorazowe narzędzia uruchamiamy przez `vp dlx`. Jedynym plikiem blokady jest commitowany `bun.lock`. Bun pełni wyłącznie rolę menedżera pakietów: testy (`vp test`, Vitest), serwer deweloperski (`vp dev`) i build (`vp build`) obsługuje Vite+.

## Konsekwencje

**Pozytywne:**

- szybka instalacja zależności lokalnie i w CI,
- jeden spójny interfejs (`vp`) niezależny od menedżera.

**Negatywne i ryzyka:**

- część dokumentacji zewnętrznej podaje komendy `npm`/`npx` – trzeba je tłumaczyć na `vp`/`bunx`,
- integracja Bun z Vite+ jest nowa; możliwe różnice zachowania względem pnpm (zapisywane jako wnioski w `.ai/lessons/`).

**Wpływ na pracę agentów i kod:**

- zakaz `npm`, `npx`, `pnpm`, `yarn` i ich plików blokady; `.gitignore` ignoruje obce pliki blokady (AGENTS.md),
- `bun test` nie jest używany – testy przez `vp test`.
