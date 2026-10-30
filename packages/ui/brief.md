# Brief stylu Koperty

**Status:** zatwierdzony (2026-10-29), razem z P1–P8. Wartości liczbowe są w [tokeny.md](tokeny.md). Ten plik i `tokeny.md` są materiałem źródłowym design systemu; każda reguła w dokumentacji Storybooka cytuje identyfikator stąd.

Oznaczenia: **C** charakter, **AC** antycharakter, **R** referencja, **K** rozstrzygnięty konflikt, **W** decyzja z warsztatu, **P** propozycja agenta (do Twojej decyzji), **DS-S** decyzja z PRD (lista w [POSTEP.md](POSTEP.md)).

## Charakter

Koperty to narzędzie do pilnowania pieniędzy domu, a nie rozrywka. Interfejs jest precyzyjny i zwarty: dużo informacji na ekranie, czytelna hierarchia, liczby wyrównane jak w księdze. Nie ocenia i nie straszy: debet to stan do uporządkowania, a nie alarm.

- **C1** Słowa charakteru: **precyzyjny, zwarty, „księgowy”**.
- **AC1** Nie jest krzykliwym fintechem: bez neonów, gradientów i animacji dla efektu.
- **AC2** Nie jest grywalizacją: bez odznak, konfetti i maskotek.
- **AC3** Nie jest surowym arkuszem: liczby mają hierarchię, a nie tylko siatkę.
- **AC4** Nie straszy: bez czerwieni i alarmów przy debecie.

## Referencje

| ID  | Referencja                                                                            | Bierzemy                                                                                                                             | Nie bierzemy (konflikt)                                                                                                                      |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| R01 | shadcn create, preset `b2CiCkMHw` (`radix-mira`, `emerald`, Oxanium, promień `small`) | R01.2 szmaragd jako kolor akcji na neutralnej bazie; R01.3 mały promień, obramowania; R01.4 Oxanium; gęstość list i odstępów (R01.5) | R01.1 wysokość kontrolek 28 px i tekst 12 px (K1); pary poniżej WCAG (K2); rozmycie tła dialogu (K5); znaczniki-pigułki z tekstem 10 px (K6) |

**R01.5 Odstępy w R01:** wnętrze karty 16 px (mała karta 12 px), dialog: wnętrze i odstęp między blokami 16 px, menu: wnętrze 4 px, pozycja 8 × 4 px, odstęp ikona–tekst 4 px.

Antyreferencje (A01…): nie podano. Antywzorce opisują AC1–AC4 i lista „Czego unikać” z polecenia budowy design systemu.

## Decyzje z warsztatu

| ID  | Decyzja                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------- |
| W1  | Kontrolki (przyciski, pola, select, pozycje menu) są większe niż w R01, na wszystkich szerokościach                       |
| W2  | Pary kolorów R01 poniżej progu WCAG poprawiamy, zmieniając tylko jasność w tych samych odcieniach; fokus jest szmaragdowy |
| W3  | Oxanium w całym interfejsie, także w nagłówkach (jak R01)                                                                 |
| W4  | Kwoty nie mają koloru znaczeniowego, ani dodatnie, ani ujemne. Ujemna kwota: znak minus i znacznik „Debet”                |
| W5  | Karty mają delikatny cień (oprócz obramowania); nakładki mają wyraźniejszy cień                                           |
| T1  | Ciemny motyw: domyślnie według systemu, z przełącznikiem w aplikacji                                                      |

## Rozstrzygnięte konflikty

