---
title: Mierz pokrycie bez pluginów aplikacji i z providerem w wersji wbudowanego Vitest
created: 2026-10-19
area: Testy
---

# Pokrycie testami w Vite+ (Vitest 5, coverage-v8)

## Kontekst

Wprowadzenie progu 100% pokrycia testami jednostkowymi w CI (`vp test --coverage`).

## Co się stało

- `vp test --coverage` bez dodatkowego pakietu kończy się błędem `MISSING DEPENDENCY @vitest/coverage-v8`: Vite+ nie zawiera providera pokrycia.
- Plik `.tsx` z trasą był w całości wykonany przez test, a mimo to raport pokazywał niepokryte gałęzie i funkcje na ostatniej linii pliku.
- Ponowny `await import("./check-ai.ts")` w teście nie uruchamiał ponownie kodu modułu.

## Przyczyna

- Provider pokrycia jest osobnym pakietem i musi mieć dokładnie wersję Vitest wbudowanego w Vite+ (obecnie `5.0.5`).
- Vitest uruchamia Vite w trybie `serve`, więc `@vitejs/plugin-react` i `@tanstack/router-plugin` doklejają do plików `.tsx` kod HMR (`if (import.meta.hot && …)`) i dzielą trasy na wirtualne moduły. W testach `import.meta.hot` nie istnieje, więc te gałęzie zawsze wyglądają na niepokryte.
- Statyczny import tego samego modułu na górze pliku testu zapisuje go w cache modułów, więc dynamiczny import zwraca tę samą instancję.

## Wniosek

Instaluj `@vitest/coverage-v8` w wersji wbudowanego Vitest. W testach nie ładuj pluginów aplikacji (`process.env.VITEST ? [] : [...]`), bo trasy działają na zatwierdzonym `routeTree.gen.ts`, a JSX transformuje wbudowany oxc. Przed ponownym importem modułu wywołuj `vi.resetModules()`.

## Jak go stosować

- Aktualizując Vite+, podnoś `@vitest/coverage-v8` do wersji Vitest z `vite-plus` (dokładna wersja, bez `^`). `vp add -D` nie przyjmuje `--exact`: podaj wersję w specyfikatorze (`pakiet@5.0.5`).
- Nowy plugin w `apps/web/vite.config.ts` dodawaj w gałęzi `[...]`, która nie działa pod Vitest, chyba że testy go wymagają.
- Gdy nowy kod generowany (np. `routeTree.gen.ts`) zmienia się po dodaniu trasy, wygeneruj go przez `vp dev` lub `vp build` przed uruchomieniem testów.
- Kod wejścia CLI (`if (import.meta.filename === process.argv[1])`) testuj, podmieniając `process.argv` przez `vi.spyOn(process, "argv", "get")`, wywołując `vi.resetModules()` i importując moduł dynamicznie. Mock `process.exit` powinien rzucać wyjątek, tak jak prawdziwe wyjście przerywa wykonanie.

## Powiązania

- Specyfikacja: brak (zmiana narzędziowa)
- Log przebiegu: .ai/runs/2026-10-19-ci-unit-test-coverage.md
- Commit: brak
