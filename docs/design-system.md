# Design system Koperty – skrót dla agentów

Agent budujący ekran czyta ten plik jako pierwszy. Pełna dokumentacja ze stanami i przykładami jest w Storybooku (`vp -C packages/ui run storybook`, sekcja „Design system → Zacznij tutaj”). Pakiet: `packages/ui` (`@koperty/ui`), decyzja: [ADR 0012](adr/0012-design-system-package-storybook.md). Źródła reguł (C1, K3, P4…): `packages/ui/brief.md` i `packages/ui/tokeny.md`.

## Charakter produktu

Koperty to narzędzie do pilnowania pieniędzy domu, a nie rozrywka: **precyzyjny, zwarty, „księgowy”** (C1). Dużo informacji na ekranie, czytelna hierarchia, liczby wyrównane jak w księdze. Nie ocenia i nie straszy – debet to stan do uporządkowania (AC4). Nie jest krzykliwym fintechem (AC1), grywalizacją (AC2) ani surowym arkuszem (AC3).

## Jak zbudować ekran

1. Znajdź wzorzec albo ekran epiku (sekcje Wzorce i Ekrany w Storybooku; tabele niżej).
2. Wybierz komponenty według „Jeśli… to użyj…” – najpierw widoki i komponenty produktu, potem bazowe.
3. Tylko klasy tokenów znaczeniowych (tabele niżej). Paleta, skala odstępów i arbitralne wartości Tailwinda są wyłączone; `vp run check:tokens` musi przejść.
4. Zaprojektuj stany danych: ładowanie, pusto (brak wyników vs „jeszcze nic tu nie ma”), błąd, częściowe dane, dużo danych, długie teksty; w formularzu także oczekiwanie, błąd pola, błąd serwera i brak sieci (`useFormSubmit`).
5. Sprawdź „Czego unikać” i ekran przy 320 px w obu motywach. Ekran ma jeden `h1`; listy z nagłówkami `h3` stoją pod `h2`.

Reguły domenowe zostają w bazie (RPC); komponenty tylko pokazują wynik. Kwoty w groszach (`parsePLN`, `formatPLN` z `@koperty/ui/lib/money`), daty `RRRR-MM-DD` (`todayInWarsaw`, `formatDate`, `formatMonth`, `addMonths` z `@koperty/ui/lib/dates`).

## Komponenty

Style: w aplikacji `@import "@koperty/ui/styles.css";` (jest w `apps/web/src/index.css`). Każda pozycja ma w Storybooku stronę z 13 sekcjami.

### Komponenty bazowe

