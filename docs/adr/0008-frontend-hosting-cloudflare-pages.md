# ADR 0008: Hosting frontendu na Cloudflare Pages

- **Status:** zaakceptowany
- **Data:** 2026-10-19

## Kontekst

Aplikacja webowa jest statyczną SPA ([ADR 0001](0001-react-spa-on-vite-plus.md)), więc wystarcza hosting plików statycznych z obsługą przekierowań dla routingu po stronie klienta. Hosting ma być darmowy i dawać podglądy wdrożeń dla pull requestów. Rozważane warianty: Cloudflare Pages, Vercel, Netlify.

## Decyzja

Frontend hostujemy na Cloudflare Pages w darmowym planie. Build (`vp build`) produkuje statyczne pliki; wszystkie ścieżki są przekierowywane do `index.html`, żeby działał routing TanStack Router.

## Konsekwencje

**Pozytywne:**

- darmowy plan bez limitu transferu i bez zakazu użycia komercyjnego,
- podglądy wdrożeń dla gałęzi i PR, globalna sieć CDN.

**Negatywne i ryzyka:**

- limit liczby buildów w darmowym planie – w razie potrzeby build w GitHub Actions i wdrożenie gotowych plików,
- integracja Cloudflare z Vite+ i Bun nie jest jeszcze zweryfikowana (do sprawdzenia przy pierwszym wdrożeniu).

**Wpływ na pracę agentów i kod:**

- konfiguracja wdrożenia i zmienne środowiskowe frontendu (tylko publiczne: URL i klucz publiczny Supabase) opisane w `.env.example` i README przy zadaniu wdrożenia,
- adresy podglądów i produkcji trzeba dodać do dozwolonych adresów przekierowań w Supabase Auth.
