# Wnioski

Indeks wniosków z pracy agentów. Czytany na początku każdej sesji. Szczegóły każdego wniosku znajdują się w `.ai/lessons/` (wzorzec: [`_template.md`](lessons/_template.md)).

**Format wpisu:** jedna linia na wniosek, sformułowana jako reguła do stosowania, z linkiem do szczegółów:

```
- <Reguła w trybie rozkazującym.> ([szczegóły](lessons/YYYY-MM-DD-slug.md))
```

Przed dodaniem sprawdź, czy podobny wniosek już istnieje; jeśli tak, zaktualizuj go. Indeks utrzymuj zwięzłym (orientacyjnie do 100 linii).

## Baza i Supabase

- Uruchamiaj Supabase CLI przez `vp exec supabase`; nie twórz `.gitkeep` w `supabase/migrations` i nie instaluj pgTAP w testach. ([szczegóły](lessons/2026-10-19-supabase-cli-local-setup.md))

## Frontend

- Inicjalizuj shadcn/ui nieinteraktywnie z jawnym presetem (`-p nova`) i weryfikuj dodane przez niego zależności. ([szczegóły](lessons/2026-10-19-shadcn-init-noninteractive.md))

## Vite+

- W monorepo trzymaj w głównym `vite.config.ts` `test.projects` i `defaultPackage`; komendy z flagami kieruj przez `vp -C apps/web`; nie używaj `-w` z Bun. ([szczegóły](lessons/2026-10-19-vite-plus-monorepo-root-commands.md))
- Po `vp create` popraw import `defineConfig` (z `vite-plus`), usuń blok `lint` z pakietu i włącz `strict`. ([szczegóły](lessons/2026-10-19-vite-plus-app-template-fixes.md))

## Testy

## Proces

- Logi w `.ai/runs/` zmieniaj tylko przez dopisywanie; wykluczaj je z masowych zamian tekstu. ([szczegóły](lessons/2026-10-19-run-log-append-only-edits.md))
