# Kompleksowy Audyt SEO — zuzanna-czuprynska.pl

**Data audytu:** 2026-07-01  
**Audytor:** Analiza statyczna kodu (bez uruchamiania Lighthouse/PageSpeed Insights)  
**Platforma:** HTML + CSS + JavaScript, hosting Vercel (wcześniej Firebase Hosting)

---

## A. PODSUMOWANIE

### Ogólna ocena SEO: **51/100**

Strona posiada solidne fundamenty techniczne (HTTPS przez Vercel, clean URLs, robots.txt, sitemap.xml, Google Analytics + GTM) i przyzwoity zestaw meta tagów. Jednak szereg poważnych problemów technicznych i contentowych obniża jej rzeczywisty potencjał pozycjonowania.

### Największe problemy

1. **Ogromny rozmiar pliku `index.html`** — 362 KB / ~10 381 linii w jednym pliku HTML
2. **Wszystkie obrazy hostowane zewnętrznie na imgur.com** — brak kontroli, ryzyko zerwania linków, brak WebP
3. **Brak elementu `<main>` na stronie głównej** — poważny błąd semantyczny
4. **Błędne og:url i twitter:url na `sekretarz-sejmiku.html`** — wskazują na inną stronę
5. **Linki do `/fundacja` i `/rekrutacja` z rozszerzeniem `.html`** w nawigacji — niepotrzebne przekierowania 301
6. **Plik `Flyingbee.glb` (8,5 MB)** + biblioteki Three.js bez `defer`
7. **`sekretarz-sejmiku.html` nie jest w sitemap.xml**
8. **Przełącznik języka EN bez tagów `hreflang`** — ryzyko duplikacji

### Największe szanse wzrostu

- Dodanie `BreadcrumbList` w Schema.org dla artykułów (łatwa implementacja rich results)
- Optymalizacja LCP: przeniesienie obrazu hero na własny serwer + preload
- Uzupełnienie sitemap.xml o brakujące strony artykułowe
- Poprawa meta description strony głównej — sucha, bez CTA
- Dodanie `FAQPage` Schema na stronach fundacja i rekrutacja

### Ogólna ocena wpływu

- Indeksowanie nowych artykułów: **opóźnione** (brak w sitemap)
- LCP na stronie głównej: **prawdopodobnie > 4s** (8,5 MB GLB + imgur images)
- CTR: **średni** (tytuły kompetentne, meta descriptions do poprawy)
- Potencjał na rich results: **niezrealizowany** (brak BreadcrumbList, FAQPage)

---

## B. LISTA PROBLEMÓW

### PROBLEM 1 — Brak `<main>` na stronie głównej

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Semantyka HTML
- **Plik:** `public/index.html`
- **Opis:** Strona główna nie zawiera elementu `<main>`. Googlebot i czytniki ekranowe nie mogą zidentyfikować głównej treści. Pozostałe strony (o-mnie, fundacja itd.) posiadają `<main class="article-content">`, lecz index.html — nie.
- **Wpływ na SEO:** Degradacja sygnałów semantycznych, problem z dostępnością
- **Rekomendacja:** Owinąć wszystkie sekcje treści w `<main id="main-content">` po nawigacji, zamknąć przed `<footer>`
- **Automatyczna poprawka:** Tak

---

### PROBLEM 2 — Błędny og:url i twitter:url na sekretarz-sejmiku.html

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Open Graph / Canonicale
- **Plik:** `public/sekretarz-sejmiku.html`, linie 39–50
- **Opis:** Canonical wskazuje prawidłowo na `/sekretarz-sejmiku`, ale `og:url` i `twitter:url` wskazują na `/konferencja-energia-przyszlosci`. Błąd kopiowania szablonu.
- **Wpływ na SEO:** Błędne sygnały tożsamości przy udostępnianiu w social media
- **Rekomendacja:**
```html
<meta property="og:url" content="https://zuzanna-czuprynska.pl/sekretarz-sejmiku">
<meta name="twitter:url" content="https://zuzanna-czuprynska.pl/sekretarz-sejmiku">
```
- **Automatyczna poprawka:** Tak

---

### PROBLEM 3 — sekretarz-sejmiku brakuje w sitemap.xml

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Crawlability
- **Plik:** `public/sitemap.xml`
- **Opis:** Strona `sekretarz-sejmiku.html` istnieje i jest linkowana z index.html, ale brakuje jej w sitemap.xml.
- **Wpływ na SEO:** Opóźnione lub nieskuteczne indeksowanie
- **Rekomendacja:** Dodać wpis:
```xml
<url>
    <loc>https://zuzanna-czuprynska.pl/sekretarz-sejmiku</loc>
    <lastmod>2025-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
</url>
```
- **Automatyczna poprawka:** Tak

---

### PROBLEM 4 — Linki do fundacja.html i rekrutacja.html w nawigacji

- **Priorytet:** KRYTYCZNY
- **Kategoria:** URL / Linkowanie wewnętrzne
- **Plik:** Wszystkie HTML: `index.html` L7371-7372, `o-mnie.html` L5934-5935, `fundacja.html` L6313-6314, artykuły, polityka-prywatnosci, sekretarz-sejmiku
- **Opis:** Dropdown nawigacyjny linkuje przez `fundacja.html` i `rekrutacja.html` zamiast `/fundacja` i `/rekrutacja`. Generuje niepotrzebne przekierowania 301 (cleanUrls: true). Footer używa poprawnych URL — niespójność.
- **Wpływ na SEO:** Straty link equity, niespójne sygnały dla Googlebota
- **Rekomendacja:** Zamienić wszystkie: `href="fundacja.html"` → `href="/fundacja"`, `href="rekrutacja.html"` → `href="/rekrutacja"`
- **Automatyczna poprawka:** Tak (find & replace)

