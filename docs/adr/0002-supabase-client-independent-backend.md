# ADR 0002: Supabase jako backend niezależny od klienta

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Aplikacja potrzebuje kont użytkowników, relacyjnej bazy z izolacją danych między budżetami, w przyszłości przechowywania plików (paragony) i wywołań modelu AI. Z tych samych danych i reguł ma korzystać aplikacja webowa, a później natywna aplikacja iOS. Projekt ma działać na darmowych planach. Rozważane warianty: własny backend (np. Node + Postgres), Firebase, Supabase.

## Decyzja

Backendem jest Supabase: Postgres z RLS i funkcjami RPC, Auth, Storage, Edge Functions. Backend nie zakłada niczego o kliencie – web i iOS są równorzędnymi klientami tego samego API (PostgREST + RPC + Edge Functions). Lokalne środowisko, migracje i generowanie typów obsługuje Supabase CLI.

## Konsekwencje

**Pozytywne:**

- relacyjny model danych i SQL do reguł domenowych, z transakcjami i ograniczeniami,
- gotowe Auth, RLS i SDK dla JavaScript i Swift,
- darmowy plan wystarczający dla MVP; lokalne środowisko w Dockerze.

**Negatywne i ryzyka:**

- zależność od dostawcy (łagodzona tym, że rdzeń to standardowy Postgres),
- limity darmowego planu (wstrzymywanie nieaktywnych projektów, limity e-maili Auth),
- lokalne testy bazy wymagają Dockera.

**Wpływ na pracę agentów i kod:**

- schemat zmieniany wyłącznie migracjami; schemat i sygnatury RPC są kontraktem (patrz [architektura, sekcja 5](../architecture.md#5-wersjonowanie-i-wsteczna-zgodność-api)),
- klucz `service_role` tylko w Edge Functions, nigdy w kliencie ani repozytorium.
