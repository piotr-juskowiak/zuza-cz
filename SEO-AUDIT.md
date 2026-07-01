# Audyt SEO – Zuzanna Czupryńska | zuzanna-czuprynska.pl

**Data audytu:** 2026-07-02  
**Wersja analizy:** kompletna, na podstawie kodu źródłowego

---

## 1. Rozpoznanie projektu

| Cecha | Wartość |
|---|---|
| Typ strony | Strona osoby publicznej / portfolio polityczne |
| Technologia | Czysty HTML + wbudowany CSS + vanilla JavaScript |
| Rendering | Statyczny SSG-like, bez frameworka (pliki `.html` serwowane przez Vercel) |
| Hosting | Vercel (wercel.json z `cleanUrls: true`, `trailingSlash: false`) |
| CMS | Brak. Dane dynamiczne (posty, wydarzenia) są ładowane z Firestore przez JavaScript. |
| Baza danych | Firebase Firestore (dynamiczne posty i события na stronie głównej) |
| Języki | PL (domyślny) + EN (tłumaczenia przez `site-language.js`) |
| SEO zasięg | Ogólnopolski, z akcentem lokalnym (Brodnica, Kujawsko-Pomorskie) |
| Główna konwersja | Wypełnienie formularza kontaktowego / zapis na newsletter / rekrutacja do fundacji |
| Intencja główna | Budowanie wizerunku osoby publicznej, liderki, posłanki, fundatorki |

### Mapa wszystkich podstron

| Plik HTML | Adres URL (Vercel cleanUrls) | Typ |
|---|---|---|
| `index.html` | `/` | Strona główna |
| `o-mnie.html` | `/o-mnie` | O osobie |
| `fundacja-beehouses.html` | `/fundacja-beehouses` | Organizacja NGO |
| `rekrutacja-do-fundacji-beehouses.html` | `/rekrutacja-do-fundacji-beehouses` | Rekrutacja |
| `aktualnosci.html` | `/aktualnosci` | Hub bloga |
| `kontakt.html` | `/kontakt` | Kontakt |
| `inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html` | `/inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka` | Artykuł |
| `konferencja-energia-przyszlosci.html` | `/konferencja-energia-przyszlosci` | Artykuł |
| `nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html` | `/nowe-inicjatywy-na-rzecz-ochrony-zapylaczy` | Artykuł |
| `projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html` | `/projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach` | Artykuł |
| `sekretarz-sejmiku.html` | `/sekretarz-sejmiku` | Artykuł |
| `udzial-w-pracach-nad-narodowym-programem-lesnym.html` | `/udzial-w-pracach-nad-narodowym-programem-lesnym` | Artykuł |
| `warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2.html` | `/warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2` | Artykuł |
| `polityka-prywatnosci.html` | `/polityka-prywatnosci` | Prawna |
| `cookies.html` | `/cookies` | Prawna |
| `404.html` | `/404` | Błąd |
| `stopka-mailowa.html` | `/stopka-mailowa` | ⚠️ Techniczna (brak noindex!) |

---

## A. Executive Summary

Strona Zuzanny Czupryńskiej jest solidnie zbudowaną wizytówką osoby publicznej z dobrą strukturą treści i poprawnymi podstawami meta danych. Projekt wyróżnia się: formatem WebP dla wszystkich obrazów, prawidłowymi atrybutami `width/height` na obrazach (ważne dla CLS), systemem preloadingu LCP, wdrożoną analityką GTM+GA4 oraz bogatymi, naturalnie napisanymi treściami.

**Największe problemy:**
1. **Inline CSS blokujący renderowanie** – każdy plik HTML zawiera od 6000 do 6500+ linii CSS w bloku `<style>`. To podstawowa przyczyna wolnych metryk LCP/FCP.
2. **Błędne canonical i og:url** dla `/fundacja-beehouses` (wskazuje na nieistniejące `/fundacja`) i `/rekrutacja-do-fundacji-beehouses` (wskazuje na nieistniejące `/rekrutacja`).
3. **Wszystkie tagi og:image i twitter:image używają ścieżek względnych** zamiast absolutnych URL – miniatury nie ładują się podczas udostępniania linków w social mediach.
4. **Linki nawigacyjne i stopka używają .html w href** – niespójne z cleanUrls Vercela, ryzyko pętli przekierowań lub nieočekiwanych zachowań.
5. **Three.js i Flyingbee.glb (7,5 MB!)** ładowane synchronicznie na stronie głównej – drastycznie zwiększa czas ładowania dla użytkowników mobilnych.

**Największe możliwości:**
- Przeniesienie CSS do zewnętrznych plików poprawi LCP/FCP nawet o kilka sekund.
- Naprawienie canonical uchroni przed duplikowaniem treści.
- Poprawienie og:image zwiększy CTR z postów social media.
- Tagowanie artykułów z `BlogPosting` schema umożliwi wyświetlanie w Google Discover.
- Wdrożenie opisowych nazw obrazów poprawi widoczność w Google Grafika.

---

## B. Ocena punktowa (ekspercka, na podstawie kodu)