---

### PROBLEM 5 — Flyingbee.glb (8,5 MB) + Three.js bez defer

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Wydajność / Core Web Vitals
- **Plik:** `public/index.html`, linie 9978–9979 i 10170+
- **Opis:** Dwa pliki Three.js ładowane bez `defer`. Plik `Flyingbee.glb` waży 8,5 MB — przy słabym łączu (mobilnym) może opóźniać ładowanie całej strony.
- **Wpływ na SEO:** Degradacja LCP, INP, TBT
- **Rekomendacja:**
  1. Dodać `defer` do obu tagów `<script src="...three...">` 
  2. Załadować model GLB przez IntersectionObserver (gdy sekcja wchodzi w viewport)
  3. Skompresować model GLB narzędziem `gltf-pipeline` lub Draco (cel: < 1 MB)
- **Automatyczna poprawka:** Częściowo (defer — tak; kompresja GLB — nie)

---

### PROBLEM 6 — Wszystkie obrazy hostowane na imgur.com

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Obrazy / Wydajność
- **Plik:** `public/index.html` (36 instancji), wszystkie podstrony
- **Opis:** Kluczowe zdjęcia (portrait hero, logo Beehouses, galeria) hostowane na `i.imgur.com`. Imgur nie gwarantuje SLA, nie obsługuje WebP/AVIF per-request, brak kontroli nagłówków cache. Jeden obraz pochodzi z `tapetuj.pl`, inny z sejmiku kujawsko-pomorskiego.
- **Wpływ na SEO:** Brak kontroli LCP image, ryzyko broken images
- **Rekomendacja:** Przenieść do `/public/images/` lub użyć Cloudflare Images / Vercel Image Optimization
- **Automatyczna poprawka:** Nie

---

### PROBLEM 7 — Brak preload dla obrazu LCP (hero)

- **Priorytet:** KRYTYCZNY
- **Kategoria:** Wydajność / LCP
- **Plik:** `public/index.html`, linia 7554
- **Opis:** Obraz hero ma `fetchpriority="high"` i `decoding="async"`, ale brakuje `<link rel="preload">` w `<head>`. Przeglądarka odkrywa ten obraz dopiero po sparsowaniu 362 KB HTML.
- **Wpływ na SEO:** LCP prawdopodobnie > 2.5s
- **Rekomendacja:**
```html
<link rel="preload" as="image" href="/images/hero-portrait.jpg" fetchpriority="high">
<link rel="preconnect" href="https://i.imgur.com">
```
- **Automatyczna poprawka:** Tak (po przeniesieniu obrazu na własny hosting)

---

### PROBLEM 8 — favicon.svg (480 KB) i favicon.png (360 KB)

- **Priorytet:** WYSOKI
- **Kategoria:** Wydajność
- **Plik:** `public/favicon.svg`, `public/favicon.png`
- **Opis:** Faviconа SVG waży 480 KB, PNG 360 KB — typowo powinny to być pliki < 2 KB (SVG) i < 5 KB (PNG).
- **Wpływ na SEO:** Zbędny transfer danych przy każdej wizycie
- **Rekomendacja:** Wygenerować prawidłowe favicony przez np. favicon.io lub realfavicongenerator.net
- **Automatyczna poprawka:** Nie

---

### PROBLEM 9 — Niespójność jobTitle w Schema.org

- **Priorytet:** WYSOKI
- **Kategoria:** Dane strukturalne
- **Plik:** `public/index.html`, linia 86
- **Opis:** `Person.jobTitle` = "Posłanka IX Kadencji Parlamentu Młodych RP", natomiast meta description mówi "Sekretarz Młodzieżowego Sejmiku Kujawsko-Pomorskiego". Niespójność może powodować odrzucenie rich results.
- **Wpływ na SEO:** Ryzyko błędów w Google Search Console
- **Rekomendacja:** Ujednolicić jobTitle po weryfikacji aktualnego stanowiska — zaktualizować we wszystkich miejscach
- **Automatyczna poprawka:** Nie (wymaga decyzji merytorycznej)

---

### PROBLEM 10 — Fałszywa SearchAction w WebSite schema

- **Priorytet:** WYSOKI
- **Kategoria:** Dane strukturalne
- **Plik:** `public/index.html`, linia 133–137
- **Opis:** Schema WebSite zawiera `potentialAction: SearchAction` z targetem `/?s={search_term_string}`. Strona nie posiada funkcji wyszukiwania. To fałszywe dane strukturalne niezgodne z wytycznymi Google.
- **Wpływ na SEO:** Ryzyko penalizacji za nieprawdziwe dane strukturalne
- **Rekomendacja:** Usunąć cały blok `"potentialAction": {...}` z WebSite schema
- **Automatyczna poprawka:** Tak

---

### PROBLEM 11 — Brak BreadcrumbList na stronach artykułowych

