---
title: Faza 0 – fundamenty projektu
started: 2026-10-19
spec: docs/prompts/00-bootstrap.md (traktowany jako zatwierdzona specyfikacja fazy 0 – decyzja użytkownika)
status: in-progress
---

# Faza 0 – fundamenty projektu

## Cel

Przygotowanie fundamentów pod pracę z agentami AI: pamięć projektu (`.ai/`), PRD, architektura i ADR, szkielet repozytorium, kontrola jakości i CI, proces i backlog. Bez implementacji funkcjonalności domenowych. Instrukcje: [docs/prompts/00-bootstrap.md](../../docs/prompts/00-bootstrap.md).

## Plan

1. Weryfikacja kontekstu.
2. Struktura `.ai/`.
3. PRD na podstawie wywiadu.
4. Architektura i ADR.
5. Szkielet repozytorium.
6. Kontrola jakości i CI.
7. Proces i plan pracy.

Po każdym etapie punkt kontrolny i akceptacja użytkownika; commit po każdym etapie.

## Przebieg kroków

> Wpisy dla etapów 1 i 2 dodane w etapie 2, bo katalog `.ai/` wcześniej nie istniał (wymuszony wyjątek od zasady zakładania logu na początku przebiegu).

### Etap 1. Weryfikacja kontekstu

- **Co zrobiono:** przeczytano `README.md`, `AGENTS.md`, `CLAUDE.md`, `00-bootstrap.md`; przedstawiono podsumowanie rozumienia produktu, architektury i procesu oraz listę niejasności.
- **Komendy:**
  ```bash
  date +%F
  command -v vp bun supabase docker git gh
  ```
- **Wynik:** `vp` 1.3.0, Bun 1.4.3, `gh` dostępne; brak Supabase CLI i Dockera.

### Etap 2. Struktura `.ai/`

- **Co zrobiono:**
  - zmieniono nazwę gałęzi `claude/bootstrap-setup-c092fc` → `chore/project-bootstrap` (bazą jest `master`),
  - przeniesiono `00-bootstrap.md` z katalogu głównego głównej kopii repozytorium (był tylko w indeksie, niezacommitowany) do `docs/prompts/00-bootstrap.md`; commit `993ef24`,
  - utworzono `.ai/specs/{implemented,archive}/` (z `.gitkeep`), `.ai/runs/`, `.ai/lessons/`,
  - utworzono wzorce `.ai/specs/_template.md`, `.ai/runs/_template.md`, `.ai/lessons/_template.md`,
  - utworzono `.ai/lessons.md` z instrukcją formatu i pustymi sekcjami obszarów,
  - założono ten log.
- **Komendy:**
  ```bash
  git branch -m chore/project-bootstrap
  mkdir -p .ai/specs/implemented .ai/specs/archive .ai/runs .ai/lessons
  git check-ignore -v .ai .ai/lessons.md   # brak dopasowań – .ai/ nie jest ignorowany
  ```
- **Wynik:** struktura gotowa, `.ai/` nie jest ignorowany przez `.gitignore`. Commit `9b0b75e`. Etap zaakceptowany przez użytkownika.

### Etap 3. PRD na podstawie wywiadu

- **Co zrobiono:** rozpoczęto wywiad; partia 1 pytań dotyczy „Otwartych decyzji” z `AGENTS.md` (koniec okresu, ujemne saldo, wiele budżetów, role, logowanie).
- **Wynik partii 1 (decyzje użytkownika):**
  - koniec okresu: saldo koperty zawsze przechodzi na kolejny miesiąc (saldo = suma historii),
  - saldo koperty może być ujemne, z wyraźnym oznaczeniem w UI,
  - jedna osoba może należeć do wielu budżetów (przełącznik budżetu),
  - role: `owner` i `member`, możliwych kilku właścicieli,
  - logowanie: e-mail z magic linkiem / OTP, bez haseł i bez OAuth w MVP.
- Partia 2: zaproszenia, hosting, podział wydatku i zaokrąglenia, definicja okresu, doprecyzowania z partii 1.
- **Wynik partii 2 (decyzje użytkownika):**
  - zaproszenia: link z jednorazowym tokenem ważnym 7 dni, z możliwością unieważnienia,
  - hosting frontendu: Cloudflare Pages,
  - podział wydatku: kwoty części w groszach, suma musi równać się kwocie wydatku (wymusza baza); podpowiedzi procentowe/po równo tylko w UI; wydatek ma datę, opcjonalny opis, autora (automatycznie), edycję i usuwanie dla każdego członka,
  - okres: miesiąc kalendarzowy; przydziały na przyszłe miesiące dozwolone,
  - pula „do rozdysponowania” może być ujemna, z wyraźnym oznaczeniem w UI (zatem przydział nie jest ograniczony pulą),
  - „przenoszenie reszty” (etap 2): opcjonalny zwrot niewykorzystanej reszty z koperty do puli na koniec miesiąca, konfigurowany per koperta.