| Obszar | Ocena | Uzasadnienie |
|---|---|---|
| SEO techniczne | **58/100** | Błędne canonical (2 strony), relative og:image, .html w linkach nawigacyjnych, SearchAction bez wyszukiwarki |
| Indeksowanie | **82/100** | Dobry robots.txt, czytelny sitemap, cleanUrls działają poprawnie, stopka-mailowa bez noindex |
| On-page SEO | **74/100** | Tytuły i meta description są, ale miejscami zbyt ogólne; keywords meta (nieużywany przez Google) wszędzie identyczny |
| Treści | **88/100** | Treści naturalne, merytoryczne, dobrze opisujące osobę publiczną |
| Linkowanie wewnętrzne | **66/100** | Niejednolite – mix `/ścieżka` vs `plik.html`; tagi artykułów z `href="#"` nie linkują nigdzie |
| Wydajność | **42/100** | Inline CSS ≈300KB na plik HTML, Three.js + model 3D 7.5MB na stronie głównej, podwójne tagi analityki |
| Core Web Vitals | **50/100** | Wysokie ryzyko słabego LCP i TBT z powodu inline CSS i Three.js; dobre CLS (width/height na obrazach) |
| Mobile SEO | **88/100** | Responsywny układ, skip-link, aria-labels w menu mobilnym |
| Dane strukturalne | **72/100** | Person + Organization + WebSite na stronach głównych; NewsArticle na artykułach; brak BreadcrumbList; relative URL w image |
| Obrazy | **62/100** | Dobry format WebP, ale losowe nazwy plików, brak preload hero na podstronach, jeden hero image bez alt |
| Dostępność (SEO-relevant) | **76/100** | Skip-link, aria-labels, lang="pl", ale ukryty tekst w H1 (clip CSS), `<h4>` w hero decoration |
| Bezpieczeństwo | **88/100** | HTTPS przez Vercel, nagłówki bezpieczeństwa w vercel.json, brak CSP |
| E-E-A-T / Wiarygodność | **87/100** | Silne sygnały: doświadczenie, role, nagrody, dane kontaktowe, polityka prywatności |

---

## C. Lista wszystkich problemów

