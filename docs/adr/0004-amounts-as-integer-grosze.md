# ADR 0004: Kwoty jako liczby całkowite w groszach

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Liczby zmiennoprzecinkowe nie reprezentują dokładnie ułamków dziesiętnych (np. `0.1 + 0.2 ≠ 0.3`), co w budżecie prowadzi do rozjazdów sum i sald. Rozważane warianty: `numeric(12,2)` w bazie, liczby całkowite w groszach, biblioteka typu decimal w kliencie. Aplikacja obsługuje tylko PLN.

## Decyzja

Wszystkie kwoty przechowujemy i przesyłamy jako liczby całkowite w groszach: `bigint` w Postgresie, `number` w TypeScript (bezpieczny zakres `Number.MAX_SAFE_INTEGER` ≈ 90 bilionów zł). Zamiana na złotówki i formatowanie (`pl-PL`, PLN) odbywa się wyłącznie w warstwie prezentacji; parsowanie kwot wpisanych przez użytkownika zamienia tekst na grosze bez arytmetyki zmiennoprzecinkowej.

## Konsekwencje

**Pozytywne:**

- dokładna arytmetyka w bazie i kliencie, brak zaokrągleń przy sumowaniu,
- prosty kontrakt API (liczba całkowita), identyczny dla web i iOS (`Int64` w Swift).

**Negatywne i ryzyka:**

- każdy klient musi poprawnie konwertować grosze ↔ złote w prezentacji i parsowaniu (wymaga testów Vitest),
- PostgREST zwraca `bigint` jako liczbę JSON – bezpieczne w zakresie realnych kwot budżetu domowego.

**Wpływ na pracę agentów i kod:**

- zakaz `float`/`real`/`double precision`/`numeric` z ułamkiem dla kwot w bazie i zakaz operacji zmiennoprzecinkowych na kwotach w kliencie (AGENTS.md),
- formatowanie i parsowanie kwot w jednym module z testami.