| Komponent             | Import                                                                                                                                                                                                                            | Kiedy                                                                                            | Kiedy nie                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Akcja tekstowa i link | `import { Button } from "@koperty/ui/primitives/button"`                                                                                                                                                                          | „Wyślij nowy kod” na ekranie logowania                                                           | Główna czynność formularza – zamiast tego: przycisk `primary`                                                                                    |
| Alert                 | `import { Alert, AlertDescription, AlertTitle } from "@koperty/ui/primitives/alert"`                                                                                                                                              | Powód wejścia na logowanie (wygasły link, wygasła sesja); akcją jest formularz pod spodem        | Błąd jednego pola – zamiast tego: błąd w `FormField`                                                                                             |
| Awatar                | `import { Avatar } from "@koperty/ui/primitives/avatar"`                                                                                                                                                                          | Lista członków budżetu                                                                           | Bez nazwy osoby obok – zamiast tego: nazwa osoby (awatar jest dekoracją)                                                                         |
| Dialog potwierdzenia  | `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@koperty/ui/primitives/alert-dialog"` | Usunięcie wydatku lub przychodu                                                                  | Operacja odwracalna (archiwizacja koperty – można przywrócić) – zamiast tego: wykonaj od razu, bez pytania                                       |
| Dialog                | `import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@koperty/ui/primitives/dialog"`                                                                   | Zmiana nazwy koperty                                                                             | Potwierdzenie operacji nieodwracalnej – zamiast tego: dialog potwierdzenia                                                                       |
| Karta                 | `import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@koperty/ui/primitives/card"`                                                                                                             | Pula „Do rozdysponowania” na widoku kopert                                                       | Długa lista operacji – zamiast tego: lista operacji                                                                                              |
| Menu                  | `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@koperty/ui/primitives/dropdown-menu"`        | Akcje koperty: zmień nazwę, zarchiwizuj, przesuń                                                 | Jedna lub dwie akcje – zamiast tego: przyciski widoczne w wierszu                                                                                |
| Podpowiedź            | `import { Tooltip, TooltipContent, TooltipTrigger } from "@koperty/ui/primitives/tooltip"`                                                                                                                                        | Przyciski ikonowe w wierszach: „Zmień nazwę koperty”, „Usuń wydatek”, „Więcej akcji: Jedzenie”   | Informacja potrzebna do działania (format kwoty, powód blokady) – zamiast tego: podpowiedź pola (`hint`) albo tekst obok przycisku               |
| Pole formularza       | `import { FieldGroup, FormField } from "@koperty/ui/primitives/field"`                                                                                                                                                            | Każde pole formularza: etykieta, podpowiedź i błąd w jednym miejscu                              | Pojedynczy przycisk bez wartości – zamiast tego: Przycisk                                                                                        |
| Pole tekstowe         | `import { Input } from "@koperty/ui/primitives/input"`                                                                                                                                                                            | Adres e-mail przy logowaniu                                                                      | Wybór z istniejących kopert – zamiast tego: Select                                                                                               |
| Przełącznik           | `import { Switch } from "@koperty/ui/primitives/switch"`                                                                                                                                                                          | „Pokaż zarchiwizowane koperty” na liście kopert                                                  | Czynność (zapis, usunięcie, archiwizacja) – zamiast tego: Przycisk                                                                               |
| Przycisk              | `import { Button } from "@koperty/ui/primitives/button"`                                                                                                                                                                          | Wysłanie formularza: „Zapisz wydatek”, „Wyślij kod”, „Utwórz budżet”                             | Przejście na inny ekran (adres się zmienia) – zamiast tego: link: `Button asChild` z `<a>` albo linkiem routera – strona „Akcja tekstowa i link” |
| Pusty stan            | `import { EmptyState } from "@koperty/ui/primitives/empty"`                                                                                                                                                                       | Nowy budżet bez kopert                                                                           | Dane się wczytują – zamiast tego: szkielet ładowania                                                                                             |
| Select                | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@koperty/ui/primitives/select"`                                                                                                                   | Koperta wydatku (jedna koperta)                                                                  | Więcej niż około 15 pozycji albo potrzeba wyszukiwania – zamiast tego: pole z wyszukiwaniem (brak w planie, strona „Czego brakuje”)              |
| Stan błędu            | `import { ErrorState } from "@koperty/ui/primitives/empty"`                                                                                                                                                                       | Błąd wczytania widoku kopert, listy operacji, podsumowania                                       | Błąd jednego pola formularza – zamiast tego: błąd w `FormField`                                                                                  |
| Szkielet ładowania    | `import { Skeleton } from "@koperty/ui/primitives/skeleton"`                                                                                                                                                                      | Pierwsze wczytanie widoku kopert i puli                                                          | Wysyłanie formularza, zapis – zamiast tego: przycisk z `loading`                                                                                 |
| Tabela                | `import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@koperty/ui/primitives/table"`                                                                                         | Podsumowanie miesiąca: saldo na początek, przydział, wydatki, saldo na koniec dla każdej koperty | Lista operacji (różne pola, akcje w wierszu, czytanie na telefonie) – zamiast tego: lista z wierszami operacji                                   |
| Toast                 | `import { Toaster, showToast } from "@koperty/ui/primitives/toast"`                                                                                                                                                               | Skopiowanie linku zaproszenia                                                                    | Błąd, który wymaga działania – zamiast tego: błąd pola, alert albo stan błędu – `showToast` nie ma wariantu błędu                                |
| Wskaźnik ładowania    | `import { Spinner } from "@koperty/ui/primitives/spinner"`                                                                                                                                                                        | W przycisku podczas zapisu („Zapisywanie…”) – przycisk sam go dodaje przy `loading`              | Wczytywanie listy lub kart – zamiast tego: szkielet ładowania                                                                                    |
| Zakładki              | `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@koperty/ui/primitives/tabs"`                                                                                                                                          | Ustawienia budżetu: „Członkowie” i „Zaproszenia”                                                 | Główna nawigacja aplikacji (koperty, operacje, podsumowanie) – zamiast tego: linki do osobnych stron (każda ma własny adres)                     |
| Znacznik              | `import { Badge } from "@koperty/ui/primitives/badge"`                                                                                                                                                                            | Rola członka budżetu                                                                             | Komunikat, który wymaga działania – zamiast tego: alert                                                                                          |