- **Priorytet:** WYSOKI
- **Kategoria:** Dane strukturalne / Rich Results
- **Plik:** 6 artykułów HTML (inicjatywa-brodnica..., konferencja-energia..., nowe-inicjatywy..., projekt-brodnica..., udzial-w-pracach..., warsztaty-pszczelarskie...)
- **Opis:** Breadcrumb wizualny w HTML istnieje, ale brak odpowiadającego `BreadcrumbList` w JSON-LD. Blokuje to wyświetlanie breadcrumbs w SERP.
- **Wpływ na SEO:** Niezrealizowany potencjał na rich results i wyższy CTR
- **Rekomendacja:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://zuzanna-czuprynska.pl/"},
    {"@type": "ListItem", "position": 2, "name": "Aktualności", "item": "https://zuzanna-czuprynska.pl/aktualnosci"},
    {"@type": "ListItem", "position": 3, "name": "[Tytuł artykułu]"}
  ]
}
</script>
```
- **Automatyczna poprawka:** Tak (skrypt generujący per-plik)

---

### PROBLEM 12 — form-mailer.js i Three.js bez defer

- **Priorytet:** WYSOKI
- **Kategoria:** Wydajność / JavaScript SEO
- **Plik:** `public/index.html`, linia 9367 (`form-mailer.js`), linie 9978–9979 (Three.js)
- **Opis:** `form-mailer.js` (24 KB) i skrypty Three.js (~600 KB z CDN) ładowane bez `defer`/`async`, blokując parser HTML. Jedynie `site-language.js` ma `defer`.
- **Wpływ na SEO:** Zwiększony TBT, degradacja INP
- **Rekomendacja:** Dodać `defer` do obu skryptów:
```html
<script src="form-mailer.js?v=resend-8" defer></script>
<script src="https://cdn.jsdelivr.net/.../three.min.js" defer></script>
```
- **Automatyczna poprawka:** Tak

---

### PROBLEM 13 — Brak og:image:alt na artykułach

- **Priorytet:** WYSOKI
- **Kategoria:** Open Graph
- **Plik:** `sekretarz-sejmiku.html`, `inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html` i inne
- **Opis:** Większość stron artykułowych nie posiada `og:image:alt`. Wymagane przez WCAG 2.1, zalecane przez Facebook/LinkedIn.
- **Wpływ na SEO:** Dostępność, jakość social sharing
- **Rekomendacja:** Dodać `<meta property="og:image:alt" content="Opis zdjęcia">` dla każdej strony
- **Automatyczna poprawka:** Tak

---

### PROBLEM 14 — Przełącznik języka EN bez hreflang; site-language.js 132 KB

- **Priorytet:** WYSOKI
- **Kategoria:** Internacjonalizacja / JavaScript SEO
- **Plik:** `public/site-language.js`, wszystkie HTML
- **Opis:** Tłumaczenie EN/PL realizowane przez JavaScript (132 KB słownik ładowany dla WSZYSTKICH). Googlebot widzi tylko wersję PL. Brak `hreflang`. Jeśli Google zindeksuje wersję EN, może traktować ją jako duplikat.
- **Wpływ na SEO:** Potencjalne duplikaty, blokowanie 132 KB JS
- **Rekomendacja:** Decyzja architektoniczna: (a) oddzielne pliki HTML per język z hreflang, lub (b) oznaczenie EN jako dekoracyjnego bez indeksowania. Niezależnie — plik site-language.js powinien być dzielony per-strona.
- **Automatyczna poprawka:** Nie

---

### PROBLEM 15 — insta-grid.png (1,8 MB) w katalogu public

- **Priorytet:** WYSOKI
- **Kategoria:** Obrazy / Wydajność
- **Plik:** `public/insta-grid.png`
- **Opis:** PNG 1,8 MB — potencjalnie nieużywany (Instagram grid ładowany przez JS z imgur). Weryfikacja wymagana.
- **Wpływ na SEO:** Niepotrzebny zasób w deploymencie
- **Rekomendacja:** Zweryfikować użycie i usunąć jeśli nieużywany; jeśli używany — przekonwertować do WebP
- **Automatyczna poprawka:** Nie

---

### PROBLEM 16 — Meta description strony głównej — niska jakość marketingowa

- **Priorytet:** ŚREDNI
- **Kategoria:** Meta tagi / CTR
- **Plik:** `public/index.html`, linia 29–30
- **Opis:** „Oficjalna strona internetowa..." — opis suchy, biurokratyczny, bez CTA, niespójny z tytułem „Głos nowego pokolenia w polityce".
- **Wpływ na SEO:** Niski CTR
- **Rekomendacja:** Przepisać na: „Zuzanna Czupryńska — Sekretarz Sejmiku Kujawsko-Pomorskiego, założycielka Beehouses Foundation i głos młodego pokolenia w polskiej polityce. Poznaj jej działania na rzecz ekologii."
- **Automatyczna poprawka:** Nie

---

### PROBLEM 17 — Tytuły podstron za długie (105–106 znaków)

- **Priorytet:** ŚREDNI
- **Kategoria:** Meta tagi
- **Plik:** `sekretarz-sejmiku.html` (106 znaków), `inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html` (105 znaków), inne przekraczające 80 znaków
- **Opis:** Sufiks „| Posłanka, Liderka i Założycielka Beehouses Foundation" (40+ znaków) pochłania cały limit tytułu. Tytuły > 60 znaków będą obcinane w SERP.
- **Wpływ na SEO:** Obcięty snippet w wynikach wyszukiwania
- **Rekomendacja:** Skrócić sufiks do `| Zuzanna Czupryńska`. Cel: < 60 znaków łącznie.
- **Automatyczna poprawka:** Nie

---

### PROBLEM 18 — Meta description sekretarz-sejmiku.html (299 znaków)

- **Priorytet:** ŚREDNI
- **Kategoria:** Meta tagi
- **Plik:** `public/sekretarz-sejmiku.html`, linia 24
- **Opis:** 299 znaków — ponad dwukrotnie więcej niż zalecane 155–160 znaków. Pisana w pierwszej osobie — nienaturalne jako snippet SERP.
- **Wpływ na SEO:** Obcięty snippet, zły CTR
- **Rekomendacja:** Skrócić do 150 znaków, pisać w trzeciej osobie
- **Automatyczna poprawka:** Nie

---

### PROBLEM 19 — Brak preconnect dla imgur i cdnjs

- **Priorytet:** ŚREDNI
- **Kategoria:** Wydajność / Resource Hints
- **Plik:** `public/index.html`, sekcja head
- **Opis:** Brakuje `preconnect` lub `dns-prefetch` dla `i.imgur.com`, `cdnjs.cloudflare.com`, `cdn.jsdelivr.net` — domen, z których pobierane są kluczowe zasoby.
- **Wpływ na SEO:** Wolniejszy TTFB dla zewnętrznych zasobów
- **Rekomendacja:**
```html
<link rel="preconnect" href="https://i.imgur.com">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
```
- **Automatyczna poprawka:** Tak

---

### PROBLEM 20 — Hierarchia nagłówków H1→H3→H4 bez H2

- **Priorytet:** ŚREDNI
- **Kategoria:** Semantyka
- **Plik:** `public/index.html`, linie 7580–7628 (sekcja hero)
- **Opis:** W sekcji hero używane są `<h3>` (Asystentka wiceministra, Parlamentarzystka, Fundatorka & prezes) bez nadrzędnego `<h2>`. `<h4>` pojawia się w sekcji Beehouses (L7565) bezpośrednio po H1 — pomijanie H2 i H3.
- **Wpływ na SEO:** Zamieszanie w hierarchii semantycznej
- **Rekomendacja:** Elementy `<h3>` w hero-ticker zamienić na `<span>` z klasą CSS.
- **Automatyczna poprawka:** Częściowo

---

### PROBLEM 21 — Font Awesome render-blocking z CDN

- **Priorytet:** ŚREDNI
- **Kategoria:** Wydajność / Fonty
- **Plik:** `public/index.html`, linia 176
- **Opis:** Font Awesome 6.4.0 ładowany synchronicznie z CDN (render-blocking CSS). Zawiera setki ikon, strona używa kilkunastu. Brak kontroli nad `font-display`.
- **Wpływ na SEO:** FOIT, blokowanie renderowania
- **Rekomendacja:** Użyć Font Awesome Kit z subsettingiem, lub zainstalować lokalnie, lub przejść na SVG sprites
- **Automatyczna poprawka:** Nie

---

### PROBLEM 22 — msapplication-config odwołuje się do nieistniejącego browserconfig.xml

- **Priorytet:** ŚREDNI
- **Kategoria:** Techniczne
- **Plik:** Wszystkie HTML: `index.html` L73, `inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html` L63, i inne
- **Opis:** `<meta name="msapplication-config" content="/browserconfig.xml">` wskazuje na nieistniejący plik — generuje błąd 404.
- **Wpływ na SEO:** 404 w logach serwera i ewentualnie Search Console
- **Rekomendacja:** Usunąć meta tag lub stworzyć minimalny `browserconfig.xml`
- **Automatyczna poprawka:** Tak (usunięcie tagu)

---

### PROBLEM 23 — Brak skip-link (przejdź do treści)

- **Priorytet:** ŚREDNI
- **Kategoria:** Dostępność
- **Plik:** Wszystkie pliki HTML
- **Opis:** Żadna strona nie posiada linku „Przejdź do treści" dla użytkowników klawiaturowych.
- **Wpływ na SEO:** Dostępność wpływa na E-E-A-T
- **Rekomendacja:**
```html
<a href="#main-content" class="skip-link">Przejdź do treści</a>
```
(widoczny tylko przy focusie — dodać CSS)
- **Automatyczna poprawka:** Tak

---

### PROBLEM 24 — Słabe i powtarzające się alt teksty

- **Priorytet:** ŚREDNI
- **Kategoria:** Obrazy / Dostępność
- **Plik:** `public/index.html`, linia 7919 i inne
- **Opis:** Alt "Zuzanna" dla zdjęcia timeline (L7919), "Akcja charytatywna", "Wystąpienie" — zbyt ogólnikowe. 10 zdjęć Instagram grid ma identyczny alt „Post z Instagrama Zuzanny Czupryńskiej" — duplicate content w alt.
- **Wpływ na SEO:** Image SEO, dostępność
- **Rekomendacja:** Unikalny, opisowy alt dla każdego obrazu (max 125 znaków)
- **Automatyczna poprawka:** Nie

---

### PROBLEM 25 — Logotyp w nawigacji — brak ogonka w alt

- **Priorytet:** NISKI
- **Kategoria:** Dostępność
- **Plik:** `public/index.html`, linia 7361
- **Opis:** Alt logotypu: "Zuzanna Maria Czuprynska" zamiast "Zuzanna Maria Czupryńska" (brak ogonka)
- **Wpływ na SEO:** Niski
- **Rekomendacja:** Ujednolicić do `alt="Logo — Zuzanna Maria Czupryńska"`
- **Automatyczna poprawka:** Tak

---

### PROBLEM 26 — Sekcja #harmonogram ukryta display:none — dead code

- **Priorytet:** NISKI
- **Kategoria:** Kod
- **Plik:** `public/index.html`, linia 7951
- **Opis:** Sekcja „Harmonogram Wydarzeń" z `display:none` — parsowana przez przeglądarkę, niewidoczna dla użytkownika.
- **Wpływ na SEO:** Niski (zbędny kod w DOM)
- **Rekomendacja:** Usunąć sekcję lub zachować jako HTML comment do czasu uruchomienia
- **Automatyczna poprawka:** Nie

---

### PROBLEM 27 — Skrypty .py w katalogu public/ — dostępne publicznie

- **Priorytet:** NISKI
- **Kategoria:** Bezpieczeństwo
- **Plik:** `public/fix_articles.py`, `public/fix_divs.py`, `public/inject_js.py`
- **Opis:** Przy konfiguracji Vercel `outputDirectory: "public"`, skrypty Python są serwowane publicznie pod adresami URL: `https://zuzanna-czuprynska.pl/fix_articles.py`
- **Wpływ na SEO:** Problem bezpieczeństwa, niepotrzebne zasoby w deploymencie
- **Rekomendacja:** Przenieść do katalogu poza `public/` (np. `/scripts/`)
- **Automatyczna poprawka:** Częściowo

