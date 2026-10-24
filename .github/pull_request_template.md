## Co i dlaczego

<!-- Krótki opis zmiany i jej celu. -->

- Zgłoszenie: <!-- „Closes #<numer>” (angielskie słowo kluczowe GitHub zamyka zgłoszenie przy scaleniu) albo „nie dotyczy” -->
- Specyfikacja: <!-- .ai/specs/implemented/YYYY-MM-DD-slug.md albo „nie dotyczy” (literówka, formatowanie, dokumentacja) -->
- User stories: <!-- US-xx -->
- Log przebiegu: <!-- .ai/runs/YYYY-MM-DD-slug.md albo „nie dotyczy” -->
- ADR: <!-- docs/adr/NNNN-slug.md albo „brak” -->

## Jak zweryfikowano

<!-- Komendy i wyniki, scenariusze sprawdzone ręcznie. -->

## Definition of Done

**Jakość**

- [ ] `vp check`, `vp test --coverage` (100% pokrycia nowego i zmienionego kodu) i `vp build` przechodzą
- [ ] Zmiany w bazie: `vp exec supabase db reset` i `vp exec supabase test db` przechodzą, typy wygenerowane na nowo (albo: brak zmian w bazie)
- [ ] Nowa logika ma testy, w tym przypadki brzegowe (zera, kwoty ujemne, przekroczenie puli, zaokrąglenia) i testy dostępu (członek budżetu A vs B, `member` vs `owner`, osoba niezalogowana)
- [ ] Reguły domenowe są w bazie (RPC, ograniczenia), nie w komponentach React; zapis tylko przez RPC
- [ ] Kwoty w groszach (`bigint` / `number`), bez liczb zmiennoprzecinkowych; daty jako `date`
- [ ] Zmiana jest zgodna z `BACKWARD_COMPATIBILITY.md` albo ma ADR i plan migracji; zastosowane migracje i wygenerowane typy nie były edytowane
- [ ] Samokontrola według `CODE_REVIEW.md`

**Proces (`.ai/`)**

- [ ] Specyfikacja ma status `implemented`, uzupełnione podsumowanie realizacji i leży w `.ai/specs/implemented/`
- [ ] Log przebiegu w `.ai/runs/` jest kompletny i ma status końcowy
- [ ] Wnioski (naprawione błędy, korekty podejścia, nieoczywiste zachowania narzędzi) zapisane w `.ai/lessons/` i podlinkowane w `.ai/lessons.md`
- [ ] `vp run check:ai` przechodzi
- [ ] Etykiety według `SDLC.md`: kategoria, priorytet, ryzyko i `needs-qa` albo `skip-qa`

**Dokumentacja i bezpieczeństwo**

- [ ] PRD, architektura, ADR i `AGENTS.md` odzwierciedlają zmianę
- [ ] Brak sekretów, kluczy `service_role` / `secret` i prawdziwych danych osobowych lub finansowych; nowe zmienne opisane w `.env.example`
- [ ] Nowe zależności zaakceptowane (i opisane w ADR, jeśli spoza ustalonego stacku); jedynym plikiem blokady jest `bun.lock`

## Co zostało otwarte

<!-- Znane ograniczenia, zgłoszone problemy spoza zakresu, następne kroki. -->