### Komponenty produktu

| Komponent                                       | Import                                                                                             | Kiedy                                                                                  | Kiedy nie                                                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Powłoka aplikacji (Konto)                       | `import { AppShell } from "@koperty/ui/product/account/app-shell"`                                 | Układ tras po zalogowaniu (`_authenticated`): nagłówek z nazwą użytkownika i „Wyloguj” | Ekran logowania i dołączania przed zalogowaniem – zamiast tego: sama karta na środku strony      |
| Karta dołączenia (Budżety i członkostwo)        | `import { JoinBudgetCard } from "@koperty/ui/product/budgets/join-budget-card"`                    | Ekran dołączania po otwarciu linku (także po zalogowaniu się z linku)                  | Osoba jest już członkiem – zamiast tego: przekierowanie do budżetu bez karty i bez zużycia linku |
| Panel linku zaproszenia (Budżety i członkostwo) | `import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel"`                  | Ustawienia budżetu, sekcja „Zaproszenia”                                               | Zaproszenie na konkretny e-mail – zamiast tego: brak w MVP                                       |
| Przełącznik budżetu (Budżety i członkostwo)     | `import { BudgetSwitcher } from "@koperty/ui/product/budgets/budget-switcher"`                     | Nagłówek powłoki aplikacji                                                             | Pierwszy budżet nowego konta – zamiast tego: formularz utworzenia budżetu na ekranie             |
| Wiersz członka (Budżety i członkostwo)          | `import { MemberRow } from "@koperty/ui/product/budgets/member-row"`                               | Lista członków w ustawieniach budżetu                                                  | Autor operacji – zamiast tego: wiersz operacji                                                   |
| Wiersz zaproszenia (Budżety i członkostwo)      | `import { InvitationRow } from "@koperty/ui/product/budgets/invitation-row"`                       | Lista aktywnych zaproszeń w ustawieniach budżetu                                       | Nowo wygenerowany link do skopiowania – zamiast tego: panel linku zaproszenia                    |
| Karta koperty (Koperty)                         | `import { EnvelopeCard, EnvelopeCardSkeleton } from "@koperty/ui/product/envelopes/envelope-card"` | Lista kopert na widoku głównym                                                         | Koperty w podsumowaniu miesiąca – zamiast tego: tabela podsumowania                              |
| Lista kopert (Koperty)                          | `import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list"`                       | Widok kopert po otwarciu aplikacji                                                     | Jedna koperta w innym kontekście – zamiast tego: karta koperty                                   |
| Kwota (Przychody i przydziały)                  | `import { Amount } from "@koperty/ui/product/funds/amount"`                                        | Saldo koperty, pula „Do rozdysponowania”                                               | Wpisywanie kwoty – zamiast tego: pole kwoty                                                      |
| Podsumowanie puli (Przychody i przydziały)      | `import { PoolSummary } from "@koperty/ui/product/funds/pool-summary"`                             | Góra widoku kopert, nad listą                                                          | Saldo koperty – zamiast tego: karta koperty                                                      |
| Pole kwoty (Przychody i przydziały)             | `import { AmountInput } from "@koperty/ui/product/funds/amount-input"`                             | Kwota przychodu                                                                        | Pokazanie kwoty – zamiast tego: kwota (`Amount`)                                                 |
| Przełącznik miesiąca (Przychody i przydziały)   | `import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher"`                         | Lista operacji miesiąca                                                                | Data jednej operacji – zamiast tego: pole daty (`Input type="date"`)                             |
| Edytor podziału (Wydatki)                       | `import { SplitEditor } from "@koperty/ui/product/expenses/split-editor"`                          | Formularz wydatku po włączeniu „Podziel wydatek na kilka kopert”                       | Wydatek na jedną kopertę – zamiast tego: select koperty w formularzu                             |
| Lista operacji (Wydatki)                        | `import { OperationList } from "@koperty/ui/product/expenses/operation-list"`                      | Ekran „Operacje” z przełącznikiem miesiąca                                             | Porównanie kopert w miesiącu – zamiast tego: tabela podsumowania                                 |
| Wiersz operacji (Wydatki)                       | `import { OperationRow } from "@koperty/ui/product/expenses/operation-row"`                        | Wiersz na liście operacji miesiąca                                                     | Pełne dane wydatku z częściami podziału – zamiast tego: widok szczegółów wydatku (wzorzec)       |
| Tabela podsumowania miesiąca (Przegląd budżetu) | `import { MonthSummaryTable } from "@koperty/ui/product/overview/month-summary-table"`             | Ekran „Podsumowanie” wybranego miesiąca                                                | Bieżące salda – zamiast tego: lista kopert                                                       |
| Komunikat braku sieci (Aplikacja na telefonie)  | `import { OfflineBanner } from "@koperty/ui/product/app/offline-banner"`                           | Raz w układzie ekranów po zalogowaniu                                                  | Nieudany zapis formularza – zamiast tego: komunikat formularza                                   |

