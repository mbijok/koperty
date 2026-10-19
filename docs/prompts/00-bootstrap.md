# 00. Faza 0: fundamenty projektu

Zaczynamy projekt. Celem tej sesji nie jest implementacja funkcjonalności, tylko przygotowanie fundamentów pod pracę z agentami AI w całym cyklu wytwarzania: struktury pamięci projektu, wymagań, architektury, szkieletu repozytorium, kontroli jakości i planu pracy.

## Zasady tej sesji

- Najpierw przeczytaj `README.md` i `AGENTS.md`. Obowiązują Cię przez całą sesję.
- Pracujesz w etapach opisanych poniżej. Po każdym etapie zatrzymaj się, podsumuj, co zrobiłeś i jakie pliki zmieniłeś, i poczekaj na moją akceptację. Nie przechodź do kolejnego etapu bez niej.
- Gdy czegoś nie wiesz, pytaj. Nie wypełniaj luk założeniami. Jeśli musisz coś założyć, zapisz to wprost jako założenie do potwierdzenia.
- Nie implementuj funkcji domenowych (kopert, wydatków itp.), nawet w uproszczonej formie.
- Jeśli zauważysz sprzeczność między dokumentami albo między dokumentami a dokumentacją narzędzi, zgłoś ją.
- Od momentu utworzenia katalogu `.ai/` (etap 2) stosujesz zasady z sekcji „Katalog `.ai/`” w `AGENTS.md`: prowadzisz log tej sesji w `.ai/runs/` i zapisujesz wnioski w `.ai/lessons/` oraz `.ai/lessons.md`.

## Etap 1. Weryfikacja kontekstu

1. Przeczytaj `README.md`, `AGENTS.md` oraz plik specyficzny dla Twojego narzędzia, jeśli istnieje (np. `CLAUDE.md`).
2. Opisz własnymi słowami, jak rozumiesz produkt, architekturę i proces, w tym rolę katalogu `.ai/` (maksymalnie kilkanaście zdań).
3. Wypisz niejasności, sprzeczności i brakujące informacje, które mogą zablokować dalsze etapy.

**Punkt kontrolny:** czekam na Twoje podsumowanie i listę pytań.

## Etap 2. Struktura `.ai/`

1. Pobierz bieżącą datę z systemu (`date +%F`). Używaj jej we wszystkich nazwach plików tworzonych w `.ai/`.
2. Utwórz strukturę opisaną w `AGENTS.md`: `.ai/specs/` z podkatalogami `implemented/` i `archive/`, `.ai/runs/`, `.ai/lessons/` oraz plik `.ai/lessons.md`. W pustych katalogach umieść `.gitkeep`, żeby trafiły do repozytorium.
3. Utwórz wzorce:
   - `.ai/specs/_template.md`: nagłówek YAML (`title`, `status: draft`, `created`, `user_stories`, `adrs`, `runs`) oraz sekcje: cel, kontekst, zakres i poza zakresem, kryteria akceptacji (Given/When/Then), projekt rozwiązania (zmiany w bazie, funkcje RPC, polityki RLS, Edge Functions, interfejs), wsteczna zgodność, plan implementacji w krokach, strategia testów (pgTAP, Vitest, E2E), ryzyka i otwarte pytania, podsumowanie realizacji (wypełniane po zakończeniu) oraz powód archiwizacji (wypełniany tylko przy archiwizacji).
   - `.ai/runs/_template.md`: nagłówek YAML (`title`, `started`, `spec`, `status`) oraz sekcje: cel, plan, przebieg kroków (krok, komendy, wynik), decyzje i założenia, problemy, status końcowy, następne kroki.
   - `.ai/lessons/_template.md`: nagłówek YAML (`title`, `created`, `area`) oraz sekcje: kontekst, co się stało, przyczyna, wniosek, jak go stosować, powiązania.
4. Wypełnij `.ai/lessons.md` krótką instrukcją formatu wpisów i pustymi sekcjami obszarów (Baza i Supabase, Frontend, Vite+, Testy, Proces).
5. Załóż log tej sesji: `.ai/runs/<data>-project-bootstrap.md`. Uzupełnij go o etapy 1 i 2 i prowadź na bieżąco do końca sesji.