| ID | Priorytet | Obszar | Problem | Lokalizacja | Wpływ SEO | Rekomendacja |
|---|---|---|---|---|---|---|
| P01 | **CRITICAL** | Wydajność/LCP | Cały CSS (ok. 6000–6500 linii) wstrzyknięty inline w każdym pliku HTML. Plik `index.html` waży 360 KB, z czego ~280 KB to CSS. | Wszystkie pliki HTML (`index.html` L188–L6495, pozostałe analogicznie) | Blokowanie renderowania, wolny FCP i LCP, niski wynik PageSpeed | Ekstrakcja CSS do pliku `/style.css` i podpięcie przez `<link rel="stylesheet" href="/style.css">` |
| P02 | **CRITICAL** | Canonical | `fundacja-beehouses.html`: canonical i og:url wskazują na `/fundacja` (strona nie istnieje = 404) | `fundacja-beehouses.html` L39, L43 | Google ignoruje canonical, ryzyko duplikatów treści pod złym URL | Zmiana na `https://zuzanna-czuprynska.pl/fundacja-beehouses` |
| P03 | **CRITICAL** | Canonical | `rekrutacja-do-fundacji-beehouses.html`: canonical i og:url wskazują na `/rekrutacja` (404) | `rekrutacja-do-fundacji-beehouses.html` L43, L47 | Jak wyżej | Zmiana na `https://zuzanna-czuprynska.pl/rekrutacja-do-fundacji-beehouses` |
| P04 | **HIGH** | Open Graph | Wszystkie tagi `og:image` i `twitter:image` zawierają ścieżki względne (np. `/images/pzhgBM6.webp`) zamiast absolutnych URL | Wszystkie pliki HTML (np. `index.html` L52, L65; `o-mnie.html` L50, L62) | Serwisy social media (FB, LinkedIn, X) nie renderują miniatur linków | Zamiana na `https://zuzanna-czuprynska.pl/images/pzhgBM6.webp` we wszystkich plikach |
| P05 | **HIGH** | Linki wewnętrzne | Linki nawigacyjne i stopkowe do Fundacji i Rekrutacji używają rozszerzenia `.html` (np. `fundacja-beehouses.html`), podczas gdy Vercel obsługuje `cleanUrls`. Może powodować niespójność i niepotrzebne przekierowania | Wszystkie HTML w nav/footer, np. `index.html` L7307, L9223 | Nieoptymalne przekazywanie link equity, ryzyko przekierowań | Zmiana na `/fundacja-beehouses` i `/rekrutacja-do-fundacji-beehouses` we wszystkich plikach |
| P06 | **HIGH** | Wydajność | Three.js (ok. 600 KB) + GLTFLoader + DRACOLoader ładowane synchronicznie (bez `defer`/`async`) przed renderowaniem strony | `index.html` L9897–L9899 | Blokowanie głównego wątku, wysokie TBT, zły INP | Dodanie atrybutu `defer` lub przeniesienie Three.js do modułu ładowanego warunkowo (np. gdy sekcja fundacji jest widoczna) |
| P07 | **HIGH** | Wydajność | Model 3D `Flyingbee.glb` waży **7,5 MB** i jest ładowany na stronie głównej | `public/Flyingbee.glb` – ładowany przez Three.js na stronie głównej | Dramatycznie spowalnia LCP i TTI dla użytkowników mobilnych | Kompresja modelu do formatu Draco (możliwa redukcja do ~500 KB), warunek: ładuj tylko na desktop lub po kliknięciu |
| P08 | **HIGH** | Analityka | Na każdej stronie wdrożono JEDNOCZEŚNIE Google Tag Manager (GTM-WJKVQZNP) i bezpośredni tag GA4 (G-9BK92HFXPZ) przez gtag.js. To powoduje podwójne śledzenie i dodatkowe żądanie sieciowe. | Wszystkie HTML L11–L28 | Zaśmiecenie danych analitycznych (zdwojone sesje/zdarzenia), spowolnienie ładowania | Usunięcie bezpośredniego kodu gtag.js; zarządzanie GA4 wyłącznie przez GTM |
| P09 | **MEDIUM** | Indeksowanie | `stopka-mailowa.html` jest dostępna dla robotów bez tagu `noindex`, mimo że jest plikiem technicznym (stopka mailowa do skopiowania) | `stopka-mailowa.html` L1–L20 (brak `<meta name="robots" content="noindex">`) | Crawl budget waste, thin content | Dodanie `<meta name="robots" content="noindex, nofollow">` |
| P10 | **MEDIUM** | Schema | W JSON-LD wszystkich plików pola `"image"` (w Person i Organization) oraz `"logo"` zawierają ścieżki względne zamiast URL absolutnych | Np. `index.html` L130 (`/images/pzhgBM6.webp`), L157 (`/images/ZqtTYMW.webp`) | Błąd walidacji w Google Rich Results Test | Zmiana na `https://zuzanna-czuprynska.pl/images/...` |
| P11 | **MEDIUM** | Schema | Schema `WebSite` zawiera `SearchAction` z URL `?s={search_term_string}`, co sugeruje istnienie wyszukiwarki. Strona jej nie posiada. | `aktualnosci.html` L121–L132, `kontakt.html` L121–L132, `o-mnie.html` L125–L138 | Wprowadzenie Google w błąd, potencjalny błąd walidacji | Usunięcie bloku `potentialAction` ze schema `WebSite` |
| P12 | **MEDIUM** | Linkowanie | Tagi artykułów (Ekologia, Brodnica, Srebrny Wilk, itp.) mają `href="#"` i nie prowadzą do żadnych stron kategorii | Wszystkie artykuły, np. `nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html` L6716–L6721 | Stracona okazja na linkowanie do stron z filtrowaną treścią; tagi jako `<a>` bez celu to anti-pattern SEO | Zmiana na `<span class="tag-item">` (jeśli nie planujemy stron tagów) lub stworzenie stron tagów z listą artykułów |
| P13 | **MEDIUM** | Obrazy | Wszystkie pliki graficzne w `/public/images/` mają losowe, nieczytelne nazwy (np. `pzhgBM6.webp`, `L5rbn0e.webp`). Google Grafika indeksuje obrazy po nazwie pliku i alt. | Katalog `/public/images/` (44 pliki) | Brak widoczności w Google Grafika dla powiązanych fraz | Systematyczna zmiana nazw na opisowe (np. `zuzanna-czuprynska-portret.webp`) i aktualizacja referencji |
| P14 | **MEDIUM** | Obrazy | Plik `e66eab26-08a9-48cd-925f.jpeg` to jedyny plik JPEG w projekcie. Reszta to WebP. | `/public/images/e66eab26-08a9-48cd-925f.jpeg` i reference w schema `inicjatywa-brodnica` L79 | Brak optymalizacji formatu; stare JPEG są cięższe | Konwersja do WebP; aktualizacja referencji w schema JSON-LD |
| P15 | **MEDIUM** | Semantyka | Elementy `<h4>` są używane wewnątrz bloku hero w sekcji Beehouses decoration, bez H2/H3 poprzedzającego | `index.html` L7502 (`<h4>Beehouses Foundation</h4>`) | Złamana hierarchia nagłówków – przeskok H1→H4 | Zamiana na `<p class="decoration-title">` lub odpowiedni `<h3>` po dodaniu H2 sekcji |
| P16 | **MEDIUM** | Meta | Meta tag `keywords` jest identyczny na wszystkich podstronach – zawiera ten sam zestaw 12 ogólnych fraz | Wszystkie HTML, L33–L34 (lub analogicznie) | Google nie używa `keywords` do rankingu, ale identyczne tagi na wszystkich stronach świadczą o copy-paste, co może utrudnić audyt GSC | Albo usunąć tag keywords ze wszystkich stron, albo dostosować do specyfiki każdej podstrony |
| P17 | **LOW** | H1 | Nagłówki H1 na stronach głównych/hubowych zawierają ukryty tekst przez CSS clip (`position: absolute; clip: rect(0,0,0,0)`). Choć dostępny dla czytników ekranu, może być flagowany jako hidden text | `index.html` L7476, `o-mnie.html` L6116, `aktualnosci.html` L6229, `fundacja-beehouses.html` L6492 itd. | Ryzyko działania jak cloaking, sprzeczne z wytycznymi Google | Usunięcie ukrytego spanu; użycie naturalnego zdania jako H1 z umieszczonym imieniem/brandingiem w inny sposób |
| P18 | **LOW** | Dostępność | Logo nawigacyjne (`logotyp.webp`) ma alt `"Zuzanna Maria Czuprynska"` (bez polskich znaków) w wielu plikach | Np. `kontakt.html` L5937, wszystkie artykuły L (nawigacja) | Niespójna transkrypcja znaku ń | Korekta na `"Zuzanna Maria Czupryńska"` (z polskim ń) |
| P19 | **LOW** | Linki | Marquee (ticker ról) zawiera linki do osób (`Arkadiusz Myrcha`, `Iwona Karolewska`) z `href="#"` zamiast realnych URL (np. do strony wiki lub oficjalnej strony) | `index.html` L7519, L7523 | Stracona okazja na zewnętrzne linkowanie, które sygnalizuje E-E-A-T | Dodanie href do profili publicznych tych osób lub usunięcie `<a>` i zastąpienie `<span>` |
| P20 | **LOW** | Canonical | `404.html` ma canonical wskazujący na `https://zuzanna-czuprynska.pl/404`. Strony błędów nie powinny mieć canonical (lub canonical powinien wskazywać na `/`). | `404.html` L11 | Niestandardowe, może wprowadzać w błąd | Usunięcie canonical z 404.html |
| P21 | **LOW** | Bezpieczeństwo | Firebase API key widoczny w HTML (`index.html` L9293). Choć klucze Firebase są z natury "publiczne" (działają po stronie klienta), warto zabezpieczyć dostęp przez Firebase Security Rules | `index.html` L9292–L9299 | Ryzyko nadużycia zasobów Firebase bez właściwych reguł | Weryfikacja, czy Firestore Security Rules są poprawnie skonfigurowane (sprawdzić w Firebase Console) |
| P22 | **INFO** | Indeksowanie | Wszystkie `lastmod` w sitemap.xml mają datę `2026-07-01` (prawdopodobnie aktualizowane ręcznie lub ustawione na jeden dzień) | `sitemap.xml` L5, L11, L17, itd. | Google może ignorować lastmod jeśli wszystkie strony mają tę samą datę | Ustawienie lastmod na faktyczną datę ostatniej modyfikacji treści |
| P23 | **INFO** | Hreflang | Strona posiada przełącznik językowy (PL/EN) w JS, ale brak tagów `hreflang` w HTML. Google nie wie, że istnieje wersja angielska. | Brak tagów `<link rel="alternate" hreflang="pl">` w `<head>` | Jeśli tłumaczenia angielskie są dostępne pod oddzielnym URL, Google nie może ich powiązać | Jeśli EN to tylko tłumaczenie UI bez zmiany URL – dodać `hreflang="x-default"` i nie dodawać EN hreflang. Jeśli EN ma inny URL – wdrożyć pełny hreflang. |
| P24 | **INFO** | Treści | Artykuł `udzial-w-pracach-nad-narodowym-programem-lesnym.html` używa zewnętrznego obrazu hero z innej domeny (`tapetuj.pl`) | `udzial-w-pracach-nad-narodowym-programem-lesnym.html` L6550 | Zależność zewnętrzna, ryzyko 404 obrazu, wolniejsze ładowanie | Pobranie obrazu i dodanie do katalogu `/public/images/` |

