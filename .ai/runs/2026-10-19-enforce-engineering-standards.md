---
title: Egzekwowanie standardów inżynieryjnych
started: 2026-10-19
spec: brak – zmiana narzędziowa i dokumentacyjna (lint, CI, AGENTS.md) bez wpływu na zachowanie aplikacji; plan zaakceptowany w rozmowie
status: completed
---

# Egzekwowanie standardów inżynieryjnych

## Cel

Uczynić sekcje 3–4 `docs/engineering-standards.md` (zatwierdzone przez użytkownika 2026-10-19) obowiązującymi dla agentów i zamienić część konwencji na automatyczne kontrole. Zmiany trafiają do PR #2 (gałąź `claude/github-ci-tests-setup-a0d501`), zgodnie z decyzją użytkownika.

## Plan

1. `AGENTS.md`: link do standardów jako obowiązujących (sekcje 3–4), zasada tytułu PR w Conventional Commits. `docs/engineering-standards.md`: status, tabela bramek 3.2, opis reguł lintu w 4.1, doprecyzowanie mockowania w 4.8, status P-12.
2. Reguły Oxlint w głównym `vite.config.ts`: `typescript/no-non-null-assertion`, `unicorn/filename-case` (kebab-case), `import/no-default-export` (wyjątek: `**/vite.config.ts`), `import/no-relative-parent-imports`.
3. Workflow `.github/workflows/pr-title.yml`: regex na tytuł PR, tytuł przekazany przez `env`.
4. Weryfikacja: `vp check`, `vp test --coverage`, `vp build`, `vp run check:ai`; po wypchnięciu sprawdzenie kontroli tytułu w PR #2.

## Przebieg kroków

### Krok 0. Rozpoznanie

- **Co zrobiono:** próbne włączenie czterech reguł Oxlint (zmiana cofnięta), sprawdzenie ochrony `master`.
- **Wynik:** wszystkie reguły są dostępne w Oxlint z Vite+ 1.3; jedyne naruszenia to `export default` w obu `vite.config.ts` (Vite wymaga eksportu domyślnego). `master` chroni aktywny ruleset „Master branch lock” (PR, squash, wymagane `Check, test, build` i `Database tests (pgTAP)`).

### Krok 1. Dokumentacja

- **Co zrobiono:** `AGENTS.md`: link do standardów we wstępie, zasada w „Sposób pracy” (sekcje 3–4 obowiązują, sekcja 5 tylko po akceptacji, przy sprzeczności wygrywa `AGENTS.md`), zasada tytułu PR w „Git”. `docs/engineering-standards.md`: status, `vp test --coverage` w tabeli 3.2, lista reguł lintu w 4.1, wyjątek dla mocka konstruktora SDK w 4.8, notatka „Wdrożone (PR #2)”.

### Krok 2. Reguły Oxlint

- **Co zrobiono:** w głównym `vite.config.ts` włączono `typescript/no-non-null-assertion`, `import/no-default-export` (override wyłączający dla `**/vite.config.ts`), `import/no-relative-parent-imports`, `unicorn/filename-case` (`kebabCase`).
- **Komendy:**
  ```bash
  vp check --fix
  vp lint   # z tymczasowymi plikami naruszającymi reguły, następnie usuniętymi
  ```
- **Wynik:** istniejący kod bez naruszeń. Kontrola negatywna: wszystkie cztery reguły zgłaszają błąd na celowo złym pliku.

### Krok 3. Kontrola tytułu PR

- **Co zrobiono:** `.github/workflows/pr-title.yml` (zadanie `PR title`, `permissions: {}`, tytuł przez `env`), regex Conventional Commits.
- **Wynik:** regex sprawdzony lokalnie: akceptuje `ci: …`, `feat(envelopes): …`, `fix!: …`; odrzuca tytuł bez typu, bez spacji po dwukropku, z wielką literą w zakresie i z próbą wstrzyknięcia komendy.

### Krok 4. Weryfikacja

- **Komendy:**
  ```bash
  vp check && vp test --coverage && vp build && vp run check:ai
  ```
- **Wynik:** wszystkie przechodzą (kod wyjścia 0).

## Decyzje i założenia

- Sekcje 3–4 standardów zatwierdzone przez użytkownika; sekcja 5 pozostaje listą propozycji.
- Kontrola tytułu PR bez zewnętrznej akcji (bez nowej zależności); osobny workflow, bo `ci.yml` nie reaguje na edycję tytułu.
- Dodanie kontroli „PR title” do wymaganych w rulesecie to zmiana ustawień repozytorium – tylko po osobnej zgodzie użytkownika.

## Problemy

- Notatka „Wdrożone (PR #1)” w standardach mówi, że ochrona `master` wymaga GitHub Pro; ruleset jest jednak aktywny. Dopisano aktualny stan w notatce dla PR #2, historycznej notatki nie zmieniano.

## Status końcowy

completed: standardy obowiązują w `AGENTS.md`, cztery konwencje egzekwuje lint, tytuł PR sprawdza CI. Przebieg kontroli na GitHubie potwierdzany w PR #2.

## Następne kroki

- Dodać zadanie `PR title` do wymaganych kontroli w rulesecie „Master branch lock” (zmiana ustawień repozytorium – decyzja użytkownika).

## Uzupełnienie po zakończeniu

### Krok 5. Wymagana kontrola tytułu PR

- **Co zrobiono:** na prośbę użytkownika dodano kontrolę `PR title` (GitHub Actions, `integration_id` 15368) do wymaganych w rulesecie „Master branch lock”; pozostałe reguły i `bypass_actors` (pusta lista) bez zmian. Zaktualizowano `docs/engineering-standards.md` (3.1 i notatka „Wdrożone (PR #2)”).
- **Komendy:**
  ```bash
  gh api repos/mbijok/koperty/rulesets/<id> > ruleset.json
  gh api -X PUT repos/mbijok/koperty/rulesets/<id> --input ruleset-new.json
  gh pr checks 2
  ```
- **Wynik:** wymagane kontrole: `Check, test, build`, `Database tests (pgTAP)`, `PR title`. W PR #2 wszystkie trzy przechodzą. Następny krok z sekcji „Następne kroki” zrealizowany.
