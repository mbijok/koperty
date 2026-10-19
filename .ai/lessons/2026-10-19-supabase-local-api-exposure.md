---
title: Lokalny Supabase domyślnie wystawia nowe tabele i funkcje rolom API – nadawaj uprawnienia jawnie
created: 2026-10-19
area: Baza i Supabase
---

# Lokalny Supabase domyślnie wystawia nowe tabele i funkcje rolom API – nadawaj uprawnienia jawnie

## Kontekst

Research standardów inżynieryjnych przed S-01 (pierwsza migracja projektu).

## Co się stało

Według changelogu Supabase nowe projekty w chmurze (od 2026-05-30) nie wystawiają nowych tabel w `public` rolom `anon` / `authenticated` bez jawnego `grant`, a od 2026-10-30 dotyczy to też istniejących projektów. Lokalny `supabase/config.toml` ma jednak `auto_expose_new_tables` domyślnie `true`. Do tego funkcje w Postgresie dostają `EXECUTE` dla `PUBLIC` w chwili utworzenia, więc funkcja `security definer` bez `revoke` jest dostępna dla `anon` przez `/rpc`.

## Przyczyna

Domyślne uprawnienia lokalnego środowiska różnią się od chmury, a domyślne `EXECUTE` dla `PUBLIC` jest zachowaniem samego Postgresa.

## Wniosek

Nie polegaj na domyślnych uprawnieniach: w każdej migracji nadawaj jawne `grant` dla potrzebnych ról, odbieraj `execute` od `public` i `anon` i sprawdzaj to testem pgTAP.

## Jak go stosować

- Propozycja P-01 w `docs/engineering-standards.md`: `auto_expose_new_tables = false` i `alter default privileges ... revoke execute on functions from public, anon, authenticated`.
- Test niezmiennika: żadna funkcja w `public` nie jest wykonywalna przez `anon`, każda tabela ma RLS.

## Powiązania

- Specyfikacja: brak (research), dotyczy `.ai/specs/2026-10-19-email-login-profile.md`
- Log przebiegu: .ai/runs/2026-10-19-engineering-standards-research.md
- Commit: research standardów