---

### PROBLEM 28 — Brak FAQPage schema na fundacja i rekrutacja

- **Priorytet:** NISKI
- **Kategoria:** Dane strukturalne
- **Plik:** `public/rekrutacja.html`, `public/fundacja.html`
- **Opis:** Jeśli strony zawierają sekcje Q&A — brak FAQPage Schema.org blokuje rich results
- **Wpływ na SEO:** Niezrealizowany potencjał rich results
- **Rekomendacja:** Zweryfikować treść i dodać FAQPage Schema jeśli sekcja FAQ istnieje
- **Automatyczna poprawka:** Nie

---

### PROBLEM 29 — Brak ContactPage schema na kontakt.html

- **Priorytet:** NISKI
- **Kategoria:** Dane strukturalne
- **Plik:** `public/kontakt.html`
- **Opis:** Strona kontaktowa nie ma dedykowanego JSON-LD ContactPage
- **Rekomendacja:**
```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ContactPage","name":"Kontakt — Zuzanna Czupryńska","url":"https://zuzanna-czuprynska.pl/kontakt"}
</script>
```
- **Automatyczna poprawka:** Tak

---

### PROBLEM 30 — logotyp.webp 399 KB na logo 42px wysokości

- **Priorytet:** NISKI
- **Kategoria:** Obrazy / Wydajność
- **Plik:** `public/logotyp.webp`
- **Opis:** Logo 900×195px, 399 KB wyświetlane jako `max-height: 42px`. Logo powinno ważyć < 20 KB.
- **Rekomendacja:** Zoptymalizować logotyp.webp (zmniejszyć rozmiar do 200×43px, docelowa waga < 20 KB)
- **Automatyczna poprawka:** Nie

