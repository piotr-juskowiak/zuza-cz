# Plan Wdrożenia Poprawek SEO

Poniżej znajduje się uporządkowana lista zadań naprawczych dla projektu "Zuzanna Czupryńska". Zmiany są ułożone od najbardziej krytycznych do najmniej inwazyjnych.

## SEO-001 — Wydzielenie stylów CSS z plików HTML do zewnętrznego pliku

**Priorytet:** CRITICAL  
**Pliki:** Wszystkie pliki `.html`, `public/style.css` (nowy plik)  
**Problem:** Każdy plik HTML zawiera w sekcji `<head>` ponad 6000 linii kodu CSS. Powoduje to masowe puchnięcie plików (ok. 360 KB na plik `index.html`), blokowanie renderowania (render-blocking) i drastyczny spadek metryk FCP i LCP.  
**Zakres zmiany:**
1. Utworzenie nowego pliku `public/style.css`.
2. Skopiowanie całej zawartości znacznika `<style> ... </style>` z pliku `index.html` do `style.css`.
3. Usunięcie całego bloku `<style>` ze wszystkich plików `.html`.
4. Dodanie tagu `<link rel="stylesheet" href="/style.css">` w sekcji `<head>` wszystkich plików `.html`.

**Ryzyko:** Średnie (wymaga dokładnego sprawdzenia, czy wszystkie podstrony korzystały z tego samego bloku stylów; jeżeli nie, trzeba połączyć reguły CSS).  
**Kryteria akceptacji:**
- Pliki HTML ważą ok. 15-30 KB.
- Style ładują się poprawnie z pliku `style.css`.
- Google PageSpeed Insights raportuje mniejszy HTML.
**Test:**
- Uruchomienie lokalnego serwera deweloperskiego.
- Przeklikanie każdej podstrony (szczególnie bloga vs o-mnie) w celu walidacji wyglądu.

---

## SEO-002 — Naprawa błędnych tagów canonical

**Priorytet:** CRITICAL  
**Pliki:** `public/fundacja-beehouses.html`, `public/rekrutacja-do-fundacji-beehouses.html`  
**Problem:** Tagi `canonical` kierują roboty Google na nieistniejące adresy, co grozi indeksowaniem duplikatów pod domyślnymi adresami generowanymi z nazwy pliku.  
**Zakres zmiany:**
1. W pliku `fundacja-beehouses.html` zamiana `<link rel="canonical" href="https://zuzanna-czuprynska.pl/fundacja">` na `<link rel="canonical" href="https://zuzanna-czuprynska.pl/fundacja-beehouses">`.
2. W pliku `rekrutacja-do-fundacji-beehouses.html` zamiana `/rekrutacja` na `/rekrutacja-do-fundacji-beehouses`.

**Ryzyko:** Brak  
**Kryteria akceptacji:**
- Tagi canonical wskazują na ten sam adres co lokalizacja pliku (`window.location.pathname`).
- Adresy canonical są spójne z wpisami w sitemap.xml.
**Test:**
- Sprawdzenie widoku źródła w przeglądarce po restarcie środowiska deweloperskiego.

---

## SEO-003 — Naprawa adresów w tagach Open Graph (og:image)

**Priorytet:** HIGH  
**Pliki:** Wszystkie pliki `.html` w katalogu `public/`  
**Problem:** Atrybuty `content` dla `og:image` i `twitter:image` to ścieżki względne (np. `/images/pzhgBM6.webp`). Protokół Open Graph wymaga adresów absolutnych wraz z protokołem https. Miniatury postów w social mediach ulegną awarii (nie załadują się).  
**Zakres zmiany:**
1. Wyszukanie w projekcie ciągów `content="/images/` wewnątrz tagów `meta property="og:image"`.
2. Zamiana na `content="https://zuzanna-czuprynska.pl/images/`.

**Ryzyko:** Niskie  
**Kryteria akceptacji:**
- Tagi meta OG posiadają pełny adres ze schematem https.
**Test:**
- Po deployu użycie Facebook Sharing Debugger, by sprawdzić widoczność karty rich card dla linku głównego.

---

## SEO-004 — Wdrożenie opisowych nazw plików graficznych i atrybutów alt

**Priorytet:** HIGH  
**Pliki:** Katalog `public/images/`, wszystkie pliki `.html` (odniesienia `src`)  
**Problem:** Obrazy mają wygenerowane systemowo nazwy (`pzhgBM6.webp`, `e0lLmNt.webp`), brak w nich odpowiednich opisów tekstowych `alt=""`, zwłaszcza przy grafice głównej hero.  
**Zakres zmiany:**
1. Ręczna / seryjna zmiana nazwy plików obrazów na ich wersje z frazami (np. `zuzanna-czuprynska-portret.webp`).
2. Masowa podmiana referencji ze starych na nowe nazwy we wszystkich plikach `.html` za pomocą komendy `sed` lub narzędzi IDE (Search & Replace).
3. Dodanie atrybutu `alt` z krótkim, naturalnym opisem obrazu na zdjęciach bez pustego `alt=""` lub dodanie altów do istotnych zdjęć (hero, posty, logo).

