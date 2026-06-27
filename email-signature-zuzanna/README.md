# Profesjonalna Animowana Stopka Mailowa - Zuzanna Maria Czupryńska

Pakiet zawiera kompletną, profesjonalnie zaprojektowaną i zoptymalizowaną stopkę mailową (wersje animowane i statyczne) dla Zuzanny Marii Czupryńskiej, wykonaną od podstaw jako naturalne rozszerzenie identyfikacji wizualnej jej oficjalnej witryny ("Organic Luxury").

---

## 1. Koncepcja i Stylistyka

Projekt stopki nawiązuje bezpośrednio do design systemu strony głównej:
* **Kadrowanie fotografii:** Portret Zuzanny został wykadrowany do proporcji **130x170 px** i zamknięty w klasycznym kształcie łuku (*arch* / *portal*), który odpowiada głównemu motywowi graficznemu portretów na stronie (np. w sekcji hero `border-radius: 200px 200px 0 0`). Dodatkowo nałożono delikatną sepia (8%) i zwiększono kontrast, by dopasować grading zdjęcia do klimatu witryny.
* **Typografia:** Użycie fontu szeryfowego *Cormorant Garamond* (nazwisko pisane kursywą, spójnie ze stopką strony) w zestawieniu z geometrycznym sans-serifem *Plus Jakarta Sans* w sloganach i linkach.
* **Kolorystyka:** Ciepłe organiczne tło `#F9F8F6` (var `--bg-paper`), głęboka leśna zieleń tekstów `#1A2E28` (var `--text-primary`), zgaszony grafitowy szary `#5C6B66` (var `--text-secondary`), szałwiowe hasło `#73827D` (var `--text-light`) i akcenty w kolorze stonowanego złota `#C5A065` (var `--accent-gold`).
* **Linia podziału:** Cienka linia o wysokości 1px z gradientowym rozmyciem na końcach, tworząca lekki, nowoczesny separator.
* **Ruch (Motion Design):** Animacja trwa ok. 1.2s. Elementy wchodzą płynnie z delikatnym efektem *fade-in* i przesunięciem pionowym (slide-up) opartym na krzywej łagodnego hamowania `ease-out-cubic`. Linia dividera rozwija się od lewej do prawej (*draw-on*).

---

## 2. Struktura plików w folderze `/email-signature-zuzanna/`

* `index-preview.html` — interaktywna makieta wiadomości e-mail umożliwiająca szybkie przełączanie i testowanie wszystkich 4 wersji stopki.
* `zuzanna-signature-local.html` — szablon stopki animowanej korzystający z lokalnych zasobów w katalogu `/assets/`.
* `zuzanna-signature-production.html` — gotowy produkcyjny kod HTML stopki animowanej (linki do grafik wskazują na serwer).
* `zuzanna-signature-local-static.html` — szablon stopki statycznej z lokalnymi grafikami PNG.
* `zuzanna-signature-production-static.html` — gotowy produkcyjny kod HTML stopki statycznej (linki wskazują na serwer).
* `zuzanna-signature-demo.gif` — zapętlona, pełna animacja stopki (karty) do celów demonstracyjnych i prezentacji.
* `zuzanna-signature-static.png` — pełny statyczny podgląd finalnego stanu stopki.
* `preview-screenshot.png` — estetyczny zrzut ekranu przedstawiający stopkę w oknie klienta pocztowego.
* `animation-contact-sheet.png` — stykówka (contact sheet) prezentująca klatki animacji w odstępach czasu (0.0s, 0.2s, 0.4s, 0.6s, 0.8s, 1.0s, 1.2s, stan końcowy).
* `/assets/` — folder z plikami źródłowymi (fonty TTF, ikony 50x50, oryginalny portret) oraz lokalnymi grafikami stopki.
* `/upload/email-signature/` — **folder zawierający gotowe grafiki produkcyjne (GIF-y oraz PNG), które należy przesłać na serwer.**

---

## 3. Instrukcja wdrożenia na serwer

Aby stopka produkcyjna (`zuzanna-signature-production.html` lub `zuzanna-signature-production-static.html`) działała poprawnie, należy przesłać całą zawartość folderu `/upload/email-signature/` na serwer strony Zuzanny Czupryńskiej do katalogu o ścieżce:
`/email-signature/`

Dzięki temu grafiki będą dostępne pod adresami typu:
`https://www.zuzanna-czuprynska.pl/email-signature/portrait.gif`

---

## 4. Instrukcja instalacji stopki w programach pocztowych