### Wzorce i widoki

| Komponent                  | Import                                                                             | Kiedy                                                         | Kiedy nie                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Brak sieci i wygasła sesja | `import { OfflineBanner } from "@koperty/ui/product/app/offline-banner"`           | Utrata połączenia w trakcie pracy                             | Nieudany zapis formularza – zamiast tego: komunikat formularza (dane zostają)                     |
| Formularz nazwy            | `import { NameForm } from "@koperty/ui/patterns/name-form"`                        | Nowa koperta, zmiana nazwy koperty                            | Formularz z kilkoma polami – zamiast tego: `useFormSubmit`                                        |
| Formularz                  | `import { useFormSubmit } from "@koperty/ui/patterns/use-form-submit"`             | Każdy formularz zapisujący dane: przychód, przydział, wydatek | Pojedyncza akcja bez pól (usuń, archiwizuj) – zamiast tego: potwierdzenie usunięcia albo przycisk |
| Formularz przychodu        | `import { IncomeForm } from "@koperty/ui/views/funds/income-form"`                 | Nowy przychód i edycja przychodu                              | Przydział do koperty – zamiast tego: formularz przydziału                                         |
| Kwota ujemna i debet       | `import { AllocationForm } from "@koperty/ui/views/funds/allocation-form"`         | Przydział środków do koperty (także przyszły)                 | Kwota wydatku w liście – zamiast tego: kwota `kind="expense"` (bez minusa)                        |
| Lista z filtrem miesiąca   | `import { OperationsPanel } from "@koperty/ui/views/expenses/operations-panel"`    | Ekran „Operacje”                                              | Porównanie kopert w miesiącu – zamiast tego: tabela podsumowania                                  |
| Logowanie kodem            | `import { SignInForm } from "@koperty/ui/views/account/sign-in-form"`              | Ekran `/login`                                                | Zmiana nazwy wyświetlanej – zamiast tego: formularz (wzorzec Formularz)                           |
| Nawigacja po miesiącach    | `import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher"`         | Podsumowanie miesiąca                                         | Wybór daty wydatku – zamiast tego: pole daty                                                      |
| Pierwsze uruchomienie      | `import { CreateBudgetForm } from "@koperty/ui/views/budgets/create-budget-form"`  | Po pierwszym zalogowaniu, bez budżetów                        | Dołączenie do cudzego budżetu – zamiast tego: zaproszenie (karta dołączenia)                      |
| Podział wydatku            | `import { ExpenseForm } from "@koperty/ui/views/expenses/expense-form"`            | Nowy wydatek (osobna strona)                                  | Przychód – zamiast tego: formularz przychodu                                                      |
| Potwierdzenie usunięcia    | `import { ConfirmDeleteDialog } from "@koperty/ui/patterns/confirm-delete-dialog"` | Usunięcie przychodu, wydatku                                  | Archiwizacja koperty (odwracalna) – zamiast tego: akcja bez pytania + przywróć                    |
| Widok szczegółów           | `import { ExpenseDetails } from "@koperty/ui/views/expenses/expense-details"`      | Wydatek otwarty z listy operacji                              | Szybka edycja kwoty w liście – zamiast tego: formularz wydatku                                    |
| Zaproszenie                | `import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel"`  | Ustawienia budżetu: zaproszenia                               | Zmiana roli członka – zamiast tego: wiersz członka                                                |

