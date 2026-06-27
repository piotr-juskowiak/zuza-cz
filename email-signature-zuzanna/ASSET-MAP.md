# Mapa Zasobów (Asset Map) - Stopka Mailowa Zuzanny Czupryńskiej

Ten dokument opisuje pochodzenie i parametry wszystkich zasobów graficznych, typograficznych oraz kolorystycznych użytych do stworzenia stopki mailowej.

## 1. Fotografia (Portret)
* **Plik źródłowy w projekcie:** [portrait_orig.jpg](file:///Users/piotrjuskowiak/Desktop/Projekty/zuzanna%20czupry%C5%84ska/email-signature-zuzanna/assets/portrait_orig.jpg) (1206x1471 px)
* **Odpowiednik na stronie produkcyjnej:** Zdjęcie z sekcji Hero strony głównej (`https://i.imgur.com/pzhgBM6.jpeg`).
* **Zastosowane kadrowanie:** Wycięcie twarzy i ramion do proporcji **130x170 px** (skala 3x do renderowania: 390x510 px).
* **Maska:** Kształt łuku (*arch*) o promieniu zaokrąglenia góry `65px` (`195px` w skali 3x), spójny z ramkami zdjęć na stronie (np. w sekcji hero `border-radius: 200px 200px 0 0`).
* **Korekcja:** Zastosowano filtr sepia (8%) oraz zwiększono kontrast o 5% w celu dopasowania gradingu do stylu fotografii na stronie (`filter: sepia(10%) contrast(1.05)`).

## 2. Typografia (Fonty)
Fonty zostały zaczerpnięte z zasobów lokalnych projektu w folderze `assets/fonts/`:
* **Cormorant Garamond Regular** (`CormorantGaramond.ttf`): Użyty do zapisu imion "Zuzanna Maria" w logotypie stopki.
* **Cormorant Garamond Italic** (`CormorantGaramond-Italic.ttf`): Użyty do zapisu nazwiska "Czupryńska" (spójnie z zapisem w stopce strony), stanowiska "Fundatorka i Prezes Beehouses Foundation" oraz hasła "Przyszłość buduje się od natury.".
* **Plus Jakarta Sans Medium** (`PlusJakartaSans-Medium.ttf`): Użyty do zapisu górnej linii wizerunkowej "KOBIETA · AKTYWISTKA · LIDERKA" (z rozstrzeleniem liter) oraz linków kontaktowych i etykiet.

## 3. Kolorystyka
Paleta pobrana bezpośrednio ze zmiennych CSS strony głównej (`:root` w `index.html`):
* **Tło stopki (Karta):** `#F9F8F6` (odpowiednik `var(--bg-paper)`) – ciepły, organiczny odcień papieru.
* **Tekst główny:** `#1A2E28` (odpowiednik `var(--text-primary)`) – głęboka leśna zieleń.
* **Tekst dodatkowy:** `#5C6B66` (odpowiednik `var(--text-secondary)`) – ciemny grafitowy szary o odcieniu szałwii.
* **Tekst hasła (Quote):** `#8E9C98` (odpowiednik `var(--text-light)`) – jasna szałwiowa szarość.
* **Złoty akcent:** `#C5A065` (odpowiednik `var(--accent-gold)`) – ciepłe, stonowane złoto użyte do linii rozdzielającej oraz ikon.

## 4. Ikony
* **Lokalizacja:** `email-signature-zuzanna/assets/icons/`
* **Pliki:** `mail.png`, `globe.png`, `instagram.png`, `facebook.png`, `linkedin.png`
* **Wymiary oryginalne:** 50x50 px, format PNG z przezroczystością.
* **Kolorystyka:** Kolor dominujący `#C5A065` (brandowy złoty).
* **Przekształcenia:** Skalowane z wygładzaniem Lanczos do rozmiaru **14x14 px** dla ikon kontaktowych oraz **20x20 px** dla social media.
