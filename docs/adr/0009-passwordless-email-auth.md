# ADR 0009: Logowanie bez haseł (magic link i kod OTP)

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

MVP potrzebuje prostego i bezpiecznego logowania, które zadziała tak samo w aplikacji webowej (PWA) i w przyszłej aplikacji iOS. Rozważane warianty: e-mail z hasłem, e-mail bez hasła (magic link / kod OTP), dostawcy OAuth (Google). Dodanie logowania przez Google wymaga w aplikacji iOS także Sign in with Apple (wytyczne App Store), a więc płatnego konta Apple Developer i konfiguracji dwóch dostawców.

## Decyzja

Jedyną metodą logowania w MVP jest e-mail bez hasła przez Supabase Auth: użytkownik dostaje wiadomość z linkiem logowania i jednorazowym kodem OTP. Pierwsze logowanie zakłada konto (otwarta rejestracja). Nie przechowujemy haseł i nie używamy dostawców OAuth.

## Konsekwencje

**Pozytywne:**

- brak przechowywania, polityki i resetowania haseł,
- kod OTP działa także wtedy, gdy link otwiera się w innej przeglądarce niż PWA (np. na iOS),
- bez wymogu Sign in with Apple w MVP.

**Negatywne i ryzyka:**

- logowanie zależy od dostarczalności e-maili; wbudowany serwer pocztowy Supabase ma niskie limity – na produkcji potrzebny własny SMTP,
- każde logowanie wymaga przejścia do skrzynki pocztowej,
- dodanie OAuth w przyszłości wymaga nowego ADR (Google razem z Sign in with Apple).

**Wpływ na pracę agentów i kod:**

- szablon wiadomości Auth musi zawierać zarówno link, jak i kod OTP,
- adresy aplikacji (lokalny, podglądy, produkcja) muszą być na liście dozwolonych przekierowań Supabase Auth.
