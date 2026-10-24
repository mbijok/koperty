# Backlog MVP

Backlog prowadzimy w GitHub Issues ([ADR 0010](adr/0010-agent-pipeline-under-project-rules.md)). Kolejność realizacji wyznacza zgłoszenie zbiorcze [Backlog MVP (#20)](https://github.com/mbijok/koperty/issues/20); zakres i kryteria ukończenia zadania są w jego zgłoszeniu. Ten plik opisuje zasady backlogu i stan na dzień przeniesienia (2026-10-24).

## Zasady

- Zadania są typu „vertical slice”: każde dostarcza działający kawałek od bazy (migracja, RLS, RPC, testy pgTAP) po interfejs.
- Każde zadanie realizujemy według [docs/prompts/feature-workflow.md](prompts/feature-workflow.md), zaczynając od specyfikacji w `.ai/specs/` z numerem zgłoszenia w polu `issue`. PR realizujący zadanie zamyka zgłoszenie („Zamyka #<numer>”).
- Wspólne kryteria ukończenia: Definition of Done z [AGENTS.md](../AGENTS.md). Zgłoszenie zawiera tylko kryteria specyficzne dla zadania.
- Nowe zadanie dodajemy tylko w zakresie PRD, jako zgłoszenie z identyfikatorem (`S-xx` funkcjonalność, `T-xx` zadanie techniczne) w tytule, i wpisujemy je na listę w zgłoszeniu zbiorczym.

## Zadania

| Kolejność | Zadanie                                         | Zgłoszenie                                         | User stories        | Zależy od  |
| --------- | ----------------------------------------------- | -------------------------------------------------- | ------------------- | ---------- |
| 1         | S-01 Logowanie i profil                         | [#3](https://github.com/mbijok/koperty/issues/3)   | US-01, US-02, US-24 | –          |
| 2         | S-02 Budżet: utworzenie i przełączanie          | [#4](https://github.com/mbijok/koperty/issues/4)   | US-04, US-05        | S-01       |
| 3         | T-01 Testy E2E (Playwright)                     | [#5](https://github.com/mbijok/koperty/issues/5)   | –                   | S-02       |
| 4         | S-03 Koperty: dodawanie, nazwa, kolejność       | [#6](https://github.com/mbijok/koperty/issues/6)   | US-11, US-12        | S-02       |
| 5         | S-04 Przychody i pula                           | [#7](https://github.com/mbijok/koperty/issues/7)   | US-14, US-15        | S-02       |
| 6         | S-05 Przydziały i salda kopert                  | [#8](https://github.com/mbijok/koperty/issues/8)   | US-16, US-21        | S-03, S-04 |
| 7         | S-06 Wydatek na jedną kopertę                   | [#9](https://github.com/mbijok/koperty/issues/9)   | US-17               | S-05       |
| 8         | S-07 Podział wydatku                            | [#10](https://github.com/mbijok/koperty/issues/10) | US-18               | S-06       |
| 9         | S-08 Lista operacji, edycja i usuwanie wydatków | [#11](https://github.com/mbijok/koperty/issues/11) | US-19, US-20        | S-06       |
| 10        | S-09 Podsumowanie miesiąca                      | [#12](https://github.com/mbijok/koperty/issues/12) | US-22               | S-05, S-06 |
| 11        | S-10 Archiwizacja kopert                        | [#13](https://github.com/mbijok/koperty/issues/13) | US-13               | S-05       |
| 12        | S-11 Zaproszenia                                | [#14](https://github.com/mbijok/koperty/issues/14) | US-07, US-08        | S-02       |
| 13        | S-12 Członkowie i role                          | [#15](https://github.com/mbijok/koperty/issues/15) | US-09, US-10        | S-11       |
| 14        | S-13 Zmiana nazwy i usunięcie budżetu           | [#16](https://github.com/mbijok/koperty/issues/16) | US-06               | S-02       |
| 15        | S-14 Usunięcie konta                            | [#17](https://github.com/mbijok/koperty/issues/17) | US-03               | S-12, S-13 |
| 16        | S-15 PWA                                        | [#18](https://github.com/mbijok/koperty/issues/18) | US-23               | S-01       |
| 17        | T-02 Wdrożenie produkcyjne                      | [#19](https://github.com/mbijok/koperty/issues/19) | –                   | S-15       |

Uzasadnienie kolejności: najpierw ścieżka, bez której nic nie działa (konto → budżet), potem rdzeń metody kopertowej w kolejności przepływu pieniędzy (koperty i przychody → przydziały → wydatki → przegląd), dalej współdzielenie budżetu i zarządzanie, a na końcu instalacja i wdrożenie. Po S-08 aplikacja nadaje się do codziennego użytku przez jedną osobę; po S-12 przez całe gospodarstwo.
