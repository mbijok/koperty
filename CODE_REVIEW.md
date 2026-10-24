# Zasady przeglądu kodu

Reguły przeglądu PR w tym repozytorium, stosowane przez ludzi i automatycznie przez skill `om-code-review` (a więc też `om-auto-review-pr`). Ten plik nie powtarza reguł, tylko wskazuje, co i gdzie sprawdzać; źródłem są [AGENTS.md](AGENTS.md) i [docs/engineering-standards.md](docs/engineering-standards.md), a przy sprzeczności obowiązuje `AGENTS.md`. Proces (etykiety, bramka QA) opisuje [SDLC.md](SDLC.md), chronione kontrakty [BACKWARD_COMPATIBILITY.md](BACKWARD_COMPATIBILITY.md).

## Priorytety

1. **Poprawność reguł domenowych** – salda, pula, przydziały, podział wydatków, zaokrąglenia, wartości ujemne.
2. **Bezpieczeństwo i izolacja budżetów** – RLS, uprawnienia, `security definer`, sekrety.
3. **Kontrakty** – schemat bazy, sygnatury RPC, kody błędów.
4. **Zgodność z procesem** – zatwierdzona specyfikacja, testy, `.ai/`.
5. Czytelność i konwencje.

## Bramka walidacji

PR nie dostaje akceptacji, dopóki nie przechodzą komendy z `validation.commands` w `.ai/agentic.config.json` (te same co w CI).

## Co sprawdzać

| Obszar                          | Źródło reguł                                                                    | Najczęstsze uwagi                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Proces i zakres                 | `AGENTS.md`: „Sposób pracy”, „Katalog `.ai/`”, „Definition of Done”; szablon PR | brak specyfikacji `approved`, zmiana spoza specyfikacji, brak logu lub wniosków, nowa zależność bez zgody i ADR                           |
| Baza: schemat, RLS, uprawnienia | `AGENTS.md`: „Zasady architektoniczne”; standardy 3.3, 4.6, 4.7                 | tabela bez RLS, `budget_id` lub indeksu, polityka zapisu na tabeli, brak jawnego `grant`, uprawnienia dla `anon` lub `public`             |
| Baza: funkcje RPC               | standardy 4.7; `docs/architecture.md`: „Kontrakt błędów”                        | brak `set search_path = ''`, autoryzacji lub atomowości, błąd bez kodu z katalogu, SQLSTATE `40001`                                       |
| Kontrakty                       | `BACKWARD_COMPATIBILITY.md`                                                     | edycja zastosowanej migracji, zmiana łamiąca bez ADR, ręcznie edytowane typy                                                              |
| Frontend                        | standardy 4.1–4.5                                                               | logika domenowa w komponencie, `supabase` poza `features/*/api.ts`, pobieranie danych w `useEffect`, `any`, kwoty jako zmiennoprzecinkowe |
| Testy                           | `AGENTS.md`: „Testy”; standardy 4.8                                             | brak pgTAP dla reguły lub RLS (budżet A vs B, `member` vs `owner`, `anon`), pokrycie poniżej 100%, nowe wykluczenie bez zgody             |
| Bezpieczeństwo                  | standardy 3.3                                                                   | sekret lub `service_role` w kodzie, przekierowanie na adres zewnętrzny, niezwalidowane wejście                                            |

## Waga uwag

- **blocker** – złamana reguła domenowa, luka w RLS lub uprawnieniach, sekret w kodzie, zmiana łamiąca kontrakt bez ADR, edycja zastosowanej migracji, brak zatwierdzonej specyfikacji, czerwona bramka walidacji.
- **major** – brak testów dla nowej reguły lub ścieżki dostępu, pokrycie poniżej 100%, logika domenowa w kliencie, niezgodność ze specyfikacją.
- **minor** – konwencje nazewnictwa i struktury, czytelność, dokumentacja.
- **nit** – drobiazgi bez wpływu na zachowanie; nie blokują.

Akceptacja wymaga braku uwag `blocker` i `major`.
