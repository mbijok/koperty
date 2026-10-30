# Wnioski

Indeks wniosków z pracy agentów. Czytany na początku każdej sesji. Szczegóły każdego wniosku znajdują się w `.ai/lessons/` (wzorzec: [`_template.md`](lessons/_template.md)).

**Format wpisu:** jedna linia na wniosek, sformułowana jako reguła do stosowania, z linkiem do szczegółów:

```
- <Reguła w trybie rozkazującym.> ([szczegóły](lessons/YYYY-MM-DD-slug.md))
```

Przed dodaniem sprawdź, czy podobny wniosek już istnieje; jeśli tak, zaktualizuj go. Indeks utrzymuj zwięzłym (orientacyjnie do 100 linii).

## Baza i Supabase

- Nie polegaj na domyślnych uprawnieniach Supabase: nadawaj jawne `grant`, domyślne `EXECUTE` dla `PUBLIC` wyłączaj globalnym `alter default privileges` (nie `in schema`) i testuj to w pgTAP. ([szczegóły](lessons/2026-10-19-supabase-local-api-exposure.md))
- Uruchamiaj Supabase CLI przez `vp exec supabase`; nie twórz `.gitkeep` w `supabase/migrations` i nie instaluj pgTAP w testach; przed `test db` wykonaj `db reset`, bo `db start` nie odświeża działającej bazy. ([szczegóły](lessons/2026-10-19-supabase-cli-local-setup.md))

## Frontend

- Inicjalizuj shadcn/ui nieinteraktywnie z jawnym presetem, weryfikuj dodane zależności; komponenty dodawaj w `packages/ui` i po `shadcn add` zamieniaj import `"cn"` na `@koperty/ui/lib/utils`. ([szczegóły](lessons/2026-10-19-shadcn-init-noninteractive.md))

## Vite+

- Włączając kategorie Oxlint, wyłącz `react/react-in-jsx-scope` i dopuść importy CSS w `import/no-unassigned-import`. ([szczegóły](lessons/2026-10-19-oxlint-categories-react-rules.md))
- W monorepo trzymaj w głównym `vite.config.ts` `test.projects` i `defaultPackage`; komendy z flagami kieruj przez `vp -C apps/web`; nie używaj `-w` z Bun. ([szczegóły](lessons/2026-10-19-vite-plus-monorepo-root-commands.md))
- W hookach, skryptach i CI wywołuj komendy przez `vp run <skrypt>`; `vp node` i `vp env` istnieją tylko w globalnym CLI. ([szczegóły](lessons/2026-10-19-vite-plus-hooks-local-cli.md))
- Po dodaniu lub aktualizacji skilli `om-*` uruchom `vp check --fix`, potem `vp check`, i popraw uwagi lintu bez zmiany zachowania. ([szczegóły](lessons/2026-10-24-vendored-skills-vp-check.md))
- Po `vp create` popraw import `defineConfig` (z `vite-plus`), usuń blok `lint` z pakietu, włącz `strict` we wszystkich `tsconfig` (także głównym) i uruchom każdy wygenerowany skrypt. ([szczegóły](lessons/2026-10-19-vite-plus-app-template-fixes.md))

## Testy

- Instaluj `@vitest/coverage-v8` w wersji Vitest wbudowanego w Vite+, wyłączaj pluginy aplikacji pod Vitest (fałszywe gałęzie HMR) i przed ponownym importem modułu wywołuj `vi.resetModules()`. ([szczegóły](lessons/2026-10-19-vitest-coverage-vite-plus.md))
- W Storybooku nie używaj `import * as React` – importuj typy i nazwane funkcje (`useState`), bo przestrzeń nazw CJS daje fałszywe gałęzie w pokryciu, motyw ustawiaj także z kanału globali (MDX nie uruchamia dekoratorów), a story we własnej ramce niech przejmie motyw strony dokumentacji; przewijanie przy 320 px sprawdzaj na każdej story; bloki w MDX oznaczaj `sb-unstyled`; nazwę produktu podmieniaj w `manager.ts`, a kontenery z `sr-only` oznaczaj `relative`. ([szczegóły](lessons/2026-10-29-storybook-vite-plus-setup.md))

## Proces

- Pracując w worktree, na starcie powiedz, gdzie trafiają zmiany i jak dotrą do `master`; sprawdzaj wartości wyprowadzane z nazwy katalogu i nieśledzone pliki w głównej kopii. ([szczegóły](lessons/2026-10-19-worktree-session-location.md))
- Logi w `.ai/runs/` zmieniaj tylko przez dopisywanie (poza nagłówkiem, „Statusem końcowym” i „Następnymi krokami”, które opisują stan bieżący); wykluczaj je z masowych zamian tekstu. ([szczegóły](lessons/2026-10-19-run-log-append-only-edits.md))
- Statystyki zmian licz bez ruszania indeksu (`git diff --stat HEAD`, `git ls-files --others`), a liczby do logu przepisuj z wyniku komendy z tego samego kroku. ([szczegóły](lessons/2026-10-31-git-stats-and-counts.md))
- Zamykaj zgłoszenie w opisie PR przez angielskie `Closes #<numer>`; polskie „Zamyka #N” nie zamyka go przy scaleniu. ([szczegóły](lessons/2026-10-24-github-close-keywords-english.md))
- Nie zostawiaj w repozytorium znaczników z wtyczek i trybów narzędzi (np. `ponytail:`); komentarze pisz według konwencji projektu. ([szczegóły](lessons/2026-10-24-no-tool-specific-markers.md))