Pomocnicze: `@koperty/ui/lib/online` (`useOnline`), `@koperty/ui/lib/split` (`splitEvenly`, `remainingToSplit`), `@koperty/ui/lib/utils` (`cn`). Wewnętrzny: `@koperty/ui/primitives/label` (część `FormField`).

## Tokeny znaczeniowe

Wartości są tylko w `packages/ui/src/tokens/tokens.css` (oba motywy przez `light-dark()`; motyw na `<html>`: klasa `light` albo `dark`, bez klasy – systemowy).

### Kolor

| Klasa                       | Token                    | Przeznaczenie                                  | Źródło          |
| --------------------------- | ------------------------ | ---------------------------------------------- | --------------- |
| `bg-surface-page`           | `surface-page`           | Tło strony                                     | R01             |
| `bg-surface-card`           | `surface-card`           | Tło karty i panelu                             | R01             |
| `bg-surface-muted`          | `surface-muted`          | Wyróżniony obszar, nagłówek tabeli             | R01             |
| `bg-surface-overlay`        | `surface-overlay`        | Dialog, menu, popover                          | R01             |
| `bg-surface-scrim`          | `surface-scrim`          | Przyciemnienie pod dialogiem, bez rozmycia     | K5              |
| `text-default`              | `text-default`           | Tekst i kwoty (bez koloru znaczeniowego)       | R01, W4         |
| `text-muted`                | `text-muted`             | Podpowiedzi, metadane                          | K2              |
| `text-link`                 | `text-link`              | Linki i akcje tekstowe                         | R01.2, K2       |
| `text-danger`               | `text-danger`            | Błąd pola, alert błędu                         | R01             |
| `text-on-action`            | `text-on-action`         | Tekst na przycisku głównym                     | R01             |
| `text-on-secondary`         | `text-on-secondary`      | Tekst na przycisku drugorzędnym                | R01             |
| `text-on-danger`            | `text-on-danger`         | Tekst na przycisku usuwania                    | K2              |
| `bg-action-primary`         | `action-primary`         | Przycisk główny                                | R01.2           |
| `bg-action-primary-hover`   | `action-primary-hover`   | Przycisk główny: najechanie                    | K2              |
| `bg-action-primary-pressed` | `action-primary-pressed` | Przycisk główny: wciśnięcie                    | K2              |
| `bg-action-secondary`       | `action-secondary`       | Przycisk drugorzędny                           | R01             |
| `bg-action-secondary-hover` | `action-secondary-hover` | Przycisk drugorzędny: najechanie               | K2              |
| `bg-action-danger`          | `action-danger`          | Przycisk usuwania (tylko w potwierdzeniu)      | R01             |
| `bg-action-danger-hover`    | `action-danger-hover`    | Przycisk usuwania: najechanie                  | K2              |
| `border-subtle`             | `border-subtle`          | Separatory, obramowanie karty                  | R01.3           |
| `border-control`            | `border-control`         | Granica pola, selecta, przełącznika            | K2, WCAG 1.4.11 |
| `border-invalid`            | `border-invalid`         | Granica pola z błędem (zawsze z tekstem błędu) | R01, WCAG 1.4.1 |
| `outline-focus`             | `focus-ring`             | Linia fokusu 2 px z odstępem 2 px              | W2, WCAG 2.4.7  |

### Typografia