---

## D. Quick wins

| # | Zmiana | Wpływ | Trudność |
|---|---|---|---|
| 1 | Naprawa canonical w `fundacja-beehouses.html` i `rekrutacja-do-fundacji-beehouses.html` | Krytyczny (indeksowanie) | 5 min |
| 2 | Zmiana wszystkich `og:image` i `twitter:image` na adresy absolutne | Wysoki (social media CTR) | 15 min (find & replace) |
| 3 | Ekstrakcja inline CSS do pliku `/style.css` | Krytyczny (PageSpeed, LCP) | 30–60 min |
| 4 | Usunięcie bezpośredniego kodu gtag.js (zostawienie tylko GTM) | Wysoki (wydajność, rzetelność danych) | 10 min |
| 5 | Dodanie `noindex` do `stopka-mailowa.html` | Średni (crawl budget) | 2 min |
| 6 | Dodanie `defer` do tagów Three.js | Wysoki (TBT, INP) | 5 min |
| 7 | Naprawa altów logo nawigacyjnego (`Czuprynska` → `Czupryńska`) | Niski (dostępność) | 5 min (find & replace) |
| 8 | Zmiana linków w nawigacji z `.html` na czyste ścieżki (`/fundacja-beehouses`) | Wysoki (spójność linków) | 20 min |
| 9 | Zmiana ścieżek w JSON-LD image/logo na absolutne | Średni (Rich Results) | 10 min |
| 10 | Usunięcie `SearchAction` z schema WebSite (strona nie ma wyszukiwarki) | Średni (błąd walidacji) | 5 min |

---

## E. Problemy krytyczne

1. **[P01] Inline CSS** – 300 KB CSS w każdym HTML-u blokuje renderowanie i zabija metryki Core Web Vitals.
2. **[P02, P03] Błędne canonical** – prowadzą do stron 404, Google ignoruje wskazanie canonical.
3. **[P04] Relative og:image** – brak miniatur przy udostępnianiu linków w social mediach.
4. **[P06, P07] Three.js + model 3D 7.5 MB** – dramatyczne spowolnienie strony głównej, szczególnie na mobile.

---

## F. Mapa podstron

