# Backlog MVP

Zadania typu „vertical slice”: każde dostarcza działający kawałek od bazy (migracja, RLS, RPC, testy pgTAP) po interfejs. Kolejność w tabeli jest kolejnością realizacji. Każde zadanie realizujemy według [docs/prompts/feature-workflow.md](prompts/feature-workflow.md), zaczynając od specyfikacji w `.ai/specs/`.

Wszystkie zadania mają wspólne kryteria ukończenia: Definition of Done z [AGENTS.md](../AGENTS.md) (`vp check`, `vp test --coverage` ze 100% pokrycia, `vp build`, `supabase test db`, testy RLS, typy wygenerowane, specyfikacja w `.ai/specs/implemented/`, log i wnioski). Poniżej wymieniono tylko kryteria specyficzne dla zadania.

| Kolejność | Zadanie                                         | User stories        | Zależy od  | Status               |
| --------- | ----------------------------------------------- | ------------------- | ---------- | -------------------- |
| 1         | S-01 Logowanie i profil                         | US-01, US-02, US-24 | –          | specyfikacja `draft` |
| 2         | S-02 Budżet: utworzenie i przełączanie          | US-04, US-05        | S-01       | –                    |
| 3         | T-01 Testy E2E (Playwright)                     | –                   | S-02       | –                    |
| 4         | S-03 Koperty: dodawanie, nazwa, kolejność       | US-11, US-12        | S-02       | –                    |
| 5         | S-04 Przychody i pula                           | US-14, US-15        | S-02       | –                    |
| 6         | S-05 Przydziały i salda kopert                  | US-16, US-21        | S-03, S-04 | –                    |
| 7         | S-06 Wydatek na jedną kopertę                   | US-17               | S-05       | –                    |
| 8         | S-07 Podział wydatku                            | US-18               | S-06       | –                    |
| 9         | S-08 Lista operacji, edycja i usuwanie wydatków | US-19, US-20        | S-06       | –                    |
| 10        | S-09 Podsumowanie miesiąca                      | US-22               | S-05, S-06 | –                    |
| 11        | S-10 Archiwizacja kopert                        | US-13               | S-05       | –                    |
| 12        | S-11 Zaproszenia                                | US-07, US-08        | S-02       | –                    |
| 13        | S-12 Członkowie i role                          | US-09, US-10        | S-11       | –                    |
| 14        | S-13 Zmiana nazwy i usunięcie budżetu           | US-06               | S-02       | –                    |
| 15        | S-14 Usunięcie konta                            | US-03               | S-12, S-13 | –                    |
| 16        | S-15 PWA                                        | US-23               | S-01       | –                    |
| 17        | T-02 Wdrożenie produkcyjne                      | –                   | S-15       | –                    |

Uzasadnienie kolejności: najpierw ścieżka, bez której nic nie działa (konto → budżet), potem rdzeń metody kopertowej w kolejności przepływu pieniędzy (koperty i przychody → przydziały → wydatki → przegląd), dalej współdzielenie budżetu i zarządzanie, a na końcu instalacja i wdrożenie. Po S-08 aplikacja nadaje się do codziennego użytku przez jedną osobę; po S-12 przez całe gospodarstwo.

## S-01 Logowanie i profil

**Zakres:** tabela `profiles` z triggerem tworzącym profil przy pierwszym logowaniu (nazwa = część e-maila przed `@`), RPC `update_profile`, RLS (własny profil), ekran logowania (e-mail → link lub kod OTP), ochrona tras dla zalogowanych, wylogowanie, edycja nazwy wyświetlanej.

**Kryteria ukończenia:**

- logowanie linkiem i kodem OTP działa lokalnie (wiadomości w Mailpit), wygasły lub użyty kod daje komunikat z możliwością ponownej wysyłki,
- niezalogowany użytkownik jest przekierowywany do logowania,
- testy pgTAP: profil tworzony przez trigger, użytkownik widzi tylko swój profil, `anon` nic, bezpośredni zapis do tabeli odrzucony, walidacja nazwy w `update_profile`,
- ustalone wzorce dla kolejnych zadań: klucze zapytań w jednym module, mapowanie kodów błędów RPC na komunikaty po polsku, typowany klient Supabase.

