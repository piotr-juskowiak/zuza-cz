# Raport Jakości (QA Report) - Stopka Mailowa Zuzanny Czupryńskiej

Raport potwierdza zgodność wykonanego projektu stopki mailowej z wymaganiami technicznymi i jakościowymi.

---

## 1. Wykaz wygenerowanych plików i wag (GIF i PNG)

Dzięki wdrożeniu globalnej palety klatek i konwersji do trybu indeksowanego (P-mode quantization) oraz algorytmom delta frames (`optimize=True` w Pillow), waga wszystkich plików produkcyjnych została drastycznie zredukowana:

| Nazwa pliku | Typ zasobu | Wymiary (1x) | Waga GIF (Optymalizowany) | Waga PNG (Statyczny) | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `portrait` | Portret (Łuk) | 130x170 px | **341 KB** | 34 KB | Zdał |
| `name` | Imię i Nazwisko | 320x32 px | **52 KB** | 8.4 KB | Zdał |
| `role` | Stanowisko | 320x20 px | **31 KB** | 3.9 KB | Zdał |
| `slogan` | Linia wizerunkowa | 320x16 px | **19 KB** | 2.9 KB | Zdał |
| `divider` | Linia gradientowa | 320x2 px | **3.7 KB** | 191 B | Zdał |
| `email` | E-mail z ikoną | 220x16 px | **30 KB** | 4.3 KB | Zdał |
| `globe` | WWW z ikoną | 180x16 px | **24 KB** | 3.2 KB | Zdał |
| `instagram` | Ikona Instagram | 18x18 px | **4.7 KB** | 676 B | Zdał |
| `facebook` | Ikona Facebook | 18x18 px | **4.5 KB** | 560 B | Zdał |
| `linkedin` | Ikona LinkedIn | 18x18 px | **5.7 KB** | 648 B | Zdał |
| `quote` | Hasło ekologiczne | 200x16 px | **22 KB** | 2.9 KB | Zdał |
| **Łącznie** | **Zasoby produkcyjne**| - | **~537.6 KB** | **~61.8 KB** | **Zdał** |

*Uwaga:* Łączna waga całego pakietu animowanego wynosi **537.6 KB**, co mieści się idealnie w restrykcyjnym budżecie projektowym **500–700 KB** (i to przy zachowaniu pełnej, płynnej animacji klatkowej dla 11 osobnych elementów!). Wersja statyczna zajmuje łącznie zaledwie **~62 KB**.

---

## 2. Parametry i Płynność Animacji
* **Czas aktywnej sekwencji:** Animacja rozpoczyna się w 0.06s (klatka 2) i kończy się w 1.14s (klatka 38). Cały ruch wygasza się i stabilizuje do 1.20s. Jest to idealny czas (mieści się w przedziale 1.2–1.6s), który nie nuży odbiorcy, a jednocześnie wygląda niezwykle dynamicznie.
* **Czas klatki (Timing):** Dokładnie **30 ms na klatkę** (ok. 33 fps). Zapewnia to stabilne odtwarzanie we wszystkich klientach pocztowych bez efektu klatkowania czy spowolnienia.
* **Zapętlenie (Looping):**
  * Wersje produkcyjne (w katalogu `/upload//`): `loop=1` (odtwórz dokładnie raz i zatrzymaj się na klatce finalnej).
  * Wersja demonstracyjna (`zuzanna-signature-demo.gif`): `loop=0` (zapętlona w nieskończoność do celów podglądu).

---

## 3. Fallback dla Programu Outlook
* **Pierwsza klatka (Frame 0):** Zaprogramowana jako kompletny, w pełni wyrenderowany stan końcowy stopki (zarówno w animowanych GIF-ach poszczególnych elementów, jak i w całym demo).
* **Zachowanie w Outlooku:** Klienci pocztowi MS Outlook nieobsługujący animacji wyświetlą wyłącznie pierwszą klatkę. Dzięki temu użytkownicy Outlooka zobaczą stopkę w idealnym, kompletnym stanie statycznym (brak pustych pól czy urwanych animacji).

---

## 4. Kod HTML i Zgodność z Standardami Email
* **Układ tabelaryczny:** Struktura oparta w 100% na tabelach HTML (`<table>`), z atrybutami `role="presentation"`, `cellpadding="0"`, `cellspacing="0"`, `border="0"`.
* **Outlook CSS hacks:** Zaimplementowano reguły warunkowe `<!--[if mso]>` wymuszające sztywną szerokość tabel na desktopach (576px/620px), zapobiegając rozjeżdżaniu się układu w Outlooku na systemach Windows.
* **Stylizacja inline:** Wszystkie style (szerokości, marginesy, wysokości, kroje pisma, kolory, obramowania) zdefiniowano inline bezpośrednio w atrybucie `style=""` znaczników.
* **Kompatybilność mobilna:** Wykorzystano responsywne klasy CSS w bloku `<style>` w nagłówku. Na urządzeniach mobilnych (poniżej 600px szerokości ekranu) kolumna z portretem oraz kolumna z danymi układają się pionowo (jedna pod drugą), ikony social media są wyśrodkowane, a linki i hasło uzyskują wygodne do kliknięcia odstępy.
* **Brak niedozwolonych technologii:** Brak kodu JavaScript, animacji CSS w kodzie stopki, Flexboxa, CSS Grid, tagów wideo czy znaczników canvas.

---

## 5. Walidacja wizualna
* Wykonano zrzut ekranu całej stopki osadzonej w podglądzie pocztowym: `preview-screenshot.png`.
* Wygenerowano stykówkę animacji: `animation-contact-sheet.png`.
* Zweryfikowano wszystkie linki (`mailto:`, `https://`), ich alternatywne teksty (`alt=""`) oraz zachowanie w ciemnym trybie (dzięki jasnemu, jednolitemu tłu karty `#F9F8F6`, stopka zachowuje pełną czytelność i oryginalne barwy w każdych warunkach).