| URL | Typ | Intencja | Główna fraza | Title (obecny) | H1 (obecny) | Canonical (obecny) | Poprawność | Uwagi |
|---|---|---|---|---|---|---|---|---|
| `/` | Główna | Brandowa/nawigacyjna | Zuzanna Czupryńska | Zuzanna Czupryńska – Głos nowego pokolenia w polityce | "Przyszłość buduje się od natury" (z ukrytym "Zuzanna Czupryńska -") | `/` ✅ | ✅ Poprawny | Inline CSS, Three.js |
| `/o-mnie` | Profil | Informacyjna | kim jest Zuzanna Czupryńska | O mnie \| Zuzanna Czupryńska | "Kim jestem?" | `/o-mnie` ✅ | ✅ Poprawny | Ukryty tekst w H1 |
| `/fundacja-beehouses` | NGO | Informacyjna | Beehouses Foundation | Fundacja Beehouses \| Zuzanna Czupryńska | "Fundacja Beehouses" | ❌ `/fundacja` (404) | **BŁĄD canonical** | |
| `/rekrutacja-do-fundacji-beehouses` | Rekrutacja | Transakcyjna | Beehouses rekrutacja | Rekrutacja do fundacji \| Zuzanna Czupryńska | "Rekrutacja Beehouses Foundation" | ❌ `/rekrutacja` (404) | **BŁĄD canonical** | |
| `/aktualnosci` | Hub bloga | Nawigacyjna | aktualności Zuzanny Czupryńskiej | Aktualności \| Zuzanna Czupryńska | "Aktualne inicjatywy" | `/aktualnosci` ✅ | ✅ Poprawny | Posty ładowane z Firestore przez JS |
| `/kontakt` | Kontakt | Transakcyjna | kontakt Zuzanna Czupryńska | Kontakt \| Zuzanna Czupryńska | "Porozmawiajmy razem" | `/kontakt` ✅ | ✅ Poprawny | |
| `/inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka` | Artykuł | Informacyjna | Brodnica Beehouses Srebrny Wilk | Beehouses z nagrodą Srebrnego Wilka... | "Inicjatywa Brodnica Beehouses z nagrodą..." | `/inicjatywa-brodnica...` ✅ | ✅ Poprawny | |
| `/konferencja-energia-przyszlosci` | Artykuł | Informacyjna | konferencja OZE | Konferencja Energia Przyszłości | "Wystąpienie na konferencji Energia Przyszłości" | `/konferencja-energia-przyszlosci` ✅ | ✅ Poprawny | |
| `/nowe-inicjatywy-na-rzecz-ochrony-zapylaczy` | Artykuł | Informacyjna | ochrona zapylaczy | Ochrona zapylaczy — nowe inicjatywy | "Nowe inicjatywy na rzecz ochrony zapylaczy" | `/nowe-inicjatywy...` ✅ | ✅ Poprawny | |
| `/projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach` | Artykuł | Informacyjna | projekt Beehouses 2025 | Projekt Brodnica Beehouses 2025 | "Projekt Brodnica Beehouses 2025 – Edukacja o zapylaczach" | `/projekt-brodnica...` ✅ | ✅ Poprawny | |
| `/sekretarz-sejmiku` | Artykuł | Informacyjna | Sekretarz Sejmiku Kujawsko-Pomorskiego | Sekretarz Sejmiku Kujawsko-Pomorskiego | "Objęcie stanowiska Sekretarza Młodzieżowego Sejmiku..." | `/sekretarz-sejmiku` ✅ | ✅ Poprawny | |
| `/udzial-w-pracach-nad-narodowym-programem-lesnym` | Artykuł | Informacyjna | Narodowy Program Leśny | Narodowy Program Leśny \| Zuzanna Czupryńska | "Udział w pracach nad Narodowym Programem Leśnym" | `/udzial-w-pracach...` ✅ | ✅ Poprawny | Zewnętrzny obraz hero |
| `/warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2` | Artykuł | Informacyjna | warsztaty pszczelarskie Beehouses | Warsztaty pszczelarskie Beehouses v2 | "Warsztaty pszczelarskie w ramach projektu Beehouses v2" | `/warsztaty-pszczelarskie...` ✅ | ✅ Poprawny | |
| `/polityka-prywatnosci` | Prawna | — | — | Polityka prywatności \| Posłanka... | "Polityka Prywatności" | `/polityka-prywatnosci` ✅ | ✅ Poprawny | |
| `/cookies` | Prawna | — | — | Polityka cookies \| Posłanka... | "Polityka Cookies" | `/cookies` ✅ | ✅ Poprawny | |
| `/stopka-mailowa` | ⚠️ Techniczna | — | — | Stopka Mailowa - Posłanka... | Brak | Brak | ⚠️ Brak noindex | Powinno być noindex |

---

## G. Proponowane title i meta description

| URL | Obecny title | Dług. | Proponowany title | Dług. |
|---|---|---|---|---|
| `/` | Zuzanna Czupryńska – Głos nowego pokolenia w polityce | 52 | Zuzanna Czupryńska – Polityka, Ekologia, Beehouses Foundation | 59 |
| `/o-mnie` | O mnie \| Zuzanna Czupryńska | 26 | Kim jest Zuzanna Czupryńska? Sekretarz Sejmiku, Fundatorka Beehouses | 66 |
| `/fundacja-beehouses` | Fundacja Beehouses \| Zuzanna Czupryńska | 39 | Beehouses Foundation – Fundacja Ekologiczna Zuzanny Czupryńskiej | 64 |
| `/rekrutacja-do-fundacji-beehouses` | Rekrutacja do fundacji \| Zuzanna Czupryńska | 43 | Rekrutacja do Beehouses Foundation – Dołącz do Naszego Zespołu | 63 |
| `/aktualnosci` | Aktualności \| Zuzanna Czupryńska | 33 | Aktualności – Projekty, Wystąpienia i Inicjatywy Zuzanny Czupryńskiej | 68 |
| `/kontakt` | Kontakt \| Zuzanna Czupryńska | 29 | Kontakt – Zuzanna Czupryńska \| Współpraca, Media, Projekty | 58 |
| `/sekretarz-sejmiku` | Sekretarz Sejmiku Kujawsko-Pomorskiego \| Zuzanna Czupryńska | 55 | Zuzanna Czupryńska – Sekretarz Młodzieżowego Sejmiku Woj. K-P | 63 |