---

## C. TABELA PRIORYTETÓW

| Priorytet | Problem | Pliki | Wpływ | Trudność | Rekomendacja |
|-----------|---------|-------|-------|----------|--------------|
| KRYTYCZNY | Brak `<main>` na stronie głównej | `index.html` | Semantyka, indeksowanie | Łatwa | Dodaj `<main id="main-content">` |
| KRYTYCZNY | Błędny og:url / twitter:url na sekretarz-sejmiku | `sekretarz-sejmiku.html` L39–50 | Social crawl | Łatwa | Popraw URL |
| KRYTYCZNY | sekretarz-sejmiku brakuje w sitemap.xml | `sitemap.xml` | Indeksowanie | Łatwa | Dodaj wpis |
| KRYTYCZNY | Linki .html w nawigacji (fundacja, rekrutacja) | Wszystkie HTML | Link equity | Łatwa | Zmień na /fundacja, /rekrutacja |
| KRYTYCZNY | Flyingbee.glb 8,5 MB + Three.js bez defer | `index.html` L9978 | LCP, CWV | Średnia | defer + kompresja GLB |
| KRYTYCZNY | Wszystkie obrazy na imgur.com | Wszystkie HTML | LCP, ryzyko | Trudna | Przenieść na własny hosting |
| KRYTYCZNY | Brak preload dla obrazu LCP | `index.html` L7554 | LCP | Łatwa | Dodaj link preload |
| WYSOKI | favicon.svg/png 360–480 KB | `public/` | Wydajność | Łatwa | Rekompresja |
| WYSOKI | Niespójność jobTitle w Schema.org | `index.html` L86 | Rich results | Wymaga decyzji | Ujednolicić stanowisko |
| WYSOKI | Fałszywa SearchAction w WebSite schema | `index.html` L133 | Wiarygodność | Łatwa | Usunąć SearchAction |
| WYSOKI | Brak BreadcrumbList na artykułach | 6 artykułów | Rich results, CTR | Łatwa | Dodać JSON-LD |
| WYSOKI | form-mailer.js bez defer | `index.html` L9367 | TBT, INP | Łatwa | Dodaj defer |
| WYSOKI | Brak og:image:alt na artykułach | 4+ HTML | Dostępność, social | Łatwa | Dodać meta tag |
| WYSOKI | EN switch bez hreflang; site-language.js 132 KB | Wszystkie HTML | Duplikaty | Trudna | Decyzja architektoniczna |
| WYSOKI | insta-grid.png 1,8 MB | `public/` | Wydajność | Łatwa | Sprawdzić i usunąć/optymalizować |
| ŚREDNI | Meta description strony głównej — sucha | `index.html` L29 | CTR | Łatwa | Przepisać |
| ŚREDNI | Tytuły > 60 znaków | sekretarz, inicjatywa, inne | SERP snippet | Łatwa | Skrócić |
| ŚREDNI | Sekretarz-sejmiku: desc 299 znaków | `sekretarz-sejmiku.html` L24 | CTR | Łatwa | Skrócić |
| ŚREDNI | Brak preconnect dla imgur i cdnjs | `index.html` head | TTFB | Łatwa | Dodać preconnect |
| ŚREDNI | Hierarchia H1→H3 bez H2 w hero | `index.html` L7580–7628 | Semantyka | Łatwa | Zamienić h3 na span |
| ŚREDNI | Font Awesome render-blocking z CDN | Wszystkie HTML | TTFB | Średnia | Local/kit/subsetting |
| ŚREDNI | msapplication-config → brak browserconfig.xml | Wszystkie HTML L73 | 404 | Łatwa | Usunąć tag |
| ŚREDNI | Brak skip-link | Wszystkie HTML | Dostępność | Łatwa | Dodać skip link |
| ŚREDNI | Słabe/powtarzające się alt | `index.html` | Image SEO | Średnia | Przepisać |
| NISKI | Logo alt bez ogonka | `index.html` L7361 | Spójność | Łatwa | Poprawić |
| NISKI | Sekcja harmonogram display:none | `index.html` L7951 | Dead code | Łatwa | Usunąć |
| NISKI | Skrypty .py w public/ | `public/*.py` | Bezpieczeństwo | Łatwa | Przenieść poza public |
| NISKI | Brak FAQPage schema | fundacja, rekrutacja | Rich results | Średnia | Dodać jeśli FAQ obecne |
| NISKI | Brak ContactPage schema | `kontakt.html` | Schema | Łatwa | Dodać schema |
| NISKI | logotyp.webp 399 KB | `logotyp.webp` | Wydajność | Łatwa | Rekompresja |

