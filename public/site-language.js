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

        ', wspieram młode kobiety w rozwijaniu ich kompetencji liderskich. Od sali sejmowej po zielone ogrody Brodnicy, konsekwentnie tworzę fundamenty pod wrażliwą społecznie i ekologicznie przyszłość.': ', I support young women in developing their leadership skills. From the parliamentary hall to the green gardens of Brodnica, I consistently build foundations for a socially and ecologically sensitive future.',
        '. Nasza inicjatywa, skupiona na ochronie dzikich zapylaczy i edukacji ekologicznej lokalnej społeczności, spotkała się z uznaniem zarówno jury olimpiady, jak i mieszkańców całego regionu kujawsko-pomorskiego.': '. Our initiative, focused on the protection of wild pollinators and ecological education of the local community, was appreciated by both the Olympiad jury and the residents of the entire Kuyavian-Pomeranian region.',
        '1. Administrator Danych Osobowych': '1. Personal Data Administrator',
        '1. Czym są pliki cookies?': '1. What are cookies?',
        '1. Sieć domków dla dzikich zapylaczy': '1. Network of houses for wild pollinators',
        '10 Lipca 2025': '10 July 2025',
        '15 Czerwca 2025': '15 June 2025',
        '18 Gru 2025': '18 Dec 2025',
        '2-3 minuty': '2-3 minutes',
        '2. Cele przetwarzania danych': '2. Data processing purposes',
        '2. Edukacja i zaangażowanie społeczności': '2. Education and community engagement',
        '2. Rodzaje wykorzystywanych cookies': '2. Types of cookies used',
        '20 Gru 2025': '20 Dec 2025',
        '23 Gru 2025': '23 Dec 2025',
        '25 Maja 2025': '25 May 2025',
        '3. Cele stosowania cookies': '3. Purposes of using cookies',
        '3. Cykliczne warsztaty edukacyjne': '3. Cyclic educational workshops',
        '3. Okres przechowywania danych': '3. Data retention period',
        '4. Twoje Prawa': '4. Your Rights',
        '4. Współpraca z lokalnymi partnerami': '4. Cooperation with local partners',
        '4. Zarządzanie plikami cookies': '4. Cookie management',
        '5 Sierpnia 2025': '5 August 2025',
        '5. Kontakt': '5. Contact',
        '5. Udostępnianie danych': '5. Data sharing',
        '6. Zmiany w Polityce Prywatności': '6. Changes to the Privacy Policy',
        '@zuzanna_czuprynska': '@zuzanna_czuprynska',
        'Absolutnie wymagane do prawidłowego działania strony, np. obsługi nawigacji lub formularzy kontaktowych. Tych ciasteczek nie można wyłączyć.': 'Absolutely necessary for the proper functioning of the site, e.g. supporting navigation or contact forms. These cookies cannot be disabled.',
        'Aby skorzystać z tych praw, skontaktuj się z nami poprzez podany wyżej adres e-mail. Masz również prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeśli uznasz, że przetwarzanie narusza przepisy prawa.': 'To exercise these rights, please contact us via the e-mail address provided above. You also have the right to lodge a complaint with the President of the Personal Data Protection Office if you consider that the processing violates the law.',
        'Administratorem Twoich danych osobowych przekazywanych za pośrednictwem strony internetowej jest Zuzanna Maria Czupryńska. Możesz skontaktować się z nami pisząc na adres e-mail:': 'The administrator of your personal data transferred via the website is Zuzanna Maria Czupryńska. You can contact us by writing to the following e-mail address:',
        'Adres e-mail': 'E-mail address',
        'Adres mógł zostać zmieniony albo usunięty. Najpewniej właściwa ścieżka znajduje się w głównej nawigacji.': 'The address may have been changed or deleted. Most likely the correct path is in the main navigation.',
        'Adres zamieszkania': 'Residential address',
        'Aktualności i Inicjatywy': 'News and Initiatives',
        'Aktualności i inicjatywy | Zuzanna Maria Czupryńska': 'News and initiatives | Zuzanna Maria Czupryńska',
        'Analityczne / Statystyczne:': 'Analytical / Statistical:',
        'Analityka:': 'Analytics:',
        'Arkadiusz Myrcha': 'Arkadiusz Myrcha',
        'Bardziej zaawansowany program': 'More advanced program',
        'BeeHouses Foundation': 'BeeHouses Foundation',
        'BeeHouses v2': 'BeeHouses v2',
        'Beehouses Foundation': 'Beehouses Foundation',
        'Beehouses Foundation | Edukacja ekologiczna i ochrona zapylaczy': 'Beehouses Foundation | Ecological education and pollinator protection',
        'Beehouses – zasiejeMy': 'Beehouses - let\'s sow',
        'Bezpiecznego otwierania i inspekcji ula': 'Safe opening and inspection of the hive',
        'Bioróżnorodność jako priorytet': 'Biodiversity as a priority',
        'Brodnica': 'Brodnica',
        'Brodnica Beehouses 2025': 'Brodnica Beehouses 2025',
        'Brodnica Beehouses Foundation': 'Brodnica Beehouses Foundation',
        'Brodnica Beehouses z nagrodą Srebrnego Wilka | Zuzanna Czupryńska': 'Brodnica Beehouses with the Silver Wolf award | Zuzanna Czupryńska',
        'Brodnica Beehouses — Srebrny Wilk': 'Brodnica Beehouses — Silver Wolf',
        'Budowę domków': 'Building houses',
        'Budują własne domki dla zapylaczy': 'They build their own houses for pollinators',
        'Błąd 404': 'Error 404',
        'Centrum Kształcenia Zawodowego i Ustawicznego (CKZiU) w Brodnicy': 'Vocational and Continuing Education Center (CKZiU) in Brodnica',
        'Chcę zapisać się do newslettera (opcjonalnie).': 'I want to subscribe to the newsletter (optional).',
        'Co dalej?': 'What\'s next?',
        'Czy moje dane są bezpieczne?': 'Are my data safe?',
        'Czy muszę mieć doświadczenie?': 'Do I need to have experience?',
        'Dane subskrybentów newslettera – do momentu wycofania zgody lub wypisania się z listy subskrybentów.': 'Newsletter subscribers data - until the consent is withdrawn or the subscriber unsubscribes from the list.',
        'Dane z formularza kontaktowego – do czasu zakończenia korespondencji oraz przez okres ewentualnego przedawnienia roszczeń.': 'Data from the contact form - until the end of correspondence and for the period of possible limitation of claims.',
        'Dlaczego chcesz dołączyć do Fundacji?': 'Why do you want to join the Foundation?',
        'Dlaczego dzikie zapylacze są tak ważne?': 'Why are wild pollinators so important?',
        'Dlatego o jej ochronę walczę dziś, tu i teraz."': 'That is why I fight for its protection today, here and now."',
        'Dołącz do': 'Join',
        'Doświadczeni prowadzący': 'Experienced leaders',
        'Działalność Lokalna': 'Local Activity',
        'Działania edukacyjne': 'Educational activities',
        'Długoterminowa wizja': 'Long-term vision',
        'EDS Winter University': 'EDS Winter University',
        'Edukacja & Ekologia': 'Education & Ecology',
        'Edukacja ekologiczna': 'Ecological education',
        'Ekspansja na inne miasta': 'Expansion to other cities',
        'Email': 'Email',
        'English': 'English',
        'FAQ': 'FAQ',
        'Formularz BeeHouses Foundation': 'BeeHouses Foundation Form',
        'Foundation': 'Foundation',
        'Fundacja 2026 / rekrutacja trwa!': 'Foundation 2026 / recruitment is ongoing!',
        'Funkcjonalne:': 'Functional:',
        'Grantowy / prawny': 'Grant / legal',
        'Głos młodego pokolenia w debacie o lasach': 'The voice of the young generation in the debate about forests',
        'IX': 'IX',
        'Identyfikację gatunków': 'Species identification',
        'Ile trwa wypełnienie zgłoszenia?': 'How long does it take to fill out the application?',
        'Imię': 'First name',
        'Innowacje & Legislacja': 'Innovations & Legislation',
        'Instagram': 'Instagram',
        'Instalację 100 domków w strategicznych lokalizacjach': 'Installation of 100 houses in strategic locations',
        'Instytucjami naukowymi': 'Scientific institutions',
        'Integracja teorii z praktyką': 'Integration of theory with practice',
        'Iwona Karolewska': 'Iwona Karolewska',
        'Jak możesz się zaangażować?': 'How can you get involved?',
        'Jakie masz doświadczenie w działalności społecznej?': 'What is your experience in social activities?',
        'Jako użytkownik masz pełne prawo zadecydować, czy chcesz akceptować pliki cookies na swoim urządzeniu. W każdej chwili możesz zmienić ustawienia swojej przeglądarki internetowej, by:': 'As a user, you have full right to decide whether you want to accept cookies on your device. You can change your web browser settings at any time to:',
        'Jednym z głównych celów projektu jest stworzenie rozległej sieci profesjonalnych domków dla dzikich zapylaczy w całym regionie kujawsko-pomorskim. Te domki, zwane także "hotele dla owadów", są specjalnie zaprojektowane, aby przyciągać różne gatunki dzikich pszczół i innych zapylaczy, zapewniając im bezpieczne miejsca do gniazdowania i zimowania.': 'One of the main goals of the project is to create an extensive network of professional houses for wild pollinators throughout the Kuyavian-Pomeranian region. These houses, also called "insect hotels", are specially designed to attract various species of wild bees and other pollinators, providing them with safe places to nest and winter.',
        'Jednym z najważniejszych aspektów naszego udziału było reprezentowanie perspektywy młodych ludzi. To właśnie oni odziedziczą stan polskich lasów za 20, 30, 50 lat. Dlatego też na spotkaniach roboczych konsekwentnie podkreślaliśmy potrzebę myślenia długoterminowego i odwagi w podejmowaniu decyzji, które dziś mogą być trudne politycznie, ale jutro okażą się niezbędne.': 'One of the most important aspects of our participation was representing the perspective of young people. They are the ones who will inherit the condition of Polish forests in 20, 30, 50 years. Therefore, at working meetings, we consistently emphasized the need for long-term thinking and courage in making decisions that may be politically difficult today, but will turn out to be necessary tomorrow.',
        'Jesteśmy przekonani, że las i pszczoła mówią tym samym językiem: językiem różnorodności, cierpliwości i długiego horyzontu. I właśnie tego języka chcemy uczyć polską politykę środowiskową — konsekwentnie, z determinacją i optymizmem.': 'We are convinced that the forest and the bee speak the same language: the language of diversity, patience and a long horizon. And this is the language we want to teach Polish environmental policy — consistently, with determination and optimism.',
        'Jeśli masz jakiekolwiek pytania dotyczące naszej Polityki Cookies, prosimy o kontakt e-mailowy na adres:': 'If you have any questions regarding our Cookie Policy, please contact us by email at:',
        'KRS': 'KRS',
        'Każde z tych działań jest elementem szerszej wizji — budowania trwałego, pozytywnego wpływu na środowisko i wspólnotę lokalną. Wierzymy, że edukacja ekologiczna i konkretne projekty mogą zmieniać świat, a młodzi ludzie odgrywają w tym procesie absolutnie kluczową rolę.': 'Each of these activities is an element of a broader vision — building a lasting, positive impact on the environment and the local community. We believe that ecological education and specific projects can change the world, and young people play an absolutely crucial role in this process.',
        'Kiedy dostanę odpowiedź?': 'When will I get an answer?',
        'Kontakt | Zuzanna Maria Czupryńska': 'Contact | Zuzanna Maria Czupryńska',
        'Kontakt:': 'Contact:',
        'Krótki kontakt': 'Short contact',
        'Kwi 2026': 'Apr 2026',
        'Las': 'Forest',
        'Leśnictwo & Ekologia': 'Forestry & Ecology',
        'Link do Facebooka': 'Link to Facebook',
        'Lokalna ochrona': 'Local protection',
        'Mając na uwadze te wyzwania, opracowaliśmy kompleksowy plan działań, który obejmuje zarówno bezpośrednią ochronę dzikich zapylaczy, jak i szeroko zakrojoną edukację ekologiczną. Nasze inicjatywy zostały zaprojektowane tak, aby były skuteczne, trwałe i możliwe do replikacji w innych regionach Polski.': 'Bearing these challenges in mind, we have developed a comprehensive action plan that includes both direct protection of wild pollinators and broad ecological education. Our initiatives were designed to be effective, sustainable and replicable in other regions of Poland.',
        'Materiały dla szkół': 'Materials for schools',
        'Materiały edukacyjne': 'Educational materials',
        'Mentoring długoterminowy': 'Long-term mentoring',
        'Merytoryczny': 'Substantive',
        'Metody ochrony': 'Protection methods',
        'Mieszkańcy': 'Residents',
        'Misja projektu': 'Project mission',
        'Moduł praktyczny: Obsługa ula': 'Practical module: Hive service',
        'Moduł teoretyczny: Podstawy pszczelarstwa': 'Theoretical module: Basics of beekeeping',
        'Moja fundacja': 'My foundation',
        'Moje działania': 'My activities',
        'Moje przekonania': 'My beliefs',
        'Monitoring i konserwacja': 'Monitoring and maintenance',
        'Monokultury rolnicze': 'Agricultural monocultures',
        'Możesz wskazać zespół organizacyjny, promocyjny, merytoryczny albo grantowy/prawny. Po zgłoszeniu dobierzemy zadania do Twoich kompetencji i dostępności.': 'You can indicate the organizational, promotional, substantive or grant/legal team. After reporting, we will select tasks to suit your competences and availability.',
        'NIP': 'NIP',
        'Na naszej stronie możemy korzystać z następujących rodzajów plików cookies:': 'On our website we may use the following types of cookies:',
        'Na podstawie pozytywnych reakcji i wyników projektu BeeHouses v2, planujemy dalsze rozbudowanie programu. W najbliższych miesiącach zamierzamy zorganizować kolejne edycje warsztatów, rozszerzyć je o nowe tematy, takie jak ekologia dzikich zapylaczy czy projektowanie ogrodów przyjaznych zapylaczom, oraz stworzyć cyfrową platformę edukacyjną, która będzie dostępna dla wszystkich zainteresowanych tematyką ochrony zapylaczy.': 'Based on the positive reactions and results of the BeeHouses v2 project, we plan to further expand the program. In the coming months, we intend to organize subsequent editions of workshops, expand them with new topics, such as the ecology of wild pollinators or designing pollinator-friendly gardens, and create a digital educational platform that will be available to anyone interested in the protection of pollinators.',
        'Najbardziej ekscytującym elementem warsztatów była praktyczna nauka obsługi ula. Uczestnicy pod okiem doświadczonych pszczelarzy uczyli się:': 'The most exciting element of the workshop was practical learning how to operate the hive. Participants, under the supervision of experienced beekeepers, learned:',
        'Najczęstsze pytania': 'Frequently Asked Questions',
        'Narodowy Program Leśny | Udział w pracach': 'National Forest Program | Participation in works',
        'Nasz projekt zakłada:': 'Our project assumes:',
        'Nasza inicjatywa otrzymała także wsparcie finansowe od lokalnych przedsiębiorców i fundacji, co pozwoliło nam na rozszerzenie zakresu działań i dotarcie do większej liczby uczniów. Wierzymy, że współpraca różnych sektorów jest kluczem do skutecznej ochrony środowiska.': 'Our initiative also received financial support from local entrepreneurs and foundations, which allowed us to expand the scope of activities and reach more students. We believe that cooperation between various sectors is the key to effective environmental protection.',
        'Nasze działania w liczbach': 'Our actions in numbers',
        'Nasze główne cele i inicjatywy': 'Our main goals and initiatives',
        'Nasze nowe inicjatywy są częścią szerszej, długoterminowej wizji stworzenia regionu, który jest przyjazny dla zapylaczy i w którym edukacja ekologiczna jest integralną częścią życia społeczności. Wierzymy, że:': 'Our new initiatives are part of a broader, long-term vision to create a pollinator-friendly region where environmental education is an integral part of community life. We believe that:',
        'Nasze postulaty spotkały się z dużym zainteresowaniem — zarówno ze strony ekspertów leśnictwa, jak i przedstawicieli Ministerstwa Klimatu i Środowiska. Cieszą nas sygnały, że część zgłoszonych przez nas propozycji znalazła odzwierciedlenie w roboczych dokumentach programowych.': 'Our postulates aroused great interest - both from forestry experts and representatives of the Ministry of Climate and Environment. We are pleased with signals that some of the proposals we submitted were reflected in working program documents.',
        'Naszym celem jest nie tylko ochrona zapylaczy, ale także budowanie społeczności świadomych, zaangażowanych obywateli, którzy rozumieją zależności w przyrodzie i są gotowi działać na rzecz ich zachowania. Każdy dom dla zapylaczy, każde warsztat, każda osoba, która zmienia swoje zachowanie, to krok w kierunku bardziej zrównoważonej przyszłości.': 'Our goal is not only to protect pollinators, but also to build a community of conscious, engaged citizens who understand the dependencies in nature and are ready to act to preserve them. Every pollinator house, every workshop, every person changing their behavior is a step towards a more sustainable future.',
        'Naszym długoterminowym celem jest stworzenie kompleksowego programu edukacyjnego, który będzie służył szkołom i organizacjom w całej Polsce, przyczyniając się do zwiększenia świadomości ekologicznej i aktywnego działania na rzecz ochrony zapylaczy w skali całego kraju.': 'Our long-term goal is to create a comprehensive educational program that will serve schools and organizations throughout Poland, contributing to increasing ecological awareness and active action for the protection of pollinators nationwide.',
        'Naszym ostatecznym celem jest stworzenie pokolenia młodych ludzi, którzy nie tylko rozumieją znaczenie zapylaczy, ale także aktywnie działają na rzecz ich ochrony. Wierzymy, że edukacja jest najpotężniejszym narzędziem zmiany, a inwestycja w świadomość ekologiczną młodych pokoleń to inwestycja w lepszą przyszłość dla wszystkich.': 'Our ultimate goal is to create a generation of young people who not only understand the importance of pollinators, but also actively act to protect them. We believe that education is the most powerful tool for change, and investing in the ecological awareness of young generations is an investment in a better future for everyone.',
        'Nazwisko': 'Last name',
        'Newsletter:': 'Newsletter:',
        'Nie sprzedajemy ani nie udostępniamy Twoich danych osobowych podmiotom trzecim w celach marketingowych. Dane mogą być powierzane jedynie zaufanym partnerom technologicznym (np. dostawcom hostingu, usług mailingowych czy systemów analitycznych), wyłącznie w zakresie niezbędnym do funkcjonowania strony.': 'We do not sell or share your personal data with third parties for marketing purposes. Data may only be entrusted to trusted technological partners (e.g. hosting providers, mailing services or analytical systems), solely to the extent necessary for the functioning of the site.',
        'Nie znaleziono strony': 'Page not found',
        'Nie znaleziono strony | Zuzanna Maria Czupryńska': 'Page not found | Zuzanna Maria Czupryńska',
        'Nie. Doświadczenie jest mile widziane, ale najważniejsza jest motywacja, odpowiedzialność i chęć uczenia się w konkretnym obszarze działań fundacji.': 'No. Experience is welcome, but motivation, responsibility and willingness to learn in a specific area of the foundation\'s activities are the most important.',
        'Niestety, w ostatnich latach obserwujemy drastyczny spadek populacji dzikich zapylaczy. Główne przyczyny tego zjawiska to:': 'Unfortunately, in recent years we have observed a drastic decline in the population of wild pollinators. The main reasons for this phenomenon are:',
        'Niezbędne (techniczne):': 'Necessary (technical):',
        'Nowa wizja polskich lasów': 'A new vision of Polish forests',
        'Nowe inicjatywy dla ochrony zapylaczy | Zuzanna Czupryńska': 'New initiatives to protect pollinators | Zuzanna Czupryńska',
        'Numer telefonu': 'Phone number',
        'O mnie | Zuzanna Maria Czupryńska': 'About me | Zuzanna Maria Czupryńska',
        'Ochrona & Bioróżnorodność': 'Protection & Biodiversity',
        'Odpowiadanie na zapytania przesłane przez formularz kontaktowy lub e-mail (podstawa prawna: art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes).': 'Responding to inquiries sent via the contact form or e-mail (legal basis: Art. 6 sec. 1 lit. f GDPR - legitimate interest).',
        'Opieki zdrowotnej nad pszczołami': 'Health care of bees',
        'Oprócz wymiernych wyników, projekt odcisnął trwały ślad w życiu lokalnej społeczności. Wiele dzieci i młodych ludzi, którzy uczestniczyli w warsztatach, postanowiło kontynuować działania ekologiczne na własną rękę — w swoich szkołach i rodzinnych miejscowościach. Część z nich założyła własne mini-projekty związane z ochroną środowiska, co pokazuje, że nasza inicjatywa nie tylko edukowała, ale przede wszystkim inspirowała.': 'In addition to measurable results, the project has left a lasting mark on the life of the local community. Many children and young people who participated in the workshops decided to continue ecological activities on their own — in their schools and hometowns. Some of them have set up their own mini-projects related to environmental protection, which shows that our initiative not only educated, but above all inspired.',
        'Organizacjami pozarządowymi': 'Non-governmental organizations',
        'Organizacyjny': 'Organizational',
        'Ostatnie wpisy': 'Recent posts',
        'Pamiętaj jednak, że ograniczenie stosowania cookies może wpłynąć negatywnie na niektóre funkcjonalności i poprawność wyświetlania strony internetowej.': 'Remember, however, that limiting the use of cookies may negatively affect some functionalities and the correct display of the website.',
        'Parlament Młodych RP': 'Young Parliament of the Republic of Poland',
        'Partnerstwa z lokalnymi instytucjami': 'Partnerships with local institutions',
        'Partnerzy i wsparcie': 'Partners and support',
        'Partycypacja społeczna': 'Social participation',
        'Perspektywy na przyszłość': 'Prospects for the future',
        'Plany na przyszłość': 'Plans for the future',
        'Pliki cookies to niewielkie pliki tekstowe, zapisywane na Twoim urządzeniu końcowym (komputerze, tablecie, smartfonie) podczas przeglądania naszej strony internetowej. Pozwalają one na zapamiętanie specyficznych informacji dotyczących Twojej wizyty, ustawień i preferencji.': 'Cookies are small text files saved on your end device (computer, tablet, smartphone) while browsing our website. They allow remembering specific information regarding your visit, settings and preferences.',
        'Po sprawdzeniu zgłoszenia odezwiemy się na podany adres e-mail albo numer telefonu. Czas odpowiedzi zależy od liczby zgłoszeń.': 'After checking the application, we will contact you via the e-mail address or telephone number provided. Response time depends on the number of applications.',
        'Po wysłaniu zgłoszenia odpowiemy na podany adres e-mail lub numer telefonu.': 'After sending the application, we will reply to the provided e-mail address or telephone number.',
        'Po zakończeniu warsztatów uczestnicy otrzymują certyfikaty udziału oraz materiały edukacyjne, które mogą wykorzystać w swoich szkołach i społecznościach. Wielu z nich kontynuuje działania na rzecz ochrony zapylaczy, zakładając własne projekty lub włączając się w inicjatywy lokalne.': 'After completing the workshops, participants receive certificates of participation and educational materials that they can use in their schools and communities. Many of them continue their activities to protect pollinators, setting up their own projects or joining local initiatives.',
        'Podczas trwania projektu zrealizowaliśmy szereg ambitnych celów, które przełożyły się na konkretne, mierzalne efekty dla lokalnej społeczności i środowiska. Dzięki zaangażowaniu całego zespołu oraz wsparciu nauczycieli i dyrekcji CKZiU w Brodnicy, osiągnęliśmy znacznie więcej, niż początkowo zakładaliśmy.': 'During the project, we achieved a number of ambitious goals, which translated into concrete, measurable effects for the local community and environment. Thanks to the involvement of the entire team and the support of teachers and the management of CKZiU in Brodnica, we achieved much more than we initially assumed.',
        'Podczas warsztatów uczestnicy:': 'During the workshops, participants:',
        'Podstaw produkcji miodu': 'Basics of honey production',
        'Polityka': 'Policy',
        'Polityka cookies | Zuzanna Maria Czupryńska': 'Cookie policy | Zuzanna Maria Czupryńska',
        'Polityka prywatności | Zuzanna Maria Czupryńska': 'Privacy policy | Zuzanna Maria Czupryńska',
        'Polskie lasy to nie tylko zasób surowców — to przede wszystkim skarbnica bioróżnorodności i naturalne płuca naszego kraju, odgrywające kluczową rolę w przeciwdziałaniu zmianom klimatycznym. Chłoną dwutlenek węgla, regulują stosunki wodne, chronią gleby i dostarczają siedlisk tysiącom gatunków roślin i zwierząt.': 'Polish forests are not only a resource of raw materials — they are above all a treasury of biodiversity and the natural lungs of our country, playing a key role in counteracting climate change. They absorb carbon dioxide, regulate water relations, protect soils and provide habitats for thousands of plant and animal species.',
        'Pomagają nam zrozumieć, w jaki sposób odwiedzający korzystają ze strony, dostarczając anonimowych danych o ruchu (m.in. za pośrednictwem narzędzi takich jak Google Analytics). Pozwala nam to ulepszać treści i strukturę serwisu.': 'They help us understand how visitors use the website by providing anonymous traffic data (including through tools such as Google Analytics). This allows us to improve the content and structure of the site.',
        'Ponad 15 000 odbiorców w mediach społecznościowych': 'Over 15,000 audience on social media',
        'Ponad 50 domków dla dzikich zapylaczy': 'Over 50 houses for wild pollinators',
        'Postęp zgłoszenia': 'Application progress',
        'Posłanka Parlamentu Młodych RP, Założycielka Beehouses Foundation. Pasjonatka ekologii i zrównoważonego rozwoju. Liderka nagrodzonego projektu.': 'MP of the Youth Parliament of the Republic of Poland, Founder of the Beehouses Foundation. Passionate about ecology and sustainable development. Leader of the awarded project.',
        'Poznają rośliny przyjazne zapylaczom': 'They get to know pollinator-friendly plants',
        'Poznają różnorodność dzikich zapylaczy': 'They get to know the diversity of wild pollinators',
        'Praca na rzecz województwa i wspieranie rozwoju regionalnego': 'Work for the voivodeship and support for regional development',
        'Prawo do ograniczenia przetwarzania,': 'Right to restriction of processing,',
        'Prawo do przenoszenia danych,': 'Right to data portability,',
        'Prawo do usunięcia danych (tzw. "prawo do bycia zapomnianym"),': 'Right to erasure of data (the so-called "right to be forgotten"),',
        'Prawo do wniesienia sprzeciwu wobec przetwarzania,': 'Right to object to processing,',
        'Prawo do wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed jej wycofaniem).': 'Right to withdraw consent at any time (without affecting the lawfulness of processing based on consent before its withdrawal).',
        'Prawo dostępu do treści swoich danych oraz ich poprawiania,': 'Right to access your data and rectify it,',
        'Prezes Zarządu': 'President of the Management Board',
        'Program warsztatów został podzielony na kilka modułów, które kompleksowo pokrywały tematykę pszczelarstwa:': 'The workshop program was divided into several modules that comprehensively covered the topic of beekeeping:',
        'Program wolontariacki': 'Volunteer program',
        'Projekt BeeHouses v2 ma na celu nie tylko jednorazową edukację, ale także budowanie trwałej społeczności młodych ekologów, którzy będą kontynuować działania na rzecz ochrony środowiska. Wierzymy, że inwestycja w edukację ekologiczną młodzieży to inwestycja w przyszłość naszej planety, a każdy uczestnik naszych warsztatów może stać się ambasadorem zmian w swoim środowisku.': 'The BeeHouses v2 project aims not only at one-time education, but also at building a lasting community of young ecologists who will continue to act for environmental protection. We believe that investing in ecological education of youth is an investment in the future of our planet, and every participant of our workshops can become an ambassador of changes in their environment.',
        'Projekt BeeHouses v2 to naturalna kontynuacja naszych wcześniejszych działań edukacyjnych, która została rozbudowana o nowe elementy i metody nauczania. W porównaniu do pierwszej edycji, v2 oferuje:': 'The BeeHouses v2 project is a natural continuation of our previous educational activities, which has been expanded with new elements and teaching methods. Compared to the first edition, v2 offers:',
        'Projekt BeeHouses v2 – kontynuacja misji': 'BeeHouses v2 project - continuation of the mission',
        'Projekt Beehouses 2025 — edukacja o zapylaczach': 'Beehouses 2025 Project — education about pollinators',
        'Projekt Brodnica Beehouses 2025 jest realizowany we współpracy z wieloma partnerami, w tym szkołami, lokalnymi samorządami, organizacjami ekologicznymi oraz ekspertami z dziedziny entomologii i ochrony przyrody. Dzięki temu możemy zapewnić najwyższą jakość edukacji i maksymalny wpływ naszych działań.': 'The Brodnica Beehouses 2025 project is implemented in cooperation with many partners, including schools, local governments, ecological organizations, and experts in the field of entomology and nature conservation. Thanks to this, we can ensure the highest quality of education and maximum impact of our activities.',
        'Projekt Brodnica Beehouses 2025 to nie tylko jednorazowe działanie edukacyjne, ale część długoterminowej strategii zwiększania świadomości ekologicznej w regionie. Planujemy kontynuację i rozbudowę programu w kolejnych latach, włączając nowe szkoły, rozszerzając zakres tematyczny oraz wprowadzając innowacyjne metody nauczania, takie jak wirtualne wycieczki do pasiek czy aplikacje mobilne do rozpoznawania gatunków zapylaczy.': 'The Brodnica Beehouses 2025 project is not just a one-time educational activity, but part of a long-term strategy to increase ecological awareness in the region. We plan to continue and expand the program in subsequent years, including new schools, expanding the thematic scope and introducing innovative teaching methods, such as virtual trips to apiaries or mobile applications for recognizing pollinator species.',
        'Projekt Brodnica Beehouses 2025 wyrósł z głębokiego przekonania, że edukacja ekologiczna jest fundamentem zmiany, jakiej potrzebuje nasza planeta. Zapylacze — pszczoły, trzmiele, motyle, chrząszcze i wiele innych owadów — odgrywają kluczową rolę w utrzymaniu równowagi ekosystemów. Niestety, od dekad obserwujemy drastyczny spadek ich populacji, stanowiący poważne zagrożenie nie tylko dla przyrody, ale i dla rolnictwa oraz bezpieczeństwa żywnościowego.': 'The Brodnica Beehouses 2025 project grew out of a deep belief that ecological education is the foundation of the change our planet needs. Pollinators — bees, bumblebees, butterflies, beetles, and many other insects — play a key role in maintaining the balance of ecosystems. Unfortunately, for decades we have been observing a drastic decline in their population, posing a serious threat not only to nature, but also to agriculture and food security.',
        'Projekt Brodnica Beehouses 2025 | Edukacja o zapylaczach': 'Brodnica Beehouses 2025 Project | Education about pollinators',
        'Projekt zakłada organizację regularnych, cyklicznych warsztatów edukacyjnych, które pozwolą uczestnikom pogłębić swoją wiedzę i umiejętności. Każdy cykl warsztatów obejmuje:': 'The project involves the organization of regular, cyclical educational workshops that will allow participants to deepen their knowledge and skills. Each cycle of workshops includes:',
        'Projekt łączy edukację teoretyczną z praktycznymi działaniami, co pozwala uczestnikom nie tylko przyswoić wiedzę, ale także zrozumieć złożoność ekosystemów i znaczenie każdego gatunku dla równowagi przyrodniczej. Ta metoda nauczania – learning by doing – jest szczególnie efektywna, gdyż angażuje wszystkie zmysły i pozwala na bezpośrednie doświadczenie tematu.': 'The project combines theoretical education with practical activities, which allows participants not only to acquire knowledge, but also to understand the complexity of ecosystems and the importance of each species for the natural balance. This teaching method – learning by doing – is particularly effective because it engages all the senses and allows for direct experience of the subject.',
        'Projektowanie ogrodów przyjaznych zapylaczom': 'Designing pollinator-friendly gardens',
        'Promocyjny': 'Promotional',
        'Prowadzący nie tylko przekazywali wiedzę, ale także inspirowali uczestników do aktywnego zaangażowania w ochronę zapylaczy. Dzielili się swoimi doświadczeniami, opowiadali o wyzwaniach, z jakimi mierzy się współczesne pszczelarstwo, oraz o sposobach, w jakie każdy z nas może przyczynić się do poprawy sytuacji zapylaczy.': 'The instructors not only transferred knowledge, but also inspired participants to active involvement in the protection of pollinators. They shared their experiences, talked about the challenges faced by modern beekeeping, and the ways in which each of us can contribute to improving the situation of pollinators.',
        'Prywatności': 'Privacy',
        'Przedsiębiorcami': 'Entrepreneurs',
        'Przejdź do rekrutacji': 'Go to recruitment',
        'REGON': 'REGON',
        'Razem możemy stworzyć region, w którym zapylacze będą bezpieczne i kwitnące, a ludzie będą świadomi swojej roli w ochronie bioróżnorodności. Dołącz do nas w tej ważnej misji!': 'Together we can create a region where pollinators will be safe and blooming, and people will be aware of their role in protecting biodiversity. Join us in this important mission!',
        'Rekrutacja do BeeHouses Foundation trwa! | Zuzanna Maria Czupryńska': 'Recruitment to BeeHouses Foundation is ongoing! | Zuzanna Maria Czupryńska',
        'Rekrutacja do fundacji': 'Recruitment to the foundation',
        'Rekrutacja trwa': 'Recruitment is ongoing',
        'Rezultaty i wpływ': 'Results and impact',
        'Rola lasu w ochronie zapylaczy': 'The role of the forest in protecting pollinators',
        'Rola pszczół w ekosystemie': 'The role of bees in the ecosystem',
        'Rolnicy': 'Farmers',
        'Rozpoznawania ról w kolonii': 'Recognizing roles in the colony',
        'Rozumieją znaczenie bioróżnorodności': 'They understand the importance of biodiversity',
        'Również dorośli mieszkańcy Brodnicy zaczęli żywiej interesować się losem zapylaczy. Wiele osób zdecydowało się założyć łąki kwietne w ogrodach czy na balkonach, a lokalni przedsiębiorcy zaczęli otwierać się na wspieranie inicjatyw ekologicznych w regionie.': 'Also, adult residents of Brodnica became more vividly interested in the fate of pollinators. Many people decided to establish flower meadows in their gardens or on their balconies, and local entrepreneurs began to open up to supporting ecological initiatives in the region.',
        'Różnorodność konstrukcji': 'Diversity of structures',
        'Samorządy': 'Local governments',
        'Serdecznie dziękujemy dyrekcji CKZiU w Brodnicy, partnerom, sponsorom i wszystkim, którzy nam towarzyszyli — nauczycielom, rodzicom, lokalnym działaczom i mieszkańcom. To nasz wspólny sukces. Mamy nadzieję, że nasza historia zainspiruje kolejnych młodych ludzi do działania na rzecz środowiska i ich małych ojczyzn.': 'We would like to sincerely thank the management of CKZiU in Brodnica, partners, sponsors and everyone who accompanied us — teachers, parents, local activists and residents. This is our common success. We hope that our story will inspire other young people to act for the environment and their homelands.',
        'Sieć współpracy': 'Cooperation network',
        'Spotkania': 'Meetings',
        'Srebrny Wilk': 'Silver Wolf',
        'Srebrny Wilk to dla nas wielki zaszczyt, ale też zobowiązanie do działania. Nie spoczywamy na laurach — ta nagroda motywuje nas do ambitniejszych przedsięwzięć. Jako': 'Silver Wolf is a great honor for us, but also an obligation to act. We do not rest on our laurels — this award motivates us to more ambitious undertakings. As',
        'Start': 'Start',
        'Stosowanie pestycydów': 'Use of pesticides',
        'Strona internetowa Zuzanny Marii Czupryńskiej wykorzystuje pliki cookies (tzw. "ciasteczka"). Ich celem jest zapewnienie poprawnego działania serwisu, poprawa komfortu użytkowania oraz analiza ruchu na stronie. Poniższa polityka wyjaśnia, czym są cookies i jak z nich korzystamy.': 'Zuzanna Maria Czupryńska\'s website uses cookies. Their purpose is to ensure the proper functioning of the site, improve user comfort and analyze website traffic. The following policy explains what cookies are and how we use them.',
        'Sukces naszych inicjatyw zależy od szerokiej współpracy z różnymi podmiotami. Nawiązaliśmy partnerstwa z:': 'The success of our initiatives depends on broad cooperation with various entities. We established partnerships with:',
        'Szczególny nacisk położyliśmy na zrozumienie przez uczestników kluczowej roli pszczół w ekosystemie. Przez interaktywne ćwiczenia i dyskusje, młodzi ludzie uświadomili sobie, że:': 'We placed particular emphasis on participants understanding the key role of bees in the ecosystem. Through interactive exercises and discussions, young people realized that:',
        'Szkoły i przedszkola': 'Schools and kindergartens',
        'Tagi': 'Tags',
        'Tak. Dane z formularza są wykorzystywane wyłącznie w celach rekrutacyjnych BeeHouses Foundation i nie są publikowane na stronie.': 'Yes. Data from the form is used exclusively for recruitment purposes of BeeHouses Foundation and is not published on the website.',
        'Telefon (opcjonalnie)': 'Phone (optional)',
        'Temat': 'Subject',
        'To wyróżnienie jest zwieńczeniem wielomiesięcznej pracy zespołu uczniów z': 'This distinction is the culmination of months of work by a team of students from',
        'Twoje dane będziemy przechowywać wyłącznie przez czas niezbędny do realizacji celu, dla którego zostały zebrane:': 'We will store your data only for the time necessary to achieve the purpose for which they were collected:',
        'Twoje dane osobowe przetwarzamy w ściśle określonych celach:': 'We process your personal data for strictly defined purposes:',
        'Tworzenie anonimowych statystyk, które pomagają nam optymalizować i ulepszać funkcjonalność strony (podstawa prawna: art. 6 ust. 1 lit. f RODO).': 'Creating anonymous statistics that help us optimize and improve site functionality (legal basis: Art. 6 sec. 1 lit. f GDPR).',
        'Uczestnicy zaczynali od poznania podstawowych zagadnień związanych z biologią pszczół, ich strukturą społeczną oraz cyklem życia. Dowiedzieli się, jak funkcjonuje ul jako superorganizm, jakie role pełnią poszczególne pszczoły w kolonii oraz jak przebiega proces zapylania. Eksperci wyjaśnili również różnice między pszczołą miodną a dzikimi zapylaczami, co pozwoliło uczestnikom zrozumieć pełny obraz roli owadów zapylających w przyrodzie.': 'Participants began by learning the basics related to bee biology, their social structure and life cycle. They learned how a hive functions as a superorganism, what roles individual bees play in the colony, and how the pollination process works. Experts also explained the differences between honeybees and wild pollinators, allowing participants to understand the full picture of the role of pollinating insects in nature.',
        'Uczą się praktycznych sposobów ochrony': 'They learn practical ways of protection',
        'Udział w pracach nad Programem pozwolił nam zwrócić uwagę decydentów na kilka fundamentalnych kwestii:': 'Participation in works on the Program allowed us to draw the attention of decision-makers to several fundamental issues:',
        'Union of Sisterhood': 'Union of Sisterhood',
        'Utrata siedlisk': 'Habitat loss',
        'W jakim zespole czuł/a byś się najlepiej?': 'In what team would you feel best?',
        'W jakim zespole mogę działać?': 'In what team can I act?',
        'W ramach olimpiady „Zwolnieni z Teorii" tysiące młodych ludzi z całej Polski każdego roku realizuje własne projekty społeczne, odpowiadające na realne potrzeby lokalnych społeczności. „Złote Wilki" trafiają do najlepszych projektów w skali kraju, natomiast': 'As part of the "Zwolnieni z Teorii" olympiad, thousands of young people from all over Poland implement their own social projects every year, responding to real needs of local communities. "Golden Wolves" go to the best projects nationwide, while',
        'W ramach projektu organizujemy kompleksowe warsztaty edukacyjne dla uczniów szkół podstawowych i ponadpodstawowych z regionu kujawsko-pomorskiego. Program opracował zespół ekspertów i edukatorów, by zapewnić uczestnikom zarówno solidną wiedzę teoretyczną, jak i praktyczne umiejętności.': 'As part of the project, we organize comprehensive educational workshops for primary and secondary school students from the Kuyavian-Pomeranian region. The program was developed by a team of experts and educators to provide participants with both solid theoretical knowledge and practical skills.',
        'W związku z przetwarzaniem Twoich danych osobowych przysługuje Ci:': 'In connection with the processing of your personal data, you have:',
        'WOŚP': 'WOŚP',
        'Warsztaty były prowadzone przez doświadczonych pszczelarzy, którzy nie tylko dzielili się swoją wiedzą techniczną, ale także pasją do pszczelarstwa i głębokim szacunkiem dla natury. Wielu z nich od lat prowadzi pasieki ekologiczne, stosując zrównoważone metody hodowli, które minimalizują wpływ na środowisko i maksymalizują dobrostan pszczół.': 'The workshops were conducted by experienced beekeepers who shared not only their technical knowledge, but also their passion for beekeeping and deep respect for nature. Many of them have been running ecological apiaries for years, using sustainable breeding methods that minimize environmental impact and maximize bee welfare.',
        'Warsztaty edukacyjne w 15 placówkach': 'Educational workshops in 15 facilities',
        'Warsztaty pszczelarskie BeeHouses v2 | Zuzanna Czupryńska': 'BeeHouses v2 Beekeeping Workshops | Zuzanna Czupryńska',
        'Warsztaty pszczelarskie w ramach projektu BeeHouses v2 przyniosły wymierne rezultaty. Większość uczestników deklaruje, że po warsztatach:': 'Beekeeping workshops as part of the BeeHouses v2 project brought measurable results. The majority of participants declare that after the workshops:',
        'Warsztaty pszczelarskie — BeeHouses v2': 'Beekeeping workshops — BeeHouses v2',
        'Warsztaty terenowe': 'Field workshops',
        'Webinary dla szkół z całego regionu': 'Webinars for schools from the whole region',
        'Według badań, ponad 75% roślin uprawnych na świecie zależy od zapylania przez owady. Bez zapylaczy nie byłoby jabłek, pomidorów, ogórków, wielu zbóż ani roślin oleistych. Ochrona tych małych stworzeń jest więc bezpośrednio związana z naszym codziennym życiem i przyszłością kolejnych pokoleń.': 'According to research, more than 75% of crops worldwide depend on insect pollination. Without pollinators there would be no apples, tomatoes, cucumbers, many cereals or oilseeds. Protecting these small creatures is therefore directly linked to our daily lives and the future of future generations.',
        'Wiadomość': 'Message',
        'Wiek': 'Age',
        'Wielowymiarowe warsztaty pszczelarskie': 'Multidimensional beekeeping workshops',
        'Wierzymy, że trwała ochrona zapylaczy jest możliwa tylko przy zaangażowaniu całej społeczności. Dlatego nasze działania edukacyjne są skierowane do różnych grup odbiorców:': 'We believe that lasting protection of pollinators is possible only with the involvement of the entire community. That is why our educational activities are directed to various groups of recipients:',
        'Wpływ społeczny': 'Social impact',
        'Wróć na stronę główną': 'Go back to home page',
        'Wspierać nasze działania': 'Support our actions',
        'Wykorzystujemy mechanizmy plików cookies w celu:': 'We use cookie mechanisms to:',
        'Wypełnienie zgłoszenia zajmuje kilka minut.': 'Filling out the application takes a few minutes.',
        'Wypracowane ramy Narodowego Programu Leśnego to punkt wyjścia, nie meta. Jako Beehouses Foundation planujemy kontynuować ścisłą współpracę z organami decyzyjnymi i lokalnymi społecznościami — monitorując wdrożenie przyjętych postanowień i reagując wszędzie tam, gdzie potrzebny jest obywatelski głos kontroli.': 'The developed framework of the National Forest Program is a starting point, not a finish line. As Beehouses Foundation, we plan to continue close cooperation with decision-making bodies and local communities — monitoring the implementation of the adopted provisions and reacting wherever a civic voice of control is needed.',
        'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji kontaktu zwrotnego.': 'I consent to the processing of my personal data for the purpose of carrying out return contact.',
        'Wysyłanie informacji o bieżących inicjatywach, aktualnościach i projektach, w tym działalności Beehouses Foundation, na podstawie Twojej dobrowolnej zgody (podstawa prawna: art. 6 ust. 1 lit. a RODO).': 'Sending information about current initiatives, news and projects, including Beehouses Foundation activities, based on your voluntary consent (legal basis: Art. 6 sec. 1 lit. a GDPR).',
        'Wyślij zgłoszenie': 'Send application',
        'Wziąć udział w warsztatach': 'Participate in workshops',
        'Z dumą ogłaszam sformalizowanie mojej wieloletniej inicjatywy.': 'I am proud to announce the formalization of my long-standing initiative.',
        'Z wielką satysfakcją informujemy o naszym udziale w tej inicjatywie. Celem naszego zaangażowania było wypracowanie rozwiązań łączących skuteczną ochronę przyrody z racjonalną, zrównoważoną gospodarką leśną — tak, aby las służył zarówno naturze, jak i kolejnym pokoleniom Polaków.': 'It is with great satisfaction that we announce our participation in this initiative. The goal of our involvement was to develop solutions combining effective nature protection with rational, sustainable forest management — so that the forest serves both nature and future generations of Poles.',
        'Zachęcamy wszystkich do włączenia się w nasze inicjatywy. Możesz:': 'We encourage everyone to join our initiatives. You can:',
        'Zanim przedstawimy nasze nowe inicjatywy, warto zrozumieć, dlaczego ochrona dzikich zapylaczy jest tak istotna. W Polsce żyje ponad 470 gatunków pszczół, z czego zdecydowana większość to gatunki dzikie, takie jak murarki, lepiarki, porobnice czy trzmiele. W przeciwieństwie do pszczoły miodnej, która jest gatunkiem hodowlanym, dzikie zapylacze są niezależne i odgrywają kluczową rolę w zapylaniu roślin, z których wiele jest lepiej zapylanych przez dzikie gatunki niż przez pszczołę miodną.': 'Before we introduce our new initiatives, it is worth understanding why the protection of wild pollinators is so important. Over 470 species of bees live in Poland, the vast majority of which are wild species, such as mason bees, plasterer bees, digger bees or bumblebees. Unlike the honeybee, which is a bred species, wild pollinators are independent and play a key role in pollinating plants, many of which are better pollinated by wild species than by the honeybee.',
        'Zapamiętują Twoje preferencje, by ułatwić i spersonalizować Twoją kolejną wizytę na stronie.': 'They remember your preferences to facilitate and personalize your next visit to the site.',
        'Zastrzegamy sobie prawo do aktualizacji niniejszej Polityki Prywatności w związku z rozwojem technologicznym, zmianami prawnymi lub nowymi funkcjami naszej strony internetowej. O wszelkich istotnych zmianach będziemy informować na tej podstronie.': 'We reserve the right to update this Privacy Policy due to technological developments, legal changes or new features of our website. We will inform about any significant changes on this subpage.',
        'Założycielka Beehouses Foundation, Posłanka Parlamentu Młodych RP. Aktywistka ekologiczna i ambasadorka zrównoważonego rozwoju.': 'Founder of Beehouses Foundation, MP of the Youth Parliament of the Republic of Poland. Ecological activist and ambassador of sustainable development.',
        'Założyć ogród przyjazny zapylaczom': 'Establish a pollinator-friendly garden',
        'Zgłoszenie': 'Application',
        'Zmiany klimatyczne': 'Climate change',
        'Zobacz również': 'See also',
        'Zuzanna Czupryńska': 'Zuzanna Czupryńska',
        'Zuzanna Maria Czupryńska': 'Zuzanna Maria Czupryńska',
        'Zuzanna Maria Czupryńska oraz zespół Beehouses Foundation przywiązują szczególną wagę do ochrony Twojej prywatności. Niniejsza Polityka Prywatności określa, w jaki sposób gromadzimy, wykorzystujemy i chronimy dane osobowe użytkowników naszej strony internetowej zgodnie z wymogami Rozporządzenia o Ochronie Danych Osobowych (RODO).': 'Zuzanna Maria Czupryńska and the Beehouses Foundation team attach particular importance to protecting your privacy. This Privacy Policy sets out how we collect, use and protect personal data of our website users in accordance with the requirements of the General Data Protection Regulation (GDPR).',
        'Zuzanna Maria Czupryńska | Aktywistka i Beehouses Foundation': 'Zuzanna Maria Czupryńska | Activist and Beehouses Foundation',
        'Zwolnieni z Teorii': 'Zwolnieni z Teorii',
        'Zwykle około 5-10 minut. Warto krótko opisać, co chcesz robić i dlaczego interesuje Cię BeeHouses Foundation.': 'Usually around 5-10 minutes. It is worth briefly describing what you want to do and why you are interested in BeeHouses Foundation.',
        'blokować automatyczne obsługiwanie plików cookies,': 'block automatic handling of cookies,',
        'dostosowania zawartości serwisu do preferencji użytkowników (np. zachowanie wyboru w pasku zgody na cookies),': 'adjusting the website content to user preferences (e.g. keeping the choice in the cookie consent bar),',
        'fundacji': 'foundation',
        'kontakt@zuzanna-czuprynska.pl': 'kontakt@zuzanna-czuprynska.pl',
        'o wspólnych celach': 'about common goals',
        'otrzymywać powiadomienie przed każdorazowym zapisaniem pliku,': 'receive a notification before saving a file each time,',
        'planujemy kolejne edycje działań, rozbudowane o nowe wymiary.': 'we are planning further editions of activities, expanded by new dimensions.',
        'tworzenia statystyk, które pomagają nam oceniać zainteresowanie określonymi tematami, takimi jak działania w Parlamencie Młodych czy projekt Beehouses.': 'creating statistics that help us assess interest in specific topics, such as activities in the Youth Parliament or the Beehouses project.',
        'usunąć wszystkie dotychczas zapisane ciasteczka.': 'delete all previously saved cookies.',
        'wyróżniają czołowe inicjatywy w każdym województwie. Zdobycie tej statuetki to potwierdzenie, że nasze działania w Brodnicy przyniosły wymierną zmianę — i że projekt wyróżnił się nie tylko pomysłem, ale i profesjonalizmem realizacji.': 'distinguish leading initiatives in each voivodeship. Winning this statuette is a confirmation that our actions in Brodnica brought measurable change — and that the project stood out not only with the idea, but also professionalism of execution.',
        'zapewnienia optymalnego i bezpiecznego działania naszej strony internetowej,': 'ensuring optimal and safe operation of our website,',
        'zmieniają rzeczywistość': 'they change reality',
        'Łąki kwietne w przestrzeni miejskiej': 'Flower meadows in urban space',
        '„Srebrne Wilki"': '"Silver Wolves"',
        '"Edukacja jest kluczem do zrównoważonej przyszłości. Poprzez uświadamianie ludzi o znaczeniu zapylaczy i dostarczanie im praktycznych narzędzi do działania, możemy stworzyć pokolenie, które aktywnie chroni przyrodę i buduje lepszą przyszłość dla wszystkich."': '"Education is the key to a sustainable future. By making people aware of the importance of pollinators and providing them with practical tools to act, we can create a generation that actively protects nature and builds a better future for everyone."',
        '${featuredPost.title}': '${featuredPost.title}',
        '${imgAlt}': '${imgAlt}',
        '${post.title}': '${post.title}',
        ', realizowany w ramach ogólnopolskiej olimpiady społecznej „Zwolnieni z Teorii", zdobył Srebrnego Wilka — prestiżową nagrodę przyznawaną najlepszemu projektowi w województwie kujawsko-pomorskim.': ', carried out as part of the national social olympiad "Zwolnieni z Teorii", won the Silver Wolf — a prestigious award given to the best project in the Kuyavian-Pomeranian Voivodeship.',
        '0%': '0%',
        'Akcja charytatywna': 'Charity action',
        'Beehouses': 'Beehouses',
        'Beehouses - zasiejeMy': 'Beehouses - Let\'s sow',
        'Beehouses Foundation': 'Beehouses Foundation',
        'Beehouses Foundation dołączyła do grona partnerów merytorycznych zaangażowanych w tworzenie Narodowego Programu Leśnego. To ważne zadanie dotyczące przyszłości polskiego leśnictwa, w którym mamy szansę przełożyć głos młodego pokolenia na konkretne rozwiązania systemowe.': 'Beehouses Foundation has joined the substantive partners involved in creating the National Forest Program. This is an important task concerning the future of Polish forestry, where we have a chance to translate the voice of the young generation into concrete systemic solutions.',
        'Beehouses Logo': 'Beehouses Logo',
        'Dołącz do fundacji i współtwórz projekty ekologiczne, edukacyjne oraz społeczne.': 'Join the foundation and co-create ecological, educational and social projects.',
        'Działania edukacyjne Beehouses Foundation': 'Educational activities of the Beehouses Foundation',
        'Działania edukacyjne i ekologiczne BeeHouses Foundation': 'Educational and ecological activities of the BeeHouses Foundation',
        'EDS Winter University w Macedonii Północnej': 'EDS Winter University in North Macedonia',
        'Edukacyjna inicjatywa dla szkół, która uczy troski o zapylacze przez działanie. Łączy warsztaty, materiały i proste praktyki, które dzieci mogą przenieść do swojego najbliższego otoczenia.': 'An educational initiative for schools that teaches care for pollinators through action. It combines workshops, materials and simple practices that children can transfer to their immediate surroundings.',
        'Ekosystemy naturalne i rolnicze są wzajemnie powiązane, a zdrowie pszczół jest wskaźnikiem zdrowia całego środowiska.': 'Natural and agricultural ecosystems are interconnected, and the health of bees is an indicator of the health of the entire environment.',
        'English': 'English',
        'English version': 'English version',
        'Facebook': 'Facebook',
        'Formularz BeeHouses Foundation': 'BeeHouses Foundation Form',
        'Informacje o plikach cookie na naszej stronie.': 'Information about cookies on our website.',
        'Informacje o przetwarzaniu danych osobowych.': 'Information about processing of personal data.',
        'Instagram': 'Instagram',
        'Jeśli masz pytania, propozycje współpracy lub chcesz zgłosić sprawę — jestem tutaj. Odpowiadam osobiście.': 'If you have questions, cooperation proposals or want to report a case — I am here. I answer personally.',
        'Konferencja Forum Ekonomicznego na Zamku Królewskim w Warszawie': 'Economic Forum Conference at the Royal Castle in Warsaw',
        'Kroki rekrutacji': 'Recruitment steps',
        'Las o wschodzie słońca — ochrona polskich lasów': 'Forest at sunrise — protection of Polish forests',
        'LinkedIn': 'LinkedIn',
        'Menu': 'Menu',
        'Menu mobilne': 'Mobile menu',
        'Menu nawigacyjne': 'Navigation menu',
        'Młodzieżowy Sejmik': 'Youth Assembly',
        'Napisz do mnie': 'Write to me',
        'Napisz, jeśli chcesz zaprosić mnie do rozmowy medialnej, wydarzenia, warsztatu lub wspólnego projektu. Najbliższe są mi działania łączące edukację, ochronę zapylaczy, lokalne społeczności i realne wsparcie młodych osób.': 'Write if you want to invite me to a media talk, event, workshop or joint project. The closest to my heart are activities combining education, pollinator protection, local communities and real support for young people.',
        'Narodowy Program Leśny': 'National Forest Program',
        'Następne zdjęcie': 'Next photo',
        'Nowe inicjatywy na rzecz ochrony zapylaczy': 'New initiatives to protect pollinators',
        'Obchody Święta Flagi i Konstytucji 3 Maja w Brodnicy': 'Celebrations of Flag Day and May 3rd Constitution in Brodnica',
        'Obszary działalności': 'Areas of activity',
        'Odwiedź stronę': 'Visit website',
        'Otwórz menu': 'Open menu',
        'Oświadczam, że wyrażam zgodę na przetwarzanie moich danych osobowych przez Fundację BeeHouses Foundation zgodnie z RODO w celach związanych z rekrutacją i członkostwem w Fundacji. Wyrażam również zgodę na wykorzystanie mojego wizerunku w materiałach promocyjnych.': 'I declare that I consent to the processing of my personal data by the BeeHouses Foundation in accordance with the GDPR for purposes related to recruitment and membership in the Foundation. I also consent to the use of my image in promotional materials.',
        'Parlament Młodych': 'Youth Parliament',
        'Parlament Młodych RP': 'Youth Parliament of the Republic of Poland',
        'Podmenu Fundacja': 'Foundation submenu',
        'Podnoszenie świadomości obywatelskiej na temat roli zwierząt w ekosystemach. Edukacja o ochronie gatunków zagrożonych wyginięciem.': 'Raising civic awareness about the role of animals in ecosystems. Education about the protection of endangered species.',
        'Polska wersja': 'Polish version',
        'Polski': 'Polish',
        'Poprzednie zdjęcie': 'Previous photo',
        'Post z Instagrama Zuzanny Czupryńskiej': 'Instagram post by Zuzanna Czupryńska',
        'Postęp wypełnienia zgłoszenia': 'Application progress',
        'Praca fundacji Beehouses': 'Work of the Beehouses foundation',
        'Projekt Beehouses 2025': 'Beehouses 2025 Project',
        'Przewijanie galerii': 'Gallery scrolling',
        'Przewiń galerię w lewo': 'Scroll gallery to the left',
        'Przewiń galerię w prawo': 'Scroll gallery to the right',
        'Pszczoły i dzikie zapylacze to nasz kapitał na przyszłość.': 'Bees and wild pollinators are our capital for the future.',
        'Płeć': 'Gender',
        'Razem możemy chronić różnorodność biologiczną dla dobra naszych i przyszłych pokoleń.': 'Together we can protect biodiversity for the benefit of our and future generations.',
        'Realizowany w ramach ogólnopolskiej olimpiady społecznej „Zwolnieni z Teorii", zdobył Srebrnego Wilka — prestiżową nagrodę przyznawaną najlepszemu projektowi w województwie kujawsko-pomorskim.': 'Implemented as part of the national social olympiad "Zwolnieni z Teorii", won the Silver Wolf — a prestigious award given to the best project in the Kuyavian-Pomeranian Voivodeship.',
        'Rozwój edukacji klimatycznej i ekologicznej dla dzieci i młodzieży': 'Development of climate and ecological education for children and youth',
        'Sejm RP': 'Parliament of the Republic of Poland',
        'Sekcja o mnie': 'About me section',
        'Spotkanie Beehouses dotyczące projektu Zasiejmy Naturę': 'Beehouses meeting regarding the Let\'s Sow Nature project',
        'Statuetka Srebrnego Wilka': 'Silver Wolf Statuette',
        'To nie tylko schronienia dla owadów — to element infrastruktury wspierającej zapylaczy na terenach zurbanizowanych i rolniczych.': 'These are not only shelters for insects — this is an element of infrastructure supporting pollinators in urbanized and agricultural areas.',
        'Twój adres email...': 'Your email address...',
        'Uczestnicy warsztatów pszczelarskich BeeHouses': 'Participants of BeeHouses beekeeping workshops',
        'Wybierz płeć': 'Choose gender',
        'Wydarzenie o zasięgu ogólnopolskim zorganizowane we współpracy ze środowiskiem studenckim i eksperckim.': 'A nationwide event organized in cooperation with the academic and expert community.',
        'Wystąpienie': 'Speech',
        'Zaczynamy od': 'We start with',
        'Zaloguj się': 'Log in',
        'Zamknij menu': 'Close menu',
        'Zamknij okno wsparcia': 'Close support window',
        'Zamknij szczegóły projektu': 'Close project details',
        'Zarejestruj się': 'Register',
        'Zapisz się do newslettera': 'Sign up for the newsletter',
        'Zmień język': 'Change language',
        'Zwierzęta': 'Animals',
        'Ładowanie...': 'Loading...',
        'Zaproszenie do mediów': 'Invitation to the media',
        'Zaproszenie do mediów - materiał prasowy': 'Invitation to the media - press material',
        'Zaproszenie do mediów - spotkanie': 'Invitation to the media - meeting',
        'Zuzanna': 'Zuzanna',
        'Zuzanna Czupryńska Portret': 'Zuzanna Czupryńska Portrait',
        'Zuzanna Maria Czuprynska': 'Zuzanna Maria Czuprynska',
        'Warsztaty edukacyjne Brodnica Beehouses 2025': 'Educational workshops Brodnica Beehouses 2025',
        'Warsztaty pszczelarskie': 'Beekeeping workshops',
        'Warsztaty pszczelarskie BeeHouses v2': 'Beekeeping workshops BeeHouses v2',
        'Warsztaty pszczelarskie Beehouses': 'Beekeeping workshops Beehouses',
        'Wsparcie 34. Finału WOŚP': 'Support for the 34th WOŚP Finale',
        'Wybierz język': 'Choose language',
        'Zespół BeeHouses Foundation podczas pracy projektowej': 'BeeHouses Foundation team during project work',
        'Zespół Brodnica Beehouses odbiera nagrodę Srebrnego Wilka': 'Brodnica Beehouses team receives the Silver Wolf award',
        'Zobacz profil na Instagramie': 'See profile on Instagram',
        '– dowiadują się o ponad 400 gatunkach dzikich pszczół w Polsce, ich zwyczajach, preferencjach żywieniowych i roli w ekosystemach. Uczą się rozpoznawać najważniejsze gatunki i rozumieć ich ekologię.': '– they learn about over 400 species of wild bees in Poland, their habits, food preferences and role in ecosystems. They learn to recognize the most important species and understand their ecology.',
        '– dowiadują się, które rośliny są najlepszym źródłem pokarmu dla zapylaczy i jak można je uprawiać w ogrodach, na balkonach czy w szkołach.': '– they learn which plants are the best source of food for pollinators and how they can be grown in gardens, on balconies or at schools.',
        '– dowiedzieli się o najważniejszych chorobach pszczół, metodach ich zapobiegania oraz o odpowiedzialnym stosowaniu środków ochrony roślin, które mogą szkodzić zapylaczom.': '– they learned about the most important bee diseases, methods of preventing them and the responsible use of plant protection products that may harm pollinators.',
        '– intensywna urbanizacja i rolnictwo przemysłowe prowadzą do niszczenia naturalnych siedlisk zapylaczy, takich jak łąki kwietne, zadrzewienia śródpolne czy stare drzewa z dziuplami.': '– intensive urbanization and industrial agriculture lead to the destruction of natural habitats of pollinators, such as flower meadows, mid-field woodlots or old trees with hollows.',
        '– każdy domek jest zaprojektowany dla konkretnych gatunków, wykorzystując różne materiały (drewno, trzcina, glina) i rozmiary otworów, aby przyciągać jak najszerszą gamę zapylaczy.': '– each house is designed for specific species, using different materials (wood, reed, clay) and hole sizes to attract the widest possible range of pollinators.',
        '– możesz zostać wolontariuszem, wspierać nas finansowo lub po prostu szerzyć wiedzę o zapylaczach w swoim otoczeniu.': '– you can become a volunteer, support us financially or simply spread knowledge about pollinators in your environment.',
        '– nauczyli się odróżniać królową od robotnic, identyfikować trutnie oraz rozpoznawać różne stadia rozwoju pszczół (jaja, larwy, poczwarki).': '– they learned to distinguish the queen from the workers, identify drones and recognize the various stages of bee development (eggs, larvae, pupae).',
        '– nauczyli się właściwego posługiwania się dymem, rozpoznawania stanu rodziny pszczelej oraz identyfikowania potencjalnych problemów zdrowotnych.': '– they learned the proper use of smoke, recognizing the condition of the bee family and identifying potential health problems.',
        '– nawet mały balkon może być domem dla zapylaczy, jeśli zasadzisz odpowiednie rośliny.': '– even a small balcony can be home to pollinators if you plant the right plants.',
        '– organizujemy interaktywne warsztaty, podczas których uczniowie poznają różnorodność zapylaczy, ich znaczenie oraz praktyczne sposoby pomagania im. Wielu uczniów bierze udział w budowie domków, co daje im poczucie własności i odpowiedzialności za projekt.': '– we organize interactive workshops during which students learn about the diversity of pollinators, their importance and practical ways to help them. Many students participate in building houses, which gives them a sense of ownership and responsibility for the project.',
        '– pod okiem doświadczonych instruktorów uczestnicy konstruują profesjonalne domki dla dzikich pszczół, ucząc się przy tym o potrzebach tych owadów i właściwych miejscach ich instalacji.': '– under the supervision of experienced instructors, participants construct professional houses for wild bees, learning about the needs of these insects and the proper places for their installation.',
        '– poprzez interaktywne prezentacje i gry edukacyjne poznają zależności między różnymi gatunkami w ekosystemie i dowiadują się, dlaczego każdy gatunek jest ważny dla utrzymania równowagi przyrodniczej.': '– through interactive presentations and educational games they learn about the relationships between different species in the ecosystem and find out why each species is important for maintaining natural balance.',
        '– poznają konkretne działania, które mogą podjąć w swoim otoczeniu, aby pomóc zapylaczom, takie jak tworzenie siedlisk, unikanie pestycydów czy zakładanie łąk kwietnych.': '– they learn about specific actions they can take in their environment to help pollinators, such as creating habitats, avoiding pesticides or establishing flower meadows.',
        '– poznają praktyczne sposoby ochrony zapylaczy w codziennym życiu, od wyboru produktów spożywczych po działania w przestrzeni publicznej.': '– they learn practical ways to protect pollinators in everyday life, from choosing food products to actions in public space.',
        '– poznali proces, w jaki pszczoły zbierają nektar, przetwarzają go w miód oraz jak pszczelarz pozyskuje ten cenny produkt, zachowując przy tym dobrostan pszczół.': '– they learned the process by which bees collect nectar, process it into honey, and how the beekeeper obtains this valuable product, while maintaining the welfare of the bees.',
        '– praktyczne warsztaty, podczas których uczestnicy samodzielnie konstruują domki dla zapylaczy, które następnie mogą zabrać do swoich ogrodów lub szkół.': '– practical workshops during which participants independently construct houses for pollinators, which they can then take to their gardens or schools.',
        '– prowadzimy kampanie informacyjne skierowane do mieszkańców miast i wsi, zachęcając ich do zakładania roślin przyjaznych zapylaczom w swoich ogrodach i na balkonach oraz do unikania pestycydów.': '– we conduct information campaigns addressed to residents of cities and villages, encouraging them to plant pollinator-friendly plants in their gardens and on balconies and to avoid pesticides.',
        '– regularne sprawdzanie stanu domków, czyszczenie oraz dokumentacja gatunków, które je zasiedlają, pozwoli nam ocenić skuteczność projektu i dostosować strategię.': '– regular checking of the condition of the houses, cleaning and documentation of the species that inhabit them will allow us to assess the effectiveness of the project and adjust the strategy.',
        '– rozszerzyliśmy zakres tematyczny o zaawansowane aspekty pszczelarstwa, ekologię dzikich zapylaczy oraz nowoczesne metody monitorowania zdrowia pszczół.': '– we have expanded the thematic scope to include advanced aspects of beekeeping, the ecology of wild pollinators and modern methods of monitoring bee health.',
        '– sprawdź nasz kalendarz wydarzeń i zarejestruj się na najbliższe warsztaty edukacyjne.': '– check our event calendar and register for the upcoming educational workshops.',
        '– stworzyliśmy platformę wymiany doświadczeń między uczestnikami, która pozwala na kontynuację działań po zakończeniu warsztatów.': '– we have created a platform for exchanging experiences between participants, which allows the continuation of activities after the end of the workshops.',
        '– uczestnicy otrzymują wsparcie mentorów także po zakończeniu warsztatów, co pozwala na rozwój ich własnych projektów ekologicznych.': '– participants receive mentoring support also after the end of the workshops, which allows the development of their own ecological projects.',
        '– uczestnicy uczą się rozpoznawać najważniejsze gatunki dzikich zapylaczy, rozumieć ich preferencje siedliskowe oraz potrzeby żywieniowe.': '– participants learn to recognize the most important species of wild pollinators, understand their habitat preferences and nutritional needs.',
        '– uczestnicy uczą się, jak stworzyć ogród, który będzie atrakcyjny dla zapylaczy przez cały sezon wegetacyjny, wybierając odpowiednie rośliny i zapewniając różnorodność siedlisk.': '– participants learn how to create a garden that will be attractive to pollinators throughout the growing season, selecting appropriate plants and ensuring a diversity of habitats.',
        '– uprawy jednogatunkowe nie zapewniają zapylaczom różnorodnego i ciągłego źródła pokarmu, co prowadzi do głodu i osłabienia populacji.': '– single-species crops do not provide pollinators with a diverse and continuous source of food, which leads to starvation and population weakening.',
        '– w parkach, przy szkołach, w ogrodach botanicznych oraz na terenach rolniczych, gdzie będą wspierać zapylanie upraw.': '– in parks, at schools, in botanical gardens and on agricultural areas where they will support crop pollination.',
        '– współpracujemy z lokalnymi i krajowymi organizacjami ekologicznymi, wymieniając się doświadczeniami i koordynując działania na rzecz ochrony zapylaczy.': '– we cooperate with local and national ecological organizations, exchanging experiences and coordinating actions for the protection of pollinators.',
        '– współpracujemy z lokalnymi rolnikami, promując zrównoważone metody uprawy, które chronią zapylacze, takie jak płodozmian, uprawa roślin miododajnych czy stosowanie biologicznych metod ochrony roślin.': '– we cooperate with local farmers, promoting sustainable farming methods that protect pollinators, such as crop rotation, cultivation of honey plants or the use of biological plant protection methods.',
        '– współpracujemy z uniwersytetami i instytutami badawczymi, wykorzystując najnowszą wiedzę naukową w naszych działaniach edukacyjnych i projektach ochronnych.': '– we cooperate with universities and research institutes, using the latest scientific knowledge in our educational activities and conservation projects.',
        '– zachęcamy lokalne firmy do zaangażowania w projekty CSR związane z ochroną środowiska, oferując możliwość sponsorowania domków czy warsztatów edukacyjnych.': '– we encourage local companies to engage in CSR projects related to environmental protection, offering the opportunity to sponsor houses or educational workshops.',
        '– zmieniające się warunki klimatyczne wpływają na fenologię roślin i zapylaczy, powodując rozsynchronizowanie ich cykli życiowych.': '– changing climate conditions affect the phenology of plants and pollinators, causing their life cycles to become desynchronized.',
        '— chcemy dzielić się wiedzą i doświadczeniem z innymi samorządami i szkołami, pomagając im budować podobne inicjatywy ekologiczne.': '— we want to share knowledge and experience with other local governments and schools, helping them build similar ecological initiatives.',
        '— decyzje dotyczące lasów powinny uwzględniać głos lokalnych społeczności, organizacji pozarządowych i młodego pokolenia, które będzie żyć z konsekwencjami tych wyborów.': '— decisions regarding forests should take into account the voice of local communities, non-governmental organizations and the young generation who will live with the consequences of these choices.',
        '— las powinien być traktowany jako złożony ekosystem, a nie jedynie plantacja drewna. Postulujemy zwiększenie udziału lasów wielogatunkowych i wielowiekowych, które są bardziej odporne na zmiany klimatu.': '— the forest should be treated as a complex ecosystem, not just a timber plantation. We postulate an increase in the share of multi-species and multi-age forests, which are more resistant to climate change.',
        '— nawiązaliśmy współpracę z Urzędem Miasta Brodnicy, miejscowymi pszczelarzami i organizacjami ekologicznymi, co nadało naszym działaniom trwały, systemowy charakter.': '— we established cooperation with the Brodnica City Hall, local beekeepers and ecological organizations, which gave our activities a lasting, systemic character.',
        '— opracowaliśmy broszury, prezentacje i krótkie filmy instruktażowe, dostępne bezpłatnie dla każdego zainteresowanego tematyką ochrony zapylaczy.': '— we have developed brochures, presentations and short instructional videos, available free of charge to anyone interested in the protection of pollinators.',
        '— postulujemy, aby las stał się przestrzenią edukacji dla dzieci i młodzieży z całej Polski, a programy edukacji leśnej były obowiązkowym elementem podstawy programowej.': '— we postulate that the forest should become a space of education for children and youth from all over Poland, and forest education programs should be a mandatory element of the core curriculum.',
        '— przeprowadziliśmy interaktywne zajęcia w lokalnych przedszkolach, szkołach podstawowych i ponadpodstawowych. Ponad 600 uczniów poznało rolę zapylaczy i nauczyło się, jak aktywnie im pomagać.': '— we conducted interactive classes in local kindergartens, primary and secondary schools. Over 600 students learned about the role of pollinators and learned how to actively help them.',
        '— rozszerzamy działalność edukacyjną o cykliczne webinary dla uczniów i nauczycieli z województwa kujawsko-pomorskiego i nie tylko.': '— we are expanding educational activities with cyclical webinars for students and teachers from the Kuyavian-Pomeranian voivodeship and beyond.',
        '— stare drzewa z dziuplami, bogate runo leśne i martwe drewno to kluczowe elementy siedlisk dzikich zapylaczy. Zrównoważona gospodarka leśna bezpośrednio wspiera realizację misji Beehouses Foundation.': '— old trees with hollows, rich forest undergrowth and dead wood are key elements of habitats of wild pollinators. Sustainable forest management directly supports the implementation of the Beehouses Foundation mission.',
        '— strategiczna kampania informacyjna pozwoliła dotrzeć do tysięcy osób w regionie. Nasze treści udostępniały lokalne media i organizacje ekologiczne.': '— a strategic information campaign allowed us to reach thousands of people in the region. Our content was shared by local media and ecological organizations.',
        '— uruchamiamy ścieżkę wolontariatu dla młodzieży, która chce aktywnie chronić środowisko i zdobywać doświadczenie w zarządzaniu projektami ekologicznymi.': '— we are launching a volunteer path for young people who want to actively protect the environment and gain experience in managing ecological projects.',
        '— w porozumieniu z władzami Brodnicy planujemy sieć łąk miejskich w parkach i na terenach zielonych, które staną się naturalnymi siedliskami dla zapylaczy i wzbogacą bioróżnorodność miasta.': '— in agreement with the Brodnica authorities, we are planning a network of urban meadows in parks and green areas, which will become natural habitats for pollinators and enrich the city\'s biodiversity.',
        '— zbudowaliśmy i zainstalowaliśmy profesjonalne schronienia dla pszczół samotnic, trzmieli i innych zapylaczy w strategicznych lokalizacjach w Brodnicy i okolicach. Każdy domek zaprojektowano z myślą o potrzebach konkretnych gatunków.': '— we built and installed professional shelters for solitary bees, bumblebees and other pollinators in strategic locations in and around Brodnica. Each house was designed with the needs of specific species in mind.',
        '„Nasze zaangażowanie to krok w stronę przyszłości, w której harmonia między naturą a człowiekiem jest priorytetem. Las należy do wszystkich — i wszyscy musimy wziąć odpowiedzialność za jego ochronę."': '"Our involvement is a step towards a future in which harmony between nature and humans is a priority. The forest belongs to everyone — and we all must take responsibility for its protection."',
        '„Przyroda nie zna granic —': '"Nature knows no borders —',
        '„Ta nagroda to nie tylko statuetka — to dowód, że młode pokolenie ma realny wpływ na kształtowanie naszej przyszłości. Pszczoły i dzikie zapylacze zyskały silny głos, a my ogromną motywację do dalszych działań."': '"This award is not only a statuette — it is proof that the young generation has a real impact on shaping our future. Bees and wild pollinators have gained a strong voice, and we have a huge motivation for further actions."',
        'Pszczoły są odpowiedzialne za zapylanie około 80% roślin kwiatowych, w tym wielu gatunków uprawnych, od których zależy globalne bezpieczeństwo żywnościowe.': 'Bees are responsible for pollinating about 80% of flowering plants, including many crop species on which global food security depends.',
        'Rozpoczęli własne projekty edukacyjne w swoich szkołach i społecznościach lokalnych.': 'They started their own educational projects in their schools and local communities.',
        'Rozważają możliwość założenia własnych pasiek lub współpracy z lokalnymi pszczelarzami.': 'They are considering the possibility of setting up their own apiaries or cooperating with local beekeepers.',
        'Spadek populacji pszczół ma bezpośredni wpływ na bioróżnorodność, plony rolnicze oraz stabilność ekosystemów.': 'The decline in the bee population has a direct impact on biodiversity, agricultural yields and ecosystem stability.',
        'Strona wykorzystuje pliki cookies do prawidłowego działania. Kontynuując, akceptujesz naszą politykę prywatności.': 'The site uses cookies for proper operation. By continuing, you accept our privacy policy.',
        'Szukamy osób do projektów ekologicznych, edukacyjnych i lokalnych. Liczy się regularność, ciekawość i gotowość do działania w zespole.': 'We are looking for people for ecological, educational and local projects. What counts is regularity, curiosity and readiness to work in a team.',
        'Tworzenie i ochrona siedlisk dla zwierząt oraz ekosystemów naturalnych. Prowadzenie badań z zakresu bioróżnorodności.': 'Creating and protecting habitats for animals and natural ecosystems. Conducting biodiversity research.',
        'Wdrożyli zmiany w swoim codziennym życiu, takie jak zakładanie roślin przyjaznych zapylaczom czy unikanie pestycydów w swoich ogrodach.': 'They implemented changes in their daily lives, such as planting pollinator-friendly plants or avoiding pesticides in their gardens.',
        'Wspieranie OZE, gospodarki cyrkularnej i innowacyjnych technologii ekologicznych. Inicjowanie działań legislacyjnych.': 'Supporting renewable energy, circular economy and innovative ecological technologies. Initiating legislative actions.',
        'Wypełnij krótkie zgłoszenie i napisz, w jakim obszarze chcesz działać. Dane są poufne i wykorzystywane wyłącznie do celów rekrutacyjnych BeeHouses Foundation.': 'Fill out a short application and write what area you want to work in. The data is confidential and used exclusively for the recruitment purposes of the BeeHouses Foundation.',
        'Z przyjemnością informujemy o naszym udziale w pracach nad Narodowym Programem Leśnym. To ważna inicjatywa związana z przyszłością polskiego leśnictwa, w której mieliśmy możliwość wziąć udział jako partner merytoryczny.': 'We are pleased to inform you about our participation in the work on the National Forest Program. This is an important initiative related to the future of Polish forestry, in which we had the opportunity to participate as a substantive partner.',
        'Zwiększyła się ich świadomość ekologiczna i zrozumienie znaczenia zapylaczy.': 'Their ecological awareness and understanding of the importance of pollinators increased.',
        'ani geograficznych, ani pokoleniowych.': 'neither geographical nor generational.',
        'kontynuuje misję edukacyjną Fundacji — tym razem ze zdwojoną siłą. Skupiamy się na budowaniu świadomości ekologicznej wśród młodzieży i lokalnych społeczności, pokazując, jak kluczową rolę odgrywają zapylacze w utrzymaniu równowagi naszych ekosystemów.': 'continues the Foundation\'s educational mission — this time with redoubled strength. We focus on building ecological awareness among youth and local communities, showing how crucial pollinators play a role in maintaining the balance of our ecosystems.',
        'to organizacja powołana, by łączyć innowacyjną ekologię z edukacją społeczną. Naszym celem jest tworzenie realnych zmian systemowych — od ochrony zagrożonych gatunków po legislacyjne wsparcie zielonej transformacji.': 'is an organization established to combine innovative ecology with social education. Our goal is to create real systemic changes — from the protection of endangered species to legislative support for the green transformation.',
        'wkracza na nowy poziom — organizujemy zaawansowane warsztaty pszczelarskie, które łączą praktyczną naukę obsługi ula z głębokim zrozumieniem roli owadów zapylających w ekosystemach. To kolejny, znaczący krok w naszej misji edukacyjnej na rzecz zrównoważonego rozwoju.': 'enters a new level — we organize advanced beekeeping workshops that combine practical learning of hive operation with a deep understanding of the role of pollinating insects in ecosystems. This is another significant step in our educational mission for sustainable development.',
        '– angażujemy władze lokalne w tworzenie polityk przyjaznych zapylaczom, takich jak zakładanie łąk kwietnych zamiast trawników czy ograniczanie stosowania herbicydów w przestrzeni publicznej.': '– we engage local authorities in creating pollinator-friendly policies, such as establishing flower meadows instead of lawns or reducing the use of herbicides in public spaces.',
        '– chemiczne środki ochrony roślin, szczególnie neonikotynoidy, mają katastrofalny wpływ na dzikie zapylacze, powodując ich śmierć lub zakłócając zdolność do orientacji i rozmnażania.': '– chemical plant protection products, especially neonicotinoids, have a disastrous effect on wild pollinators, causing their death or disturbing their ability to orientate and reproduce.',
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