**Punkt kontrolny:** czekam na przegląd struktury i wzorców.

## Etap 3. PRD na podstawie wywiadu

1. Przeprowadź ze mną wywiad potrzebny do napisania PRD. Zadawaj pytania partiami, maksymalnie 5 naraz. Zacznij od sekcji „Otwarte decyzje” z `AGENTS.md`. Przy każdym pytaniu, gdzie to możliwe, zaproponuj 2–3 warianty z krótkimi konsekwencjami każdego.
2. Na podstawie odpowiedzi utwórz `docs/prd.md` z sekcjami:
   - problem i cel produktu,
   - użytkownicy i ich potrzeby,
   - zakres MVP: co jest w zakresie, a co wyraźnie poza nim,
   - reguły domenowe metody kopertowej (przydziały, salda, przesunięcia, koniec okresu, podział wydatku, zaokrąglenia),
   - user stories z kryteriami akceptacji w formacie Given/When/Then, z identyfikatorami (np. `US-01`),
   - wymagania niefunkcjonalne (bezpieczeństwo i izolacja danych, wydajność, dostępność, działanie na telefonie, prywatność),
   - metryki sukcesu,
   - ryzyka i otwarte pytania.
3. Po rozstrzygnięciu otwartych decyzji zaktualizuj odpowiednią sekcję w `AGENTS.md`.

**Punkt kontrolny:** czekam na mój przegląd PRD. Spodziewaj się poprawek.

## Etap 4. Architektura i decyzje

1. Utwórz `docs/architecture.md` zawierający:
   - diagram komponentów (Mermaid),
   - wstępny model danych jako diagram ER (Mermaid) z tabelami, kluczowymi kolumnami i relacjami,
   - strategię RLS: jak sprawdzane jest członkostwo w budżecie i jakie polityki dostanie każda tabela,
   - listę operacji realizowanych jako funkcje RPC (nazwa, wejście, wynik, reguły) wynikającą z PRD,
   - zasady wersjonowania i wstecznej zgodności API z myślą o przyszłej aplikacji iOS.
2. Utwórz `docs/adr/` z szablonem `0000-template.md` (kontekst, decyzja, konsekwencje, status) i spisz w formie ADR decyzje już podjęte:
   - `0001` React SPA na Vite+,
   - `0002` Supabase jako backend niezależny od klienta,
   - `0003` logika biznesowa w bazie (RPC) z myślą o natywnej aplikacji iOS,
   - `0004` kwoty jako liczby całkowite w groszach,
   - `0005` model wielu budżetów z członkostwem i izolacją przez RLS,
   - `0006` proces spec-driven development i katalog `.ai/` jako pamięć projektu,
   - `0007` Bun jako menedżer pakietów w połączeniu z Vite+.
3. Jeśli w trakcie pojawią się nowe decyzje, zaproponuj dla nich kolejne ADR.

**Punkt kontrolny:** czekam na akceptację architektury i ADR.

## Etap 5. Szkielet repozytorium