---

## D. AUDYT KAŻDEJ PODSTRONY

### 1. index.html — Strona główna (https://zuzanna-czuprynska.pl/)

| Element | Wartość | Ocena |
|---------|---------|-------|
| Proponowany cel | Wizytówka osoby publicznej, budowanie marki | — |
| Główna fraza | „Zuzanna Czupryńska", „Beehouses Foundation", „młody polityk" | — |
| Title | „Zuzanna Czupryńska – Głos nowego pokolenia w polityce" (58 znaków) | ✅ |
| Meta description | „Oficjalna strona..." — sucha, bez CTA | ⚠️ |
| H1 | Istnieje (linia 7538), zawartość przez reveal animation | ✅/⚠️ |
| Brak `<main>` | Krytyczny błąd semantyczny | ❌ |

**Problemy z nagłówkami:** H1→H3→H4 bez H2; h3 jako dekoracyjne etykiety w hero ticker  
**Problemy z treścią:** Bogata treść; animacje scroll-reveal mogą opóźniać widoczność dla botów; ukryta sekcja harmonogram  
**Problemy techniczne:** Brak `<main>`, 8,5 MB GLB, imgur, brak preload, skrypty bez defer  
**Rekomendowane linkowanie:** Linki kontekstowe w sekcji "about" do /o-mnie; w sekcji fundacja do /fundacja; wszystkie artykuły do /aktualnosci  
**Proponowane dane strukturalne:** Usunąć fałszywą SearchAction; dodać WebPage schema

---

### 2. o-mnie.html (https://zuzanna-czuprynska.pl/o-mnie)

| Element | Wartość |
|---------|---------|
| Proponowany cel | E-E-A-T, pozycjonowanie na frazy brandowe |
| Główna fraza | „Zuzanna Czupryńska kim jest", „polityk Brodnica" |
| Title | „O mnie | Posłanka, Liderka i Założycielka Beehouses Foundation" (66 znaków) ✅ |
| Meta description | ~193 znaki — nieznacznie za długa; treść dobra |
| H1 | „Kim jestem?" — oryginalny, słabo kluczowy |

**Problemy:** Linki .html w nawigacji; meta desc za długa  
**Rekomendowane linkowanie:** Do /fundacja, /aktualnosci, /kontakt  
**Schema:** Person + WebPage

---

### 3. fundacja.html (https://zuzanna-czuprynska.pl/fundacja)

| Element | Wartość |
|---------|---------|
| Proponowany cel | Prezentacja fundacji; frazy ekologiczne |
| Główna fraza | „Beehouses Foundation", „fundacja ekologiczna Brodnica", „ochrona zapylaczy" |
| Title | „Beehouses Foundation | Posłanka, Liderka i Założycielka" (59 znaków) ✅ |
| Meta description | 189 znaków — nieznacznie za długa |
| H1 | „Beehouses Foundation" ✅ |

**Problemy:** Linki .html w nawigacji; sprawdzić thin content  
**Schema:** Organization (z KRS/NIP); FAQPage jeśli sekcja Q&A istnieje

