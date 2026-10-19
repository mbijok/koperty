# PRD: Koperty – MVP (web)

> **Status:** wersja robocza do przeglądu (faza 0). Słownik pojęć: [README.md](../README.md#słownik-domenowy). Pozycje oznaczone **[Z]** to założenia do potwierdzenia (zebrane w sekcji „Ryzyka i otwarte pytania”).

## 1. Problem i cel produktu

Gospodarstwa domowe, które chcą świadomie planować wydatki, często prowadzą budżet kopertowy w arkuszu kalkulacyjnym albo na kartce. Takie rozwiązania są niewygodne na telefonie, trudne do współdzielenia przez kilka osób i podatne na błędy w rachunkach.

Cel MVP: aplikacja webowa (instalowalna jako PWA), w której gospodarstwo domowe wspólnie prowadzi budżet metodą kopertową: rejestruje przychody, rozdziela je na koperty, zapisuje wydatki (także dzielone na kilka kopert) i w każdej chwili widzi, ile zostało w każdej kopercie i w puli do rozdysponowania.

## 2. Użytkownicy i ich potrzeby

Rejestracja jest otwarta: każda osoba z adresem e-mail może założyć konto. Docelowo użytkownikami są gospodarstwa domowe (para, rodzina); pierwszym użytkownikiem jest gospodarstwo autora projektu.

| Persona | Potrzeby |
|---|---|
| **Właściciel budżetu** (`owner`) – zakłada budżet i nim zarządza | szybko utworzyć budżet i koperty, zaprosić partnera/partnerkę, zarządzać członkami, kontrolować przydziały i stan puli |
| **Członek budżetu** (`member`) – współprowadzi budżet | szybko zapisać wydatek na telefonie (także w sklepie), sprawdzić, ile zostało w kopercie, zobaczyć podsumowanie miesiąca |
| **Osoba w kilku budżetach** | przełączać się między budżetami (np. budżet domowy i budżet wspólnego mieszkania) bez mieszania danych |

## 3. Zakres MVP

### W zakresie

- konta użytkowników: logowanie e-mailem (magic link / kod OTP), bez haseł; usunięcie konta,
- budżety: tworzenie, zmiana nazwy, usuwanie, przełączanie między budżetami,
- członkostwo i role `owner` / `member`, zaproszenia przez jednorazowy link,
- koperty: dodawanie, zmiana nazwy i kolejności, archiwizacja,
- przychody: dodawanie, edycja, usuwanie,
- przydziały środków z puli do kopert w danym miesiącu (także przyszłym),
- wydatki: na jedną kopertę lub z podziałem na kilka kopert; edycja i usuwanie,
- lista operacji miesiąca,
- widok kopert z bieżącymi saldami i stanem puli,
- podsumowanie miesiąca,
- instalacja jako PWA.

### Poza zakresem MVP

- przesunięcia między kopertami (`envelope_transfer`) – etap 2,
- zwrot niewykorzystanej reszty z koperty do puli na koniec miesiąca (opcja per koperta) – etap 2,
- wydatki cykliczne, wykresy, historia wielomiesięczna – etap 2,
- grupy kopert i kwoty docelowe kopert,
- rozpoznawanie paragonów i faktur (AI) – etap 3,
- natywna aplikacja iOS – etap 4 (backend projektujemy z myślą o niej już teraz),
- logowanie hasłem i przez dostawców OAuth (Google, Sign in with Apple),
- zaproszenia na konkretny adres e-mail i kody zaproszeń,
- tryb offline, wiele walut, import z banku, eksport danych,
- role inne niż `owner` / `member` (np. tylko do odczytu).

## 4. Reguły domenowe

Wszystkie reguły są wymuszane przez bazę danych (ograniczenia, funkcje RPC, RLS). Walidacja w interfejsie służy wyłącznie wygodzie.

### 4.1. Kwoty, waluta, daty

- Jedyną walutą jest PLN. Kwoty są liczbami całkowitymi w groszach.
- Kwota przychodu, wydatku i każdej części podziału jest **dodatnia** (> 0). Kwota przydziału jest **nieujemna** (≥ 0) **[Z1]**.
- Daty operacji to daty lokalne (bez godziny), strefa `Europe/Warsaw`.

### 4.2. Okres

- Okres to miesiąc kalendarzowy. Przychód i wydatek należą do miesiąca swojej daty, przydział jest przypisany do konkretnego miesiąca.
- Okresów nie trzeba „otwierać” ani „zamykać”: istnieją implicite.

### 4.3. Pula „do rozdysponowania”

- Pula = suma wszystkich przychodów budżetu − suma wszystkich przydziałów budżetu (niezależnie od miesiąca, także przydziałów na przyszłe miesiące) **[Z2]**.
- Pula **może być ujemna** (przydzielono więcej, niż wpłynęło). Interfejs wyraźnie to oznacza.

### 4.4. Przydziały

- Przydział to kwota przypisana kopercie w danym miesiącu. Dla pary (koperta, miesiąc) istnieje co najwyżej jeden przydział, którego kwotę można zmieniać; zmniejszenie przydziału zwraca różnicę do puli **[Z1]**.
- Przydział nie jest ograniczony stanem puli.
- Można przydzielać środki na przyszłe miesiące.
- Nie można przydzielać do koperty zarchiwizowanej.

### 4.5. Saldo koperty

- Saldo koperty na koniec miesiąca M = suma przydziałów koperty dla miesięcy ≤ M − suma części wydatków przypisanych do koperty z datą ≤ ostatni dzień M.
- Saldo jest zawsze wyliczane z historii operacji, nigdy nie jest przechowywane jako edytowalne pole.
- Na koniec miesiąca saldo **przechodzi w całości** na kolejny miesiąc (nie ma operacji zamknięcia okresu).
- Saldo **może być ujemne**. Interfejs wyraźnie to oznacza. Debet pokrywa się zwiększeniem przydziału.

### 4.6. Wydatki i podział

- Wydatek ma: kwotę, datę, opcjonalny opis, autora (ustawianego automatycznie) i co najmniej jedną część podziału.
- Część podziału wskazuje kopertę i kwotę. **Suma części musi równać się kwocie wydatku** (sprawdza baza). W ramach jednego wydatku każda koperta występuje co najwyżej raz.
- Baza nie wykonuje zaokrągleń. Interfejs może podpowiadać podział po równo lub procentowy; wtedy niepodzielna reszta groszy trafia do pierwszej części, a użytkownik zatwierdza konkretne kwoty.
- Zapis wydatku z podziałem jest atomowy (wydatek i wszystkie części zapisują się razem albo wcale).
- Nie można przypisać wydatku do koperty zarchiwizowanej. Wydatki już przypisane do koperty przed archiwizacją pozostają w historii.
- Każdy członek budżetu może edytować i usuwać wydatki (także cudze).

### 4.7. Przychody

- Przychód ma: kwotę, datę, opcjonalny opis i autora (ustawianego automatycznie). Zwiększa pulę.
- Każdy członek budżetu może edytować i usuwać przychody.

### 4.8. Koperty

- Koperta ma: nazwę (unikalną wśród niezarchiwizowanych kopert budżetu **[Z3]**), kolejność wyświetlania i znacznik archiwizacji.
- Kopert nie usuwa się, tylko archiwizuje, żeby zachować historię. Archiwizacja jest dozwolona tylko przy saldzie równym zero **[Z4]**.

### 4.9. Budżety, członkostwo, role

- Użytkownik może należeć do wielu budżetów. Twórca budżetu zostaje jego właścicielem (`owner`).
- Budżet może mieć wielu właścicieli; zawsze musi mieć co najmniej jednego.
- `owner`: wszystko, co `member`, a ponadto: zmiana nazwy i usunięcie budżetu, zaproszenia, usuwanie członków, nadawanie i odbieranie roli `owner`.
- `member`: pełne operacje na kopertach, przychodach, przydziałach i wydatkach; opuszczenie budżetu.
- Ostatni właściciel nie może opuścić budżetu ani odebrać sobie roli; może budżet usunąć.
- Usunięcie budżetu trwale usuwa wszystkie jego dane.

### 4.10. Zaproszenia

- Właściciel generuje link z jednorazowym, losowym tokenem, ważny 7 dni. Link można przekazać dowolnym kanałem.
- Zalogowana osoba, która otworzy ważny link, dołącza do budżetu jako `member`; token zostaje zużyty.
- Właściciel widzi aktywne zaproszenia i może je unieważnić.
- Link wygasły, zużyty lub unieważniony nie daje dostępu.

### 4.11. Konto

- Pierwsze logowanie nowym adresem e-mail zakłada konto.
- Użytkownik może usunąć konto. Jego wpisy we wspólnych budżetach pozostają, a autor jest anonimizowany. Szczegóły dla budżetów, w których jest jedynym właścicielem: **[Z5]**.

## 5. User stories

### Konto

**US-01. Logowanie e-mailem bez hasła**
Jako użytkownik chcę zalogować się adresem e-mail, żeby nie zapamiętywać hasła.

- **Given** osoba bez konta, **When** poda e-mail i użyje otrzymanego linku lub kodu, **Then** konto zostaje założone i osoba jest zalogowana.
- **Given** użytkownik z kontem, **When** poda e-mail i użyje linku lub kodu, **Then** jest zalogowany.
- **Given** wygasły lub już użyty link/kod, **When** użytkownik go użyje, **Then** logowanie się nie udaje i widzi komunikat z możliwością wysłania nowego.

**US-02. Wylogowanie**
Jako użytkownik chcę się wylogować, żeby nikt na moim urządzeniu nie miał dostępu do budżetu.

- **Given** zalogowany użytkownik, **When** wybierze „Wyloguj”, **Then** sesja zostaje zakończona, a próba wejścia do budżetu przekierowuje do logowania.

**US-03. Usunięcie konta**
Jako użytkownik chcę usunąć konto, żeby moje dane osobowe nie były dalej przetwarzane.

- **Given** użytkownik będący członkiem wspólnego budżetu, **When** usunie konto, **Then** traci dostęp, jego wpisy pozostają w budżecie, a jako autor wyświetla się „Usunięty użytkownik”.
- **Given** użytkownik, **When** rozpocznie usuwanie konta, **Then** musi je potwierdzić, a operacji nie da się cofnąć.
- Przypadek jedynego właściciela budżetu: zależny od **[Z5]**.

### Budżety i członkostwo

**US-04. Utworzenie budżetu**
Jako użytkownik chcę utworzyć budżet, żeby zacząć planować wydatki.

- **Given** zalogowany użytkownik bez budżetów, **When** po zalogowaniu poda nazwę budżetu, **Then** budżet powstaje, użytkownik jest jego właścicielem, a pula wynosi 0 zł.
- **Given** pusta nazwa, **When** użytkownik zatwierdzi formularz, **Then** budżet nie powstaje.

**US-05. Przełączanie budżetów**
Jako osoba w kilku budżetach chcę przełączać się między nimi, żeby prowadzić je osobno.

- **Given** użytkownik w budżetach A i B, **When** wybierze B, **Then** widzi wyłącznie dane budżetu B.
- **Given** użytkownik, **When** ponownie otworzy aplikację, **Then** widzi ostatnio wybrany budżet.

**US-06. Zmiana nazwy i usunięcie budżetu**
Jako właściciel chcę zmienić nazwę lub usunąć budżet.

- **Given** właściciel, **When** zmieni nazwę, **Then** nowa nazwa jest widoczna dla wszystkich członków.
- **Given** właściciel, **When** usunie budżet i potwierdzi operację, **Then** budżet i wszystkie jego dane znikają dla wszystkich członków.
- **Given** członek (`member`), **When** spróbuje zmienić nazwę lub usunąć budżet, **Then** operacja jest odrzucona.

**US-07. Zaproszenie przez link**
Jako właściciel chcę wygenerować link zaproszenia, żeby dodać osobę do budżetu.

- **Given** właściciel, **When** wygeneruje zaproszenie, **Then** otrzymuje link ważny 7 dni, który może skopiować lub udostępnić.
- **Given** członek (`member`), **When** spróbuje wygenerować zaproszenie, **Then** operacja jest odrzucona.
- **Given** właściciel z aktywnym zaproszeniem, **When** je unieważni, **Then** link przestaje działać.

**US-08. Dołączenie do budżetu**
Jako zaproszona osoba chcę dołączyć do budżetu przez link.

- **Given** ważny link, **When** zalogowana osoba go otworzy i potwierdzi, **Then** zostaje członkiem (`member`), a link jest zużyty.
- **Given** niezalogowana osoba z ważnym linkiem, **When** go otworzy, **Then** po zalogowaniu wraca do ekranu dołączania.
- **Given** link wygasły, zużyty lub unieważniony, **When** ktoś go otworzy, **Then** nie dołącza i widzi komunikat.
- **Given** osoba już będąca członkiem, **When** otworzy link, **Then** przechodzi do budżetu, a link nie zostaje zużyty.

**US-09. Zarządzanie członkami**
Jako właściciel chcę zarządzać członkami budżetu.

- **Given** właściciel, **When** otworzy listę członków, **Then** widzi wszystkich członków i ich role.
- **Given** właściciel, **When** usunie członka, **Then** ten traci dostęp do budżetu; jego wpisy pozostają.
- **Given** właściciel, **When** nada członkowi rolę `owner` lub ją odbierze, **Then** uprawnienia zmieniają się natychmiast.
- **Given** jedyny właściciel, **When** spróbuje odebrać sobie rolę, **Then** operacja jest odrzucona.

**US-10. Opuszczenie budżetu**
Jako członek chcę opuścić budżet, którego już nie współprowadzę.

- **Given** członek, **When** opuści budżet, **Then** traci do niego dostęp.
- **Given** jedyny właściciel, **When** spróbuje opuścić budżet, **Then** operacja jest odrzucona z informacją, że musi wskazać innego właściciela albo usunąć budżet.

### Koperty

**US-11. Dodanie koperty**
Jako członek chcę dodać kopertę, żeby przydzielać do niej środki.

- **Given** członek, **When** poda nazwę, **Then** koperta powstaje na końcu listy z saldem 0 zł.
- **Given** pusta nazwa albo nazwa istniejącej aktywnej koperty, **When** członek zatwierdzi, **Then** koperta nie powstaje **[Z3]**.

**US-12. Zmiana nazwy i kolejności kopert**
Jako członek chcę zmieniać nazwy i kolejność kopert.

- **Given** koperta, **When** członek zmieni jej nazwę, **Then** historia operacji pokazuje nową nazwę.
- **Given** lista kopert, **When** członek zmieni kolejność, **Then** nowa kolejność jest widoczna dla wszystkich członków.

**US-13. Archiwizacja koperty**
Jako członek chcę zarchiwizować niepotrzebną kopertę bez utraty historii.

- **Given** koperta z saldem 0 zł, **When** członek ją zarchiwizuje, **Then** znika z listy aktywnych, a jej historia pozostaje w podsumowaniach miesięcy, w których była używana.
- **Given** koperta z saldem różnym od 0 zł, **When** członek spróbuje ją zarchiwizować, **Then** operacja jest odrzucona **[Z4]**.
- **Given** zarchiwizowana koperta, **When** ktoś spróbuje przypisać do niej przydział lub wydatek, **Then** operacja jest odrzucona.
- **Given** zarchiwizowana koperta, **When** członek ją przywróci, **Then** wraca na listę aktywnych.

### Przychody i przydziały

**US-14. Dodanie przychodu**
Jako członek chcę zapisać przychód, żeby zwiększyć pulę do rozdysponowania.

- **Given** pula 0 zł, **When** członek zapisze przychód 5000,00 zł, **Then** pula wynosi 5000,00 zł.
- **Given** kwota 0 zł lub ujemna, **When** członek zatwierdzi, **Then** przychód nie zostaje zapisany.

**US-15. Edycja i usunięcie przychodu**
Jako członek chcę poprawić lub usunąć błędnie zapisany przychód.

- **Given** przychód 5000,00 zł i pula 5000,00 zł, **When** członek zmieni kwotę na 4000,00 zł, **Then** pula wynosi 4000,00 zł.
- **Given** przychód, **When** członek go usunie, **Then** pula zmniejsza się o jego kwotę (może stać się ujemna).

**US-16. Przydział środków do koperty**
Jako członek chcę przydzielić środki z puli do koperty w danym miesiącu.

- **Given** pula 5000,00 zł, **When** członek przydzieli 800,00 zł kopercie „Jedzenie” na bieżący miesiąc, **Then** pula wynosi 4200,00 zł, a saldo koperty rośnie o 800,00 zł.
- **Given** przydział 800,00 zł, **When** członek zmieni go na 600,00 zł, **Then** 200,00 zł wraca do puli.
- **Given** pula 100,00 zł, **When** członek przydzieli 300,00 zł, **Then** przydział zostaje zapisany, a pula wynosi −200,00 zł i jest wyraźnie oznaczona jako ujemna.
- **Given** przyszły miesiąc, **When** członek przydzieli do niego środki, **Then** pula zmniejsza się od razu, a saldo koperty rośnie od tego miesiąca.
- **Given** kwota ujemna, **When** członek zatwierdzi, **Then** przydział nie zostaje zapisany **[Z1]**.

### Wydatki

**US-17. Zapisanie wydatku**
Jako członek chcę szybko zapisać wydatek na telefonie, żeby saldo koperty było aktualne.

- **Given** koperta z saldem 300,00 zł, **When** członek zapisze wydatek 120,50 zł, **Then** saldo wynosi 179,50 zł, a autorem wydatku jest ten członek.
- **Given** koperta z saldem 50,00 zł, **When** członek zapisze wydatek 80,00 zł, **Then** wydatek zostaje zapisany, a saldo −30,00 zł jest wyraźnie oznaczone.
- **Given** kwota 0 zł lub ujemna, **When** członek zatwierdzi, **Then** wydatek nie zostaje zapisany.
- **Given** formularz wydatku, **When** członek go otwiera, **Then** data jest domyślnie ustawiona na dziś, a opis jest opcjonalny.

**US-18. Wydatek z podziałem na koperty**
Jako członek chcę podzielić jeden paragon na kilka kopert.

- **Given** wydatek 100,00 zł, **When** członek podzieli go na „Jedzenie” 70,00 zł i „Chemia” 30,00 zł, **Then** salda obu kopert maleją odpowiednio.
- **Given** wydatek 100,00 zł, **When** suma części wynosi 99,99 zł lub 100,01 zł, **Then** wydatek nie zostaje zapisany (ani wydatek, ani żadna część).
- **Given** wydatek 100,00 zł i podpowiedź „po równo” na 3 koperty, **When** członek ją wybierze, **Then** interfejs proponuje 33,34 zł, 33,33 zł i 33,33 zł.
- **Given** podział, **When** ta sama koperta występuje dwa razy albo któraś część ma kwotę 0 zł, **Then** wydatek nie zostaje zapisany.

**US-19. Edycja i usunięcie wydatku**
Jako członek chcę poprawić lub usunąć wydatek, także zapisany przez inną osobę.

- **Given** wydatek, **When** członek zmieni kwotę, datę, opis lub podział, **Then** salda kopert odpowiadają nowym danym, a reguły z US-17 i US-18 obowiązują.
- **Given** wydatek, **When** członek go usunie, **Then** salda kopert wracają do stanu sprzed wydatku.

**US-20. Lista operacji miesiąca**
Jako członek chcę zobaczyć przychody i wydatki z wybranego miesiąca, żeby je sprawdzić i poprawić.

- **Given** miesiąc z operacjami, **When** członek otworzy listę, **Then** widzi przychody i wydatki posortowane od najnowszych, z kwotą, datą, opisem, kopertami i autorem.
- **Given** lista, **When** członek przełączy miesiąc, **Then** widzi operacje wybranego miesiąca.

### Przegląd budżetu

**US-21. Widok kopert i puli**
Jako członek chcę od razu po otwarciu aplikacji widzieć, ile zostało w kopertach.

- **Given** budżet z kopertami, **When** członek otworzy aplikację, **Then** widzi aktywne koperty z bieżącym saldem i stan puli; wartości ujemne są wyraźnie oznaczone.
- **Given** nowy budżet bez kopert, **When** członek go otworzy, **Then** widzi zachętę do dodania pierwszej koperty i przychodu.

**US-22. Podsumowanie miesiąca**
Jako członek chcę zobaczyć podsumowanie wybranego miesiąca.

- **Given** miesiąc M, **When** członek otworzy podsumowanie, **Then** dla każdej koperty używanej w M widzi: saldo na początek M, przydział w M, wydatki w M i saldo na koniec M (saldo początkowe + przydział − wydatki = saldo końcowe).
- **Given** miesiąc M, **When** członek otworzy podsumowanie, **Then** widzi sumę przychodów w M, sumę przydziałów w M i stan puli; wartości ujemne są wyraźnie oznaczone.
- **Given** koperta z saldem dodatnim na koniec M, **When** członek otworzy podsumowanie M+1, **Then** saldo początkowe w M+1 jest równe saldu końcowemu z M.

### Aplikacja na telefonie

**US-23. Instalacja jako PWA**
Jako członek chcę zainstalować aplikację na ekranie głównym telefonu.

- **Given** przeglądarka mobilna wspierająca PWA, **When** użytkownik wybierze „Dodaj do ekranu głównego”, **Then** aplikacja uruchamia się w trybie pełnoekranowym z własną ikoną i nazwą.
- **Given** brak połączenia z internetem, **When** użytkownik otworzy aplikację, **Then** widzi czytelny komunikat o braku połączenia (bez trybu offline).

## 6. Wymagania niefunkcjonalne

- **Bezpieczeństwo i izolacja danych:** każda tabela z danymi budżetu jest chroniona przez RLS; członek budżetu A nie widzi ani nie modyfikuje danych budżetu B; osoba niezalogowana nie ma dostępu do żadnych danych. Klucz `service_role` nigdy nie trafia do klienta. Tokeny zaproszeń są losowe i jednorazowe.
- **Spójność danych:** operacje wieloetapowe są atomowe; reguły domenowe wymusza baza, niezależnie od klienta (web, przyszła aplikacja iOS).
- **Wydajność:** główny widok ładuje się w mniej niż 2 s na łączu 4G; zapis operacji trwa poniżej 500 ms.
- **Dostępność:** WCAG 2.1 AA (kontrast, obsługa klawiaturą, etykiety pól, czytelne komunikaty błędów).
- **Telefon:** projekt mobile first, pełna użyteczność od szerokości 360 px, instalacja jako PWA, bez trybu offline.
- **Prywatność (RODO):** możliwość usunięcia konta z anonimizacją autorstwa wpisów we wspólnych budżetach; w repozytorium i danych testowych brak prawdziwych danych osobowych i finansowych. Eksport danych poza MVP.
- **Lokalizacja:** interfejs po polsku, kwoty i daty w formacie `pl-PL`, waluta PLN.

## 7. Metryki sukcesu

Projekt nie zbiera metryk produktowych ani analityki użycia (decyzja). MVP uznajemy za ukończone, gdy wszystkie user stories z sekcji 5 spełniają kryteria akceptacji, potwierdzone testami (pgTAP, Vitest, E2E).

## 8. Ryzyka i otwarte pytania

### Założenia do potwierdzenia

- **[Z1]** Przydział to jedna edytowalna, nieujemna kwota dla pary (koperta, miesiąc), a nie lista dowolnych operacji (w tym ujemnych). Zmniejszenie przydziału zwraca środki do puli.
- **[Z2]** Pula liczona jest globalnie dla budżetu: wszystkie przychody − wszystkie przydziały, także na przyszłe miesiące (przychód z przyszłą datą też ją zwiększa).
- **[Z3]** Nazwa koperty jest unikalna wśród aktywnych kopert budżetu (bez rozróżniania wielkości liter).
- **[Z4]** Archiwizacja koperty wymaga salda 0 zł; zarchiwizowaną kopertę można przywrócić.
- **[Z5]** Usunięcie konta przez jedynego właściciela budżetu: jeśli budżet ma innych członków – operacja jest odrzucona do czasu wskazania innego właściciela; jeśli nie ma – budżet jest usuwany razem z kontem.

### Ryzyka

- **Limity darmowego planu Supabase** (np. wstrzymanie nieaktywnego projektu, limity wysyłki e-maili z linkami logowania) – może być potrzebny własny serwer SMTP.
- **Dostarczalność e-maili logowania** (spam, opóźnienia) – kluczowe, bo to jedyna metoda logowania; kod OTP jako alternatywa dla linku.
- **Ujemne salda i ujemna pula** mogą być mylące – wymagają czytelnej prezentacji i testów z użytkownikami.
- **Współbieżna edycja** tych samych danych przez kilku członków – w MVP obowiązuje „ostatni zapis wygrywa”, bez blokad.
- **Zgodność wsteczna API** z przyszłą aplikacją iOS – wymaga dyscypliny w migracjach od pierwszego dnia.
- **PWA na iOS** ma ograniczenia (np. instalacja wyłącznie przez Safari).

### Otwarte pytania

- Czy członkowie budżetu mają być powiadamiani o zmianach wprowadzonych przez innych (odświeżanie na żywo, powiadomienia)? Założenie MVP: nie, dane odświeżają się przy wejściu na ekran.
