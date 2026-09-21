import type { Language } from "./site-content";

export const secondaryCopy = {
  en: {
    navigation: {
      home: "Home",
      about: "About",
      rooms: "Bedrooms & Gallery",
      blog: "Blog",
      contact: "Contact",
      book: "Request to book",
      menu: "Open menu",
      language: "Choose language",
    },
    common: {
      address: "8257 Badacsonytomaj, Füredi út 5, Hungary",
      wholeVilla: "The villa is rented only as one complete property.",
      explore: "Explore",
      booking: "Booking & payment",
      bookingNote:
        "The host confirms your dates in writing before sending the IBAN. After the transfer, share the receipt through WhatsApp.",
      contact: "Contact",
      contactPending: "Email and WhatsApp details will be added before launch.",
      availability: "Check availability",
      backHome: "Back to home",
    },
    about: {
      eyebrow: "BADACSONY, AT YOUR OWN PACE",
      title: "A house to return to, not just sleep in",
      intro:
        "Relax Villa is a private four-bedroom base in Badacsonytomaj for families and friends who want the whole address to themselves.",
      storyEyebrow: "ONE BOOKING, NO STRANGERS",
      storyTitle: "Privacy changes the shape of a group trip",
      storyLead:
        "Everyone can follow the same plan without having to spend every hour in the same room.",
      storyBody:
        "The four bedrooms, living areas, kitchen, garden, terrace, pool, hot tub and barrel sauna all belong to one reservation. There are no room-by-room bookings and no common areas shared with other guests.",
      secondBody:
        "That makes the day easier to shape: breakfast together, separate plans around the lake or hill, then dinner back at your own table. The house gives the group a centre without turning the trip into a timetable.",
      directionEyebrow: "GOOD TO KNOW",
      directionTitle: "Simple from booking to check-out",
      visionTitle: "The villa is only yours",
      visionText:
        "When you book Relax Villa, the four bedrooms, living areas, garden, pool, hot tub and sauna are reserved for your group. No other guests stay on the property.",
      missionTitle: "You book directly with the host",
      missionText:
        "Dates and the total price are confirmed in writing. Payment is made by bank transfer only after you receive the official IBAN.",
      localEyebrow: "AROUND BADACSONY",
      localTitle: "Lake, hill or wine country?",
      localIntro:
        "Badacsony puts walking trails, Lake Balaton and wine terraces within the same easy-going holiday. Choose one for the day, or combine them without rushing.",
      localFeatures: [
        {
          title: "Walk Badacsony Hill",
          text: "Follow the marked paths through the basalt formations and continue to one of the viewpoints over Lake Balaton.",
        },
        {
          title: "Visit the local wine terraces",
          text: "Spend an afternoon at the cellars around the hill and ask for Kéknyelű, one of Badacsony's bestknown local grape varieties.",
        },
        {
          title: "Make time for the lake",
          text: "Plan a beach day, visit a lakeside town or continue into the villages and markets of the Káli Basin.",
        },
      ],
      localImageAlts: [
        "Relax Villa's private pool and terrace",
        "Relax Villa's outdoor hot tub",
        "The shared dining table and kitchen at Relax Villa",
      ],
      faqEyebrow: "RELAX VILLA FAQ",
      faqTitle: "Useful answers before you book",
      faqIntro: "The practical details matter. If your question is not covered here, ask the host before transferring payment.",
      faqContact: "Contact us",
      faqs: [
        {
          question: "Is the villa booked as a whole?",
          answer:
            "Yes. Every booking includes all four bedrooms and the shared spaces. Bedrooms are not rented separately.",
        },
        {
          question: "Are pets allowed?",
          answer:
            "Yes, pets are welcome for an additional fee. Please mention the number and type of pets in your request so the host can confirm the details.",
        },
        {
          question: "What is the cancellation policy?",
          answer:
            "The host will share the applicable cancellation terms before confirming your booking. Please ask for them in writing before making a transfer.",
        },
        {
          question: "How does payment work?",
          answer:
            "Once the host confirms your dates, they will send the official IBAN and payment reference. Pay by bank transfer, then send the receipt through WhatsApp. Do not transfer money before receiving those details.",
        },
        {
          question: "What are the check-in and check-out times?",
          answer:
            "Arrival and departure times are agreed directly with the host when your stay is confirmed. Please check them before you travel.",
        },
        {
          question: "Is the villa suitable for guests with limited mobility?",
          answer:
            "Please tell the host about any accessibility requirements before booking so they can confirm whether the property meets your needs.",
        },
      ],
    },
    rooms: {
      eyebrow: "BEDROOMS & GALLERY",
      title: "Four bedrooms. All yours.",
      intro:
        "Two double rooms, one twin room and one flexible family room—all included when you book the villa.",
      notice: "Your booking includes the complete villa, all four bedrooms and every outdoor area.",
      bedroomNames: ["Bedroom One", "Bedroom Two", "Bedroom Three", "Bedroom Four"],
      bedroomNotes: [
        "Double room with a skylight, television and doors toward the balcony.",
        "Double room with bedside lighting, storage and direct balcony access.",
        "Twin room with two separate single beds for children, friends or guests who prefer their own bed.",
        "Flexible room with one double and one single bed, balcony access and air conditioning.",
      ],
      sharedEyebrow: "BETWEEN PLANS",
      sharedTitle: "The rooms that bring everyone back together",
      sharedText:
        "Kitchen, dining spaces, garden, terrace and wellness areas are not add-ons; they are the centre of a whole-villa stay.",
      galleryEyebrow: "THE COMPLETE HOUSE",
      galleryTitle: "A room-by-room look before you book",
      galleryText:
        "Browse 38 current photos of the bedrooms, living areas, pool, hot tub, barrel sauna, terrace and garden.",
      galleryTabs: {
        all: "All photos",
        bedrooms: "Bedrooms",
        shared: "Living spaces",
        outdoors: "Pool & wellness",
      },
      photoLabel: "Photo",
      previousImage: "Previous photo",
      nextImage: "Next photo",
      openImage: "Open image",
      cta: "Request your dates",
    },
    blog: {
      eyebrow: "NOTES FROM BADACSONY",
      title: "Badacsony without the generic guide",
      intro:
        "Useful reading for groups who want to understand the place, plan less and use the villa well.",
      read: "Read article",
      articles: [
        {
          slug: "slow-day",
          category: "HILL & LAKE",
          title: "Badacsony between lake and basalt",
          excerpt:
            "The region makes more sense when you see the volcanic hill, the Balaton shore and the vineyards as one landscape.",
          paragraphs: [
            "Badacsony is a volcanic remnant hill on the northern shore of Lake Balaton. Its basalt formations, viewpoints and vineyards are not separate attractions; they are different readings of the same terrain.",
            "Choose one trail, cellar or stretch of lakeshore rather than collecting stops. Back at the villa, the pool and terrace leave enough of the day unplanned.",
          ],
        },
        {
          slug: "pack-together",
          category: "GROUP PLANNING",
          title: "Four bedrooms, one group: plan the room mix first",
          excerpt:
            "Ten minutes of room planning before the drive can save an hour of negotiation at the door.",
          paragraphs: [
            "The villa has double, twin and flexible sleeping arrangements. Match them to couples, children and individual sleepers before arrival, and note who needs balcony access or air conditioning most.",
            "Then agree only the essentials: arrival window, first breakfast and one shared dinner. A whole house works best when the group has a framework, not a minute-by-minute schedule.",
          ],
        },
        {
          slug: "shared-table",
          category: "AT THE HOUSE",
          title: "Pool, sauna, dinner: a villa day with no timetable",
          excerpt:
            "Some days do not need a destination; the house already has enough ways to change pace.",
          paragraphs: [
            "Start outside while the weather is mild, move to the pool, and save the hot tub or barrel sauna for later. Because the spaces are private, the order is entirely yours.",
            "For dinner, let local market produce or a nearby wine terrace set the tone. What matters is not a complicated menu, but having the table, terrace and evening to yourselves.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "DATES, DETAILS, DIRECT CONTACT",
      title: "Ask about your dates",
      intro:
        "Tell us when you would like to stay and who is travelling. The host confirms availability, price and payment details directly.",
      formEyebrow: "YOUR GROUP",
      formTitle: "Tell us who is coming",
      formIntro:
        "Every enquiry is for the complete four-bedroom villa. Add the details that help the host answer properly the first time.",
      formFields: {
        name: "Full name",
        email: "Email address",
        whatsapp: "Contact number",
        arrival: "Arrival",
        departure: "Departure",
        guests: "Number of guests",
        language: "Preferred language",
        message: "Message",
      },
      formPlaceholder: "Children's ages, pets, arrival plans or anything the host should know.",
      formSubmit: "Send enquiry",
      formSending: "Sending…",
      formCopy: "Copy enquiry",
      formRequired: "Required fields are marked with *.",
      formTrust:
        "Your request is not a confirmed booking until the host replies in writing.",
      formDateError: "Departure must be later than arrival.",
      formCopied:
        "Online sending is not connected yet. Your message has not been sent; the enquiry details were copied.",
      formDestinationMissing:
        "Your message could not be sent. Please try again or contact us directly by email or WhatsApp.",
      formNameError: "Please enter your full name using at least 2 characters.",
      formMessageError: "Please enter a message of at least 10 characters.",
      formRateLimited: "Too many messages were sent with this email address. Please wait one hour and try again.",
      formReady: "Your message has been received. We will reply using the contact details you provided.",
      visit: "Villa address",
      write: "Direct contact",
      writeText: "Email and WhatsApp details will appear here once confirmed.",
      map: "Open in maps",
      processEyebrow: "FROM DATES TO ARRIVAL",
      processTitle: "A direct booking in three steps",
      steps: [
        ["01", "Send the essentials", "Choose dates, guest numbers and pets for the complete villa."],
        ["02", "Get it in writing", "The host confirms availability, total price, IBAN and payment reference."],
        ["03", "Transfer and keep the reference", "Pay by bank transfer, then send the receipt through WhatsApp."],
      ],
      noteTitle: "Before you transfer",
      note:
        "Please wait for written date confirmation and the official bank details before making a payment.",
      cta: "Choose dates on the home page",
    },
  },
  de: {
    navigation: {
      home: "Start",
      about: "Über uns",
      rooms: "Schlafzimmer & Galerie",
      blog: "Blog",
      contact: "Kontakt",
      book: "Buchung anfragen",
      menu: "Menü öffnen",
      language: "Sprache wählen",
    },
    common: {
      address: "8257 Badacsonytomaj, Füredi út 5, Ungarn",
      wholeVilla: "Die Villa wird ausschließlich als komplette Unterkunft vermietet.",
      explore: "Entdecken",
      booking: "Buchung & Zahlung",
      bookingNote:
        "Der Gastgeber bestätigt Ihre Reisedaten schriftlich, bevor er die IBAN sendet. Nach der Überweisung schicken Sie den Beleg per WhatsApp.",
      contact: "Kontakt",
      contactPending: "E-Mail- und WhatsApp-Daten werden vor dem Start ergänzt.",
      availability: "Verfügbarkeit prüfen",
      backHome: "Zur Startseite",
    },
    about: {
      eyebrow: "BADACSONY IM EIGENEN TEMPO",
      title: "Ein Haus zum Zurückkehren, nicht nur zum Übernachten",
      intro:
        "Die Relax Villa ist ein privates Haus mit vier Schlafzimmern in Badacsonytomaj – für Familien und Freunde, die eine Adresse ganz für sich möchten.",
      storyEyebrow: "EINE BUCHUNG, KEINE FREMDEN GÄSTE",
      storyTitle: "Privatsphäre verändert eine Gruppenreise",
      storyLead:
        "Alle können dieselbe Reise teilen, ohne jede Stunde im selben Raum verbringen zu müssen.",
      storyBody:
        "Vier Schlafzimmer, Wohnräume, Küche, Garten, Terrasse, Pool, Whirlpool und Fasssauna gehören zu einer einzigen Reservierung. Es gibt keine Zimmerbuchungen und keine Gemeinschaftsflächen mit anderen Gästen.",
      secondBody:
        "So lässt sich der Tag leicht gestalten: gemeinsames Frühstück, getrennte Pläne am See oder auf dem Berg und abends wieder am eigenen Tisch. Das Haus gibt der Gruppe einen Mittelpunkt, ohne einen festen Stundenplan vorzugeben.",
      directionEyebrow: "GUT ZU WISSEN",
      directionTitle: "Einfach von der Anfrage bis zur Abreise",
      visionTitle: "Die Villa gehört nur Ihnen",
      visionText:
        "Mit Ihrer Buchung sind vier Schlafzimmer, Wohnräume, Garten, Pool, Whirlpool und Sauna nur für Ihre Gruppe reserviert. Es wohnen keine weiteren Gäste auf dem Grundstück.",
      missionTitle: "Sie buchen direkt beim Gastgeber",
      missionText:
        "Reisedaten und Gesamtpreis werden schriftlich bestätigt. Die Überweisung erfolgt erst, nachdem Sie die offizielle IBAN erhalten haben.",
      localEyebrow: "RUND UM BADACSONY",
      localTitle: "See, Berg oder Weinregion?",
      localIntro:
        "In Badacsony liegen Wanderwege, Balaton und Weinterrassen nah beieinander. Wählen Sie ein Ziel für den Tag oder verbinden Sie mehrere ohne Eile.",
      localFeatures: [
        {
          title: "Auf den Badacsony wandern",
          text: "Folgen Sie den markierten Wegen durch die Basaltformationen bis zu einem der Aussichtspunkte über dem Balaton.",
        },
        {
          title: "Weinterrassen besuchen",
          text: "Verbringen Sie einen Nachmittag in den Kellern am Berg und probieren Sie Kéknyelű, eine der bekanntesten Rebsorten Badacsonys.",
        },
        {
          title: "Zeit für den Balaton",
          text: "Planen Sie einen Strandtag, besuchen Sie einen Ort am See oder fahren Sie weiter zu den Dörfern und Märkten im Káli-Becken.",
        },
      ],
      localImageAlts: [
        "Privater Pool und Terrasse der Relax Villa",
        "Whirlpool im Außenbereich der Relax Villa",
        "Gemeinsamer Esstisch und Küche in der Relax Villa",
      ],
      faqEyebrow: "RELAX VILLA FAQ",
      faqTitle: "Wichtige Antworten vor der Buchung",
      faqIntro: "Die praktischen Details zählen. Ist Ihre Frage nicht dabei, klären Sie sie bitte vor der Überweisung direkt mit dem Gastgeber.",
      faqContact: "Kontakt aufnehmen",
      faqs: [
        {
          question: "Wird die Villa nur komplett gebucht?",
          answer:
            "Ja. Jede Buchung umfasst alle vier Schlafzimmer und die Gemeinschaftsbereiche. Die Schlafzimmer werden nicht einzeln vermietet.",
        },
        {
          question: "Sind Haustiere erlaubt?",
          answer:
            "Ja, Haustiere sind gegen eine zusätzliche Gebühr willkommen. Bitte nennen Sie Anzahl und Art der Haustiere in Ihrer Anfrage, damit der Gastgeber die Details bestätigen kann.",
        },
        {
          question: "Welche Stornierungsbedingungen gelten?",
          answer:
            "Der Gastgeber teilt Ihnen die geltenden Stornierungsbedingungen vor der Buchungsbestätigung mit. Bitte lassen Sie sich diese vor einer Überweisung schriftlich bestätigen.",
        },
        {
          question: "Wie funktioniert die Zahlung?",
          answer:
            "Nach Bestätigung Ihrer Reisedaten erhalten Sie die offizielle IBAN und den Verwendungszweck. Zahlen Sie per Banküberweisung und senden Sie den Beleg über WhatsApp. Überweisen Sie erst nach Erhalt dieser Angaben.",
        },
        {
          question: "Wann sind Check-in und Check-out?",
          answer:
            "An- und Abreisezeiten werden bei der Bestätigung Ihres Aufenthalts direkt mit dem Gastgeber vereinbart. Bitte klären Sie diese vor Ihrer Reise.",
        },
        {
          question: "Ist die Villa für Gäste mit eingeschränkter Mobilität geeignet?",
          answer:
            "Teilen Sie dem Gastgeber besondere Anforderungen vor der Buchung mit, damit er bestätigen kann, ob die Unterkunft für Sie geeignet ist.",
        },
      ],
    },
    rooms: {
      eyebrow: "SCHLAFZIMMER & GALERIE",
      title: "Vier Schlafzimmer. Ganz für Sie.",
      intro:
        "Zwei Doppelzimmer, ein Zweibettzimmer und ein flexibles Familienzimmer – alle in jeder Villenbuchung enthalten.",
      notice: "Ihre Buchung umfasst die komplette Villa, alle vier Schlafzimmer und sämtliche Außenbereiche.",
      bedroomNames: ["Schlafzimmer 1", "Schlafzimmer 2", "Schlafzimmer 3", "Schlafzimmer 4"],
      bedroomNotes: [
        "Doppelzimmer mit Dachfenster, Fernseher und Türen in Richtung Balkon.",
        "Doppelzimmer mit Nachttischbeleuchtung, Stauraum und direktem Balkonzugang.",
        "Zweibettzimmer mit zwei getrennten Einzelbetten für Kinder, Freunde oder Gäste, die ein eigenes Bett bevorzugen.",
        "Flexibles Zimmer mit Doppel- und Einzelbett, Balkonzugang und Klimaanlage.",
      ],
      sharedEyebrow: "ZWISCHEN DEN PLÄNEN",
      sharedTitle: "Räume, in denen alle wieder zusammenkommen",
      sharedText:
        "Küche, Essbereiche, Garten, Terrasse und Wellnessbereiche sind keine Extras, sondern das Zentrum eines Aufenthalts im ganzen Haus.",
      galleryEyebrow: "DAS KOMPLETTE HAUS",
      galleryTitle: "Zimmer für Zimmer ansehen, bevor Sie buchen",
      galleryText:
        "Entdecken Sie 38 aktuelle Fotos von Schlafzimmern, Wohnbereichen, Pool, Whirlpool, Fasssauna, Terrasse und Garten.",
      galleryTabs: {
        all: "Alle Fotos",
        bedrooms: "Schlafzimmer",
        shared: "Wohnbereiche",
        outdoors: "Pool & Wellness",
      },
      photoLabel: "Foto",
      previousImage: "Vorheriges Foto",
      nextImage: "Nächstes Foto",
      openImage: "Bild öffnen",
      cta: "Reisedaten anfragen",
    },
    blog: {
      eyebrow: "NOTIZEN AUS BADACSONY",
      title: "Badacsony ohne austauschbaren Reiseführer",
      intro:
        "Nützliche Hinweise für Gruppen, die den Ort verstehen, weniger verplanen und das Haus gut nutzen möchten.",
      read: "Artikel lesen",
      articles: [
        {
          slug: "slow-day",
          category: "BERG & SEE",
          title: "Badacsony zwischen Balaton und Basalt",
          excerpt:
            "Die Region erschließt sich am besten, wenn Vulkanberg, Balatonufer und Weinberge als eine Landschaft gelesen werden.",
          paragraphs: [
            "Der Badacsony ist ein vulkanischer Zeugenberg am Nordufer des Balaton. Basaltformationen, Aussichtspunkte und Weinberge sind keine getrennten Attraktionen, sondern verschiedene Seiten desselben Geländes.",
            "Wählen Sie lieber einen Weg, einen Weinkeller oder einen Abschnitt am See, statt möglichst viele Stopps zu sammeln. Pool und Terrasse lassen anschließend genug Raum für einen ungeplanten Nachmittag.",
          ],
        },
        {
          slug: "pack-together",
          category: "GRUPPENPLANUNG",
          title: "Vier Schlafzimmer, eine Gruppe: zuerst die Zimmer verteilen",
          excerpt:
            "Zehn Minuten Zimmerplanung vor der Fahrt ersparen eine Stunde Diskussion an der Haustür.",
          paragraphs: [
            "Die Villa bietet Doppel-, Zweibett- und flexible Schlafmöglichkeiten. Ordnen Sie sie Paaren, Kindern und Einzelschläfern vorab zu und berücksichtigen Sie, wer Balkon oder Klimaanlage besonders schätzt.",
            "Danach genügen die Eckpunkte: Ankunftsfenster, erstes Frühstück und ein gemeinsames Abendessen. Ein ganzes Haus funktioniert mit einem Rahmen besser als mit einem minutiösen Programm.",
          ],
        },
        {
          slug: "shared-table",
          category: "IM HAUS",
          title: "Pool, Sauna, Abendessen: ein Villentag ohne Zeitplan",
          excerpt:
            "Manche Tage brauchen kein Ausflugsziel; das Haus bietet bereits genug Möglichkeiten für einen Tempowechsel.",
          paragraphs: [
            "Beginnen Sie draußen, solange das Wetter mild ist, wechseln Sie an den Pool und heben Sie Whirlpool oder Fasssauna für später auf. Da alles privat ist, bestimmen Sie die Reihenfolge.",
            "Für das Abendessen können Marktprodukte aus der Region oder eine nahe Weinterrasse den Ton angeben. Entscheidend ist nicht ein kompliziertes Menü, sondern Tisch, Terrasse und Abend für sich zu haben.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "TERMINE, DETAILS, DIREKTER KONTAKT",
      title: "Wunschdaten anfragen",
      intro:
        "Nennen Sie uns Reisedaten und Gruppengröße. Der Gastgeber bestätigt Verfügbarkeit, Preis und Zahlungsdaten direkt.",
      formEyebrow: "IHRE GRUPPE",
      formTitle: "Wer reist mit?",
      formIntro:
        "Jede Anfrage gilt für die komplette Villa mit vier Schlafzimmern. Ergänzen Sie die Angaben, mit denen der Gastgeber gleich beim ersten Mal konkret antworten kann.",
      formFields: {
        name: "Vollständiger Name",
        email: "E-Mail-Adresse",
        whatsapp: "Kontaktnummer",
        arrival: "Anreise",
        departure: "Abreise",
        guests: "Anzahl der Gäste",
        language: "Bevorzugte Sprache",
        message: "Nachricht",
      },
      formPlaceholder: "Alter der Kinder, Haustiere, Anreisepläne oder wichtige Hinweise für den Gastgeber.",
      formSubmit: "Anfrage senden",
      formSending: "Wird gesendet…",
      formCopy: "Anfrage kopieren",
      formRequired: "Pflichtfelder sind mit * gekennzeichnet.",
      formTrust:
        "Ihre Anfrage ist erst nach der schriftlichen Bestätigung durch den Gastgeber eine bestätigte Buchung.",
      formDateError: "Die Abreise muss nach der Anreise liegen.",
      formCopied:
        "Der Online-Versand ist noch nicht eingerichtet. Ihre Nachricht wurde nicht gesendet; die Anfrage wurde kopiert.",
      formDestinationMissing:
        "Ihre Nachricht konnte nicht gesendet werden. Versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail oder WhatsApp.",
      formNameError: "Bitte geben Sie Ihren vollständigen Namen mit mindestens 2 Zeichen ein.",
      formMessageError: "Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.",
      formRateLimited: "Mit dieser E-Mail-Adresse wurden zu viele Nachrichten gesendet. Bitte warten Sie eine Stunde und versuchen Sie es erneut.",
      formReady: "Ihre Nachricht ist eingegangen. Wir antworten über die von Ihnen angegebenen Kontaktdaten.",
      visit: "Adresse der Villa",
      write: "Direkter Kontakt",
      writeText: "E-Mail- und WhatsApp-Daten erscheinen hier nach der Bestätigung.",
      map: "In Karten öffnen",
      processEyebrow: "VOM WUNSCHTERMIN ZUR ANREISE",
      processTitle: "Direktbuchung in drei Schritten",
      steps: [
        ["01", "Eckdaten senden", "Wählen Sie Reisedaten, Gästezahl und Haustiere für die komplette Villa."],
        ["02", "Schriftliche Bestätigung", "Der Gastgeber bestätigt Verfügbarkeit, Gesamtpreis, IBAN und Verwendungszweck."],
        ["03", "Überweisen und Referenz sichern", "Zahlen Sie per Banküberweisung und senden Sie den Beleg über WhatsApp."],
      ],
      noteTitle: "Vor der Überweisung",
      note:
        "Bitte warten Sie vor einer Zahlung auf die schriftliche Terminbestätigung und die offiziellen Bankdaten.",
      cta: "Reisedaten auf der Startseite wählen",
    },
  },
  hu: {
    navigation: {
      home: "Főoldal",
      about: "Rólunk",
      rooms: "Hálószobák és galéria",
      blog: "Blog",
      contact: "Kapcsolat",
      book: "Foglalási kérés",
      menu: "Menü megnyitása",
      language: "Nyelv választása",
    },
    common: {
      address: "8257 Badacsonytomaj, Füredi út 5.",
      wholeVilla: "A villa kizárólag teljes egészként bérelhető.",
      explore: "Felfedezés",
      booking: "Foglalás és fizetés",
      bookingNote:
        "Az időpontot a házigazda írásban visszaigazolja, és csak ezután küldi el az IBAN-t. Átutalás után a bizonylat WhatsAppon küldhető.",
      contact: "Kapcsolat",
      contactPending: "Az e-mail- és WhatsApp-adatok az indulás előtt kerülnek fel.",
      availability: "Szabad időpontok",
      backHome: "Vissza a főoldalra",
    },
    about: {
      eyebrow: "BADACSONY, A SAJÁT RITMUSUKBAN",
      title: "Egy ház, ahová jó visszatérni",
      intro:
        "A Relax Villa négy hálószobás, privát badacsonytomaji bázis családoknak és baráti társaságoknak, akik a teljes házat maguknak szeretnék.",
      storyEyebrow: "EGY FOGLALÁS, NINCSENEK IDEGEN VENDÉGEK",
      storyTitle: "A privát tér más ritmust ad a közös utazásnak",
      storyLead:
        "Ugyanazt az utazást élhetik meg úgy, hogy nem kell minden órát ugyanabban a helyiségben tölteni.",
      storyBody:
        "A négy hálószoba, a nappali terek, a konyha, a kert, a terasz, a medence, a jacuzzi és a hordószauna egyetlen foglaláshoz tartozik. Nincs szobánkénti kiadás, és nincs más vendégekkel megosztott közös tér.",
      secondBody:
        "Így könnyű alakítani a napot: közös reggeli, külön programok a tónál vagy a hegyen, majd vacsora a saját asztaluknál. A ház közös pontot ad, de nem kényszeríti menetrendbe a társaságot.",
      directionEyebrow: "JÓ TUDNI",
      directionTitle: "Egyszerűen az érdeklődéstől a távozásig",
      visionTitle: "A villa csak az Önöké",
      visionText:
        "Foglaláskor a négy hálószoba, a nappali terek, a kert, a medence, a jacuzzi és a szauna kizárólag az Önök társaságáé. Más vendég nem tartózkodik az ingatlanon.",
      missionTitle: "Közvetlenül a házigazdánál foglalnak",
      missionText:
        "Az időpontot és a teljes árat írásban igazoljuk vissza. Átutalni csak a hivatalos IBAN megérkezése után kell.",
      localEyebrow: "BADACSONY KÖRNYÉKÉN",
      localTitle: "Tó, hegy vagy borvidék?",
      localIntro:
        "Badacsonyban a túraútvonalak, a Balaton és a borteraszok közel vannak egymáshoz. Válasszanak egyet a napra, vagy kényelmesen kapcsolják össze őket.",
      localFeatures: [
        {
          title: "Túra a Badacsony-hegyen",
          text: "Kövessék a jelzett utakat a bazaltformák között, és menjenek fel a Balatonra néző kilátópontok egyikéhez.",
        },
        {
          title: "Borteraszok és pincék",
          text: "Töltsenek egy délutánt a hegy pincéinél, és kóstolják meg a Kéknyelűt, Badacsony egyik legismertebb helyi szőlőfajtáját.",
        },
        {
          title: "Egy nap a Balatonnál",
          text: "Tervezzék strandolással a napot, látogassanak meg egy tóparti települést, vagy induljanak tovább a Káli-medence falvai és piacai felé.",
        },
      ],
      localImageAlts: [
        "A Relax Villa privát medencéje és terasza",
        "A Relax Villa kültéri jakuzzija",
        "Közös étkezőasztal és konyha a Relax Villában",
      ],
      faqEyebrow: "RELAX VILLA GYIK",
      faqTitle: "Hasznos válaszok foglalás előtt",
      faqIntro:
        "A gyakorlati részletek számítanak. Ha valamire itt nincs válasz, átutalás előtt kérdezzék meg közvetlenül a házigazdát.",
      faqContact: "Kapcsolatfelvétel",
      faqs: [
        {
          question: "Csak az egész villa foglalható?",
          answer:
            "Igen. Minden foglalás mind a négy hálószobát és a közös tereket is tartalmazza. A hálószobák külön nem bérelhetők.",
        },
        {
          question: "Hozható háziállat?",
          answer:
            "Igen, háziállat felár ellenében hozható. Kérjük, az érdeklődésben jelezzék a háziállatok számát és fajtáját, hogy a házigazda visszaigazolhassa a részleteket.",
        },
        {
          question: "Mik a lemondási feltételek?",
          answer:
            "A házigazda a foglalás visszaigazolása előtt ismerteti az érvényes lemondási feltételeket. Átutalás előtt kérjék ezeket írásban.",
        },
        {
          question: "Hogyan történik a fizetés?",
          answer:
            "Az időpont visszaigazolása után a házigazda elküldi a hivatalos IBAN-t és a közleményt. Banki átutalással fizethetnek, majd a bizonylatot WhatsAppon küldhetik el. Ezek megérkezése előtt ne utaljanak.",
        },
        {
          question: "Mikor van a be- és kijelentkezés?",
          answer:
            "Az érkezési és távozási időpontot a foglalás visszaigazolásakor közvetlenül a házigazdával egyeztetik. Indulás előtt kérjük, ellenőrizzék az időpontokat.",
        },
        {
          question: "Megfelelő a villa mozgásukban korlátozott vendégeknek?",
          answer:
            "Foglalás előtt jelezzék a házigazdának az akadálymentességgel kapcsolatos igényeiket, hogy visszaigazolhassa, megfelel-e az ingatlan az elvárásaiknak.",
        },
      ],
    },
    rooms: {
      eyebrow: "HÁLÓSZOBÁK ÉS GALÉRIA",
      title: "Négy hálószoba. Mind az Önöké.",
      intro:
        "Két franciaágyas szoba, egy kétágyas szoba és egy rugalmas családi szoba – mindegyik a villafoglalás része.",
      notice:
        "A foglalás a teljes villát, mind a négy hálószobát és minden kültéri teret tartalmazza.",
      bedroomNames: ["1. hálószoba", "2. hálószoba", "3. hálószoba", "4. hálószoba"],
      bedroomNotes: [
        "Franciaágyas szoba tetőablakkal, televízióval és erkély felé nyíló ajtóval.",
        "Franciaágyas szoba éjjeli világítással, tárolóhellyel és közvetlen erkélykapcsolattal.",
        "Kétágyas szoba két külön ággyal gyerekeknek, barátoknak vagy külön ágyat választó vendégeknek.",
        "Rugalmas elrendezésű szoba egy franciaággyal és egy egyszemélyes ággyal, erkéllyel és légkondicionálóval.",
      ],
      sharedEyebrow: "A PROGRAMOK KÖZÖTT",
      sharedTitle: "Terek, ahol újra együtt van a társaság",
      sharedText:
        "A konyha, az étkezők, a kert, a terasz és a wellness-terek nem kiegészítők, hanem a teljes-villa pihenés középpontjai.",
      galleryEyebrow: "AZ EGÉSZ HÁZ",
      galleryTitle: "Szobáról szobára, még foglalás előtt",
      galleryText:
        "Nézzenek meg 38 friss fotót a hálószobákról, nappali terekről, medencéről, jacuzziról, hordószaunáról, teraszról és kertről.",
      galleryTabs: {
        all: "Összes fotó",
        bedrooms: "Hálószobák",
        shared: "Közös terek",
        outdoors: "Medence és wellness",
      },
      photoLabel: "Fotó",
      previousImage: "Előző fotó",
      nextImage: "Következő fotó",
      openImage: "Kép megnyitása",
      cta: "Időpont kérése",
    },
    blog: {
      eyebrow: "JEGYZETEK BADACSONYBÓL",
      title: "Badacsony a sablonos útikalauzon túl",
      intro:
        "Hasznos olvasnivaló azoknak a társaságoknak, akik szeretnék érteni a helyet, kevesebbet tervezni és jól használni a villát.",
      read: "Cikk olvasása",
      articles: [
        {
          slug: "slow-day",
          category: "HEGY ÉS TÓ",
          title: "Badacsony a Balaton és a bazalt között",
          excerpt:
            "A táj akkor áll össze, ha a vulkanikus hegyet, a Balaton-partot és a szőlőket egy egységként nézik.",
          paragraphs: [
            "A Badacsony vulkanikus tanúhegy a Balaton északi partján. A bazaltformák, a kilátópontok és a szőlőterületek nem külön látnivalók, hanem ugyanannak a tájnak eltérő olvasatai.",
            "Sok megálló helyett válasszanak egy útvonalat, pincét vagy partszakaszt. A villába visszatérve a medence és a terasz elég teret hagy a nap hátralévő, tervezetlen részének.",
          ],
        },
        {
          slug: "pack-together",
          category: "CSOPORTOS TERVEZÉS",
          title: "Négy hálószoba, egy társaság: először a szobákat osszák el",
          excerpt:
            "Tíz perc egyeztetés indulás előtt egyórás vitát spórolhat meg az ajtóban.",
          paragraphs: [
            "A villában franciaágyas, kétágyas és rugalmas elrendezésű szobák vannak. Érkezés előtt rendeljék őket párokhoz, gyerekekhez és külön alvókhoz, és vegyék figyelembe, kinek fontosabb az erkély vagy a légkondicionálás.",
            "Ezután elég a lényegben megegyezni: érkezési idősáv, első reggeli és egy közös vacsora. Egy teljes ház kerettel működik jól, nem percre pontos programmal.",
          ],
        },
        {
          slug: "shared-table",
          category: "A VILLÁBAN",
          title: "Medence, szauna, vacsora: egy villanap menetrend nélkül",
          excerpt:
            "Van, amikor nem kell úti cél; a ház önmagában is elég lehetőséget ad a ritmusváltásra.",
          paragraphs: [
            "Kezdjék kint, amíg kellemes az idő, folytassák a medencénél, a jacuzzit vagy a hordószaunát pedig hagyják későbbre. Mivel minden privát, a sorrend teljesen az Önöké.",
            "A vacsora hangulatát adhatják helyi piaci alapanyagok vagy egy közeli borterasz. Nem a bonyolult menü a fontos, hanem hogy az asztal, a terasz és az este csak az Önöké.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "IDŐPONTOK, RÉSZLETEK, KÖZVETLEN KAPCSOLAT",
      title: "Kérdezzenek rá a kívánt időpontra",
      intro:
        "Írják meg, mikor érkeznének és kik utaznak. A házigazda közvetlenül igazolja vissza az elérhetőséget, az árat és a fizetési adatokat.",
      formEyebrow: "A TÁRSASÁG",
      formTitle: "Kik érkeznek?",
      formIntro:
        "Minden érdeklődés a teljes, négy hálószobás villára vonatkozik. Adják meg azokat a részleteket, amelyekkel a házigazda már elsőre pontos választ tud adni.",
      formFields: {
        name: "Teljes név",
        email: "E-mail-cím",
        whatsapp: "Kapcsolattartási telefonszám",
        arrival: "Érkezés",
        departure: "Távozás",
        guests: "Vendégek száma",
        language: "Kapcsolattartás nyelve",
        message: "Üzenet",
      },
      formPlaceholder:
        "Gyerekek életkora, háziállatok, érkezési terv vagy bármi, amit a házigazdának tudnia érdemes.",
      formSubmit: "Érdeklődés elküldése",
      formSending: "Küldés…",
      formCopy: "Érdeklődés másolása",
      formRequired: "A kötelező mezőket * jelöli.",
      formTrust:
        "A kérés csak a házigazda írásos visszaigazolása után válik megerősített foglalássá.",
      formDateError: "A távozás dátumának az érkezés után kell lennie.",
      formCopied:
        "Az online küldés még nincs beállítva. Az üzenetet nem küldtük el; a kérés adatait kimásoltuk.",
      formDestinationMissing:
        "Az üzenetet nem sikerült elküldeni. Próbálják újra, vagy keressék a szállásadót közvetlenül e-mailben vagy WhatsAppon.",
      formNameError: "Kérjük, legalább 2 karakterrel adják meg a teljes nevüket.",
      formMessageError: "Kérjük, legalább 10 karakteres üzenetet írjanak.",
      formRateLimited: "Ezzel az e-mail-címmel túl sok üzenetet küldtek. Kérjük, várjanak egy órát, majd próbálják újra.",
      formReady: "Az üzenet megérkezett. A megadott elérhetőségek egyikén válaszolunk.",
      visit: "A villa címe",
      write: "Közvetlen kapcsolat",
      writeText: "A megerősített e-mail- és WhatsApp-adatok itt jelennek majd meg.",
      map: "Megnyitás térképen",
      processEyebrow: "AZ IDŐPONTTÓL AZ ÉRKEZÉSIG",
      processTitle: "Közvetlen foglalás három lépésben",
      steps: [
        ["01", "A lényeg elküldése", "Válasszák ki az időpontot, a vendégek és a háziállatok számát a teljes villához."],
        ["02", "Írásos visszaigazolás", "A házigazda megerősíti az elérhetőséget, a teljes árat, az IBAN-t és a közleményt."],
        ["03", "Átutalás és hivatkozás", "Fizessenek banki átutalással, majd küldjék el a bizonylatot WhatsAppon."],
      ],
      noteTitle: "Átutalás előtt",
      note:
        "Fizetés előtt kérjük, várják meg az időpont írásos visszaigazolását és a hivatalos banki adatokat.",
      cta: "Időpont választása a főoldalon",
    },
  },
} as const satisfies Record<Language, object>;

export type SecondaryCopy = (typeof secondaryCopy)[Language];