| URL | Obecny description | Proponowany description | Dl. |
|---|---|---|---|
| `/` | Zuzanna Czupryńska – Sekretarz Sejmiku K-P, założycielka Beehouses Foundation. Głos młodego pokolenia w polityce i ekologii. | Zuzanna Czupryńska – Sekretarz Młodzieżowego Sejmiku Woj. Kujawsko-Pomorskiego i założycielka Beehouses Foundation. Działam na rzecz ekologii, edukacji i praw młodzieży w Polsce. | 162 |
| `/fundacja-beehouses` | Beehouses Foundation to fundacja założona przez Zuzannę Czupryńską. Wspieramy edukację ekologiczną, ochronę zapylaczy i bioróżnorodność w Polsce. | Beehouses Foundation – organizacja ekologiczna założona przez Zuzannę Czupryńską. Chronimy zapylacze, prowadzimy warsztaty i projekty edukacyjne dla młodzieży w Polsce. | 168 |
| `/rekrutacja-do-fundacji-beehouses` | Dołącz do Beehouses Foundation! Współtwórz lokalne i ogólnopolskie projekty ekologiczne razem z Zuzanną Czupryńską i naszym zespołem. | Chcesz działać na rzecz środowiska? Dołącz do Beehouses Foundation – współtwórz projekty ekologiczne, warsztaty i inicjatywy z Zuzanną Czupryńską. Sprawdź warunki rekrutacji. | 178 |

---

## H. Proponowana hierarchia nagłówków

### `/` – Strona główna (obecna: H1→H4, brak H2 sekcji)
```
H1: Zuzanna Czupryńska – Przyszłość buduje się od natury
  H2: O mnie – głos młodego pokolenia w debacie o przyszłości
  H2: Moje role i zaangażowanie  
  H2: Fundacja Beehouses
    H3: Czym się zajmujemy
    H3: Nasze projekty
  H2: Postulaty i priorytety
  H2: Harmonogram wydarzeń
  H2: Aktualności
  H2: Wystąpienia publiczne
```

### `/o-mnie` – O mnie (obecna: H1→brak H2)
```
H1: Kim jest Zuzanna Czupryńska?
  H2: Moja droga – od Brodnicy do ogólnopolskiej polityki
  H2: Funkcje i doświadczenie
  H2: Wartości i priorytety
```

### `/fundacja-beehouses` (obecna: H1→brak struktury)
```
H1: Fundacja Beehouses – ekologia i edukacja w działaniu
  H2: Czym jest Beehouses Foundation?
  H2: Nasze projekty i inicjatywy
  H2: Jak możesz dołączyć?
```

---

## I. Linkowanie wewnętrzne

| Strona źródłowa | Strona docelowa | Anchor | Miejsce umieszczenia | Uzasadnienie |
|---|---|---|---|---|
| Wszystkie artykuły o Beehouses | `/fundacja-beehouses` | `Beehouses Foundation` / `dowiedz się więcej o fundacji` | Pierwszy akapit treści | Buduje autorytet strony fundacji, naturalne linkowanie kontekstowe |
| `/fundacja-beehouses` | `/rekrutacja-do-fundacji-beehouses` | `Dołącz do naszego zespołu` | CTA pod opisem fundacji | Naturalna ścieżka konwersji |
| `/aktualnosci` | Każdy artykuł | Tytuł artykułu | Lista artykułów na stronie | Już istnieje, do utrzymania |
| Artykuły o Beehouses | `/aktualnosci` | `więcej aktualności` | Footer artykułu | Nawigacja powrotna do huba |
| `/` (strona główna) | `/sekretarz-sejmiku` | `Sekretarz Sejmiku Kujawsko-Pomorskiego` | Sekcja ról / timeline | Artykuł osiągnięcia jest w sitemapie, ale brak linku z głównej |
| `/o-mnie` | `/kontakt` | `Skontaktuj się ze mną` | Dolna sekcja strony | Ścieżka konwersji: poznaj → skontaktuj się |
| `/kontakt` | `/polityka-prywatnosci` | `Polityka prywatności` | Przy formularzu | Już istnieje (w stopce), wzmocnić przy formularzu |

---

## J. Obrazy

| Plik | Problem | Format | Rozmiar | Alt (obecny) | Proponowany alt | Priorytet |
|---|---|---|---|---|---|---|
| `images/pzhgBM6.webp` | Losowa nazwa | WebP ✅ | 79 KB | "Zuzanna Czupryńska Portret" | `Zuzanna Czupryńska – portret oficjalny` | HIGH |
| `images/L5rbn0e.webp` | Losowa nazwa, duży rozmiar | WebP ✅ | **715 KB** | "Nowe inicjatywy na rzecz ochrony zapylaczy" | `Zuzanna Czupryńska podczas inicjatywy ochrony zapylaczy` | HIGH |
| `images/LWGQw9V.webp` | Losowa nazwa, bardzo duży rozmiar | WebP ✅ | **1.4 MB** | nieznany | Wymaga zbadania kontekstu użycia | CRITICAL |
| `images/e0lLmNt.webp` | Losowa nazwa | WebP ✅ | 380 KB | "Warsztaty pszczelarskie Beehouses" | `Uczestnicy warsztatów pszczelarskich Beehouses` | MEDIUM |
| `images/rmV5MvN.webp` | Losowa nazwa | WebP ✅ | 266 KB | "Statuetka Srebrnego Wilka" | `Statuetka nagrody Srebrnego Wilka – projekt Brodnica Beehouses` | MEDIUM |
| `images/e66eab26...jpeg` | Format JPEG (stary) | JPEG ❌ | 6.6 KB | nieznany | Konwertuj do WebP | MEDIUM |
| `images/ICyowxn.webp` | Losowa nazwa, duży rozmiar | WebP ✅ | 256 KB | "Warsztaty edukacyjne Brodnica Beehouses 2025" | `Warsztaty edukacyjne Brodnica Beehouses 2025` ✅ (dobry) | LOW |
| `logotyp.webp` | Alt bez polskich znaków (`Czuprynska`) | WebP ✅ | 200 KB | "Zuzanna Maria Czuprynska" ❌ | `Zuzanna Maria Czupryńska – logotyp` | LOW |
| `Flyingbee.glb` | Model 3D w GLB, 7.5 MB, ładowany na każdym pageview | GLB | **7.5 MB** | Nie dotyczy | Optymalizacja/kompresja Draco wymagana | CRITICAL |

