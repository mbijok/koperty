---
title: Nie traktuj kart jednej przeglądarki jako osobnych urządzeń – dzielą sesję Supabase
created: 2026-11-03
area: Baza i Supabase
---

# Karty jednej przeglądarki dzielą sesję Supabase

## Kontekst

Mapa ekranów prototypu S-01 (`prototypes/S-01/mapa-ekranow.md`), luka L02: jak w prototypie pokazać AC-5 („inne urządzenia pozostają zalogowane”).

## Co się stało

W mapie zaproponowałem drugą kartę przeglądarki jako zastępstwo drugiego urządzenia i właściciel produktu to przyjął. Dopiero przy zapisywaniu odpowiedzi wyszło, że to nieprawda: wylogowanie w jednej karcie wylogowuje też drugą (to stan z AC-6b, nie z AC-5).

## Przyczyna

Klient Supabase trzyma sesję w pamięci przeglądarki (`localStorage`), wspólnej dla wszystkich kart tego samego źródła, i rozsyła zdarzenia `onAuthStateChange` między kartami. `signOut({ scope: "local" })` kończy sesję tej przeglądarki, a nie jednej karty.

## Wniosek

Druga karta to ta sama sesja; „inne urządzenie” to inna przeglądarka, profil przeglądarki albo okno prywatne.

## Jak go stosować

- W prototypach, testach ręcznych i E2E (T-01) AC-5 sprawdzaj w osobnym kontekście przeglądarki (Playwright: nowy `browserContext`), a AC-6b w drugiej karcie tego samego kontekstu.
- Pisząc scenariusze o sesji, nazywaj wprost, czy chodzi o kartę, czy o urządzenie.

## Powiązania

- Specyfikacja: `.ai/specs/2026-10-19-email-login-profile.md` (AC-5, AC-6b)
- Log przebiegu: brak (praca koncepcyjna, bez przebiegu autonomicznego)
- Commit: brak
