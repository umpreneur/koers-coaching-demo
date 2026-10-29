/* =====================================================================
   CENTRALE CONFIGURATIE
   ---------------------------------------------------------------------
   Pas hier alles aan wat per coachingpraktijk verschilt: naam, logo,
   kleuren, lettertypen, afbeeldingen, contactgegevens, diensten,
   prijzen, teksten, blog en de koppeling met agenda en formulieren.
   Je hoeft de HTML-bestanden in principe niet aan te raken.

   Tips
   - Teksten tussen [vierkante haken] zijn placeholders: vervang ze.
   - Zet een sectie uit met `false` onder `sections`.
   - Laat een prijs leeg (null) om hem te verbergen.
   - Zie HANDLEIDING.md voor uitleg per onderdeel.
   ===================================================================== */

window.SITE_CONFIG = {
  /* ---------- Merk ---------- */
  brand: {
    name: "Koers Coaching",
    tagline: "Loopbaan- en lifecoaching in Utrecht en online",
    coachName: "Sanne van Dijk",
    coachFirstName: "Sanne",
    coachRole: "Loopbaan- en lifecoach",
    // Klein beeldmerk naast de bedrijfsnaam. Zet op null om alleen tekst te tonen.
    logoMark: "assets/img/logo-mark.svg",
    // Heb je een compleet logo (beeldmerk + naam)? Vul het pad in; dit vervangt mark + tekst.
    logoImage: null,
    logoImageWidth: 160,
    logoImageHeight: 40,
    favicon: "assets/img/favicon.svg"
  },

  /* ---------- Huisstijl ---------- */
  theme: {
    colors: {
      background: "#FAF6F4",   // gebroken wit
      surface: "#FFFFFF",      // kaarten en formulieren
      sand: "#F0EDE5",         // crème (vlakken)
      sandStrong: "#CBB8A3",   // taupe (nieuwsbrief, accenten, lijnen)
      green: "#E8DFD5",        // licht taupe (vlakken)
      greenStrong: "#CBB8A3",  // taupe accent (decoratie)
      greenInk: "#694A3A",     // bruin voor kleine tekst (voldoende contrast)
      text: "#3F3029",         // hoofdtekst
      muted: "#6A5E57",        // secundaire tekst
      accent: "#694A3A",       // knoppen en koppen (chocoladebruin). Wit erop = AA-contrast.
      accentHover: "#523829",
      accentText: "#FFFFFF",
      border: "#E6DDD3",
      script: "#8A6A52",       // handgeschreven accentregel
      cta: "#9C5236",          // knoppen om een afspraak te plannen (terracotta). Wit erop = AA-contrast.
      ctaHover: "#84432B"
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Josefin Sans",
      script: "",               // optioneel handgeschreven accent, bijv. "Pinyon Script" (voeg dan ook toe aan googleFontsUrl)
      // Google Fonts-URL die bij bovenstaande lettertypen hoort. Leeg = systeemlettertypen.
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Josefin+Sans:wght@300;400;600&display=swap"
    },
    radius: "8px",        // afronding van kaarten en knoppen
    radiusLarge: "10px",  // afronding van liggende foto's
    archImages: true      // staande foto's als boog (bovenkant rond)
  },

  /* ---------- Contactgegevens ---------- */
  contact: {
    email: "hallo@example.com",
    phone: "020 123 45 67",
    phoneHref: "+31201234567",
    address: {
      show: true,
      street: "Voorbeeldstraat 12",
      postcode: "1234 AB",
      city: "Utrecht"
    },
    onlineAvailability: "Online gesprekken ook 's avonds mogelijk.",
    hours: [
      { days: "Ma t/m do", time: "09:00 – 17:30" },
      { days: "Di-avond", time: "19:00 – 21:00 (online)" }
    ],
    responseTime: "Je krijgt binnen twee werkdagen antwoord.",
    kvk: "[KvK-nummer]",
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "Instagram", url: "https://www.instagram.com/" }
    ],
    // Contactformulier: vul een endpoint in (bijv. Formspree: "https://formspree.io/f/xxxxxxx").
    // Leeg laten = demomodus (er wordt niets verstuurd).
    formEndpoint: ""
  },

  /* ---------- Afspraak maken ---------- */
  booking: {
    // "demo"    = geen agenda gekoppeld; bezoekers zien een duidelijk gemarkeerde demo
    // "request" = bezoekers versturen een afspraakaanvraag naar `requestEndpoint`
    // "link"    = knoppen naar je externe boekingssysteem (Calendly, Cal.com, SimplyBook, …)
    // "embed"   = je online agenda wordt op de pagina ingesloten via `embedUrl`
    mode: "demo",
    externalUrl: "",          // algemene boekingslink (mode "link"); per type kan ook `url`
    embedUrl: "",             // URL voor ingesloten agenda (mode "embed")
    embedHeight: 720,
    requestEndpoint: "",      // formulier-endpoint voor aanvragen (mode "request")

    // Knopteksten (overal op de site gebruikt)
    ctaLabel: "Plan een gratis kennismaking",
    headerLabel: "Plan kennismaking",   // kortere knop rechtsboven in het menu
    defaultType: "kennismaking",  // welk gesprekstype standaard geselecteerd is
    requireConsent: true,         // akkoord met privacyverklaring vragen

    // Gesprekstypen. Zet `enabled: false` om er een te verbergen.
    // Gratis kennismaken is niet verplicht: zet uit en pas ctaLabel en defaultType aan.
    types: [
      {
        id: "kennismaking",
        enabled: true,
        label: "Gratis kennismaking",
        duration: 20,
        price: "Gratis",
        location: "Online",
        description: "Vrijblijvend kennismaken en kijken of coaching bij je past.",
        url: ""
      },
      {
        id: "coachgesprek",
        enabled: true,
        label: "Coachgesprek",
        duration: 60,
        price: "€ 95",
        location: "Utrecht of online",
        description: "Een volledig gesprek over een vraag die nu speelt.",
        url: ""
      },
      {
        id: "online",
        enabled: true,
        label: "Online coachgesprek",
        duration: 45,
        price: "€ 85",
        location: "Online",
        description: "Compact gesprek via video, makkelijk in te plannen.",
        url: ""
      }
    ],

    // Beschikbaarheid in demomodus (alleen voor de demonstratie)
    demo: {
      daysAhead: 60,
      minNoticeDays: 1,
      weekdays: [1, 2, 3, 4],  // 0 = zondag, 1 = maandag, …
      times: ["09:00", "10:30", "13:00", "14:30", "16:00"],
      blockedDates: []         // bijv. ["2026-12-25"]
    }
  },

  /* ---------- Balk bovenaan ----------
     Korte tekst in een gekleurde balk boven het menu. Zet op null om te verbergen. */
  announcement: null,      // bijv. { text: "Nieuw: workshop in mei", href: "blog.html" }

  /* ---------- Nieuwsbrief ----------
     Aanmeldblok onderaan elke pagina (anker #nieuwsbrief).
     mode "demo" = er wordt niets verstuurd (standaard, zolang er geen dienst is gekoppeld)
     mode "form" = het formulier verstuurt naar `endpoint` (bijv. het formulieradres van
                   MailerLite, Brevo, Laposta of Formspree; zie HANDLEIDING.md)
     mode "link" = de knop opent de aanmeldpagina van je nieuwsbriefdienst (`externalUrl`)
     Verstuur alleen nieuwsbrieven aan mensen die zich zelf hebben aangemeld. */
  newsletter: {
    mode: "demo",
    endpoint: "",
    externalUrl: "",
    emailField: "email",      // veldnaam die je nieuwsbriefdienst verwacht
    nameField: "",            // bijv. "voornaam" voor een extra naamveld; leeg = alleen e-mail
    eyebrow: "Nieuwsbrief",
    title: "Rust in je inbox",
    script: "",
    text: "Een korte brief met een inzicht, een vraag om over na te denken en nieuws over workshops. Geen spam, afmelden kan altijd.",
    buttonLabel: "Aanmelden",
    consent: "Ja, ik wil de nieuwsbrief ontvangen. Ik heb de privacyverklaring gelezen."
  },

  /* ---------- Secties aan/uit ---------- */
  sections: {
    challenges: true,
    featuredServices: true,
    coachIntro: true,
    steps: true,
    reviews: true,
    blog: true,            // blog in menu en "laatste artikelen" op de homepage
    faq: true,
    newsletter: true,      // nieuwsbriefblok onderaan elke pagina
    prices: true,          // prijzen overal tonen of verbergen
    qualifications: true,
    experience: true
  },

  /* Demofoto's: van Unsplash (gratis te gebruiken, zie unsplash.com/license) en alleen
     bedoeld voor de demo. Vervang ze door je eigen foto's, bijvoorbeeld in assets/img/. */
  /* ---------- Afbeeldingen ----------
     Vervang de placeholders door eigen foto's (bij voorkeur .webp of .jpg,
     max. 1600 px breed). Geef breedte/hoogte op voor een stabiele lay-out. */
  images: {
    hero: { src: "https://images.unsplash.com/photo-1635880431084-bccf4ae5f0cd?auto=format&fit=crop&w=1000&h=1250&q=75", alt: "Een bureau met lamp, plant en notitieboek in warm licht", width: 800, height: 1000 },
    intro: { src: "https://images.unsplash.com/photo-1757792859308-b8d2115a0010?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een rustige, lichte praktijkruimte met bank en stoel", width: 1200, height: 900 },
    about: { src: "https://images.unsplash.com/photo-1635880431084-bccf4ae5f0cd?auto=format&fit=crop&w=1000&h=1250&q=75", alt: "Een bureau met lamp, plant en notitieboek in warm licht", width: 800, height: 1000 },
    aboutWide: { src: "https://images.unsplash.com/photo-1701905365018-da6f66042ee6?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een bankje in een park vol herfstbladeren", width: 1200, height: 900 },
    // Beelden bij het onderwerp (homepage en onderwerppagina). Kies rustige sfeerbeelden.
    subject: { src: "https://images.unsplash.com/photo-1613424777445-f93a2a48e285?auto=format&fit=crop&w=1000&h=1250&q=75", alt: "Gedroogde bloemen in een vaas met zachte schaduwen", width: 1200, height: 900 },
    story1: { src: "https://images.unsplash.com/photo-1788025555394-86c7d29d1de8?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een lege fauteuil in het zonlicht", width: 1200, height: 900 },
    story2: { src: "https://images.unsplash.com/photo-1706425458851-bee8e78d8316?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een open notitieboek en een kop koffie op tafel", width: 1200, height: 900 }
  },

  /* ---------- Navigatie ---------- */
  // Houd het menu kort. De knop "Plan kennismaking" staat er altijd rechts naast.
  nav: [
    { key: "subject", label: "Het onderwerp", href: "onderwerp.html" },
    { key: "blog", label: "Blog", href: "blog.html", section: "blog" },
    { key: "about", label: "Over mij", href: "over-mij.html" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ],

  /* ---------- Paginatitels en metabeschrijvingen ---------- */
  pages: {
    home: {
      title: "Loopbaan- en lifecoaching in Utrecht en online",
      description: "Vastgelopen in je werk of leven? Persoonlijke coaching in Utrecht en online. Plan een gratis kennismaking van 20 minuten."
    },
    about: {
      title: "Over mij",
      description: "Maak kennis met Sanne van Dijk: haar verhaal en haar kijk op coaching."
    },
    coaching: {
      title: "Coaching en trajecten",
      description: "Losse coachgesprekken, een coachingtraject of online coaching. Bekijk duur, werkwijze en tarieven."
    },
    subject: {
      title: "Het onderwerp",
      description: "Vastlopen in je werk: hoe het vaak gaat, wat erachter kan zitten en wat je zelf kunt doen."
    },
    blog: {
      title: "Blog",
      description: "Korte artikelen over werk, keuzes en balans van Koers Coaching."
    },
    booking: {
      title: "Afspraak maken",
      description: "Plan online een afspraak met Koers Coaching. Kies een gesprek, datum en tijd."
    },
    contact: {
      title: "Contact",
      description: "Neem contact op met Koers Coaching in Utrecht."
    },
    privacy: { title: "Privacyverklaring", description: "Lees hoe Koers Coaching omgaat met je persoonsgegevens." },
    terms: { title: "Algemene voorwaarden", description: "De algemene voorwaarden van Koers Coaching." },
    notFound: { title: "Pagina niet gevonden", description: "Deze pagina bestaat niet (meer)." }
  },

  /* ---------- Home ---------- */
  home: {
    // Volgorde van de blokken op de homepage. Beschikbaar: hero, topics, help, blog,
    // about, cta, en (optioneel) challenges, services, steps, reviews, faq.
    // Rustige, inhoudelijke opbouw: eerst het onderwerp, de coach en de afspraak pas aan het eind.
    // Andere blokken die je kunt toevoegen: hero, topics, help, blog, cta, challenges, services, steps, reviews, faq.
    order: ["opening", "story", "insights", "guidance", "about", "invite"],
    opening: {
      eyebrow: "Over werk, keuzes en balans",
      title: "Als je werk niet meer voelt als jouw werk",
      intro: "Je doet wat er van je verwacht wordt, maar het geeft je weinig energie meer. Dat overkomt meer mensen dan je denkt. Hier lees je waar dat gevoel vandaan kan komen, en wat je ermee kunt.",
      linkLabel: "Lees verder",
      linkHref: "#verhaal"
    },
    story: {
      eyebrow: "Herkenbaar?",
      title: "Vastlopen gaat vaak geleidelijk",
      blocks: [
        {
          title: "Het begint klein",
          image: "story1",
          paragraphs: [
            "Eerst is het een maandag die zwaarder voelt. Dan merk je dat je minder zin hebt in projecten waar je vroeger warm voor liep. Je doet je werk nog steeds goed, maar het kost meer moeite.",
            "Omdat het langzaam gaat, valt het lang niet op. Tot je op een dag merkt dat je vooral nog op de automatische piloot werkt."
          ]
        },
        {
          title: "Waarom veranderen zo lastig voelt",
          image: "story2",
          paragraphs: [
            "Je werk is meer dan een inkomen. Het hoort bij wie je bent, bij je zekerheid en bij wat anderen van je verwachten. Daarom voelt twijfelen al snel als falen.",
            "Toch is twijfel vaak een teken dat je gegroeid bent. Wat vroeger paste, hoeft nu niet meer te passen. Dat zien is al een eerste stap."
          ]
        }
      ],
      linkLabel: "Lees meer over dit onderwerp",
      linkHref: "onderwerp.html"
    },
    insights: {
      eyebrow: "Verdieping",
      title: "Drie inzichten om mee te beginnen",
      items: [
        { title: "Kijk naar energie, niet alleen naar taken", text: "Schrijf een week lang op welke momenten je energie geven en welke energie kosten. Patronen zeggen vaak meer dan een functietitel." },
        { title: "Twijfel is informatie", text: "In plaats van twijfel weg te drukken, kun je je afvragen wat die je vertelt. Wat mis je? En wat wil je juist behouden?" },
        { title: "Kleine stappen tellen", text: "Je hoeft niet meteen je baan op te zeggen. Een gesprek, een cursus of een dag meelopen kan al veel duidelijk maken." }
      ],
      postsTitle: "Verder lezen",
      postsCount: 3,          // aantal artikelen; 0 = geen artikelen tonen
      episodesCount: 2        // aantal podcastafleveringen (alleen als de podcast aan staat)
    },
    guidance: {
      eyebrow: "Begeleiding",
      title: "Als je er samen naar wilt kijken",
      paragraphs: [
        "Soms helpt het om hardop te denken met iemand die meekijkt zonder oordeel. In coachgesprekken onderzoeken we wat er voor jou speelt, wat je belangrijk vindt en welke stap daarbij past.",
        "Dat kan in losse gesprekken of in een traject, in de praktijk of online. Je bepaalt zelf het tempo."
      ],
      linkLabel: "Zo werk ik",
      linkHref: "coaching.html"
    },
    invite: {
      title: "Kennismaken?",
      text: "Benieuwd of coaching bij je past? In een vrijblijvend gesprek van 20 minuten kijken we samen naar je vraag.",
      secondaryLabel: "Of stuur eerst een bericht",
      secondaryHref: "contact.html"
    },
    hero: {
      eyebrow: "Coaching in Utrecht en online",
      title: "Weer helder voor ogen wat jij wilt",
      script: "",
      intro: "Loop je vast in je werk of voel je dat het anders moet? Samen maken we je keuzes concreet en zet je stappen die bij jou passen.",
      primaryLabel: "Waar kan ik je mee helpen?",
      secondaryLabel: "Plan kennismaking",
      note: "20 minuten, vrijblijvend en online",
      badgeTitle: "Utrecht & online",
      badgeText: "In de praktijk of via video"
    },
    topics: {
      eyebrow: "Herkenbaar?",
      title: "Waar loop jij tegenaan?",
      intro: "Iedereen loopt weleens vast. Dit zijn de onderwerpen waar ik mensen het vaakst mee help.",
      linkLabel: "Lees meer"
    },
    help: {
      eyebrow: "Wat kan ik voor je doen?",
      title: "Samen maken we het overzichtelijk",
      script: "",
      intro: "Je hoeft het niet alleen uit te zoeken. In de gesprekken brengen we rust in je hoofd en maken we je vraag concreet, op jouw tempo.",
      items: [
        { icon: "chat", title: "Ruimte voor jouw verhaal", text: "Je vertelt wat er speelt. Ik luister, vraag door en help je ordenen." },
        { icon: "compass", title: "Helder wat je wilt", text: "We ontdekken wat je echt belangrijk vindt en waar je naartoe wilt." },
        { icon: "leaf", title: "Stappen die passen", text: "Je zet kleine, haalbare stappen in je dagelijks leven, en we kijken samen hoe het gaat." }
      ],
      linkLabel: "Bekijk hoe ik werk",
      linkHref: "coaching.html"
    },
    challenges: {
      eyebrow: "Herkenbaar?",
      title: "Misschien loop je hier tegenaan",
      items: [
        { icon: "battery", title: "Weinig energie", text: "Je werkt hard, maar het geeft weinig voldoening." },
        { icon: "compass", title: "Twijfel over je richting", text: "Je wilt een volgende stap, maar weet niet welke." },
        { icon: "sun", title: "Een vol hoofd", text: "Ontspannen lukt steeds lastiger." },
        { icon: "chat", title: "Grenzen aangeven", text: "Je zegt ja, terwijl je nee bedoelt." }
      ]
    },
    services: {
      eyebrow: "Aanbod",
      title: "Coaching die past bij jouw vraag"
    },
    intro: {
      eyebrow: "Over mij",
      title: "Hoi, ik ben Sanne",
      script: "",
      paragraphs: [
        "Ik help mensen die vastlopen in hun werk of hun balans kwijt zijn om weer te voelen wat ze belangrijk vinden, en daar ook naar te handelen.",
        "Zelf liep ik ook vast in een baan die op papier perfect was. Die zoektocht bracht me bij coaching. Nu begeleid ik anderen, nuchter en betrokken."
      ],
      linkLabel: "Meer over mij"
    },
    steps: {
      eyebrow: "Werkwijze",
      title: "Zo werken we samen",
      items: [
        { title: "Kennismaken", text: "Je vertelt wat er speelt en we kijken of het klikt." },
        { title: "Doelen bepalen", text: "We maken je vraag concreet en spreken een aanpak af." },
        { title: "Samen aan de slag", text: "Gesprekken, oefenen in de praktijk en regelmatig evalueren." }
      ]
    },
    reviews: {
      eyebrow: "Ervaringen",
      title: "Wat cliënten zeggen"
    },
    blog: {
      eyebrow: "Blog",
      title: "Inzichten om alvast verder te komen",
      // Heb je een podcast? Vul de link in; dan staat er een knop naast de blog.
      podcastUrl: "",
      podcastLabel: "Luister de podcast"
    },
    faq: {
      eyebrow: "Vragen",
      title: "Veelgestelde vragen"
    },
    finalCta: {
      title: "Zullen we kennismaken?",
      text: "In 20 minuten ontdek je of coaching je verder kan helpen. Vrijblijvend en online.",
      secondaryLabel: "Eerst een vraag stellen"
    }
  },

  /* ---------- Het onderwerp ----------
     Het centrale thema van je website (menu: "Het onderwerp", pagina onderwerp.html).
     Pas titel, tekst en beelden aan op jouw vakgebied, bijvoorbeeld voeding,
     slaap, rouw of ondernemen. De deelonderwerpen staan hieronder bij `topics`. */
  subject: {
    eyebrow: "Het onderwerp",
    title: "Vastlopen in je werk",
    intro: "Bijna iedereen loopt weleens vast in het werk. Soms is dat een fase, soms een signaal dat er iets moet veranderen. Op deze pagina lees je hoe dat vaak gaat, wat erachter kan zitten en wat je zelf kunt doen.",
    image: "subject",
    sections: [
      {
        title: "Hoe het vaak gaat",
        paragraphs: [
          "Vastlopen komt zelden uit het niets. Meestal sluipt het erin: je energie neemt af, je twijfelt vaker en je merkt dat je vooral nog doorgaat omdat het moet.",
          "Veel mensen wachten lang voordat ze er iets mee doen. Het werk gaat immers nog, en van buiten lijkt alles in orde."
        ]
      },
      {
        title: "Wat erachter kan zitten",
        image: "story1",
        paragraphs: [
          "Soms past je werk niet meer bij wat je belangrijk vindt. Soms is het de manier waarop je werkt: altijd ja zeggen, te weinig rust, geen ruimte voor wat je leuk vindt. En soms speelt er privé iets dat ook in je werk doorwerkt.",
          "Het helpt om die lagen uit elkaar te halen. Dan wordt duidelijker of je iets aan je werk wilt veranderen, aan je manier van werken, of allebei."
        ]
      },
      {
        title: "Wat je zelf kunt doen",
        paragraphs: [
          "Begin met opmerken. Wanneer voel je je goed in je werk, en wanneer niet? Praat erover met iemand die je vertrouwt. En geef jezelf toestemming om te twijfelen zonder meteen een besluit te nemen.",
          "Merk je dat je in cirkels blijft denken, dan kan het helpen om er met iemand van buiten naar te kijken."
        ]
      }
    ],
    topicsTitle: "Lees verder over"
  },

  /* ---------- Onderwerpen ----------
     De thema's waar je bezoekers mee rondlopen. Ze staan op de homepage onder
     "Waar loop jij tegenaan?". Met `page` krijgt een onderwerp een eigen pagina
     (maak dan ook een HTML-bestand met data-topic="<slug>", zie onderwerp-werk.html).
     Laat `page` weg voor alleen een korte uitleg op de homepage. */
  topics: [
    {
      slug: "werk",
      page: "onderwerp-werk.html",
      icon: "compass",
      title: "Werk en richting",
      short: "Je werk voelt niet meer passend, maar wat dan wel? We onderzoeken wat je energie geeft en welke stap daarbij hoort.",
      intro: "Misschien doe je je werk goed, maar voelt het niet meer als jouw werk. Of je weet dat je iets anders wilt, maar niet wat. Dat is verwarrend, en heel gewoon.",
      recognise: [
        "Je zondagavond voelt zwaar bij de gedachte aan maandag",
        "Je twijfelt al lang over een volgende stap",
        "Je weet wat je niet wilt, maar niet wat je wél wilt"
      ],
      content: [
        "In de coaching kijken we eerst naar wat je drijft: waar krijg je energie van, waar loop je op leeg en wat vind je echt belangrijk? Van daaruit maken we je opties concreet.",
        "Je hoeft niet meteen alles om te gooien. Vaak begint het met een kleine stap die je zelf kunt zetten."
      ],
      help: [
        "Helder krijgen wat je drijft en wat je zoekt",
        "Opties op een rij zetten en toetsen",
        "Een eerste stap die bij jou past"
      ],
      metaDescription: "Twijfel je over je werk of je volgende stap? Lees hoe coaching je helpt om richting te vinden."
    },
    {
      slug: "balans",
      page: "onderwerp-balans.html",
      icon: "battery",
      title: "Energie en balans",
      short: "Altijd aan, weinig rust. We kijken waar je energie naartoe gaat en hoe je weer ruimte maakt voor wat je opbouwt.",
      intro: "Je zet je volledig in, voor je werk en voor anderen. Maar ergens onderweg ben je jezelf een beetje kwijtgeraakt en raakt je energie op.",
      recognise: [
        "Je bent moe, ook na een vrij weekend",
        "Ontspannen lukt steeds lastiger",
        "Je hebt het gevoel dat je achter de feiten aanloopt"
      ],
      content: [
        "Samen brengen we in kaart waar je energie naartoe gaat en wat je juist energie geeft. Je ontdekt patronen en kiest wat je anders wilt doen.",
        "Coaching is geen vervanging van medische of psychologische hulp. Heb je langdurig klachten, overleg dan ook met je huisarts."
      ],
      help: [
        "Inzicht in wat energie kost en wat energie geeft",
        "Haalbare afspraken met jezelf",
        "Rustmomenten die je ook echt neemt"
      ],
      metaDescription: "Altijd aan en weinig rust? Lees hoe coaching je helpt om je energie en balans terug te vinden."
    },
    {
      slug: "keuzes",
      page: "onderwerp-keuzes.html",
      icon: "target",
      title: "Keuzes maken",
      short: "Blijf je twijfelen of malen? We maken je keuze overzichtelijk, zodat je met vertrouwen een besluit neemt.",
      intro: "Een grote keuze kan je hoofd flink vullen. Je weegt alles af, vraagt iedereen om advies en komt toch niet verder.",
      recognise: [
        "Je blijft voor- en nadelen afwegen",
        "Je laat anderen eigenlijk voor je kiezen",
        "Je bent bang de verkeerde keuze te maken"
      ],
      content: [
        "We zetten je opties en wat je belangrijk vindt naast elkaar. Daarbij luisteren we niet alleen naar je hoofd, maar ook naar je gevoel.",
        "Het doel is niet de perfecte keuze, maar een keuze waar jij achter staat."
      ],
      help: [
        "Overzicht in je opties",
        "Duidelijk wat jij belangrijk vindt",
        "Vertrouwen om een besluit te nemen"
      ],
      metaDescription: "Blijf je twijfelen over een keuze? Lees hoe coaching je helpt om met vertrouwen te kiezen."
    },
    {
      slug: "grenzen",
      icon: "chat",
      title: "Grenzen aangeven",
      short: "Je zegt ja terwijl je nee bedoelt. We oefenen hoe je duidelijk en vriendelijk je grens aangeeft."
    }
  ],

  /* ---------- Over mij ---------- */
  about: {
    eyebrow: "Over mij",
    title: "Ik ben Sanne, coach voor mensen die richting zoeken",
    intro: "Mijn rol is de juiste vragen stellen, meedenken en je helpen de stap te zetten.",
    storyTitle: "Mijn verhaal",
    story: [
      "Jarenlang had ik een baan die er op papier goed uitzag, tot ik merkte dat ik vooral bezig was met de verwachtingen van anderen. Die zoektocht bracht me bij coaching: eerst als cliënt, later als vak.",
      "Nu begeleid ik professionals, ondernemers en leidinggevenden bij vragen over werk, keuzes en balans. Nuchter en betrokken."
    ],
    visionTitle: "Mijn kijk op coaching",
    vision: "Geen advies geven, maar samen helder krijgen wat jij nodig hebt om in beweging te komen.",
    values: [
      { title: "Persoonlijk", text: "Jouw vraag, jouw tempo." },
      { title: "Praktisch", text: "Elk gesprek levert een concrete stap op." },
      { title: "Eerlijk", text: "Ik zeg wat ik zie, met respect." }
    ],
    experienceTitle: "Ervaring",
    experience: [
      "[Aantal] jaar werkervaring als [functie] in [sector]",
      "[Aantal] jaar actief als zelfstandig coach",
      "Specialisaties: [bijvoorbeeld loopbaan, stress en balans]"
    ],
    qualificationsTitle: "Opleidingen",
    qualificationsNote: "Vermeld alleen opleidingen en registraties die je echt hebt afgerond of bezit.",
    qualifications: [
      { title: "[Naam coachopleiding]", org: "[Opleidingsinstituut]", year: "[Jaar]" },
      { title: "[Lidmaatschap beroepsvereniging of register]", org: "[Naam organisatie]", year: "[Sinds jaar]" }
    ],
    ctaTitle: "Benieuwd of we bij elkaar passen?",
    ctaText: "Een kennismaking is de beste manier om dat te ontdekken."
  },

  /* ---------- Coaching-overzicht ---------- */
  coaching: {
    eyebrow: "Coaching en trajecten",
    title: "Kies de vorm die bij je past",
    intro: "Eén gericht gesprek of een paar maanden samen aan de slag.",
    helpTitle: "Twijfel je welke vorm past?",
    helpText: "Dat zoeken we samen uit in de kennismaking."
  },

  /* ---------- Diensten ----------
     Elke dienst heeft een eigen detailpagina (bestand `page`).
     Nieuwe dienst? Kopieer een detailpagina, pas `data-service` aan
     naar de nieuwe `slug` en voeg de dienst hieronder toe.            */
  services: [
    {
      slug: "losse-gesprekken",
      page: "coaching-losse-gesprekken.html",
      featured: true,
      title: "Losse coachgesprekken",
      eyebrow: "Flexibel",
      short: "Eén gericht gesprek over een vraag die nu speelt.",
      intro: "Geen traject nodig, wel een goed gesprek. We zoomen in op één vraag en je gaat naar huis met een concrete volgende stap.",
      image: { src: "https://images.unsplash.com/photo-1778159034544-8d9eab9a9fce?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een rieten stoel met kussens in een rustige hoek", width: 1200, height: 900 },
      forWho: [
        "Je staat voor een concrete keuze of lastig gesprek",
        "Je wilt sparren zonder vast traject",
        "Je wilt een opfrisgesprek na eerdere coaching"
      ],
      includes: [
        "Coachgesprek van 60 minuten",
        "Korte samenvatting per e-mail"
      ],
      process: [
        { title: "Plan een gesprek", text: "In de praktijk of online." },
        { title: "Het gesprek", text: "Gericht werken aan je vraag." },
        { title: "Vervolg naar wens", text: "Plan gerust een nieuw gesprek." }
      ],
      durationShort: "60 minuten",
      duration: "60 minuten",
      locationShort: "Utrecht of online",
      location: "Utrecht of online",
      online: true,
      price: "€ 95",
      priceNote: "per gesprek · voorbeeldtarief",
      bookingType: "coachgesprek",
      bookingLabel: "Plan een coachgesprek",
      metaTitle: "Losse coachgesprekken",
      metaDescription: "Een gericht coachgesprek van 60 minuten over één vraag. In Utrecht of online, zonder vast traject."
    },
    {
      slug: "coachingtraject",
      page: "coaching-traject.html",
      featured: true,
      title: "Coachingtraject",
      eyebrow: "Meest gekozen",
      short: "Zes gesprekken waarin we stap voor stap aan jouw doel werken.",
      intro: "Wil je echt iets veranderen? In een traject nemen we de tijd om nieuwe keuzes te maken en die vol te houden.",
      image: { src: "https://images.unsplash.com/photo-1651841689044-00521ab0fa66?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een stapel boeken en een mok op tafel", width: 1200, height: 900 },
      forWho: [
        "Je twijfelt over je loopbaan",
        "Stress of oude patronen zitten je in de weg",
        "Je groeit in een nieuwe rol, bijvoorbeeld als leidinggevende"
      ],
      includes: [
        "Intake en doelbepaling",
        "Zes gesprekken van 75 minuten",
        "Opdrachten tussen de gesprekken",
        "Tussentijdse en eindevaluatie"
      ],
      process: [
        { title: "Kennismaking", text: "Past het traject bij je vraag?" },
        { title: "Intake en doel", text: "We maken je doel concreet." },
        { title: "Gesprekken en evaluatie", text: "Elke twee à drie weken, met afsluitende evaluatie." }
      ],
      durationShort: "6 gesprekken",
      duration: "6 × 75 minuten, in 3 à 4 maanden",
      locationShort: "Utrecht of online",
      location: "Utrecht, online of gecombineerd",
      online: true,
      price: "€ 695",
      priceNote: "heel traject · voorbeeldtarief",
      bookingType: "kennismaking",
      bookingLabel: "Plan een gratis kennismaking",
      metaTitle: "Coachingtraject",
      metaDescription: "Een coachingtraject van zes gesprekken voor wie echt iets wil veranderen in werk of leven."
    },
    {
      slug: "online-coaching",
      page: "coaching-online.html",
      featured: true,
      title: "Online coaching",
      eyebrow: "Waar je ook bent",
      short: "Persoonlijke coaching via video, ook 's avonds.",
      intro: "Geen reistijd, wel volle aandacht. Net zo persoonlijk als in de praktijk en makkelijker in te plannen.",
      image: { src: "https://images.unsplash.com/photo-1587902673915-631e5ba4488f?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Laptop op een bureau klaar voor een videogesprek", width: 1200, height: 900 },
      forWho: [
        "Je hebt een volle agenda",
        "Je woont verder weg",
        "Je praat liever vanuit je eigen omgeving"
      ],
      includes: [
        "Gesprekken van 45 of 60 minuten",
        "Beveiligde videoverbinding, geen account nodig",
        "Ook in de avonduren"
      ],
      process: [
        { title: "Plan een moment", text: "Ook 's avonds mogelijk." },
        { title: "Ontvang de link", text: "Inloggen met één klik." },
        { title: "Het gesprek", text: "Net zo persoonlijk als in de praktijk." }
      ],
      durationShort: "45 of 60 min",
      duration: "45 of 60 minuten",
      locationShort: "Online",
      location: "Online via video",
      online: true,
      price: "€ 85",
      priceNote: "per 45 minuten · voorbeeldtarief",
      bookingType: "online",
      bookingLabel: "Plan een online gesprek",
      metaTitle: "Online coaching",
      metaDescription: "Persoonlijke coaching via een beveiligde videoverbinding. Flexibel in te plannen, ook 's avonds."
    }
  ],

  /* ---------- Reviews (voorbeeldinhoud) ----------
     Vervang door echte reviews, alleen met toestemming van de cliënt.
     `sample: true` toont het label "Voorbeeldinhoud". Zet op false bij echte reviews. */
  reviews: [
    { sample: true, quote: "Plaats hier een echte ervaring van een cliënt: waar diegene mee rondliep en wat er veranderde.", name: "[Voornaam cliënt]", context: "[Beroep of situatie]" },
    { sample: true, quote: "Een tweede review over een ander soort vraag, zoals een loopbaankeuze of stress.", name: "[Voornaam cliënt]", context: "[Beroep of situatie]" },
    { sample: true, quote: "Kort, concreet en in de eigen woorden van de cliënt. Altijd met toestemming.", name: "[Voornaam cliënt]", context: "[Beroep of situatie]" }
  ],

  /* ---------- Blog ----------
     Elk artikel krijgt automatisch een eigen pagina: blog-artikel.html?post=<slug>.
     Bouwstenen voor `body`: { p: "tekst" }, { h2: "tussenkop" },
     { list: ["punt", "punt"] } en { quote: "citaat" }.
     `sample: true` toont het label "Voorbeeldartikel".                      */
  /* ---------- Podcast (optioneel) ----------
     Zet enabled op false als je geen podcast hebt; dan verdwijnt hij overal.
     platformUrl = link naar je podcast (bijv. Spotify of Apple Podcasts).
     `sample: true` toont het label "Voorbeeldinhoud". */
  podcast: {
    enabled: false,   // true = podcast tonen op homepage en blogpagina (noem het menu dan bijv. "Blog / Podcast")
    title: "Podcast",
    intro: "Korte gesprekken over werk, keuzes en balans. Om te luisteren onderweg.",
    platformUrl: "",
    platformLabel: "Alle afleveringen",
    episodes: [
      { sample: true, number: 2, title: "[Titel van aflevering 2]", duration: "[duur]", text: "[Korte omschrijving van de aflevering.]", url: "" },
      { sample: true, number: 1, title: "[Titel van aflevering 1]", duration: "[duur]", text: "[Korte omschrijving van de aflevering.]", url: "" }
    ]
  },

  blog: {
    eyebrow: "Blog",
    title: "Inzichten en tips",
    intro: "Korte artikelen over werk, keuzes en balans.",
    homeCount: 3,
    posts: [
      {
        slug: "vijf-vragen-loopbaankeuze",
        sample: true,
        title: "Vijf vragen die helpen bij een loopbaankeuze",
        date: "2026-10-14",
        readTime: "4 min",
        category: "Loopbaan",
        image: { src: "https://images.unsplash.com/photo-1603492501465-2d1bf970b974?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een pad door een dennenbos met heide", width: 1200, height: 900 },
        excerpt: "Twijfel je al maanden over een volgende stap? Deze vragen brengen je dichter bij een besluit.",
        body: [
          { p: "Een loopbaankeuze voelt vaak groot. Toch helpt het om de vraag kleiner te maken. Neem voor elk van deze vragen tien minuten en schrijf je antwoord op." },
          { h2: "1. Wanneer had je voor het laatst energie van je werk?" },
          { p: "Denk aan een concreet moment. Wat deed je, met wie, en wat maakte het goed?" },
          { h2: "2. Wat wil je juist niet meer?" },
          { p: "Weten wat je niet wilt is vaak makkelijker dan weten wat je wél wilt, en net zo waardevol." },
          { h2: "3. Welke angst houdt je tegen?" },
          { p: "Benoem hem. Een angst die je kunt opschrijven, is vaak minder groot dan hij voelt." },
          { h2: "4. Wat zou je een vriend adviseren?" },
          { p: "Afstand nemen van je eigen situatie geeft vaak verrassend heldere antwoorden." },
          { h2: "5. Wat is een kleine stap die je deze week kunt zetten?" },
          { list: ["Een gesprek met iemand in het vak dat je aanspreekt", "Een vacature lezen zonder te solliciteren", "Een middag vrij plannen om na te denken"] },
          { p: "Kom je er alleen niet uit? Dan is dat precies waar coaching bij kan helpen." }
        ]
      },
      {
        slug: "hoofd-tot-rust",
        sample: true,
        title: "Drie manieren om je hoofd tot rust te brengen",
        date: "2026-09-30",
        readTime: "3 min",
        category: "Balans",
        image: { src: "https://images.unsplash.com/photo-1778766017582-44ba4512f532?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Een knusse kamer met een brandende lamp", width: 1200, height: 900 },
        excerpt: "Een vol hoofd na werktijd? Met deze eenvoudige gewoontes maak je weer ruimte.",
        body: [
          { p: "Veel mensen herkennen het: het werk is klaar, maar je gedachten nog niet. Deze drie gewoontes helpen om de dag echt af te sluiten." },
          { h2: "Schrijf het op" },
          { p: "Zet aan het eind van je werkdag alles wat nog in je hoofd zit op papier. Wat op papier staat, hoef je niet meer vast te houden." },
          { h2: "Maak een overgangsmoment" },
          { p: "Een korte wandeling of een vast ritueel helpt je brein om te schakelen van werk naar thuis." },
          { h2: "Kies bewust één ding" },
          { p: "Vraag jezelf 's ochtends af: wat is vandaag het belangrijkste? Dat geeft focus en een gevoel van voldoening." },
          { quote: "Rust komt zelden vanzelf. Je maakt er ruimte voor." },
          { p: "Houden de klachten aan of maak je je zorgen over je gezondheid? Neem dan contact op met je huisarts." }
        ]
      },
      {
        slug: "nee-zeggen",
        sample: true,
        title: "Nee zeggen zonder schuldgevoel",
        date: "2026-09-12",
        readTime: "3 min",
        category: "Persoonlijke groei",
        image: { src: "https://images.unsplash.com/photo-1765118422113-e757c5082b03?auto=format&fit=crop&w=1600&h=1200&q=75", alt: "Koffie en thee op een vensterbank", width: 1200, height: 900 },
        excerpt: "Zeg je vaak ja terwijl je nee bedoelt? Zo geef je vriendelijk en duidelijk je grenzen aan.",
        body: [
          { p: "Ja zeggen voelt vaak makkelijker. Maar elke keer dat je ja zegt tegen iets wat je niet wilt, zeg je nee tegen iets anders." },
          { h2: "Neem bedenktijd" },
          { p: "\"Ik kom er morgen op terug\" is een prima antwoord. Zo voorkom je een automatisch ja." },
          { h2: "Houd het kort" },
          { p: "Je hoeft je nee niet uitgebreid uit te leggen. Een korte, vriendelijke reden is genoeg." },
          { h2: "Bied een alternatief als je dat wilt" },
          { list: ["\"Deze week lukt niet, volgende week wel.\"", "\"Dat kan ik niet oppakken, maar ik denk graag even mee.\""] },
          { p: "Oefenen helpt. Begin bij kleine verzoeken en merk hoe het voelt." }
        ]
      }
    ]
  },

  /* ---------- Veelgestelde vragen ---------- */
  faq: [
    { q: "Wat gebeurt er tijdens de gratis kennismaking?", a: "We spreken elkaar 20 minuten via video. Je vertelt wat er speelt en we kijken of coaching bij je past. Je zit nergens aan vast." },
    { q: "Hoeveel gesprekken heb ik nodig?", a: "Dat hangt af van je vraag. Soms zijn één of twee gesprekken genoeg, voor grotere veranderingen werkt een traject van zes gesprekken vaak goed." },
    { q: "Is coaching hetzelfde als therapie?", a: "Nee. Coaching richt zich op je doelen, keuzes en gedrag. Bij psychische klachten verwijs ik je naar je huisarts." },
    { q: "Wordt coaching vergoed?", a: "Meestal niet door de zorgverzekeraar, maar veel werkgevers hebben een ontwikkelbudget. Vraag het gerust na." }
  ]
};
