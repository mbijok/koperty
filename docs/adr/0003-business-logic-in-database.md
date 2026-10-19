# ADR 0003: Logika biznesowa w bazie (RPC)

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Reguły kopertowe (przydziały, salda, podział wydatku, uprawnienia ról) muszą działać identycznie w aplikacji webowej i przyszłej aplikacji iOS. Powielanie ich w każdym kliencie prowadzi do rozbieżności, a reguły tylko po stronie klienta da się obejść, wołając API bezpośrednio. Niektóre operacje są wieloetapowe (wydatek z kilkoma częściami podziału) i muszą być atomowe.

Rozważane warianty zapisu: (a) bezpośrednie zapisy do tabel chronione politykami RLS i ograniczeniami, (b) zapis wyłącznie przez funkcje RPC, (c) własna warstwa API (Edge Functions) dla wszystkich operacji.

## Decyzja

Reguły domenowe realizujemy w Postgresie: ograniczenia (`CHECK`, klucze obce, unikalność), triggery tam, gdzie reguła musi obowiązywać niezależnie od drogi zapisu (np. suma części wydatku), oraz funkcje RPC.

- **Zapis wyłącznie przez funkcje RPC** (`security definer`, `set search_path = ''`), które same sprawdzają `auth.uid()` i rolę w budżecie i wykonują operację w jednej transakcji. Tabele nie mają polityk zapisu, a role klienckie nie mają uprawnień `insert` / `update` / `delete`.
- **Odczyt bezpośrednio z tabel** przez PostgREST, chroniony politykami RLS `select`; wartości wyliczane (salda, pula, podsumowania) przez funkcje `security invoker`.
- Edge Functions tylko dla operacji wymagających sekretów lub zewnętrznych API.

## Konsekwencje

**Pozytywne:**

- jedna implementacja reguł dla wszystkich klientów; klient iOS dostaje gotowe operacje,
- atomowość operacji wieloetapowych,
- brak możliwości obejścia reguł bezpośrednim zapisem do tabel,
- reguły testowalne w izolacji przez pgTAP.

**Negatywne i ryzyka:**

- funkcje `security definer` omijają RLS – każda musi jawnie sprawdzać członkostwo i rolę; błąd w sprawdzeniu to luka (łagodzone testami dostępu pgTAP dla każdej funkcji),
- logika w SQL/PL/pgSQL jest trudniejsza w debugowaniu niż w TypeScript,
- zmiana sygnatury funkcji to zmiana kontraktu API (wersjonowanie przez nowe funkcje).

**Wpływ na pracę agentów i kod:**

- komponenty React nie zawierają reguł domenowych; walidacja w UI tylko dla wygody (AGENTS.md),
- każda funkcja RPC ma testy pgTAP: reguły, przypadki brzegowe i dostęp (członek innego budżetu, `member` vs `owner`, `anon`).

## Uzupełnienie (2026-10-19)

Doprecyzowanie po researchu standardów ([engineering-standards.md](../engineering-standards.md), P-01 i P-02):

- uprawnienia nadajemy wyłącznie jawnie: `auto_expose_new_tables = false`, globalne `alter default privileges revoke execute on functions from public`, a w migracjach `grant select` na tabelach i `grant execute` na funkcjach tylko dla `authenticated`,
- błędy biznesowe zgłaszamy z SQLSTATE `PTxyz` (status HTTP) i stałym kodem w `message` – katalog w [architekturze](../architecture.md#kontrakt-błędów).
