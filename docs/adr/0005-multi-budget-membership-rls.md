# ADR 0005: Wiele budżetów z członkostwem i izolacją przez RLS

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Jedna instancja aplikacji obsługuje wiele niezależnych gospodarstw domowych. Budżet prowadzi wspólnie kilka osób, a jedna osoba może należeć do kilku budżetów (PRD, sekcja 4.9). Dane budżetów muszą być w pełni odizolowane – wyciek między budżetami jest najpoważniejszym możliwym błędem. Rozważane warianty: osobny schemat lub baza per budżet, izolacja w kodzie aplikacji, wspólne tabele z `budget_id` i Row Level Security.

## Decyzja

Wszystkie dane budżetu leżą we wspólnych tabelach z kolumną `budget_id`. Członkostwo opisuje tabela `budget_members (budget_id, user_id, role)` z rolami `owner` i `member`. RLS jest włączone na każdej tabeli; polityki odczytu sprawdzają członkostwo przez funkcje pomocnicze `private.is_budget_member` / `private.is_budget_owner` (`security definer`, bez rekurencji polityk). Spójność między tabelami w obrębie budżetu wymuszają złożone klucze obce `(id, budget_id)`. Szczegóły: [architektura, sekcja 3](../architecture.md#3-strategia-rls-i-dostępu).

## Konsekwencje

**Pozytywne:**

- izolacja wymuszana przez bazę, niezależnie od klienta i błędów w nim,
- naturalny model dla wielu budżetów na osobę i wielu osób na budżet,
- prosty schemat i migracje (jeden zestaw tabel).

**Negatywne i ryzyka:**

- błąd w polityce RLS ujawnia dane innych budżetów – każda tabela wymaga testów RLS (budżet A vs B, `anon`),
- każde zapytanie płaci koszt sprawdzenia członkostwa (łagodzone indeksami i wywołaniem `auth.uid()` w podzapytaniu).

**Wpływ na pracę agentów i kod:**

- każda nowa tabela z danymi budżetu: `budget_id`, RLS włączone, polityki członkostwa i testy RLS (AGENTS.md); RLS nigdy nie jest wyłączane.