## S-02 Budżet: utworzenie i przełączanie

**Zakres:** typ `budget_role`, tabele `budgets` i `budget_members`, funkcje `private.is_budget_member` / `private.is_budget_owner`, RPC `create_budget`, RLS; rozszerzenie polityki `profiles` o osoby dzielące budżet; ekran tworzenia pierwszego budżetu, przełącznik budżetów, zapamiętanie ostatnio wybranego budżetu, układ aplikacji (nawigacja mobilna).

**Kryteria ukończenia:**

- użytkownik bez budżetu trafia na ekran tworzenia; twórca jest `owner`, pula 0 zł,
- testy RLS: członek budżetu A nie widzi budżetu B, `anon` nie ma dostępu, bezpośredni zapis odrzucony,
- test RLS `profiles`: członkowie wspólnego budżetu widzą swoje nazwy, pozostali nie.

## T-01 Testy E2E (Playwright)

**Zakres:** ADR dla konfiguracji Playwright z Vite+ i Bun (Playwright jest w stacku README, ale sposób uruchamiania z `vp` i w CI wymaga ustalenia), pierwszy test E2E: logowanie kodem OTP odczytanym z Mailpit i utworzenie budżetu; zadanie E2E w CI; uzupełnienie komendy w `AGENTS.md`.

**Kryteria ukończenia:** test przechodzi lokalnie i w CI na świeżej bazie; dane testowe tylko fikcyjne.

## S-03 Koperty: dodawanie, nazwa, kolejność

**Zakres:** tabela `envelopes` (unikalna nazwa wśród aktywnych, bez wielkości liter), RPC `create_envelope`, `rename_envelope`, `reorder_envelopes`; lista kopert (na razie bez sald), formularz dodawania i zmiany nazwy, zmiana kolejności.

**Kryteria ukończenia:** walidacje nazwy (pusta, duplikat bez względu na wielkość liter); `reorder_envelopes` odrzuca listę niezgodną z aktywnymi kopertami; testy RLS.

## S-04 Przychody i pula

**Zakres:** tabela `incomes`, RPC `create_income`, `update_income`, `delete_income`, `get_unallocated`; formularz przychodu (kwota w zł → grosze, data domyślnie dziś, opis), stan puli w nagłówku budżetu; moduł formatowania i parsowania kwot `pl-PL` z testami Vitest.

**Kryteria ukończenia:** kwota ≤ 0 odrzucona przez bazę; usunięcie przychodu może dać ujemną pulę, wyraźnie oznaczoną w UI; parsowanie kwot bez arytmetyki zmiennoprzecinkowej (testy: „1 234,56”, „0,01”, „12,345” → błąd).

## S-05 Przydziały i salda kopert

**Zakres:** tabela `allocations` (jeden przydział na kopertę i miesiąc, kwota ≥ 0), RPC `set_allocation`, `get_envelope_balances`; ekran główny z kopertami, saldami i pulą (US-21), przydział dla bieżącego i przyszłego miesiąca.

**Kryteria ukończenia:** przydział ponad pulę zapisany, pula ujemna oznaczona; przydział na przyszły miesiąc zmniejsza pulę od razu, a saldo koperty rośnie od tego miesiąca; testy salda na granicach miesięcy.

## S-06 Wydatek na jedną kopertę

**Zakres:** tabele `expenses` i `expense_splits` ze złożonymi kluczami obcymi i odroczonym triggerem sumy, RPC `create_expense` (na razie interfejs z jedną kopertą), szybki formularz wydatku na telefonie.

**Kryteria ukończenia:** saldo może zejść poniżej zera (oznaczone); kwota ≤ 0 i koperta z innego budżetu odrzucone; trigger sumy działa także przy bezpośrednim zapisie w teście.

## S-07 Podział wydatku

**Zakres:** formularz z wieloma częściami, podpowiedzi „po równo” i procentowa (reszta groszy do pierwszej części) jako funkcja frontendu z testami Vitest.