- **Wynik partii 3 (decyzje użytkownika):** otwarta rejestracja; koperta (nazwa, kolejność, archiwizacja) i przychód (kwota, data, opis, autor) w wersji minimalnej; podsumowanie miesiąca jako tabela per koperta + sumy i pula; wymagania niefunkcjonalne potwierdzone (WCAG 2.1 AA, mobile first od 360 px, PWA bez offline, < 2 s / < 500 ms, usunięcie konta z anonimizacją, tylko PLN); brak metryk produktowych.
- Utworzono `docs/prd.md` (23 user stories US-01–US-23, reguły domenowe, NFR, ryzyka). Założenia, których wywiad nie rozstrzygnął, oznaczono w PRD jako [Z1]–[Z5] do potwierdzenia w przeglądzie.
- Zaktualizowano `AGENTS.md`: sekcja „Otwarte decyzje” zamieniona na „Rozstrzygnięte decyzje” + odesłanie do założeń [Z1]–[Z5].
- Zaktualizowano `README.md`: hosting (Cloudflare Pages) i opis „przenoszenia reszty” w etapie 2.
- Commit `fb13290`. Przegląd użytkownika: założenia [Z1]–[Z5] potwierdzone, odświeżanie na żywo poza MVP. PRD oznaczony jako zaakceptowany, sekcja „Otwarte decyzje” w `AGENTS.md` pusta. Etap zaakceptowany.

### Etap 4. Architektura i decyzje

- **Co zrobiono:**
  - `docs/architecture.md`: diagram komponentów, diagram ER (profiles, budgets, budget_members, invitations, envelopes, incomes, allocations, expenses, expense_splits), strategia RLS, lista RPC z odwołaniami do US, Edge Function `delete-account`, zasady wersjonowania API,
  - `docs/adr/0000-template.md` i ADR 0001–0007 (status: zaakceptowany),
  - `AGENTS.md`: dopisana reguła „zapis wyłącznie przez RPC” (z ADR 0003).
- **Decyzje (do akceptacji w przeglądzie):** zapis wyłącznie przez RPC `security definer`, odczyt przez RLS `select`; spójność budżetu przez złożone klucze obce; suma części wydatku pilnowana odroczonym triggerem; tokeny zaproszeń przechowywane jako hash; `profiles.display_name` do pokazywania autora.
- **Otwarte:** źródło nazwy wyświetlanej autora; propozycje nowych ADR (hosting Cloudflare Pages, logowanie bez haseł).
- Commit `17942c3`. Przegląd użytkownika: nazwa wyświetlana = część e-maila przed `@`, zmienialna (dopisano US-24 w PRD i regułę w 4.11; `update_profile` → US-24); dodano ADR 0008 (Cloudflare Pages) i ADR 0009 (logowanie bez haseł). Architektura oznaczona jako zaakceptowana. Etap zaakceptowany.

### Etap 5. Szkielet repozytorium

- **Co zrobiono:** rozpoznanie przed implementacją (wymagane przez bootstrap): przeczytano dokumentację Vite+ (`llms-full.txt`: create, package management, monorepo, env) i wykonano próbne `vp create` w katalogu tymczasowym (poza repozytorium).
- **Komendy:**
  ```bash
  curl -sSfL https://viteplus.dev/llms-full.txt -o vp.txt
  vp create vite:monorepo --directory mono --package-manager bun --no-interactive --no-git --no-agent --no-editor --no-hooks
  vp create vite:application --directory apps/web --no-interactive --no-agent --no-editor -- --template react-ts
  ```
- **Wynik:** szablon monorepo zapisuje `devEngines.packageManager` (bun 1.4.3), `catalog` z wersjami `vite-plus` i aliasem `vite` → `@voidzero-dev/vite-plus-core`, workspaces `apps/*`, `packages/*`, `tools/*` i przykładowe pakiety `apps/website`, `packages/utils`. Szablon aplikacji React tworzy `apps/web/vite.config.ts` z `defineConfig` z `vite` (nie `vite-plus`), własnym blokiem `lint` i bez `strict` w `tsconfig.app.json`. Przedstawiono plan użytkownikowi, czekam na akceptację.
- **Akceptacja użytkownika:** plan, lista zależności, routing oparty na plikach, `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`; użytkownik zainstalował OrbStack (`brew install --cask orbstack`).
- **Co zrobiono (implementacja):**
  - monorepo: `package.json` (workspaces `apps/*`, `packages/*`, `devEngines.packageManager` bun 1.4.3, `catalog`, `overrides` dla `vite` i `vitest@5.0.5`), główny `vite.config.ts` (lint + overrides React, fmt, `test.projects`, `defaultPackage`), `tsconfig.json`, wpisy `*.local` i `.claude/worktrees/` w `.gitignore`,
  - `apps/web`: szablon `react-ts`, usunięte demo, `strict: true`, alias `@/`, `lang="pl"`, `vite.config.ts` z `vite-plus` (TanStack Router plugin, React, Tailwind, `test`),
  - zależności: `@tanstack/react-router`, `@tanstack/router-plugin` (dev), `@tanstack/react-query`, `tailwindcss`, `@tailwindcss/vite`, `@supabase/supabase-js`; shadcn dodał `cn`, `radix-ui`, `shadcn`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, `@fontsource-variable/geist` (odstępstwo od listy przedstawionej w planie: `cn` zamiast `clsx` + `tailwind-merge`, zweryfikowany – repozytorium shadcn-ui, brak skryptów instalacyjnych),
  - routing plikowy: `src/routes/__root.tsx`, `src/routes/index.tsx` (przykładowa trasa z komponentem `Button`), `routeTree.gen.ts` commitowany, wykluczony z lint/fmt; `QueryClient` w `src/lib/query-client.ts`,
  - `apps/web/.env.example`, `src/lib/supabase-config.ts` (walidacja zmiennych), `src/lib/supabase.ts` (klient), test Vitest `supabase-config.test.ts`,
  - Supabase: `vp add -D supabase` (2.121.0), `supabase init` (`project_id = "koperty"`, `site_url` → 5173), `seed.sql`, test pgTAP `supabase/tests/000-infrastructure.test.sql`,
  - README „Uruchomienie lokalne”, AGENTS.md: tabela komend i zasada konfiguracji Vite+ w monorepo,
  - 5 wniosków w `.ai/lessons/` i indeks w `.ai/lessons.md`.