---

## K. Dane strukturalne

### Obecna architektura JSON-LD

| Strona | Typy Schema | Status |
|---|---|---|
| `/` | `Person`, `WebSite`, `Organization` | ⚠️ Relative URLs w image/logo |
| `/o-mnie` | `Person`, `WebSite`, `Organization` | ⚠️ Jak wyżej |
| `/aktualnosci` | `Person`, `WebSite` (z błędnym `SearchAction`), `Organization` | ⚠️ SearchAction nieuzasadniony |
| `/kontakt` | `Person`, `WebSite` (z SearchAction), `Organization` | ⚠️ SearchAction nieuzasadniony |
| `/fundacja-beehouses` | `Person`, `WebSite`, `Organization` | ✅ Logicznie odpowiedni |
| `/rekrutacja-do-fundacji-beehouses` | `Person`, `WebSite`, `Organization` | ✅ |
| Artykuły | `NewsArticle` | ⚠️ Relative URL w image; brak `description` i `publisher` |

### Brakujące typy

- **`BreadcrumbList`** – brak na artykułach (mimo sekcji breadcrumb widocznej na stronie)
- **`ContactPage`** – strona kontaktowa powinna mieć schema `ContactPage`
- **`AboutPage`** – strona `/o-mnie` powinna mieć schema `AboutPage`

### Rekomendowana struktura dla artykułów (przykład)

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Inicjatywa Brodnica Beehouses z nagrodą Srebrnego Wilka",
  "image": ["https://zuzanna-czuprynska.pl/images/rmV5MvN.webp"],
  "datePublished": "2025-05-25T08:00:00+02:00",
  "dateModified": "2025-05-25T08:00:00+02:00",
  "description": "Projekt Brodnica Beehouses zdobył nagrodę Srebrnego Wilka w olimpiadzie Zwolnieni z Teorii.",
  "author": [{
    "@type": "Person",
    "name": "Zuzanna Maria Czupryńska",
    "url": "https://zuzanna-czuprynska.pl"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "Zuzanna Maria Czupryńska",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zuzanna-czuprynska.pl/logotyp.webp"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://zuzanna-czuprynska.pl/inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka"
  }
}
```

### Rekomendowana struktura BreadcrumbList (artykuły)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://zuzanna-czuprynska.pl/"},
    {"@type": "ListItem", "position": 2, "name": "Aktualności", "item": "https://zuzanna-czuprynska.pl/aktualnosci"},
    {"@type": "ListItem", "position": 3, "name": "Inicjatywa Brodnica Beehouses z nagrodą Srebrnego Wilka", "item": "https://zuzanna-czuprynska.pl/inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka"}
  ]
}
```

---

## L. Core Web Vitals

### LCP (Largest Contentful Paint)

**Element LCP:** Prawdopodobnie `<img src="/images/pzhgBM6.webp">` (hero portrait) na stronie głównej.

- ✅ Preload jest wdrożony: `<link rel="preload" as="image" href="/images/pzhgBM6.webp">`
- ✅ `fetchpriority="high"` na img
- ❌ Ale: przeglądarka musi najpierw pobrać cały HTML (~360 KB z CSS), żeby znaleźć `<link rel="preload">` w `<head>`. Ekstrakcja CSS skróci czas parsowania HTML do ~20–40 KB, co przyspieszy dotarcie do preload i samego LCP o 1–3 sekundy.
- ❌ Na stronach artykułów brak preload dla hero image artykułu.

**Naprawa:** Ekstrakcja CSS (P01) + dodanie `<link rel="preload" as="image" href="[hero_article_image]">` na każdej stronie artykułu.

### CLS (Cumulative Layout Shift)

- ✅ Większość obrazów ma `width` i `height` – dobra praktyka zapobiegająca CLS.
- ⚠️ `kontakt.html` L6323–L6329: obrazy w galerii bez `width`/`height` – ryzyko CLS.
- ⚠️ Cookie banner pojawia się z opóźnieniem (setTimeout 500ms) – potencjalny CLS jeśli pojawi się nad treścią.

### INP (Interaction to Next Paint)

- ❌ `page-transition.js` dodaje 650ms opóźnienia nawigacji (line 86: `setTimeout(() => window.location.href = targetUrl, 650)`). Każde kliknięcie linku wewnętrznego czeka 650ms. To **bardzo wysoki TBT** dla użytkowników mobilnych.
- ❌ Three.js + GLTFLoader ładowane synchronicznie na stronie głównej blokują główny wątek.
- ⚠️ Firebase SDK ładowany przez `<script type="module">` – asynchroniczny, mniejszy problem.

**Naprawa:** `defer` na Three.js; rozważenie skrócenia `setTimeout` w `page-transition.js` lub zastąpienia `View Transitions API`.

---

## M. Plan wdrożenia