---

### 4. rekrutacja.html (https://zuzanna-czuprynska.pl/rekrutacja)

| Element | Wartość |
|---------|---------|
| Proponowany cel | Pozyskiwanie wolontariuszy/członków |
| Główna fraza | „wolontariat ekologia", „dołącz do fundacji", „rekrutacja Beehouses" |
| Title | „Dołącz do nas | Posłanka, Liderka i Założycielka Beehouses Foundation" (75 znaków) — za długi |
| Meta description | 181 znaków — za długa |
| H1 | „Rekrutacja BeeHouses Foundation" — niespójność: BeeHouses vs Beehouses |

**Problemy:** Niespójność brandingu (BeeHouses vs Beehouses); linki .html w nav  
**Rekomendowane linkowanie:** Do /fundacja, /kontakt

---

### 5. aktualnosci.html (https://zuzanna-czuprynska.pl/aktualnosci)

| Element | Wartość |
|---------|---------|
| Proponowany cel | Hub newsowy; pozycjonowanie na frazy informacyjne |
| Główna fraza | „aktualności Zuzanna Czupryńska", „inicjatywy Brodnica" |
| Title | „Aktualności i inicjatywy | Posłanka..." (85 znaków) — za długi |
| Meta description | 163 znaki — akceptowalne |
| H1 | „Aktualne inicjatywy" ✅ |

**Krytyczny problem:** Artykuły ładowane dynamicznie z Firestore przez JS — ryzyko nieindeksowania przez Googlebota  
**Schema:** ItemList dla listy artykułów

---

### 6. kontakt.html (https://zuzanna-czuprynska.pl/kontakt)

| Element | Wartość |
|---------|---------|
| Proponowany cel | Konwersja — inicjowanie kontaktu |
| Główna fraza | „kontakt Zuzanna Czupryńska" |
| Title | „Kontakt z biurem | Posłanka..." (76 znaków) — nieco za długi |
| Meta description | 178 znaków — nieznacznie za długa |
| H1 | „Porozmawiajmy razem" — kreacyjny, słabo kluczowy |

**Dobre elementy:** Formularz z labelami ✅, mailto link ✅  
**Brakujące:** ContactPage schema, telefon kontaktowy (jeśli dostępny)

---

### 7-12. Artykuły (6 stron)

**Wspólne obserwacje:**
- Canonical URLs prawidłowe ✅
- Schema NewsArticle obecna ✅ (wymaga publisher, właściwych wymiarów obrazu)
- Breadcrumb wizualny w HTML ✅, brak BreadcrumbList JSON-LD ❌
- Tytuły za długie (105 znaków) ❌
- Obrazy na imgur ❌
- Meta descriptions (130–155 znaków) ✅

**Proponowane frazy kluczowe:**

| Strona | Frazy |
|--------|-------|
| inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka | „Srebrny Wilk Brodnica", „Beehouses nagroda" |
| konferencja-energia-przyszlosci | „konferencja OZE 2025", „energia przyszłości" |
| nowe-inicjatywy-na-rzecz-ochrony-zapylaczy | „ochrona zapylaczy Polska", „pszczoły edukacja" |
| projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach | „edukacja o zapylaczach Brodnica 2025" |
| udzial-w-pracach-nad-narodowym-programem-lesnym | „Narodowy Program Leśny", „leśnictwo polityka" |
| warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2 | „warsztaty pszczelarskie Brodnica", „BeeHouses v2" |

---

### 13. sekretarz-sejmiku.html (https://zuzanna-czuprynska.pl/sekretarz-sejmiku)

**Krytyczne problemy:**
- og:url i twitter:url wskazują na `/konferencja-energia-przyszlosci` ❌
- Brakuje w sitemap.xml ❌
- Title: 106 znaków ❌ → skrócić do: „Sekretarz Sejmiku Kujawsko-Pomorskiego | Zuzanna Czupryńska"
- Meta description: 299 znaków, pisana w 1. osobie ❌

**Proponowane frazy:** „Sekretarz Młodzieżowego Sejmiku Kujawsko-Pomorskiego", „Zuzanna Czupryńska sejmik"

---

### 14. polityka-prywatnosci.html i cookies.html

- Meta tagi prawidłowe ✅
- `cookies.html` w sitemap.xml z priority 0.3 ✅
- Rozważyć `noindex` dla `cookies.html` (opcjonalne)

---

## E. PLAN WDROŻENIA

### Etap 1: Poprawki krytyczne (dzień 1–2)

1. **[index.html]** Dodać `<main id="main-content">` owijający sekcje treści
2. **[sekretarz-sejmiku.html L39–50]** Poprawić og:url i twitter:url na `/sekretarz-sejmiku`
3. **[sitemap.xml]** Dodać wpis sekretarz-sejmiku; zweryfikować lastmod
4. **[Wszystkie HTML]** Zamienić `href="fundacja.html"` → `href="/fundacja"` i `href="rekrutacja.html"` → `href="/rekrutacja"` (find & replace)
5. **[index.html L9367, L9978–9979]** Dodać `defer` do form-mailer.js i Three.js
6. **[index.html L133–137]** Usunąć `potentialAction: SearchAction` z WebSite schema
7. **[public/]** Przenieść `fix_articles.py`, `fix_divs.py`, `inject_js.py` poza katalog public/

### Etap 2: Poprawki w jeden dzień (dzień 2–3)