| Klasa                 | Token              | Przeznaczenie                                            | Źródło |
| --------------------- | ------------------ | -------------------------------------------------------- | ------ |
| `text-page`           | `type-page`        | Nagłówek strony                                          | P3     |
| `text-section`        | `type-section`     | Nagłówek sekcji, tytuł dialogu                           | P3     |
| `text-body`           | `type-body`        | Tekst interfejsu i treść                                 | P3     |
| `text-label`          | `type-label`       | Etykieta pola, tekst przycisku                           | P3     |
| `text-input`          | `type-input`       | Tekst wpisywany w pole (16 px: iOS nie powiększa strony) | K1     |
| `text-meta`           | `type-meta`        | Data, autor, podpowiedź, znacznik                        | P3     |
| `text-amount`         | `type-amount`      | Kwota w wierszu (cyfry tabelaryczne)                     | P3, W3 |
| `text-amount-lg`      | `type-amount-lg`   | Kwota główna: pula, saldo w nagłówku                     | P3     |
| `font-mono text-body` | `font-family-mono` | Link zaproszenia                                         | P8     |

### Odstępy

| Klasa                | Token                  | Przeznaczenie                                    | Źródło    |
| -------------------- | ---------------------- | ------------------------------------------------ | --------- |
| `gap-inline`         | `space-inline`         | W elemencie: ikona–tekst, kwota–znacznik         | P4, R01.5 |
| `gap-group`          | `space-group`          | W grupie: etykieta–pole–podpowiedź               | P4        |
| `gap-between-groups` | `space-between-groups` | Między grupami: pola formularza, karty na liście | P4, R01.5 |
| `p-panel`            | `space-panel`          | Wnętrze karty i dialogu                          | P4, R01.5 |
| `p-panel-compact`    | `space-panel-compact`  | Wnętrze małej karty, wiersza listy               | P4, R01.5 |
| `gap-section`        | `space-section`        | Między sekcjami strony                           | P4        |

### Układ

| Klasa                | Token              | Przeznaczenie                                   | Źródło               |
| -------------------- | ------------------ | ----------------------------------------------- | -------------------- |
| `px-gutter`          | `page-gutter`      | Margines strony poniżej 768 px                  | P5                   |
| `md:px-gutter-wide`  | `page-gutter-wide` | Margines strony od 768 px                       | P5                   |
| `max-w-content`      | `content-max`      | Szerokość treści: formularze, listy             | P5                   |
| `max-w-content-wide` | `content-max-wide` | Szerokość tabeli podsumowania miesiąca          | P5                   |
| `max-w-measure`      | `measure-text`     | Długość linii tekstu ciągłego (około 65 znaków) | P3, polecenie budowy |

### Kształt i głębia

| Klasa             | Token            | Przeznaczenie                      | Źródło    |
| ----------------- | ---------------- | ---------------------------------- | --------- |
| `rounded-control` | `radius-control` | Przycisk, pole, znacznik           | R01.3, P1 |
| `rounded-card`    | `radius-card`    | Karta, alert, menu                 | R01.3     |
| `rounded-overlay` | `radius-overlay` | Dialog                             | R01.3     |
| `border`          | `border-width`   | Obramowania                        | R01.3     |
| `shadow-card`     | `shadow-card`    | Karta: zawsze razem z obramowaniem | W5, K4    |
| `shadow-overlay`  | `shadow-overlay` | Dialog, menu, toast                | W5        |

Kontrolki: `h-control` (40 px), `h-control-sm` (32 px, tylko akcje w wierszach), `px-control-x`; znacznik `h-badge`; ikony `size-icon`, `size-icon-standalone`.

## Jeśli… to użyj…

