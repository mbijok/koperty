---
title: Inicjalizuj shadcn/ui nieinteraktywnie z jawnym presetem i sprawdzaj dodane zależności
created: 2026-10-19
area: Frontend
---

# Inicjalizuj shadcn/ui nieinteraktywnie z jawnym presetem i sprawdzaj dodane zależności

## Kontekst

Faza 0, etap 5: `vp dlx shadcn@latest init` w `apps/web` (Vite+, Tailwind v4, Bun).

## Co się stało

- `vp dlx shadcn@latest init --help` pokazał pomoc `vp dlx`, a `init -- --help` potraktował `--help` jako nazwę komponentu.
- `init -t vite -b radix -y` mimo `-y` zatrzymał się na pytaniu o preset.
- shadcn 4.x dodał inne zależności niż w starszych wersjach: `cn` (zamiast `clsx` + `tailwind-merge`), `radix-ui`, `shadcn` (import `shadcn/tailwind.css`), `@fontsource-variable/geist`, `tw-animate-css`, `class-variance-authority`, `lucide-react`.

## Przyczyna

`vp dlx` przechwytuje własne flagi. Aktualne CLI shadcn wymaga wyboru presetu, którego `-y` nie pomija.

## Wniosek

Uruchamiaj `vp dlx shadcn@latest init -t vite -b radix -p nova --no-monorepo --no-rtl --no-pointer -y` (pomoc: `vp dlx shadcn@latest help init`) i po inicjalizacji sprawdź listę dodanych zależności (pochodzenie, skrypty instalacyjne).

## Jak go stosować

- Komponenty dodawaj `vp -C apps/web dlx shadcn@latest add <komponent>`; pliki w `src/components/ui/` są generowane i nie przepisuje się ich ręcznie.
- Nieznany pakiet dodany przez narzędzie zweryfikuj w `node_modules/<pakiet>/package.json` (repozytorium, `scripts`, `bin`) zanim zostanie zacommitowany.

## Powiązania

- Specyfikacja: docs/prompts/00-bootstrap.md (faza 0)
- Log przebiegu: .ai/runs/2026-10-19-project-bootstrap.md
- Commit: etap 5 fazy 0