| ID  | Konflikt                                                                                                                                                      | Rozstrzygnięcie                                                                                                                                  | Źródło                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| K1  | R01 ma kontrolki 28 px i tekst 12 px, a wydatek zapisuje się na telefonie w sklepie                                                                           | kontrolki 40 px, tekst pól 16 px (iOS Safari nie powiększa wtedy strony przy fokusie); zwartość dają odstępy i typografia, a nie małe kontrolki  | W1, DS-S04, C1                                |
| K2  | R01: obramowanie pola 1,26 : 1, fokus 2,59 : 1 (do tego przezroczystość 30%), szary tekst na szarym tle 4,34 : 1, szmaragdowy link w ciemnym motywie 2,61 : 1 | wartości z [tokeny.md](tokeny.md), wszystkie pary ≥ 4,5 : 1 (tekst) i ≥ 3 : 1 (elementy interfejsu); fokus jako pełna linia 2 px z odstępem 2 px | W2, WCAG 1.4.3, 1.4.11, 2.4.7                 |
| K3  | PRD: ujemne saldo „wyraźnie oznaczone”; AC4: nie straszyć                                                                                                     | bez koloru: znak minus i znacznik „Debet” obok kwoty, czytany przez czytnik ekranu                                                               | W4, DS-S03, WCAG 1.4.1                        |
| K4  | R01 oddziela treść obramowaniem (płasko), W5: cienie na kartach                                                                                               | karta ma zawsze obramowanie i dodatkowo delikatny cień; cień nigdy nie jest jedynym oddzieleniem                                                 | W5, R01.3                                     |
| K5  | R01: dialog rozmywa tło (`backdrop-blur-xs`)                                                                                                                  | półprzezroczyste tło bez rozmycia                                                                                                                | AC1, polecenie budowy („szkło i rozmycie”)    |
| K6  | R01: znacznik w kształcie pigułki z tekstem 10 px                                                                                                             | **P1** znacznik z promieniem kontrolki i tekstem 12 px                                                                                           | polecenie budowy („wszystko w pigułkach”), C1 |

## Propozycje agenta (zatwierdzone 2026-10-29)

Materiały nie określają tych wartości; zaproponowałem je z R01 i decyzji wyżej. Zatwierdzone razem z briefem; dokumentacja cytuje je jako P1–P8.

| ID  | Propozycja                                                                                                            | Wynika z                   |
| --- | --------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| P1  | Znacznik: promień kontrolki, tekst 12 px, wysokość 20 px                                                              | K6                         |
| P2  | Wysokość kontrolek 40 px; wariant mały 32 px tylko w wierszach list i tabel (akcje wiersza), z celem dotyku ≥ 24 px   | W1, WCAG 2.5.8             |
| P3  | Tekst interfejsu 14 px, tekst pól 16 px, metadane 12 px; skala nagłówków w `tokeny.md`                                | C1, K1                     |
| P4  | Odstępy: 4 / 8 / 16 / 16 / 32 px dla poziomów: w elemencie, w grupie, między grupami, wnętrze panelu, między sekcjami | R01.5                      |
| P5  | Szerokość treści 640 px (formularze, listy), 960 px dla tabeli podsumowania; marginesy strony 16 px, od 768 px 24 px  | DS-S02, C1                 |
| P6  | Ruch: 100 ms dla zmian koloru, 150 ms dla nakładek; przy `prefers-reduced-motion` bez przesunięć i powiększeń         | AC1, WCAG 2.3.3            |
| P7  | Kwoty dodatnie bez znaku plus, z wyjątkiem przychodu na liście operacji („+5000,00 zł”)                               | W4, US-20                  |
| P8  | Kod i link zaproszenia w kroju systemowym o stałej szerokości                                                         | Oxanium nie ma wersji mono |

## Fakty sprawdzone w materiałach

- Oxanium (`@fontsource-variable/oxanium` 5.3.0, OFL-1.1) ma wszystkie polskie znaki (ó w podzbiorze `latin`, pozostałe w `latin-ext`; oba podzbiory trzeba dołączyć) i domyślnie cyfry tabelaryczne: wszystkie cyfry mają szerokość 578 jednostek; cechy GSUB: `ccmp`, `pnum`. Kwoty wyrównują się w kolumnach bez dodatkowych ustawień; nie włączamy `pnum`.
- Oxanium nie ma kursywy ani wersji o stałej szerokości.