Przed instalacją upewnij się, że grafiki zostały wgrane na serwer, a plik `zuzanna-signature-production.html` otwiera się w przeglądarce i poprawnie wyświetla wszystkie elementy.

### A. Gmail (Wersja przeglądarkowa)
1. Otwórz plik `zuzanna-signature-production.html` (lub wersję `-static.html`) w przeglądarce (Chrome, Safari, Firefox).
2. Zaznacz całą stopkę (skrót **Ctrl+A** lub **Cmd+A**) i skopiuj ją (**Ctrl+C** lub **Cmd+C**).
3. Wejdź w ustawienia Gmaila (ikona koła zębatego -> *Zobacz wszystkie ustawienia* -> zakładka *Ogólne*).
4. Przewiń w dół do sekcji **Podpis**.
5. Kliknij *Utwórz nowy*, nazwij go, a następnie wklej stopkę (**Ctrl+V** lub **Cmd+V**) do pola edycji.
6. Ustaw nowo utworzony podpis jako domyślny dla nowych wiadomości i odpowiedzi.
7. Zaznacz opcję *"Wstaw podpis przed cytowanym tekstem..."* i zapisz zmiany na samym dole strony.

### B. Apple Mail (macOS)
1. Otwórz plik `zuzanna-signature-production.html` w przeglądarce i skopiuj całą zawartość.
2. W programie Apple Mail wejdź w *Mail* -> *Ustawienia* -> zakładka *Podpisy*.
3. Kliknij ikonę `+` aby dodać nowy podpis.
4. **Odznacz** opcję *"Zawsze dopasowuj do mojego domyślnego fontu wiadomości"*.
5. Wklej stopkę do pola edycji. Grafiki mogą chwilowo nie wyświetlać się w oknie edytora Apple Mail (często widać puste ramki), ale załadują się poprawnie przy tworzeniu nowej wiadomości.

### C. Microsoft Outlook (Klasyczny / Nowy / Web)
1. Skopiuj stopkę z poziomu przeglądarki.
2. W Outlooku wejdź w *Ustawienia* (Ustawienia -> Poczta -> Redagowanie i odpowiadanie -> Podpisy).
3. Utwórz nowy podpis, wklej skopiowaną stopkę i zapisz.
*Uwaga dla starszych wersji Outlooka:* Program Outlook korzysta z silnika renderującego Worda, który nie obsługuje animowanych GIF-ów w wiadomościach wychodzących (wyświetla tylko ich pierwszą klatkę). Projekt stopki uwzględnia to ograniczenie – **pierwsza klatka każdego GIF-a została zaprogramowana jako pełny, statyczny stan końcowy stopki**. Dzięki temu w Outlooku stopka wyświetli się jako w pełni profesjonalny podpis statyczny (identycznie jak wersja PNG).

---

## 5. Jak zmodyfikować dane lub wymienić zdjęcie?

### Wymiana portretu:
1. Podmień plik [portrait_orig.jpg](file:///Users/piotrjuskowiak/Desktop/Projekty/zuzanna%20czupry%C5%84ska/email-signature-zuzanna/assets/portrait_orig.jpg) w folderze `/assets/` na nowe zdjęcie (najlepiej w wysokiej rozdzielczości pionowej).
2. W razie potrzeby dostosuj współrzędne kadrowania `px`, `py` oraz szerokość `pw` i wysokość `ph` w pliku `generate_signature.py` (linia ok. 195-200), aby idealnie wycentrować kadr na twarzy.

### Zmiana danych tekstowych:
1. Otwórz plik `generate_signature.py` w edytorze kodu.
2. Zmodyfikuj teksty w funkcjach rysujących:
   * Slogan: zmień ciąg w `draw_slogan` (linia ok. 120).
   * Imię i nazwisko: zmień ciągi w `draw_name` (linia ok. 130).
   * Rola: zmień ciąg w `draw_role` (linia ok. 140).
   * Hasło: zmień ciąg w `draw_quote` (linia ok. 190).

### Ponowne wygenerowanie stopki:
Po wprowadzeniu jakichkolwiek zmian, uruchom w terminalu skrypt:
```bash
python3 email-signature-zuzanna/generate_signature.py
```
Skrypt automatycznie wygeneruje nowe, zoptymalizowane pod kątem wagi i płynności ruchów GIF-y i PNG, zaktualizuje demo, contact-sheet oraz zrzut ekranu. Następnie skopiuj nowo wygenerowane pliki z `/upload/email-signature/` do folderu `/assets/` (lub uruchom gotowe polecenie kopiowania).
