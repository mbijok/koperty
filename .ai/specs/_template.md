---
title: <Krótki tytuł funkcjonalności lub zmiany>
status: draft # draft | approved | in-progress | implemented | archived (approved nadaje wyłącznie człowiek)
created: YYYY-MM-DD # data utworzenia z `date +%F`, nie zmienia się przy przenoszeniu pliku
issue: # numer zgłoszenia w GitHub Issues, np. 12
user_stories: [] # np. [US-01, US-02]
adrs: [] # np. [docs/adr/0003-business-logic-in-database.md]
runs: [] # np. [.ai/runs/YYYY-MM-DD-slug.md]
---

# <Tytuł>

## Cel

<Jaki problem rozwiązujemy i jaki efekt dostaje użytkownik. 2–4 zdania.>

## Kontekst

<Powiązane user stories z PRD, ADR, istniejące elementy systemu, na których budujemy, ograniczenia.>

## Zakres

**W zakresie:**

- <...>

**Poza zakresem:**

- <...>

## Kryteria akceptacji

<Każde kryterium w formacie Given/When/Then, z odwołaniem do user story. Uwzględnij przypadki brzegowe i dostęp.>

- **AC-1** (US-xx)
  - **Given** <stan początkowy>
  - **When** <akcja>
  - **Then** <oczekiwany wynik>

## Projekt rozwiązania

### Zmiany w bazie

<Nowe tabele, kolumny, ograniczenia (`CHECK`, klucze obce), indeksy, triggery, widoki. Nazwy migracji.>

### Funkcje RPC

<Dla każdej funkcji: nazwa, wejście, wynik, reguły i walidacje, błędy, atomowość.>

### Polityki RLS

<Dla każdej tabeli: polityki `select`, `insert`, `update`, `delete` i sposób sprawdzania członkostwa w budżecie.>

### Edge Functions

<Tylko jeśli potrzebne (sekrety, zewnętrzne API). W przeciwnym razie: „nie dotyczy”.>

### Interfejs

<Ekrany, trasy, komponenty, zapytania TanStack Query (klucze), stany ładowania, błędów i puste. Mobile first.>

## Wsteczna zgodność

<Czy zmiana jest addytywna? Wpływ na istniejących klientów (web, przyszła aplikacja iOS). Jeśli łamie kontrakt: link do ADR i plan migracji.>

## Plan implementacji

<Małe kroki, każdy kończy się działającym kodem i zielonymi testami.>

1. <...>

## Strategia testów

- **pgTAP:** <reguły domenowe, przypadki brzegowe (zera, kwoty ujemne, przekroczenie puli, zaokrąglenia), testy RLS (członek budżetu A vs budżet B, osoba niezalogowana)>
- **Vitest:** <formatowanie, mapowanie danych, hooki>
- **E2E:** <kluczowe ścieżki użytkownika albo „nie dotyczy”>

## Ryzyka i otwarte pytania

- <...>

## Podsumowanie realizacji

<Wypełniane po zakończeniu: co zrealizowano, odstępstwa od specyfikacji, jak zweryfikowano, linki do logów przebiegów, commitów i wniosków.>

## Powód archiwizacji

<Wypełniane tylko przy archiwizacji: dlaczego porzucono lub zastąpiono, link do specyfikacji zastępującej.>