| Jeśli…                                                                                                     | to użyj…                                                                                                   |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| czynność na tym ekranie                                                                                    | `Button` (jeden `primary` na ekran)                                                                        |
| przejście w inne miejsce                                                                                   | `Button asChild` z linkiem routera                                                                         |
| mała czynność w tekście                                                                                    | `Button variant="link"`                                                                                    |
| akcja w wierszu, oczywista z ikony                                                                         | przycisk ikonowy z `aria-label` i `Tooltip`                                                                |
| trzy i więcej akcji obiektu                                                                                | `DropdownMenu`; jedna–dwie: widoczne przyciski                                                             |
| wybór z krótkiej listy (do ~15)                                                                            | `Select`                                                                                                   |
| ustawienie działające od razu                                                                              | `Switch`                                                                                                   |
| krótka czynność bez opuszczania ekranu                                                                     | `Dialog`                                                                                                   |
| operacja nieodwracalna                                                                                     | `ConfirmDeleteDialog` (pytanie z nazwą obiektu, przycisk z czasownikiem)                                   |
| formularz z kilkoma polami, częsty na telefonie                                                            | osobna strona                                                                                              |
| formularz                                                                                                  | `useFormSubmit` albo gotowy widok: `IncomeForm`, `ExpenseForm`, `AllocationForm`, `NameForm`, `SignInForm` |
| błąd jednego pola                                                                                          | `FormField error`                                                                                          |
| błąd formularza lub ekranu, wymaga działania                                                               | `Alert variant="danger"`                                                                                   |
| informacja o stanie                                                                                        | `Alert`                                                                                                    |
| sukces bez dalszego działania                                                                              | `showToast` – nigdy dla błędów                                                                             |
| treść się nie wczytała                                                                                     | `ErrorState` z „Spróbuj ponownie”                                                                          |
| pusto                                                                                                      | `EmptyState` z jednym krokiem; brak wyników filtra ≠ „jeszcze nic tu nie ma”                               |
| wczytywanie listy, karty, tabeli                                                                           | `Skeleton` w kształcie treści                                                                              |
| zapis po kliknięciu                                                                                        | `Button loading loadingText="Zapisywanie…"`                                                                |
| porównanie liczb wielu obiektów                                                                            | `Table` (wymagany `label`)                                                                                 |
| rekordy z akcjami na telefonie                                                                             | lista z wierszami (`OperationList`)                                                                        |
| kwota                                                                                                      | `Amount` (debet: minus i „Debet”); pole: `AmountInput`                                                     |
| miesiąc                                                                                                    | `MonthSwitcher`; miesiąc w adresie `?month=RRRR-MM`                                                        |
| brak sieci                                                                                                 | `OfflineBanner` raz w układzie                                                                             |
| element, którego nie ma (checkbox, radio, popover, pole z wyszukiwaniem, panel dolny, pole wielowierszowe) | nie dodawaj sam – strona „Czego brakuje” i pytanie do właściciela                                          |

## Czego unikać

- Wartości spoza tokenów: `#hex`, `oklch()`, `p-[13px]`, `text-red-500`, `dark:` → klasy tokenów.
- Kolor jako jedyny sygnał; czerwone kwoty przy debecie → minus i „Debet” (K3, W4).
- Gradienty, szkło i rozmycie (`backdrop-blur`), poświata, emoji zamiast ikon, iskierki, trzy identyczne karty z ikoną, pigułki (`rounded-full`) na znacznikach i przyciskach, karta w karcie, cień bez obramowania, wszystko wyśrodkowane.
- Wariant dodany przy okazji; `div` zamiast przycisku; placeholder zamiast etykiety; zablokowany przycisk bez wyjaśnienia; toast z błędem, który wymaga działania; podpowiedź z informacją niezbędną do działania.
- Reguły domenowe w komponentach, liczby zmiennoprzecinkowe dla kwot, pobieranie danych w `useEffect`, sukces przed odpowiedzią serwera.
- Odznaki, konfetti, wykrzykniki, żarty i emoji w treści (AC1, AC2); kody błędów w interfejsie.

## Treść w skrócie

Po polsku, w drugiej osobie, bez wykrzykników. Przyciski: czasownik i obiekt („Zapisz wydatek”, nigdy „OK”); akcja otwierająca dialog kończy się „…”. Błąd: co się stało i co zrobić, z przykładem („Podaj kwotę, np. 5000 albo 120,50.”). Pusty stan: dlaczego pusto i jeden krok. Kwoty przez `formatPLN` („1 250,00 zł”, „−30,00 zł”), daty bez godzin.

## Komendy

| Cel                          | Komenda                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Storybook lokalnie           | `vp -C packages/ui run storybook`                                                         |
| Build Storybooka             | `vp -C packages/ui run build-storybook`                                                   |
| Testy stories w obu motywach | `vp run test:storybook`                                                                   |
| Wartości spoza tokenów       | `vp run check:tokens`                                                                     |
| Nowy komponent shadcn        | `vp -C packages/ui dlx shadcn@latest add <komponent>`, potem strona „Jak zmieniać system” |

Nowy komponent musi mieć stories ze stanami, stronę z 13 sekcjami, wpis w `packages/ui/docs/blocks/catalog-data.tsx` i w tym pliku (sprawdza to `catalog.test.ts`).
