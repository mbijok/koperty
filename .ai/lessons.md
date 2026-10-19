# Wnioski

Indeks wniosków z pracy agentów. Czytany na początku każdej sesji. Szczegóły każdego wniosku znajdują się w `.ai/lessons/` (wzorzec: [`_template.md`](lessons/_template.md)).

**Format wpisu:** jedna linia na wniosek, sformułowana jako reguła do stosowania, z linkiem do szczegółów:

```
- <Reguła w trybie rozkazującym.> ([szczegóły](lessons/YYYY-MM-DD-slug.md))
```

Przed dodaniem sprawdź, czy podobny wniosek już istnieje; jeśli tak, zaktualizuj go. Indeks utrzymuj zwięzłym (orientacyjnie do 100 linii).

## Baza i Supabase

- Nie polegaj na domyślnych uprawnieniach Supabase: nadawaj jawne `grant`, domyślne `EXECUTE` dla `PUBLIC` wyłączaj globalnym `alter default privileges` (nie `in schema`) i testuj to w pgTAP. ([szczegóły](lessons/2026-10-19-supabase-local-api-exposure.md))
- Uruchamiaj Supabase CLI przez `vp exec supabase`; nie twórz `.gitkeep` w `supabase/migrations` i nie instaluj pgTAP w testach. ([szczegóły](lessons/2026-10-19-supabase-cli-local-setup.md))

## Frontend

- Inicjalizuj shadcn/ui nieinteraktywnie z jawnym presetem (`-p nova`), weryfikuj dodane zależności i po `shadcn add` zamieniaj import `"cn"` na `@/lib/utils`. ([szczegóły](lessons/2026-10-19-shadcn-init-noninteractive.md))

## Vite+

- Włączając kategorie Oxlint, wyłącz `react/react-in-jsx-scope` i dopuść importy CSS w `import/no-unassigned-import`. ([szczegóły](lessons/2026-10-19-oxlint-categories-react-rules.md))
- W monorepo trzymaj w głównym `vite.config.ts` `test.projects` i `defaultPackage`; komendy z flagami kieruj przez `vp -C apps/web`; nie używaj `-w` z Bun. ([szczegóły](lessons/2026-10-19-vite-plus-monorepo-root-commands.md))
- W hookach, skryptach i CI wywołuj komendy przez `vp run <skrypt>`; `vp node` i `vp env` istnieją tylko w globalnym CLI. ([szczegóły](lessons/2026-10-19-vite-plus-hooks-local-cli.md))
- Po `vp create` popraw import `defineConfig` (z `vite-plus`), usuń blok `lint` z pakietu i włącz `strict`. ([szczegóły](lessons/2026-10-19-vite-plus-app-template-fixes.md))

## Testy

## Proces

- Pracując w worktree, na starcie powiedz, gdzie trafiają zmiany i jak dotrą do `master`; sprawdzaj wartości wyprowadzane z nazwy katalogu. ([szczegóły](lessons/2026-10-19-worktree-session-location.md))
- Logi w `.ai/runs/` zmieniaj tylko przez dopisywanie; wykluczaj je z masowych zamian tekstu. ([szczegóły](lessons/2026-10-19-run-log-append-only-edits.md))
