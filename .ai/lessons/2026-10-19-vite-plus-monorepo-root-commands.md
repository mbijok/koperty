---
title: W monorepo Vite+ komendy z katalogu głównego wymagają test.projects i defaultPackage
created: 2026-10-19
area: Vite+
---

# W monorepo Vite+ komendy z katalogu głównego wymagają test.projects i defaultPackage

## Kontekst

Faza 0, etap 5: szkielet monorepo Vite+ (`vp create vite:monorepo`) z aplikacją `apps/web` i Bun jako menedżerem pakietów.

## Co się stało

- `vp test` uruchomiony w katalogu głównym nie wczytał `apps/web/vite.config.ts`, więc alias `@/` nie działał i test padał (`Cannot find package '@/lib/...'`). Z `vp -C apps/web test` przechodził.
- `vp build` w katalogu głównym w powłoce nieinteraktywnej kończył się błędem „needs a target package”, bo katalog główny też jest pakietem workspace (`koperty .`).
- `vp dev` z `defaultPackage` działa, ale `vp dev --port 5199` uruchomił serwer dla katalogu głównego (404 dla `/src/main.tsx`).
- `vp add -D <pakiet> -w` zwraca „bun does not support --workspace-root”.

## Przyczyna

Główny `vite.config.ts` monorepo służy do lintu, formatowania i zadań; konfiguracje pakietów nie są dla `vp test` automatycznie łączone. Wybór pakietu dla `dev`/`build` zależy od `defaultPackage` lub interaktywnego wyboru, a dodatkowe argumenty zmieniają ścieżkę rozpoznawania celu. Flaga `-w` jest specyficzna dla pnpm.

## Wniosek

W głównym `vite.config.ts` trzymaj `test: { projects: ["apps/*"] }` i `defaultPackage: "./apps/web"`. Komendy z dodatkowymi flagami kieruj do pakietu przez `vp -C apps/web <komenda>`. Zależności katalogu głównego dodawaj `vp add -D <pakiet>` bez `-w`.

## Jak go stosować

- Po dodaniu nowego pakietu workspace dopisz jego katalog do `workspaces` w `package.json`, a jeśli ma testy, także do `test.projects`.
- Weryfikuj komendy z katalogu głównego w trybie nieinteraktywnym (tak jak w CI), np. `vp build | cat`.
- Zależności aplikacji: `vp -C apps/web add <pakiet>`.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 5 fazy 0