8. **[Wszystkie HTML]** Usunąć `<meta name="msapplication-config" content="/browserconfig.xml">`
9. **[Wszystkie HTML head]** Dodać preconnect dla i.imgur.com, cdnjs.cloudflare.com, cdn.jsdelivr.net
10. **[Wszystkie HTML]** Dodać skip-link `<a href="#main-content" class="skip-link">Przejdź do treści</a>` + CSS
11. **[index.html L29–30]** Przepisać meta description strony głównej
12. **[sekretarz-sejmiku.html L24]** Skrócić meta description do < 160 znaków; poprawić tytuł
13. **[index.html L7361]** Poprawić alt logotypu (dodać ogonki)
14. **[6 artykułów HTML]** Dodać og:image:alt
15. **[index.html L7580–7628]** Zamienić `<h3>` w hero ticker na `<span>`

### Etap 3: Poprawki w pierwszym tygodniu

16. **[6 artykułów HTML]** Dodać BreadcrumbList JSON-LD do każdego artykułu
17. **[index.html head]** Dodać `<link rel="preload" as="image">` dla obrazu hero
18. **[index.html L86]** Ujednolicić jobTitle po konsultacji z właścicielką strony
19. **[index.html L7919]** Poprawić alt teksty obrazów (timeline, instagram grid)
20. **[kontakt.html]** Dodać ContactPage schema JSON-LD
21. **[Wszystkie HTML]** Skrócić tytuły > 60 znaków (zmienić sufiks na `| Zuzanna Czupryńska`)

### Etap 4: Działania contentowe

22. Zweryfikować aktualność stanowisk (Posłanka vs Sekretarz Sejmiku) — ujednolicić we wszystkich miejscach
23. Rozbudować artykuły o sekcje E-E-A-T (źródła, linki do instytucji)
24. Ustandaryzować zapis nazwy fundacji: Beehouses Foundation (nie BeeHouses)
25. Zoptymalizować meta descriptions dla o-mnie (193 zn.), fundacja (189 zn.), rekrutacja (181 zn.)
26. Zaktualizować lastmod w sitemap.xml przy każdej aktualizacji

### Etap 5: Działania wymagające zewnętrznych narzędzi

27. **PageSpeed Insights / Lighthouse:** Zmierzyć LCP, CLS, INP, TTFB na żywo
28. **Google Search Console:** Coverage report, Mobile Usability, Rich Results
29. **Google Rich Results Test:** Walidacja NewsArticle, Person, Organization, BreadcrumbList
30. **gltf-pipeline / Draco:** Kompresja Flyingbee.glb z 8,5 MB do < 1 MB
31. **Image migration:** Przenieść imgur → własny hosting, konwersja do WebP/AVIF
32. **WebPageTest:** Analiza waterfall dla zewnętrznych zasobów

### Etap 6: Działania długoterminowe

33. Rozważyć SSG (Astro, 11ty) zamiast monolitycznych plików HTML 8K–10K linii
34. Podzielić site-language.js (132 KB) — code splitting per-strona lub osobne wersje językowe z hreflang
35. Wdrożyć Cloudflare Images lub Vercel Image Optimization dla obrazów
36. Zoptymalizować Font Awesome — lokalny hosting z subsettingiem lub SVG sprites
37. Wdrożyć statyczne generowanie listy artykułów zamiast dynamicznego ładowania z Firestore
38. Monitoring dostępności zewnętrznych obrazów (imgur breakage alerts)

---

## Uwagi końcowe

> Wyniki wymagające pomiaru w środowisku produkcyjnym (Chrome DevTools / Lighthouse / PageSpeed Insights / Google Search Console):
> - Rzeczywiste wartości LCP, CLS, INP, TTFB
> - Efektywność kompresji Brotli/Gzip (Vercel domyślnie kompresuje — do weryfikacji)
> - Nagłówki Cache-Control (Vercel cachuje statyczne pliki — do weryfikacji)
> - Faktyczne renderowanie JS przez Googlebot
> - Indeksowanie treści tłumaczonej przez site-language.js

---

## PODSUMOWANIE KOŃCOWE

| Metryka | Wartość |
|---------|---------|
| Przeanalizowanych podstron | **16** (w tym 404, stopka mailowa, polityki) |
| Kluczowych podstron SEO | **14** |
| Problemów krytycznych | **7** |
| Problemów wysokiego priorytetu | **8** |
| Problemów średniego priorytetu | **9** |
| Problemów niskiego priorytetu | **6** |
| **Łącznie problemów** | **30** |

### 3 Najważniejsze poprawki (max wpływ przy min nakładzie):

1. **Dodać `<main>` do strony głównej + poprawić og:url na sekretarz-sejmiku + dodać do sitemap** — 15 minut pracy, duży wpływ na crawlability i semantykę

2. **Zamienić wszystkie linki `fundacja.html`/`rekrutacja.html` na `/fundacja`/`/rekrutacja` + dodać `defer` do form-mailer.js i Three.js + usunąć fałszywą SearchAction** — 30 minut pracy, poprawa link equity i wydajności

3. **Dodać BreadcrumbList JSON-LD do wszystkich 6 artykułów** — ~1h pracy, potencjalny wzrost CTR przez rich results w Google

---

**Pełny raport:** [SEO-AUDIT.md](file:///Users/piotrjuskowiak/Desktop/Projekty/zuzanna%20czupry%C5%84ska/SEO-AUDIT.md)
