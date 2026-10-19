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
- **Wynik:** struktura gotowa, `.ai/` nie jest ignorowany przez `.gitignore`.

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