### Etap 1 – Problemy krytyczne (czas: 1–2 dni)
1. [P01] Ekstrakcja inline CSS do `/style.css` (wszystkie strony)
2. [P02, P03] Naprawa canonical i og:url w `fundacja-beehouses.html` i `rekrutacja-do-fundacji-beehouses.html`
3. [P04] Naprawa relative og:image na absolute URL we wszystkich plikach
4. [P05] Naprawa linków nawigacyjnych z `.html` na czyste ścieżki

### Etap 2 – Najważniejsze poprawki SEO (czas: 2–3 dni)
5. [P08] Usunięcie duplikatu gtag.js (tylko GTM)
6. [P06] Dodanie `defer` do skryptów Three.js
7. [P09] Dodanie `noindex` do `stopka-mailowa.html`
8. [P10] Naprawa ścieżek w JSON-LD (relative → absolute)
9. [P11] Usunięcie błędnego `SearchAction` ze schema WebSite
10. [P17] Usunięcie ukrytego tekstu z H1 na stronach głównych

### Etap 3 – Wydajność (czas: 3–5 dni)
11. [P07] Optymalizacja modelu 3D Flyingbee.glb (Draco compression, lazy load)
12. [P13] Zmiana nazw obrazów WebP na opisowe + aktualizacja referencji
13. [P14] Konwersja JPEG do WebP
14. Dodanie preload hero na podstronach artykułów
15. Optymalizacja Cookie Banner (unikanie CLS)

### Etap 4 – Rozwój treści i schema (czas: 1–2 tygodnie)
16. Dodanie `BreadcrumbList` do artykułów
17. Uzupełnienie schema `NewsArticle` (publisher, description, absolutne URL)
18. Dodanie `ContactPage` schema do `/kontakt`
19. Dodanie `AboutPage` schema do `/o-mnie`
20. Uzupełnienie linkowania wewnętrznego kontekstowego
21. Rozważenie stron z tagami (zamiast `href="#"`)

### Etap 5 – Monitoring (ciągły)
22. Podpięcie Google Search Console i oczekiwanie na ponowną indeksację po naprawie canonical
23. Konfiguracja alertów w GSC (błędy indeksowania)
24. Testy PageSpeed Insights po ekstrakcji CSS
25. Testy Facebook Sharing Debugger po naprawie og:image

---

## N. Elementy wymagające danych zewnętrznych

| Element | Narzędzie | Co sprawdzić |
|---|---|---|
| Rzeczywista indeksacja stron | Google Search Console | Które strony są zaindeksowane, błędy crawlowania, canonical issues |
| CTR i pozycje organiczne | Google Search Console → Performance | Na jakie frazy pojawia się strona, jaki jest CTR |
| Core Web Vitals z danych terenowych (CrUX) | PageSpeed Insights, GSC CWV report | Realne dane mobilnych użytkowników |
| Backlinks / profil linków | Ahrefs / Semrush | Ile domen zewnętrznych linkuje do strony |
| Profil Google Business Profile | Google Maps | Czy Beehouses Foundation ma zweryfikowaną wizytówkę |
| Wolumen fraz kluczowych | Senuto / Surfer / Semrush | Potencjał fraz jak "ochrona zapylaczy", "młodożeżowy sejmik Kujawsko-Pomorski" |
| Analiza konkurencji | Semrush / Ahrefs | Inne strony rankingujące na te same frazy |
| Firebase Security Rules | Firebase Console | Czy dane w Firestore są odpowiednio zabezpieczone |
| Aktualny stan indeksowania po naprawach | Google Search Console | Weryfikacja efektów naprawy canonical (kilka tygodni po wdrożeniu) |

---

## Rekomendowany pierwszy pakiet wdrożeniowy

Poniższe 10 zmian jest **bezpiecznych, nie zmienia designu, nie wymaga decyzji biznesowych** i daje natychmiastowy, mierzalny efekt:

| # | Zmiana | Plik(i) | Zakres |
|---|---|---|---|
| 1 | Naprawa canonical `fundacja-beehouses` | `fundacja-beehouses.html` L39 | `/fundacja` → `/fundacja-beehouses` |
| 2 | Naprawa canonical `rekrutacja` | `rekrutacja-do-fundacji-beehouses.html` L43 | `/rekrutacja` → `/rekrutacja-do-fundacji-beehouses` |
| 3 | Naprawa og:url `fundacja-beehouses` | `fundacja-beehouses.html` L43 | `/fundacja` → `/fundacja-beehouses` |
| 4 | Naprawa og:url `rekrutacja` | `rekrutacja-do-fundacji-beehouses.html` L47 | `/rekrutacja` → `/rekrutacja-do-fundacji-beehouses` |
| 5 | Zmiana all `og:image` na absolute URL | Wszystkie HTML | `/images/...` → `https://zuzanna-czuprynska.pl/images/...` |
| 6 | Zmiana all `twitter:image` na absolute URL | Wszystkie HTML | `/images/...` → `https://zuzanna-czuprynska.pl/images/...` |
| 7 | Noindex dla stopka-mailowa | `stopka-mailowa.html` | Dodanie `<meta name="robots" content="noindex, nofollow">` |
| 8 | `defer` dla Three.js | `index.html` L9897–L9899 | `<script src="...three.min.js" defer>` itd. |
| 9 | Usunięcie gtag.js (zostawienie GTM) | Wszystkie HTML L20–L28 | Usunięcie 3 linii ze wszystkich plików |
| 10 | Naprawa linków nawigacyjnych z `.html` | Wszystkie HTML (nav + footer) | `fundacja-beehouses.html` → `/fundacja-beehouses` (i analogicznie rekrutacja) |