- **Komendy weryfikacji:**
  ```bash
  vp check                      # pass: formatowanie, lint, typy (0 błędów, 0 ostrzeżeń)
  vp test                       # 1 plik, 3 testy – pass
  vp build                      # pass (defaultPackage → apps/web)
  vp exec supabase start        # pass (OrbStack)
  vp exec supabase db reset     # pass
  vp exec supabase test db      # Files=1, Tests=3, Result: PASS
  vp exec supabase gen types typescript --local   # działa (brak tabel)
  vp dev                        # serwer na 5173, /src/main.tsx → 200
  ```
- **Problemy i rozwiązania:** `vp test` z katalogu głównego nie widział aliasu (→ `test.projects`); `vp build` z katalogu głównego wymagał celu (→ `defaultPackage`); `vp dev --port` ignoruje `defaultPackage` (→ `vp -C apps/web dev --port`); `vp add -w` nieobsługiwane przez Bun; shadcn wymagał presetu; fałszywe ostrzeżenia `react/only-export-components` dla tras i `components/ui` (wyłączone override'em). Szczegóły w wnioskach.

- Commit `bdf2784`. Pytanie użytkownika o worktree: zmiany są w worktree `.claude/worktrees/...` na gałęzi `chore/project-bootstrap`; problemy z aliasami nie wynikały z lokalizacji. Decyzja: dokończyć etapy 6–7 w worktree i scalić / otworzyć PR na końcu.
- **Korekta użytkownika:** zamiast pakietu `cn` używamy `clsx` + `tailwind-merge`.
  - `vp -C apps/web remove cn`, `vp -C apps/web add clsx tailwind-merge`; `src/lib/utils.ts` w klasycznej postaci shadcn; import w `button.tsx` → `@/lib/utils`.
  - `shadcn add card --dry-run --view` pokazał, że nowe komponenty nadal importują `"cn"` → dodano regułę `no-restricted-imports` dla `apps/web/**` w głównym `vite.config.ts`; sprawdzono, że `vp check` zgłasza błąd przy imporcie `"cn"`.
  - Zaktualizowano wniosek o shadcn i indeks `lessons.md`.
  - Weryfikacja: `vp check` pass, `vp test` 3/3, `vp build` pass.

## Decyzje i założenia

- `docs/prompts/00-bootstrap.md` pełni rolę zatwierdzonej specyfikacji całej fazy 0; osobne specyfikacje dla etapów 5–6 nie powstają (decyzja użytkownika).
- Plik bootstrapu przeniesiony do `docs/prompts/` zamiast usunięcia (decyzja użytkownika).
- Gałęzie zgodnie z konwencją z `AGENTS.md`, commit po każdym etapie (decyzja użytkownika).
- Repozytorium jako monorepo Vite+ z workspace w katalogu głównym i aplikacją w `apps/web` (decyzja użytkownika).
- Supabase CLI instalowane jako zależność deweloperska (`bun add -D supabase`) w etapie 5, razem z innymi niezbędnymi elementami (decyzja użytkownika). Docker nadal wymagany dla `supabase start` / `supabase test db`.
- PWA nie wchodzi do szkieletu (etap 5); trafi do backlogu (założenie do potwierdzenia w etapie 7).
- Nazwy zmiennych środowiskowych Supabase zostaną potwierdzone z użytkownikiem w etapie 5.
- `status` w logu przyjmuje dodatkowo wartość `in-progress` na czas trwania przebiegu; wartości końcowe zgodnie z `AGENTS.md`.

## Problemy

- Brak Dockera na maszynie – zablokuje `supabase test db` w etapie 5, jeśli nie zostanie zainstalowany.

## Status końcowy

<uzupełniany po etapie 7>

## Następne kroki

- Etap 3: wywiad do PRD, zaczynając od „Otwartych decyzji” z `AGENTS.md`.