**Ryzyko:** Średnie (ryzyko tzw. "broken images" 404, w przypadku błędu przy wyszukiwaniu/zamienianiu tekstu w HTML).  
**Kryteria akceptacji:**
- Brak obrazów ładujących się jako 404 na produkcji.
- Każdy ważny obraz ma atrybut `alt` oraz zrozumiałą nazwę pliku.
**Test:**
- Narzędzia typu `npm run build` lub wizualne sprawdzanie `Developer Tools > Console` pod kątem błędów HTTP 404 na obrazkach.

---

## SEO-005 — Wyłączenie z indeksowania stron technicznych (noindex)

**Priorytet:** MEDIUM  
**Pliki:** `public/stopka-mailowa.html`, `public/404.html`  
**Problem:** Roboty wyszukiwarek nie powinny marnować limitu na crawlowanie tzw. "thin content", a użytkownicy nie powinni trafiać z wyszukiwarki Google np. na projekt stopki email.  
**Zakres zmiany:**
1. Wpisanie do sekcji `<head>` w tych plikach `<meta name="robots" content="noindex, nofollow">`.
2. Wyprowadzenie pliku `/stopka-mailowa` z mapy witryny (jeśli w niej jest, obecnie nie ma).

**Ryzyko:** Brak  
**Kryteria akceptacji:**
- Tag `noindex` pojawia się w obu technicznych plikach.
**Test:**
- Weryfikacja kodu źródłowego.

---

## SEO-006 — Usunięcie duplikujących się systemów analityki

**Priorytet:** MEDIUM  
**Pliki:** Wszystkie pliki `.html`  
**Problem:** Wdrożono dwa fragmenty kodu: Google Tag Manager (GTM-WJKVQZNP) oraz bezpośredni kod dla Google Analytics 4 (G-9BK92HFXPZ).  
**Zakres zmiany:**
1. Usunięcie bloku z tagami Gtag:
```html
<!-- Google tag (gtag.js) -->
<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-9BK92HFXPZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-9BK92HFXPZ');
</script>
```
2. Przeniesienie ewentualnej konfiguracji GA4 bezpośrednio do panelu Tag Manager.

**Ryzyko:** Niskie (zakładając, że właściciel strony posiada dostęp do konta GTM-WJKVQZNP).  
**Kryteria akceptacji:**
- W kodzie źródłowym strony figuruje tylko i wyłącznie GTM.
**Test:**
- Rozszerzenie "Google Tag Assistant" w przeglądarce – powinno raportować poprawne odpalanie 1xGTM.

---

## SEO-007 — Naprawa logicznej struktury i semantyki H1

**Priorytet:** LOW / MEDIUM  
**Pliki:** Główne sekcje hero we wszystkich plikach `.html`  
**Problem:** Zamiast poprawnego semantycznie tagu `H1`, strona używa ukrywania tekstu w tagach span (przez CSS `clip`).  
**Zakres zmiany:**
1. Zmiana sekcji "Eyebrow" w hero, wprowadzając słowo kluczowe "Zuzanna Czupryńska". Zmiana H1 na poprawne semantycznie hasło widoczne na stronie bez oszukiwania algorytmów. 
2. Usunięcie `span style="position: absolute;..."`.

**Ryzyko:** Niskie  
**Kryteria akceptacji:**
- Zgodność kodu z zasadami WCAG. Brak stosowania technik Black Hat SEO.
**Test:**
- Przeskanowanie narzędziem SEO (np. Screaming Frog, Ahrefs Site Audit) – czy wyczytuje poprawne H1 na podstawie wizualnego tekstu.

---

## Rekomendowany pierwszy pakiet wdrożeniowy

W przypadku podjęcia decyzji o wdrożeniu polecam zaplanować tzw. "Quick Wins Batch". Zawiera on 3 zmiany, które **są bezwzględnie bezpieczne, wymagają 10 minut pracy dewelopera i dają natychmiastowy wpływ**.

1. **(SEO-002) Canonical:** Korekta w pliku `fundacja-beehouses.html` i `rekrutacja-do-fundacji-beehouses.html`. (Bezpieczne, uchroni przed błędami GSC).
2. **(SEO-003) Open Graph url absolutny:** Zamiana relatywnych linków og:image z `/images/...` na `https://zuzanna-czuprynska.pl/images/...` we wszystkich html'ach. (Konieczne dla social media).
3. **(SEO-005) Zabezpieczenie stopki:** Wrzucenie `noindex` do `stopka-mailowa.html`. (Sprzątanie repo).
