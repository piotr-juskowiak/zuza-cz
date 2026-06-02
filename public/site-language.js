(function () {
    const STORAGE_KEY = 'preferredLanguage';
    const VALID_LANGS = new Set(['pl', 'en']);
    const originalText = new WeakMap();
    const originalAttrs = new WeakMap();
    let currentLang = 'pl';
    let isApplying = false;
    let queued = false;

    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();

    const t = {
        // Common navigation and UI
        'O mnie': 'About',
        'Rekrutacja': 'Recruitment',
        'Fundacja': 'Foundation',
        'Aktualności': 'News',
        'Kontakt': 'Contact',
        'Wsparcie': 'Support',
        'Strona główna': 'Home',
        'Język strony': 'Site language',
        'Polski': 'Polish',
        'Język': 'Language',
        'Aktualnie wybrany': 'Current selection',
        'English version': 'English version',
        'Polska wersja': 'Polish version',
        'Dostępny': 'Available',
        'Zobacz więcej': 'See more',
        'Napisz do mnie': 'Write to me',
        'Napisz': 'Write',
        'Napisz wiadomość': 'Write a message',
        'Zaproś': 'Invite',
        'Wyślij zaproszenie': 'Send an invitation',
        'Opisz współpracę': 'Describe the collaboration',
        'Obserwuj': 'Follow',
        'Zobacz profil': 'View profile',
        'Czytaj dalej': 'Read more',
        'Czytaj więcej': 'Read more',
        'Szczegóły': 'Details',
        'Odśwież stronę': 'Refresh page',
        'Wysyłanie...': 'Sending...',
        'Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy w ciągu 24 godzin.': 'Thank you! Your message has been sent. We will reply within 24 hours.',
        'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.': 'An error occurred while sending the message. Please try again later.',
        'Wystąpił błąd podczas zapisywania. Spróbuj ponownie później.': 'An error occurred while saving. Please try again later.',
        'Wystąpił błąd. Spróbuj ponownie później.': 'An error occurred. Please try again later.',
        'Błąd ładowania wydarzeń': 'Error loading events',
        'Nie udało się załadować harmonogramu wydarzeń. Spróbuj odświeżyć stronę.': 'The event schedule could not be loaded. Please refresh the page.',
        'Nadchodzące wydarzenie': 'Upcoming event',
        'Nadchodzące': 'Upcoming',
        'Wkrótce': 'Soon',
        'Przeszłe': 'Past',
        'min czytania': 'min read',
        'min': 'min',
        'Przesuń': 'Swipe',
        'Cookies': 'Cookies',
        'Newsletter': 'Newsletter',
        'Mapa Strony': 'Sitemap',
        'Polityka Prywatności': 'Privacy Policy',
        'Polityka prywatności': 'Privacy policy',
        'Nawigacja': 'Navigation',
        'Projekty': 'Projects',
        'Projekt': 'Project',
        'O stronie': 'About this site',
        'Bądź na bieżąco z najważniejszymi sprawami.': 'Stay up to date with the most important work.',
        '© 2025 Zuzanna Maria Czupryńska. Wszelkie prawa zastrzeżone.': '© 2025 Zuzanna Maria Czupryńska. All rights reserved.',
        'Głos nowego pokolenia.': 'A voice of the new generation.',
        'Budujemy Polskę, która szanuje naturę i inwestuje w przyszłość.': 'We are building a Poland that respects nature and invests in the future.',
        'Oficjalna strona internetowa Zuzanny Marii Czupryńskiej — aktywistki, fundatorki Beehouses Foundation i głosu nowego pokolenia w polskiej polityce.': 'Official website of Zuzanna Maria Czupryńska — activist, founder of Beehouses Foundation, and a voice of a new generation in Polish public life.',

        // Support and cookies
        'Dołącz do inicjatywy': 'Join the initiative',
        'Wsparcie działalności': 'Support the work',
        'Dziękuję za chęć zaangażowania się w moją pracę. Razem możemy budować przyszłość, która szanuje naturę i wspiera zieloną transformację.': 'Thank you for wanting to get involved in my work. Together we can build a future that respects nature and supports the green transition.',
        'Skontaktuj się ze mną': 'Contact me',
        'Szanujemy Twoją Prywatność': 'We Respect Your Privacy',
        'Strona wykorzystuje pliki cookies do prawidłowego działania. Kontynuując, akceptujesz naszą politykę': 'This site uses cookies to function properly. By continuing, you accept our',
        'Używamy plików cookies. Klikając „Akceptuję" wyrażasz zgodę zgodnie z naszą Polityką Prywatności.': 'We use cookies. By clicking "Accept", you consent according to our Privacy Policy.',
        'Akceptuję': 'Accept',
        'Akceptuję Wszystkie': 'Accept all',

        // Homepage hero and about
        'Kobieta · Aktywistka · Liderka': 'Woman · Activist · Leader',
        'Przyszłość': 'The future',
        'buduje się': 'is built',
        'zaczyna się': 'begins',
        'zmienia się': 'changes',
        'kwitnie': 'blooms',
        'od natury.': 'with nature.',
        'Buduję mosty między pokoleniami, walcząc o nowoczesną edukację i środowisko. Dołącz do dialogu o Polsce jutra.': 'I build bridges between generations, advocating for modern education and the environment. Join the conversation about tomorrow\'s Poland.',
        'Poznaj moją wizję': 'Discover my vision',
        'Założycielka': 'Founder',
        'Edukacja ekologiczna, ochrona zapylaczy i lokalne projekty, które budują realną zmianę.': 'Ecological education, pollinator protection, and local projects that create real change.',
        'Asystentka wiceministra': 'Assistant to the Deputy Minister',
        'Asystentka posłanki': 'Assistant to an MP',
        'Parlamentarzystka': 'Young Parliament member',
        'Parlamentu Młodych RP': 'Young Parliament of Poland',
        'Fundatorka & prezes': 'Founder & President',
        'Koordynatorka': 'Coordinator',
        'Pasja, która': 'Passion that',
        'zmienia rzeczywistość': 'changes reality',
        'Moja droga nie zaczęła się w gabinetach, ale w działaniu. Od lokalnych inicjatyw w Brodnicy, przez salę plenarną Parlamentu Młodych RP, aż po zarządzanie ogólnopolskimi projektami. Wierzę, że polityka to nie gra interesów, ale narzędzie do budowania zrównoważonej przyszłości.': 'My path did not begin in offices, but in action. From local initiatives in Brodnica, through the plenary hall of the Young Parliament of Poland, to managing nationwide projects. I believe politics is not a game of interests, but a tool for building a sustainable future.',
        'Łączę perspektywę prawniczą z wrażliwością ekologiczną. Jako Założycielka': 'I combine a legal perspective with ecological sensitivity. As the founder of',
        'udowadniam, że edukacja może być innowacyjna, a jako aktywistka walczę o to, by głos mojego pokolenia był słyszalny przy tworzeniu prawa.': 'I show that education can be innovative, and as an activist I fight for my generation\'s voice to be heard when law is created.',
        'Głos Nowego Pokolenia': 'Voice of a New Generation',
        'Wprowadzam perspektywę młodych do debaty publicznej': 'I bring young people\'s perspective into public debate',
        'Ekologia w Działaniu': 'Ecology in Action',
        'Łączę edukację ekologiczną z realną ochroną przyrody wokół nas': 'I connect ecological education with real protection of nature around us',
        'Moja ścieżka': 'My path',
        'Doświadczenie i Rozwój': 'Experience and Growth',
        '2025 - Obecnie': '2025 - Present',
        '2023 - Obecnie': '2023 - Present',
        'Radna': 'Council member',
        'Młodzieżowy Sejmik Województwa Kujawsko-Pomorskiego': 'Youth Assembly of the Kuyavian-Pomeranian Voivodeship',
        'Praca na rzecz województwa, wspieranie rozwoju regionalnego i innowacji.': 'Work for the region, supporting regional development and innovation.',
        'Asystentka Posłanki': 'Assistant to an MP',
        'Biuro Iwony Karolewskiej': 'Office of Iwona Karolewska',
        'Wsparcie w działaniach poselskich oraz realizacja inicjatyw na rzecz regionu.': 'Support in parliamentary work and regional initiatives.',
        'Asystentka Społeczna': 'Social assistant',
        'Biuro Arkadiusza Myrchy': 'Office of Arkadiusz Myrcha',
        'Wsparcie w organizacji działań posła na rzecz wyborców oraz promowanie wizerunku.': 'Support in organizing an MP\'s work for constituents and communication activities.',
        'Zarządzanie projektami ekologicznymi, rozwój edukacji na temat bioróżnorodności.': 'Managing ecological projects and developing education about biodiversity.',
        'Aktywny udział w obradach i pracach legislacyjnych na rzecz młodzieży.': 'Active participation in debates and legislative work for young people.',
        'Gdzie mnie spotkasz': 'Where to meet me',
        'Harmonogram Wydarzeń': 'Event schedule',
        'Sejm RP': 'Polish Parliament',
        'Aktywna praca w Sejmie Rzeczypospolitej Polskiej na rzecz ekologii i przyszłości kraju': 'Active work in the Polish Parliament for ecology and the country\'s future',
        'Aktywny udział w obradach VIII i IX kadencji': 'Active participation in the 8th and 9th term sessions',
        'Projekt Beehouses': 'Beehouses Project',
        'Innowacyjna edukacja ekologiczna i ochrona dzikich zapylaczy': 'Innovative ecological education and protection of wild pollinators',
        'Co nowego na socialach': 'What\'s new on social media',
        'Obserwuj @zuzanna_czuprynska': 'Follow @zuzanna_czuprynska',
        'Porozmawiajmy o wspólnych celach': 'Let\'s talk about shared goals',
        'Jeśli masz pytania lub propozycje współpracy, napisz do mnie.': 'If you have questions or collaboration ideas, write to me.',
        'Wyślij wiadomość': 'Send message',

        // About page
        'Kim': 'Who',
        'jestem?': 'am I?',
        'Aktywistka, Posłanka Parlamentu Młodych, Założycielka Beehouses Foundation. Buduję przyszłość, w której ekologia i odpowiedzialność idą w parze.': 'Activist, Young Parliament member, founder of Beehouses Foundation. I am building a future where ecology and responsibility go hand in hand.',
        'Kadencja': 'Term',
        'Parlamentu': 'of Parliament',
        'Wierzę, że polityka to nie gra gabinetowa, lecz żywy dialog pokoleń i realne działanie. Jako': 'I believe politics is not an office game, but a living dialogue between generations and real action. As a',
        'Posłanka IX Kadencji Parlamentu Młodych RP': 'member of the 9th term of the Young Parliament of Poland',
        'i studentka prawa, łączę aktywizm z wiedzą merytoryczną, dążąc do tworzenia nowoczesnego, sprawiedliwego prawa. Moja droga to nie tylko debaty, ale przede wszystkim praca u podstaw na rzecz klimatu i społeczności lokalnych.': 'and a law student, I combine activism with substantive knowledge, working toward modern and fair law. My path is not only debates, but above all grassroots work for climate and local communities.',
        'Jako założycielka': 'As the founder of',
        'wdrażam innowacyjną edukację ekologiczną i buduję miejskie oazy dla dzikich zapylaczy, udowadniając, że ochrona przyrody może iść w parze z rozwojem. Z kolei koordynując inicjatywę': 'I implement innovative ecological education and build urban oases for wild pollinators, proving that nature protection can go hand in hand with development. While coordinating the',
        'wspieram młode kobiety w rozwijaniu ich kompetencji liderskich. Od sali sejmowej po zielone ogrody Brodnicy, konsekwentnie tworzę fundamenty pod wrażliwą społecznie i ekologicznie przyszłość.': 'initiative, I support young women in developing their leadership skills. From the parliamentary hall to green gardens in Brodnica, I consistently build foundations for a socially sensitive and ecological future.',
        'Prawo': 'Law',
        'Ekologia': 'Ecology',
        'Edukacja': 'Education',
        'Edukacja & Świadomość': 'Education & Awareness',
        'Wiedza i świadomość jako fundament trwałej zmiany.': 'Knowledge and awareness as the foundation of lasting change.',
        'Galeria': 'Gallery',
        'Chwile i': 'Moments and',
        'działania': 'actions',
        'Forum Ekonomiczne': 'Economic Forum',
        'Zamek Królewski w Warszawie': 'Royal Castle in Warsaw',
        'Święta państwowe': 'National holidays',
        'Święto Flagi i Konstytucji 3 Maja': 'Flag Day and Constitution of 3 May',
        'Spotkania w Skopje': 'Meetings in Skopje',
        'Zasiejmy Naturę': 'Let\'s Sow Nature',
        'Spotkanie z Wojewodą': 'Meeting with the Governor',
        'Samorząd': 'Local government',
        'XI Europejski Kongres Samorządów': '11th European Congress of Local Governments',
        '34. Finał WOŚP': '34th WOŚP Finale',

        // Recruitment page
        'Dołącz': 'Join',
        'do zespołu': 'the team',
        'Szukamy osób, które chcą działać odpowiedzialnie, uczyć się pracy publicznej i współtworzyć inicjatywy społeczne, ekologiczne oraz edukacyjne.': 'We are looking for people who want to act responsibly, learn public work, and co-create social, ecological, and educational initiatives.',
        'Rekrutacja otwarta': 'Recruitment open',
        'Dołącz do mojego zespołu': 'Join my team',
        'Zapraszam osoby, które chcą rozwijać się w działaniach społecznych, komunikacji, edukacji ekologicznej i organizacji projektów. Nie musisz mieć wieloletniego doświadczenia. Ważniejsze są odpowiedzialność, ciekawość świata i gotowość do regularnej pracy.': 'I invite people who want to grow in social action, communication, ecological education, and project organization. You do not need years of experience. Responsibility, curiosity, and readiness for regular work matter more.',
        'W zespole można zaangażować się w przygotowanie wydarzeń, prowadzenie komunikacji, research, kontakt z partnerami, działania lokalne oraz projekty związane z Beehouses Foundation. To przestrzeń dla osób, które chcą uczyć się przez praktykę i współtworzyć inicjatywy mające realny wpływ.': 'In the team, you can get involved in preparing events, communication, research, partner contact, local activities, and projects connected with Beehouses Foundation. It is a space for people who want to learn by doing and co-create initiatives with real impact.',
        'Wolontariat': 'Volunteering',
        'Komunikacja': 'Communication',
        'Wydarzenia': 'Events',
        'Współpraca': 'Collaboration',
        'Obszary': 'Areas',
        'Gdzie możesz': 'Where you can',
        'pomóc?': 'help?',
        'Tworzenie treści i social media': 'Content creation and social media',
        'Koordynacja inicjatyw społecznych': 'Coordination of social initiatives',
        'Organizacja spotkań i debat': 'Organizing meetings and debates',
        'Warsztaty i działania w szkołach': 'Workshops and school activities',
        'Akcje dla bioróżnorodności': 'Actions for biodiversity',
        'Lokalnie': 'Local',
        'Praca blisko mieszkańców': 'Work close to residents',
        'Jak aplikować': 'How to apply',
        'Wypełnij formularz': 'Fill out the form',
        'rekrutacyjny': 'recruitment',
        'Uzupełnij krótkie zgłoszenie w formularzu poniżej. Dzięki temu od razu wiemy, które obszary są Ci najbliższe i jak możemy najlepiej zaprosić Cię do współpracy.': 'Complete the short application form below. This helps us immediately understand which areas are closest to you and how we can best invite you to collaborate.',
        'Przejdź do formularza': 'Go to the form',
        'Otwórz w nowej karcie': 'Open in a new tab',
        'Formularz rekrutacyjny': 'Recruitment form',
        'Otwórz w Google Forms': 'Open in Google Forms',
        'Ładowanie…': 'Loading...',
        'Napisz kilka zdań': 'Write a few sentences',
        'o sobie': 'about yourself',
        'Opowiedz, w czym chcesz się rozwijać, ile czasu możesz poświęcić i które obszary są Ci najbliższe. Odpowiadamy osobom, z którymi możemy od razu porozmawiać o konkretnym zaangażowaniu.': 'Tell us what you want to develop, how much time you can dedicate, and which areas are closest to you. We reply to people with whom we can immediately discuss concrete involvement.',
        'Aplikuj mailowo': 'Apply by email',
        'Przejdź do kontaktu': 'Go to contact',
        'Krótka wiadomość': 'Short message',
        'Napisz, co Cię interesuje i jakie masz doświadczenie lub motywację.': 'Write what interests you and what experience or motivation you have.',
        'Rozmowa': 'Conversation',
        'Ustalamy, gdzie Twoje kompetencje najlepiej pasują do działań zespołu.': 'We determine where your skills best fit the team’s work.',
        'Pierwsze zadanie': 'First task',
        'Zaczynamy od konkretnego, realnego działania i wspólnego feedbacku.': 'We start with a concrete, real task and shared feedback.',

        // Foundation page
        'Organizacja łącząca innowacyjną ekologię z edukacją społeczną. Działamy na rzecz realnych zmian systemowych.': 'An organization combining innovative ecology with social education. We work for real systemic change.',
        'Odwiedź beehouses.org': 'Visit beehouses.org',
        'Nasza Misja': 'Our Mission',
        'Edukacja, Ochrona,': 'Education, Protection,',
        'Działanie': 'Action',
        'BeeHouses Foundation to organizacja, która łączy edukację ekologiczną, ochronę zagrożonych gatunków i promowanie zrównoważonego stylu życia. Działamy na styku nauki, natury i ludzkiej codzienności — bo wierzymy, że trwałe zmiany zaczynają się od świadomości.': 'BeeHouses Foundation is an organization that combines ecological education, protection of endangered species, and promotion of sustainable lifestyles. We work at the intersection of science, nature, and everyday life — because we believe lasting change begins with awareness.',
        'Pszczoły zapylają blisko 70% upraw żywności. Ich ochrona to nie tylko kwestia bioróżnorodności — to podstawa bezpieczeństwa żywnościowego nas wszystkich.': 'Bees pollinate nearly 70% of food crops. Protecting them is not only a matter of biodiversity — it is the foundation of food security for all of us.',
        'Laureatka "Srebrnego Wilka"': 'Silver Wolf Award laureate',
        'w ogólnopolskiej olimpiadzie Zwolnieni z Teorii': 'in the nationwide Zwolnieni z Teorii social project olympiad',
        'Nasze działania': 'Our work',
        'Projekty, które': 'Projects that',
        'Bioróżnorodność': 'Biodiversity',
        'Beehouses': 'Beehouses',
        'zasiejeMy': 'zasiejeMy',
        'To innowacyjna akcja edukacyjna skierowana do szkół, mająca na celu przybliżenie dzieciom znaczenia zapylaczy w przyrodzie i codziennym życiu człowieka.': 'An innovative educational campaign for schools, helping children understand the role of pollinators in nature and everyday life.',
        'Zobacz projekt': 'View project',
        'Beehouses zasiejeMy': 'Beehouses zasiejeMy',
        'Beehouses zasiejeMy to edukacyjna inicjatywa dla szkół, która pokazuje dzieciom, jak ważne są zapylacze i jak codzienne wybory wpływają na lokalną bioróżnorodność.': 'Beehouses zasiejeMy is an educational initiative for schools that shows children the importance of pollinators and how everyday choices affect local biodiversity.',
        'Warsztaty i materiały edukacyjne przybliżające temat pszczół, roślin miododajnych i ochrony siedlisk.': 'Workshops and educational materials about bees, nectar plants, and habitat protection.',
        'Działania skierowane do społeczności szkolnych, które łączą wiedzę przyrodniczą z praktyką.': 'Activities for school communities that combine nature knowledge with practice.',
        'Budowanie świadomości, że troska o zapylacze zaczyna się lokalnie: w ogrodzie, na balkonie, w szkole i w sąsiedztwie.': 'Building awareness that care for pollinators begins locally: in the garden, on the balcony, at school, and in the neighborhood.',
        'Przejdź do projektu': 'Go to project',

        // Contact page
        'Porozmawiajmy': 'Let\'s talk',
        'razem': 'together',
        'Jestem tutaj, by słuchać i działać. Napisz, zadzwoń lub odwiedź.': 'I am here to listen and act. Write, call, or visit.',
        'Obszary': 'Areas',
        'współpracy': 'of collaboration',
        'Angażuję się w tematy, które mają realny wpływ na życie ludzi i środowisko.': 'I focus on issues that have a real impact on people\'s lives and the environment.',
        'Zaproszenie do mediów': 'Media invitations',
        'Zapraszam redakcje, dziennikarzy i organizatorów programów do rozmów o ekologii, edukacji, ochronie zapylaczy i odpowiedzialnych działaniach społecznych.': 'I invite editorial teams, journalists, and program organizers to conversations about ecology, education, pollinator protection, and responsible social action.',
        'Zapraszam redakcje, dziennikarzy, podcasty i organizatorów programów do kontaktu w sprawie rozmów, komentarzy, paneli oraz materiałów eksperckich. Jestem dostępna w tematach ekologii, edukacji, ochrony zapylaczy i działań społecznych.': 'I invite editorial teams, journalists, podcasts, and program organizers to get in touch regarding interviews, comments, panels, and expert materials. I am available for topics related to ecology, education, pollinator protection, and social action.',
        'Współpraca i wsparcie działalności': 'Collaboration and support',
        'Projekty edukacyjne, ekologiczne, inicjatywy społeczne i naukowe oraz zaangażowanie w misję Beehouses Foundation na rzecz ochrony bioróżnorodności.': 'Educational and ecological projects, social and scientific initiatives, and engagement in the Beehouses Foundation mission to protect biodiversity.',
        'W sprawach wsparcia projektowego, zasięgowego lub partnerskiego proszę o wiadomość z krótkim opisem propozycji, zakresem zaangażowania oraz oczekiwaną formą współpracy.': 'For project, reach, or partnership support, please send a message with a brief description of the proposal, the scope of involvement, and the expected form of collaboration.',
        'Porozmawiajmy o': 'Let\'s talk about',
        'wspólnych celach': 'shared goals',
        'Jeśli masz pytania, propozycję współpracy lub chcesz poruszyć ważny temat – jestem tutaj. Odpowiadam osobiście.': 'If you have questions, a collaboration idea, or want to raise an important issue, I am here. I answer personally.',
        'Szybki kontakt': 'Quick contact',
        'Imię i nazwisko': 'Full name',
        'Adres email': 'Email address',
        'Temat wiadomości': 'Message subject',
        'Twoja wiadomość': 'Your message',

        // News page and article cards
        'Aktualne': 'Current',
        'inicjatywy': 'initiatives',
        'śledzę to, co ważne — od lokalnych projektów w Brodnicy po ogólnopolskie działania na rzecz ekologii i edukacji.': 'I follow what matters — from local projects in Brodnica to nationwide work for ecology and education.',
        'Przejdź do aktualności': 'Go to news',
        'Wiadomości': 'News',
        'Aktualności &': 'News &',
        'Inicjatywy': 'Initiatives',
        'Konkretne działania, które łączą edukację, ekologię i odpowiedzialność obywatelską w Brodnicy i całym kraju.': 'Concrete actions connecting education, ecology, and civic responsibility in Brodnica and across Poland.',
        'Leśnictwo': 'Forestry',
        'Nagrody': 'Awards',
        'Warsztaty': 'Workshops',
        '25 Kwi 2026': '25 Apr 2026',
        '20 Kwi 2026': '20 Apr 2026',
        '15 Kwi 2026': '15 Apr 2026',
        '05 Sie 2025': '05 Aug 2025',
        '15 Cze 2025': '15 Jun 2025',
        'Udział w pracach nad Narodowym Programem Leśnym': 'Participation in work on the National Forest Programme',
        'Udział w pracach nad Narodowym Programem Leśnym to ważna inicjatywa związana z przyszłością polskiego leśnictwa i odpowiedzialną ochroną zasobów naturalnych.': 'Participation in work on the National Forest Programme is an important initiative related to the future of Polish forestry and responsible protection of natural resources.',
        'Inicjatywa Brodnica Beehouses z nagrodą Srebrnego Wilka': 'Brodnica Beehouses initiative awarded the Silver Wolf',
        'Inicjatywa Brodnica Beehouses z prestiżową nagrodą Srebrnego Wilka': 'Brodnica Beehouses initiative receives the prestigious Silver Wolf award',
        'Projekt Brodnica Beehouses został doceniony podczas ogólnopolskiej gali. To wyróżnienie dla zespołu i dowód, że lokalne działania mogą mieć szeroki wpływ.': 'The Brodnica Beehouses project was recognized during a nationwide gala. This distinction honors the team and proves that local actions can have broad impact.',
        'Projekt Brodnica Beehouses 2025 – Edukacja o zapylaczach': 'Brodnica Beehouses 2025 Project – Pollinator Education',
        'Projekt Brodnica Beehouses 2025': 'Brodnica Beehouses 2025 Project',
        'Nowa edycja działań edukacyjnych pokazuje, jak ważną rolę pełnią zapylacze w ekosystemach i jak szkoły mogą realnie wspierać bioróżnorodność.': 'The new edition of educational activities shows how important pollinators are in ecosystems and how schools can truly support biodiversity.',
        'Warsztaty pszczelarskie w ramach projektu BeeHouses v2': 'Beekeeping workshops as part of BeeHouses v2',
        'Młodzi liderzy rozwijali wiedzę o pszczelarstwie, ekologii dzikich zapylaczy i praktycznych sposobach ochrony środowiska w lokalnych społecznościach.': 'Young leaders developed knowledge of beekeeping, wild pollinator ecology, and practical ways to protect the environment in local communities.',
        'Nowe inicjatywy na rzecz ochrony zapylaczy': 'New initiatives to protect pollinators',
        'Nowe inicjatywy — ochrona zapylaczy': 'New initiatives — pollinator protection',
        'Rozwijamy działania edukacyjne i praktyczne, które zwiększają świadomość na temat dzikich zapylaczy oraz wspierają realną ochronę lokalnych ekosystemów.': 'We are developing educational and practical actions that raise awareness of wild pollinators and support real protection of local ecosystems.',
        'Rozwijamy działania edukacyjne i praktyczne, które zwiększają świadomość roli dzikich zapylaczy oraz wspierają realną ochronę lokalnych ekosystemów.': 'We are developing educational and practical actions that raise awareness of the role of wild pollinators and support real protection of local ecosystems.',
        'Narodowy Program Leśny': 'National Forest Programme',
        'Statuetka Srebrnego Wilka': 'Silver Wolf statuette',

        // Article content - concise coverage of visible long reads
        'Autor: Zuzanna Czupryńska': 'Author: Zuzanna Czupryńska',
        'Przeczytasz w 5 min': '5 min read',
        'Przeczytasz w 6 min': '6 min read',
        'Przeczytasz w 7 min': '7 min read',
        'W ramach projektu Brodnica Beehouses uruchamiamy nowe, ambitne działania edukacyjne i praktyczne, których celem jest zwiększenie świadomości o roli dzikich zapylaczy oraz bezpośrednia ochrona tych niezbędnych dla przyrody owadów. To odpowiedź na rosnące potrzeby ekologiczne regionu — łącząca teorię z konkretnymi efektami.': 'As part of the Brodnica Beehouses project, we are launching new, ambitious educational and practical activities to raise awareness of wild pollinators and directly protect these insects, which are essential for nature. It is a response to the region\'s growing ecological needs, combining knowledge with concrete results.',
        'Projekt': 'Project',
        'Projekt Brodnica Beehouses 2025 kontynuuje misję edukacyjną Fundacji — tym razem ze zdwojoną siłą. Skupiamy się na budowaniu świadomości ekologicznej wśród młodzieży i lokalnych społeczności, pokazując, jak kluczową rolę odgrywają zapylacze w utrzymaniu równowagi naszych ekosystemów.': 'The Brodnica Beehouses 2025 project continues the Foundation\'s educational mission, this time with even more energy. We focus on building ecological awareness among young people and local communities, showing the key role pollinators play in maintaining ecosystem balance.',
        'Wielki sukces młodych ekologów z Brodnicy! Projekt': 'A great success for young ecologists from Brodnica! The project',
        '„Brodnica Beehouses"': '"Brodnica Beehouses"',
        'realizowany w ramach ogólnopolskiej olimpiady społecznej „Zwolnieni z Teorii", zdobył Srebrnego Wilka — prestiżową nagrodę przyznawaną najlepszemu projektowi w województwie kujawsko-pomorskim.': 'carried out as part of the nationwide Zwolnieni z Teorii social project olympiad, won the Silver Wolf — a prestigious award for the best project in the Kuyavian-Pomeranian Voivodeship.',
        'Czym jest nagroda Srebrnego Wilka?': 'What is the Silver Wolf award?',
        'Warsztaty pszczelarskie, które zorganizowaliśmy w ramach projektu BeeHouses v2, znacznie wykraczały poza tradycyjne lekcje biologii. Były to intensywne, praktyczne zajęcia, podczas których uczestnicy mieli możliwość bezpośredniego kontaktu z pszczołami i poznania fascynującego świata pszczelarstwa od podszewki. To doświadczenie pozwoliło im zrozumieć nie tylko techniczne aspekty hodowli pszczół, ale także głębsze znaczenie tych owadów dla całego ekosystemu.': 'The beekeeping workshops we organized as part of BeeHouses v2 went far beyond traditional biology lessons. They were intensive, hands-on classes where participants could experience direct contact with bees and discover the fascinating world of beekeeping from the inside. This helped them understand not only the technical aspects of bee keeping, but also the deeper importance of these insects for the whole ecosystem.',
        'Powiązane artykuły': 'Related articles',
        'Wróć do aktualności': 'Back to news',

        // Privacy and cookies pages
        'Polityka prywatności': 'Privacy policy',
        'Polityka cookies': 'Cookie policy',
        'Data ostatniej aktualizacji:': 'Last updated:',
        'Niniejsza polityka prywatności opisuje zasady przetwarzania danych osobowych oraz wykorzystywania plików cookies na stronie internetowej zuzanna-czuprynska.pl.': 'This privacy policy describes how personal data is processed and how cookies are used on zuzanna-czuprynska.pl.',
    };

    const attrT = {
        'Zmień język': 'Change language',
        'Wybierz język': 'Choose language',
        'Otwórz menu': 'Open menu',
        'Zamknij menu': 'Close menu',
        'Napisz do mnie': 'Write to me',
        'Zamknij okno wsparcia': 'Close support window',
        'Zamknij szczegóły projektu': 'Close project details',
        'Obszary działalności': 'Areas of activity',
        'Sekcja o mnie': 'About section',
        'Przewijanie galerii': 'Gallery scrolling',
        'Przewiń galerię w lewo': 'Scroll gallery left',
        'Przewiń galerię w prawo': 'Scroll gallery right',
        'Twój adres email...': 'Your email address...',
        'Imię i nazwisko': 'Full name',
        'Adres email': 'Email address',
        'Temat wiadomości': 'Message subject',
        'Twoja wiadomość': 'Your message',
        'Zuzanna Czupryńska Portret': 'Portrait of Zuzanna Czupryńska',
        'Praca fundacji Beehouses': 'Beehouses Foundation work',
        'Zaproszenie do mediów': 'Media invitation',
        'Zaproszenie do mediów - materiał prasowy': 'Media invitation - press material',
        'Zaproszenie do mediów - spotkanie': 'Media invitation - meeting',
        'Warsztaty edukacyjne Brodnica Beehouses 2025': 'Brodnica Beehouses 2025 educational workshops',
        'Warsztaty pszczelarskie Beehouses': 'Beehouses beekeeping workshops',
        'Warsztaty pszczelarskie BeeHouses v2': 'BeeHouses v2 beekeeping workshops',
        'Nowe inicjatywy na rzecz ochrony zapylaczy': 'New initiatives to protect pollinators',
        'Statuetka Srebrnego Wilka': 'Silver Wolf statuette',
        'Narodowy Program Leśny': 'National Forest Programme',
        'Projekt Beehouses 2025': 'Beehouses 2025 Project',
        'Akcja charytatywna': 'Charity action',
        'Wystąpienie': 'Public speech',
        'Młodzieżowy Sejmik': 'Youth Assembly',
        'Sejm RP': 'Polish Parliament',
        'Parlament Młodych': 'Young Parliament',
        'Zuzanna': 'Zuzanna',
    };

    const meta = {
        'index.html': {
            title: 'Zuzanna Maria Czupryńska - A New Generation in Politics',
            description: 'Official website of Zuzanna Maria Czupryńska: activist, founder of Beehouses Foundation, and a voice of a new generation in Polish public life.'
        },
        'o-mnie.html': {
            title: 'About | Zuzanna Maria Czupryńska',
            description: 'Meet Zuzanna Maria Czupryńska: activist, Young Parliament member, and founder of Beehouses Foundation.'
        },
        'rekrutacja.html': {
            title: 'Recruitment | Zuzanna Maria Czupryńska',
            description: 'Join the team and co-create social, ecological, and educational initiatives with Zuzanna Maria Czupryńska.'
        },
        'fundacja.html': {
            title: 'Foundation | Zuzanna Maria Czupryńska',
            description: 'Beehouses Foundation combines ecological education, protection of pollinators, and practical action for biodiversity.'
        },
        'aktualnosci.html': {
            title: 'News | Zuzanna Maria Czupryńska',
            description: 'News and initiatives connected with ecology, education, biodiversity, and civic responsibility.'
        },
        'kontakt.html': {
            title: 'Contact | Zuzanna Maria Czupryńska',
            description: 'Contact Zuzanna Maria Czupryńska for media invitations, collaboration, and ecological or educational projects.'
        },
        'projekt-brodnica-beehouses-2025-edukacja-o-zapylaczach.html': {
            title: 'Brodnica Beehouses 2025 Project - Pollinator Education | Zuzanna Maria Czupryńska',
            description: 'An educational project focused on pollinators and their role in ecosystems.'
        },
        'inicjatywa-brodnica-beehouses-z-nagroda-srebrnego-wilka.html': {
            title: 'Brodnica Beehouses awarded the Silver Wolf | Zuzanna Czupryńska',
            description: 'The Brodnica Beehouses project received the prestigious Silver Wolf award in the Zwolnieni z Teorii olympiad.'
        },
        'warsztaty-pszczelarskie-w-ramach-projektu-beehouses-v2.html': {
            title: 'BeeHouses v2 beekeeping workshops | Zuzanna Maria Czupryńska',
            description: 'Beekeeping workshops where young leaders learn about pollinators and practical environmental protection.'
        },
        'nowe-inicjatywy-na-rzecz-ochrony-zapylaczy.html': {
            title: 'New initiatives to protect pollinators | Zuzanna Maria Czupryńska',
            description: 'New educational activities by Brodnica Beehouses to protect pollinators and increase ecological awareness.'
        },
        'udzial-w-pracach-nad-narodowym-programem-lesnym.html': {
            title: 'Work on the National Forest Programme | Zuzanna Czupryńska',
            description: 'Participation in work on the National Forest Programme and responsible protection of natural resources.'
        },
        'polityka-prywatnosci.html': {
            title: 'Privacy Policy | Zuzanna Maria Czupryńska',
            description: 'Privacy policy for the website of Zuzanna Maria Czupryńska.'
        },
        'cookies.html': {
            title: 'Cookie Policy | Zuzanna Maria Czupryńska',
            description: 'Cookie policy for the website of Zuzanna Maria Czupryńska.'
        }
    };

    const getPageKey = () => {
        const file = window.location.pathname.split('/').filter(Boolean).pop();
        return file || 'index.html';
    };

    const storeOriginalAttr = (el, attr) => {
        if (!originalAttrs.has(el)) originalAttrs.set(el, {});
        const attrs = originalAttrs.get(el);
        if (!Object.prototype.hasOwnProperty.call(attrs, attr)) attrs[attr] = el.getAttribute(attr);
    };

    const translateTextNode = (node) => {
        const parent = node.parentElement;
        if (!parent || parent.closest('script, style, noscript, svg, canvas')) return;

        const currentValue = node.nodeValue;
        const key = normalize(currentValue);
        if (!key) return;
        if (!originalText.has(node)) originalText.set(node, currentValue);

        if (currentLang === 'pl') {
            node.nodeValue = originalText.get(node);
            return;
        }

        const translated = t[key];
        if (!translated) return;

        const leading = currentValue.match(/^\s*/)?.[0] || '';
        const trailing = currentValue.match(/\s*$/)?.[0] || '';
        node.nodeValue = `${leading}${translated}${trailing}`;
    };

    const translateTextNodes = (root) => {
        const base = root && root.nodeType === Node.ELEMENT_NODE ? root : document.body;
        if (!base) return;
        const walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(translateTextNode);
    };

    const translateAttrs = (root) => {
        const base = root && root.nodeType === Node.ELEMENT_NODE ? root : document;
        const selector = '[placeholder], [title], [aria-label], [alt], [data-meta]';
        base.querySelectorAll(selector).forEach((el) => {
            ['placeholder', 'title', 'aria-label', 'alt', 'data-meta'].forEach((attr) => {
                if (!el.hasAttribute(attr)) return;
                storeOriginalAttr(el, attr);
                const original = originalAttrs.get(el)[attr];

                if (currentLang === 'pl') {
                    if (original !== null) el.setAttribute(attr, original);
                    return;
                }

                const translated = attrT[normalize(original)] || t[normalize(original)];
                if (translated) el.setAttribute(attr, translated);
            });
        });
    };

    const updateMeta = () => {
        document.documentElement.setAttribute('lang', currentLang === 'en' ? 'en' : 'pl');
        if (currentLang !== 'en') return;

        const pageMeta = meta[getPageKey()];
        if (!pageMeta) return;
        document.title = pageMeta.title;

        [
            ['meta[name="description"]', 'content'],
            ['meta[property="og:title"]', 'content'],
            ['meta[property="og:description"]', 'content'],
            ['meta[name="twitter:title"]', 'content'],
            ['meta[name="twitter:description"]', 'content']
        ].forEach(([selector, attr]) => {
            const el = document.querySelector(selector);
            if (!el) return;
            storeOriginalAttr(el, attr);
            const value = selector.includes('title') ? pageMeta.title : pageMeta.description;
            el.setAttribute(attr, value);
        });
    };

    const updateControls = () => {
        const data = {
            pl: { code: 'PL', name: currentLang === 'en' ? 'Polish' : 'Polski', meta: currentLang === 'en' ? 'Polish version' : 'Aktualnie wybrany' },
            en: { code: 'EN', name: 'English', meta: currentLang === 'en' ? 'Current selection' : 'English version' }
        };

        const code = document.getElementById('currentLangText');
        if (code) code.textContent = currentLang === 'en' ? 'EN' : 'PL';

        const button = document.getElementById('langBtn');
        if (button) {
            const activeName = currentLang === 'en' ? 'English' : 'Polski';
            const label = currentLang === 'en' ? `Change language. Current: ${activeName}` : `Zmień język. Aktualnie: ${activeName}`;
            button.setAttribute('aria-label', label);
            button.setAttribute('title', currentLang === 'en' ? 'Change language' : 'Zmień język');
        }

        const dropdown = document.getElementById('langDropdown');
        if (dropdown) dropdown.setAttribute('aria-label', currentLang === 'en' ? 'Choose language' : 'Wybierz język');

        document.querySelectorAll('.lang-option').forEach((option) => {
            const lang = option.dataset.lang || 'pl';
            const isActive = lang === currentLang;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-selected', isActive ? 'true' : 'false');
            const name = option.querySelector('.lang-option__name');
            const metaEl = option.querySelector('.lang-option__meta');
            if (name && data[lang]) name.textContent = data[lang].name;
            if (metaEl) {
                if (isActive) {
                    metaEl.textContent = currentLang === 'en' ? 'Current selection' : 'Aktualnie wybrany';
                } else {
                    metaEl.textContent = lang === 'en' ? 'English version' : (currentLang === 'en' ? 'Polish version' : 'Polska wersja');
                }
            }
        });

        document.querySelectorAll('.mobile-lang-option').forEach((option) => {
            const lang = option.dataset.lang || 'pl';
            const isActive = lang === currentLang;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const restoreMeta = () => {
        document.title = originalTitle;
        document.querySelectorAll('meta[content]').forEach((el) => {
            const stored = originalAttrs.get(el);
            if (stored && Object.prototype.hasOwnProperty.call(stored, 'content')) {
                el.setAttribute('content', stored.content);
            }
        });
    };

    const applySiteLanguage = (lang, persist = true) => {
        currentLang = VALID_LANGS.has(lang) ? lang : 'pl';
        if (persist) {
            try { localStorage.setItem(STORAGE_KEY, currentLang); } catch (error) {}
        }

        isApplying = true;
        if (currentLang === 'pl') restoreMeta();
        translateTextNodes(document.body);
        translateAttrs(document);
        updateMeta();
        updateControls();
        isApplying = false;
    };

    const scheduleApply = () => {
        if (queued || isApplying || currentLang !== 'en') return;
        queued = true;
        window.requestAnimationFrame(() => {
            queued = false;
            applySiteLanguage(currentLang, false);
        });
    };

    const bindLanguageApi = () => {
        const nativeSetLangMenuState = window.setLangMenuState;
        const nativeApplyLanguage = window.applyLanguage;

        window.applyLanguage = function (lang, persist = true) {
            if (typeof nativeApplyLanguage === 'function') nativeApplyLanguage(lang, persist);
            applySiteLanguage(lang, persist);
        };

        window.changeLang = function (lang) {
            window.applyLanguage(lang, true);
            if (typeof nativeSetLangMenuState === 'function') nativeSetLangMenuState(false);
        };
    };

    const initStickyHeaderAnimation = () => {
        const nav = document.getElementById('navbar');
        if (!nav || nav.dataset.stickyHeaderRevealBound === 'true') return;
        nav.dataset.stickyHeaderRevealBound = 'true';

        let wasSticky = window.scrollY > 50;
        let revealTimer;

        const getRevealDuration = () => {
            const raw = getComputedStyle(document.documentElement).getPropertyValue('--sticky-header-duration').trim();
            const value = Number.parseFloat(raw);
            if (!Number.isFinite(value)) return 520;
            return raw.endsWith('ms') ? value : value * 1000;
        };

        const reveal = () => {
            nav.classList.remove('sticky-header-reveal');
            void nav.offsetWidth;
            nav.classList.add('sticky-header-reveal');
            window.clearTimeout(revealTimer);
            revealTimer = window.setTimeout(() => {
                nav.classList.remove('sticky-header-reveal');
            }, getRevealDuration() + 80);
        };

        const update = () => {
            const isSticky = window.scrollY > 50;
            if (isSticky && !wasSticky) reveal();
            if (!isSticky) {
                nav.classList.remove('sticky-header-reveal');
                window.clearTimeout(revealTimer);
            }
            wasSticky = isSticky;
        };

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    };

    const init = () => {
        bindLanguageApi();
        initStickyHeaderAnimation();
        let saved = 'pl';
        try { saved = localStorage.getItem(STORAGE_KEY) || 'pl'; } catch (error) {}
        if (!VALID_LANGS.has(saved)) saved = 'pl';
        applySiteLanguage(saved, false);

        const observer = new MutationObserver((mutations) => {
            if (isApplying || currentLang !== 'en') return;
            if (mutations.some((m) => m.type === 'childList' || m.type === 'characterData')) scheduleApply();
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    };

    const originalTitle = document.title;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