1. Przygotuj pozostałą strukturę katalogów opisaną w `README.md`.
2. Utwórz aplikację w `apps/web` przy użyciu Vite+ (React + TypeScript) z Bun jako menedżerem pakietów. Przed rozpoczęciem sprawdź w dokumentacji Vite+ aktualny sposób tworzenia projektu i wskazywania menedżera pakietów (`devEngines.packageManager`, `vp env pin`) i przedstaw mi go. Po instalacji upewnij się, że jedynym plikiem blokady jest `bun.lock`.
3. Dodaj Tailwind CSS, shadcn/ui, TanStack Router i TanStack Query w minimalnej konfiguracji: jedna przykładowa trasa, jeden przykładowy komponent shadcn, skonfigurowany `QueryClient`. Zanim zaczniesz, zaproponuj sposób konfiguracji routera (np. routing oparty na plikach) z krótkim uzasadnieniem.
4. Zainicjalizuj Supabase w katalogu głównym (`supabase init`), bez tworzenia tabel domenowych. Dodaj jeden przykładowy test pgTAP, który potwierdza, że infrastruktura testów działa.
5. Dodaj `.env.example` i klienta Supabase w aplikacji webowej czytającego konfigurację ze zmiennych środowiskowych. Plik `.gitignore` w katalogu głównym już istnieje: nie nadpisuj go, tylko uzupełnij, jeśli narzędzia wygenerują pliki, których jeszcze nie obejmuje. Upewnij się, że katalog `.ai/` nie jest ignorowany.
6. Dodaj jeden przykładowy test w Vitest.
7. Zweryfikuj, że `vp check`, `vp test`, `vp build` oraz `supabase test db` przechodzą.
8. Uzupełnij w `README.md` sekcję „Uruchomienie lokalne”, a w `AGENTS.md` tabelę komend o faktycznie działające polecenia.
9. Nieoczywiste problemy napotkane przy konfiguracji (np. różnice między Vite+ a klasycznym Vite) zapisz jako wnioski w `.ai/lessons/`.

**Punkt kontrolny:** czekam na podsumowanie i wyniki weryfikacji.

## Etap 6. Kontrola jakości i CI

1. Przygotuj workflow GitHub Actions uruchamiany dla pull requestów i gałęzi `master`: `vp check`, `vp test`, `vp build` dla aplikacji webowej. Sprawdź w dokumentacji Vite+ zalecany sposób instalacji `vp` w GitHub Actions i skonfiguruj instalację zależności przez Bun (z cache).
2. Oceń, czy już teraz uruchamiać w CI testy bazy (`supabase start` i `supabase test db`). Przedstaw rekomendację z uzasadnieniem i wdróż ją po mojej akceptacji.
3. Przygotuj prosty skrypt kontrolujący katalog `.ai/` i uruchamiaj go w CI. Ma sprawdzać co najmniej: zgodność nazw plików z formatem `YYYY-MM-DD-slug.md` (z wyjątkiem `_template.md` i `.gitkeep`), zgodność pola `status` z katalogiem (np. `implemented` tylko w `specs/implemented/`, `archived` tylko w `specs/archive/`) oraz to, czy każdy plik w `.ai/lessons/` jest podlinkowany w `.ai/lessons.md`.
4. Dodaj szablon pull requesta z checklistą zgodną z Definition of Done z `AGENTS.md`, w tym z pozycjami dotyczącymi specyfikacji, logu przebiegu i wniosków.
5. Zaproponuj, czy i jak sprawdzać zmiany przed commitem (np. konfiguracja `staged` w Vite+).

**Punkt kontrolny:** czekam na akceptację.

## Etap 7. Proces i plan pracy

1. Utwórz `docs/prompts/feature-workflow.md`: prompt wielokrotnego użytku, który prowadzi agenta przez realizację jednej funkcjonalności z punktami kontrolnymi:
   - przeczytanie `.ai/lessons.md`,
   - utworzenie specyfikacji w `.ai/specs/` i oczekiwanie na zatwierdzenie,
   - założenie logu przebiegu w `.ai/runs/` i ustawienie statusu specyfikacji na `in-progress`,
   - testy, implementacja i weryfikacja według `AGENTS.md`,
   - domknięcie: wnioski, podsumowanie w specyfikacji, przeniesienie jej do `.ai/specs/implemented/`, zamknięcie logu.
2. Utwórz `docs/backlog.md`: podziel MVP z PRD na małe zadania typu „vertical slice” (każde dostarcza działający kawałek od bazy po UI). Każde zadanie ma odwołanie do user story, kryteria ukończenia i zależności. Uporządkuj je w kolejności realizacji.
3. Zaproponuj pierwsze zadanie do realizacji, uzasadnij wybór i przygotuj dla niego specyfikację w `.ai/specs/` ze statusem `draft`.
4. Zamknij log tej sesji ze statusem końcowym i zapisz wnioski z całej fazy 0.

**Punkt kontrolny:** końcowe podsumowanie sesji: co powstało, jakie decyzje zapadły, co zostało otwarte.