**Kryteria ukończenia:** suma ≠ kwota → nic nie zostaje zapisane; powtórzona koperta lub część 0 zł odrzucone; 100,00 zł na 3 → 33,34 / 33,33 / 33,33.

## S-08 Lista operacji, edycja i usuwanie wydatków

**Zakres:** RPC `update_expense`, `delete_expense`; lista przychodów i wydatków miesiąca z autorem (nazwa wyświetlana), przełączanie miesięcy, edycja i usuwanie (także przychodów z S-04).

**Kryteria ukończenia:** edycja podziału zastępuje części w całości i przelicza salda; usunięcie przywraca salda; autor usuniętego konta wyświetlany jako „Usunięty użytkownik”.

## S-09 Podsumowanie miesiąca

**Zakres:** RPC `get_month_summary`, `get_month_totals`; tabela per koperta (saldo początkowe, przydział, wydatki, saldo końcowe), sumy i pula.

**Kryteria ukończenia:** saldo początkowe M+1 = saldo końcowe M; koperty zarchiwizowane widoczne w miesiącach, w których były używane.

## S-10 Archiwizacja kopert

**Zakres:** RPC `archive_envelope`, `restore_envelope`; akcje w UI, widok kopert zarchiwizowanych.

**Kryteria ukończenia:** archiwizacja tylko przy saldzie 0 zł; brak przydziałów i wydatków do koperty zarchiwizowanej; przywrócenie sprawdza unikalność nazwy.

## S-11 Zaproszenia

**Zakres:** tabela `invitations` (hash tokenu), RPC `create_invitation`, `revoke_invitation`, `accept_invitation`; ekran zaproszeń właściciela (kopiowanie i udostępnianie linku), trasa przyjęcia zaproszenia z powrotem po zalogowaniu.

**Kryteria ukończenia:** token jednorazowy, ważny 7 dni, nieczytelny dla klientów (tylko hash w bazie); link wygasły, zużyty, unieważniony nie działa; obecny członek nie zużywa tokenu; `member` nie tworzy zaproszeń.

## S-12 Członkowie i role

**Zakres:** RPC `set_member_role`, `remove_member`, `leave_budget`; lista członków z rolami, akcje właściciela, opuszczenie budżetu.

**Kryteria ukończenia:** budżet zawsze ma co najmniej jednego właściciela (odebranie roli, usunięcie, opuszczenie); usunięty członek traci dostęp, jego wpisy zostają.

## S-13 Zmiana nazwy i usunięcie budżetu

**Zakres:** RPC `rename_budget`, `delete_budget`; ustawienia budżetu z potwierdzeniem usunięcia.

**Kryteria ukończenia:** tylko `owner`; usunięcie kaskadowo usuwa wszystkie dane budżetu (test).

## S-14 Usunięcie konta

**Zakres:** Edge Function `delete-account` (klucz `service_role` tylko po stronie serwera) z regułami [Z5]; ekran usuwania konta z potwierdzeniem.

**Kryteria ukończenia:** jedyny właściciel budżetu z innymi członkami – odmowa; budżety, w których był jedynym członkiem – usunięte; autorstwo wpisów zanonimizowane; testy funkcji i pgTAP dla skutków w bazie.

## S-15 PWA

**Zakres:** ADR dla wtyczki PWA (nowa zależność), manifest, ikony, service worker bez trybu offline, komunikat o braku połączenia.

**Kryteria ukończenia:** aplikacja instaluje się na Androidzie (Chrome) i iOS (Safari) i uruchamia w trybie pełnoekranowym; Lighthouse PWA bez błędów krytycznych.

## T-02 Wdrożenie produkcyjne

**Zakres:** projekt Supabase (Free) z migracjami z repozytorium, własny SMTP dla e-maili logowania, Cloudflare Pages z przekierowaniem SPA, adresy przekierowań w Supabase Auth, zmienne środowiskowe, opis procedury wdrożenia w README.

**Kryteria ukończenia:** logowanie i podstawowy przepływ działają na produkcji; podglądy PR na Cloudflare Pages; brak sekretów w repozytorium.
