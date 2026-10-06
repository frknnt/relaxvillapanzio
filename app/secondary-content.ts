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
      wholeVilla: "We prepare the right booking option for one room, several rooms or the entire villa.",
      explore: "Explore",
      booking: "Booking & payment",
      bookingNote:
        "Once your payment reaches our account, we confirm your reservation and share all stay details with you through WhatsApp.",
      contact: "Contact",
      contactPending: "Email and WhatsApp details will be added before launch.",
      availability: "Check availability",
      backHome: "Back to home",
    },
    about: {
      eyebrow: "BADACSONY, AT YOUR OWN PACE",
      title: "Enjoy Badacsony at your own pace",
      intro:
        "Relax Villa offers four distinctive bedrooms and a complete villa experience in Badacsonytomaj. Book one room, several rooms or the entire villa.",
      storyEyebrow: "ROOM OR WHOLE VILLA",
      storyTitle: "Choose the rooms that fit your stay",
      storyLead:
        "Choose from two double rooms, one twin room and one flexible family room.",
      storyBody:
        "We calculate your stay from the bedrooms you select. When you choose all four, we create your reservation for the entire villa.",
      secondBody:
        "A fully equipped kitchen, spacious dining area, garden and terrace let the day unfold with ease. The pool, outdoor hot tub, barrel sauna and barbecue area add something special to your stay in every season.",
      directionEyebrow: "GOOD TO KNOW",
      directionTitle: "Simple from booking to check-out",
      visionTitle: "Book rooms or the whole villa",
      visionText:
        "We create the right reservation for one room, several rooms or all four. Choose all four and we reserve the villa in its entirety.",
      missionTitle: "Fast booking confirmation",
      missionText:
        "Send us your dates and room choice. We quickly check availability and the total price, then share the payment details. We confirm your reservation when the payment reaches us.",
      localEyebrow: "AROUND BADACSONY",
      localTitle: "Lake, hill and wine country",
      localIntro:
        "Walk the Badacsony trails in the morning, head down to Lake Balaton in the afternoon and finish the day on a wine terrace among the vineyards.",
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
        "Relax Villa's pool and terrace",
        "Relax Villa's outdoor hot tub",
        "The shared dining table and kitchen at Relax Villa",
      ],
      faqEyebrow: "RELAX VILLA FAQ",
      faqTitle: "Useful answers before you book",
      faqIntro: "The practical details matter. If your question is not covered here, contact us before making a payment.",
      faqContact: "Contact us",
      checkInOutAnswer: "Check-in is from {checkIn}. Check-out is by {checkOut}. We keep these times up to date in the booking settings.",
      faqs: [
        {
          question: "Can I book a room or the whole villa?",
          answer:
            "We offer both options. You can reserve one bedroom, several bedrooms or all four as the entire villa.",
        },
        {
          question: "Are pets allowed?",
          answer:
            "Yes, pets are welcome for an additional fee. Please include the number and type of pets in your request so we can give you the right information.",
        },
        {
          question: "What is the cancellation policy?",
          answer:
            "We share the applicable cancellation terms before confirming your reservation. You can review them before making a payment.",
        },
        {
          question: "How does payment work?",
          answer:
            "After your booking request, we send the official IBAN and payment reference. Once your payment reaches our account, we confirm your reservation and share the stay details through WhatsApp.",
        },
        {
          question: "What are the check-in and check-out times?",
          answer:
            "We share the current check-in and check-out times with your booking details. You can check them again before travelling.",
        },
        {
          question: "Is the villa suitable for guests with limited mobility?",
          answer:
            "Please tell us about any accessibility requirements before booking so we can assess together whether the villa meets your needs.",
        },
      ],
    },
    rooms: {
      eyebrow: "BEDROOMS & GALLERY",
      title: "Choose the room that suits you best",
      intro:
        "We offer two double rooms, one twin room and one flexible family room. Choose the room that suits you best, or reserve all four together.",
      notice: "We calculate the price from the bedrooms you select. When you choose all four, we create your reservation for the entire villa.",
      bedroomNames: ["Bedroom One", "Bedroom Two", "Bedroom Three", "Bedroom Four"],
      bedroomNotes: [
        "Double room with a skylight, television and doors toward the balcony.",
        "A bright, spacious double room with practical storage and a door that opens directly onto the balcony.",
        "Twin room with two separate single beds for children, friends or guests who prefer their own bed.",
        "Flexible room with one double and one single bed, balcony access and air conditioning.",
      ],
      sharedEyebrow: "BETWEEN PLANS",
      sharedTitle: "The rooms that bring everyone back together",
      sharedText:
        "The fully equipped kitchen, dining spaces, garden, terrace, barbecue and wellness areas add something special to every moment at the villa.",
      galleryEyebrow: "EXPLORE THE HOUSE",
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
      title: "Beyond the generic guide: Badacsony",
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
            "Agree only the essentials: the arrival window, first breakfast and one shared dinner. Plan the rest of the day at your own pace around Badacsony and the villa's amenities.",
          ],
        },
        {
          slug: "shared-table",
          category: "AT THE HOUSE",
          title: "Pool, sauna, dinner: a villa day with no timetable",
          excerpt:
            "Some days do not need a destination; the house already has enough ways to change pace.",
          paragraphs: [
            "Start in the garden while the weather is mild, cool off in the pool and save the hot tub or barrel sauna for the evening. Each space turns an unhurried day at the villa into a different experience.",
            "For dinner, let local market produce or a nearby wine terrace set the tone. The fully equipped kitchen, large dining table, terrace and barbecue area give you everything you need for a long evening.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "QUESTIONS & DIRECT CONTACT",
      title: "Ask us what you would like to know",
      intro:
        "Write to us with any questions about the rooms, amenities, accessibility, location or booking process, and we will answer you directly.",
      formEyebrow: "YOUR QUESTION",
      formTitle: "What can we help you with?",
      formIntro:
        "Share what you are curious about. If your question concerns a stay, you can also mention the dates and number of guests.",
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
      formPlaceholder: "Write your question about the villa, rooms, amenities, location or booking process.",
      formSubmit: "Send message",
      formSending: "Sending…",
      formCopy: "Copy enquiry",
      formRequired: "Required fields are marked with *.",
      formTrust:
        "The contact form does not create a reservation. Your reservation is confirmed once your payment reaches us.",
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
        ["01", "Send the essentials", "Choose dates, guest numbers, pets and whether you want a room or the complete villa."],
        ["02", "Receive the payment details", "We check availability and the total price, then share the official IBAN and payment reference with you."],
        ["03", "Complete the payment", "Make the bank transfer and send the receipt through WhatsApp; we confirm your reservation when the payment arrives."],
      ],
      noteTitle: "Payment and reservation confirmation",
      note:
        "Check the official bank details and complete the payment. Once it reaches us, we confirm your reservation and share the stay details with you.",
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
      wholeVilla: "Wir stellen die passende Buchungsoption für ein Zimmer, mehrere Zimmer oder die gesamte Villa zusammen.",
      explore: "Entdecken",
      booking: "Buchung & Zahlung",
      bookingNote:
        "Sobald Ihre Zahlung auf unserem Konto eingegangen ist, bestätigen wir Ihre Buchung und senden Ihnen alle Informationen zum Aufenthalt per WhatsApp.",
      contact: "Kontakt",
      contactPending: "E-Mail- und WhatsApp-Daten werden vor dem Start ergänzt.",
      availability: "Verfügbarkeit prüfen",
      backHome: "Zur Startseite",
    },
    about: {
      eyebrow: "BADACSONY IM EIGENEN TEMPO",
      title: "Erleben Sie Badacsony in Ihrem eigenen Tempo",
      intro:
        "Die Relax Villa bietet vier unterschiedliche Schlafzimmer und ein vollständiges Villaerlebnis in Badacsonytomaj. Buchen Sie ein Zimmer, mehrere Zimmer oder die gesamte Villa.",
      storyEyebrow: "ZIMMER ODER GANZE VILLA",
      storyTitle: "Wählen Sie die passenden Zimmer",
      storyLead:
        "Zur Wahl stehen zwei Doppelzimmer, ein Zweibettzimmer und ein flexibles Familienzimmer.",
      storyBody:
        "Wir berechnen Ihren Aufenthalt anhand der gewählten Schlafzimmer. Entscheiden Sie sich für alle vier, legen wir Ihre Buchung für die gesamte Villa an.",
      secondBody:
        "Eine voll ausgestattete Küche, ein großzügiger Essbereich, Garten und Terrasse lassen den Tag entspannt vergehen. Pool, Außenwhirlpool, Fasssauna und Grillplatz machen den Aufenthalt zu jeder Jahreszeit besonders.",
      directionEyebrow: "GUT ZU WISSEN",
      directionTitle: "Einfach von der Anfrage bis zur Abreise",
      visionTitle: "Zimmer oder komplette Villa buchen",
      visionText:
        "Wir erstellen die passende Buchung für ein Zimmer, mehrere Zimmer oder alle vier. Mit allen vier Zimmern reservieren wir die Villa vollständig für Sie.",
      missionTitle: "Schnelle Buchungsbestätigung",
      missionText:
        "Senden Sie uns Reisedaten und Zimmerwahl. Wir prüfen Verfügbarkeit und Gesamtpreis, teilen Ihnen die Zahlungsdaten mit und bestätigen Ihre Buchung nach Zahlungseingang.",
      localEyebrow: "RUND UM BADACSONY",
      localTitle: "See, Berg und Weinregion",
      localIntro:
        "Wandern Sie morgens auf den Wegen des Badacsony, fahren Sie nachmittags hinunter zum Balaton und lassen Sie den Tag auf einer Weinterrasse zwischen den Reben ausklingen.",
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
        "Pool und Terrasse der Relax Villa",
        "Whirlpool im Außenbereich der Relax Villa",
        "Gemeinsamer Esstisch und Küche in der Relax Villa",
      ],
      faqEyebrow: "RELAX VILLA FAQ",
      faqTitle: "Wichtige Antworten vor der Buchung",
      faqIntro: "Die praktischen Details zählen. Ist Ihre Frage nicht dabei, kontaktieren Sie uns bitte vor der Zahlung.",
      faqContact: "Kontakt aufnehmen",
      checkInOutAnswer: "Der Check-in ist ab {checkIn} möglich. Der Check-out erfolgt bis {checkOut}. Wir halten diese Zeiten in den Buchungseinstellungen aktuell.",
      faqs: [
        {
          question: "Kann ich ein Zimmer oder die ganze Villa buchen?",
          answer:
            "Wir bieten beide Möglichkeiten. Sie können ein Schlafzimmer, mehrere Schlafzimmer oder alle vier als gesamte Villa reservieren.",
        },
        {
          question: "Sind Haustiere erlaubt?",
          answer:
            "Ja, Haustiere sind gegen eine zusätzliche Gebühr willkommen. Bitte nennen Sie Anzahl und Art der Haustiere in Ihrer Anfrage, damit wir Ihnen die passenden Informationen geben können.",
        },
        {
          question: "Welche Stornierungsbedingungen gelten?",
          answer:
            "Wir teilen Ihnen die geltenden Stornierungsbedingungen vor der Buchungsbestätigung mit. Sie können diese vor der Zahlung in Ruhe prüfen.",
        },
        {
          question: "Wie funktioniert die Zahlung?",
          answer:
            "Nach Ihrer Buchungsanfrage senden wir Ihnen die offizielle IBAN und den Verwendungszweck. Sobald Ihre Zahlung auf unserem Konto eingegangen ist, bestätigen wir die Buchung und senden Ihnen die Informationen zum Aufenthalt per WhatsApp.",
        },
        {
          question: "Wann sind Check-in und Check-out?",
          answer:
            "Die aktuellen An- und Abreisezeiten erhalten Sie mit Ihren Buchungsinformationen. Vor der Reise können Sie diese noch einmal prüfen.",
        },
        {
          question: "Ist die Villa für Gäste mit eingeschränkter Mobilität geeignet?",
          answer:
            "Teilen Sie uns Anforderungen an die Barrierefreiheit vor der Buchung mit, damit wir gemeinsam prüfen können, ob die Villa zu Ihren Bedürfnissen passt.",
        },
      ],
    },
    rooms: {
      eyebrow: "SCHLAFZIMMER & GALERIE",
      title: "Wählen Sie das Zimmer, das am besten zu Ihnen passt",
      intro:
        "Wir bieten zwei Doppelzimmer, ein Zweibettzimmer und ein flexibles Familienzimmer. Wählen Sie das passende Zimmer oder reservieren Sie alle vier gemeinsam.",
      notice: "Wir berechnen den Preis anhand der gewählten Schlafzimmer. Entscheiden Sie sich für alle vier, legen wir Ihre Buchung für die gesamte Villa an.",
      bedroomNames: ["Schlafzimmer 1", "Schlafzimmer 2", "Schlafzimmer 3", "Schlafzimmer 4"],
      bedroomNotes: [
        "Doppelzimmer mit Dachfenster, Fernseher und Türen in Richtung Balkon.",
        "Ein helles, großzügiges Doppelzimmer mit praktischem Stauraum und einer Tür, die direkt auf den Balkon führt.",
        "Zweibettzimmer mit zwei getrennten Einzelbetten für Kinder, Freunde oder Gäste, die ein eigenes Bett bevorzugen.",
        "Flexibles Zimmer mit Doppel- und Einzelbett, Balkonzugang und Klimaanlage.",
      ],
      sharedEyebrow: "ZWISCHEN DEN PLÄNEN",
      sharedTitle: "Räume, in denen alle wieder zusammenkommen",
      sharedText:
        "Die voll ausgestattete Küche, Essbereiche, Garten, Terrasse, Grillplatz und Wellnessbereiche machen jeden Moment in der Villa besonders.",
      galleryEyebrow: "DAS HAUS ENTDECKEN",
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
      title: "Jenseits austauschbarer Reiseführer: Badacsony",
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
            "Stimmen Sie nur die Eckpunkte ab: Ankunftsfenster, erstes Frühstück und ein gemeinsames Abendessen. Den restlichen Tag gestalten Sie rund um Badacsony und die Angebote der Villa in Ihrem eigenen Tempo.",
          ],
        },
        {
          slug: "shared-table",
          category: "IM HAUS",
          title: "Pool, Sauna, Abendessen: ein Villentag ohne Zeitplan",
          excerpt:
            "Manche Tage brauchen kein Ausflugsziel; das Haus bietet bereits genug Möglichkeiten für einen Tempowechsel.",
          paragraphs: [
            "Beginnen Sie bei mildem Wetter im Garten, erfrischen Sie sich im Pool und heben Sie Whirlpool oder Fasssauna für den Abend auf. Jeder Bereich macht einen entspannten Villentag zu einem eigenen Erlebnis.",
            "Für das Abendessen können Marktprodukte aus der Region oder eine nahe Weinterrasse den Ton angeben. Die voll ausgestattete Küche, der große Esstisch, die Terrasse und der Grillplatz bieten alles für einen langen Abend.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "FRAGEN & DIREKTER KONTAKT",
      title: "Fragen Sie uns, was Sie wissen möchten",
      intro:
        "Schreiben Sie uns Ihre Fragen zu Zimmern, Ausstattung, Barrierefreiheit, Lage oder Buchung; wir antworten Ihnen direkt.",
      formEyebrow: "IHRE FRAGE",
      formTitle: "Wobei können wir helfen?",
      formIntro:
        "Schreiben Sie uns, was Sie wissen möchten. Bei Fragen zu einem Aufenthalt können Sie auch Zeitraum und Gästezahl nennen.",
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
      formPlaceholder: "Ihre Frage zur Villa, zu den Zimmern, zur Ausstattung, Lage oder Buchung.",
      formSubmit: "Nachricht senden",
      formSending: "Wird gesendet…",
      formCopy: "Anfrage kopieren",
      formRequired: "Pflichtfelder sind mit * gekennzeichnet.",
      formTrust:
        "Das Kontaktformular erstellt keine Buchung. Ihre Reservierung wird bestätigt, sobald Ihre Zahlung bei uns eingegangen ist.",
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
        ["01", "Eckdaten senden", "Nennen Sie Reisedaten, Gästezahl, Haustiere und ob Sie ein Zimmer oder die komplette Villa wünschen."],
        ["02", "Zahlungsdaten erhalten", "Wir prüfen Verfügbarkeit und Gesamtpreis und senden Ihnen die offizielle IBAN sowie den Verwendungszweck."],
        ["03", "Zahlung abschließen", "Überweisen Sie den Betrag und senden Sie den Beleg per WhatsApp; nach Zahlungseingang bestätigen wir Ihre Buchung."],
      ],
      noteTitle: "Zahlung und Buchungsbestätigung",
      note:
        "Prüfen Sie die offiziellen Bankdaten und schließen Sie die Zahlung ab. Sobald sie bei uns eingegangen ist, bestätigen wir Ihre Buchung und senden Ihnen die Informationen zum Aufenthalt.",
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
      wholeVilla: "Egy szobához, több szobához vagy az egész villához is összeállítjuk az Önöknek megfelelő foglalást.",
      explore: "Felfedezés",
      booking: "Foglalás és fizetés",
      bookingNote:
        "Amint a fizetés megérkezik a számlánkra, megerősítjük a foglalást, és WhatsAppon elküldjük a tartózkodás minden fontos részletét.",
      contact: "Kapcsolat",
      contactPending: "Az e-mail- és WhatsApp-adatok az indulás előtt kerülnek fel.",
      availability: "Szabad időpontok",
      backHome: "Vissza a főoldalra",
    },
    about: {
      eyebrow: "BADACSONY, A SAJÁT RITMUSUKBAN",
      title: "Éljék meg Badacsonyt a saját ritmusukban",
      intro:
        "A Relax Villa négy különböző hálószobát és teljes villaélményt kínál Badacsonytomajban. Foglaljanak egy szobát, több szobát vagy az egész villát.",
      storyEyebrow: "SZOBA VAGY TELJES VILLA",
      storyTitle: "Válasszák ki a megfelelő szobákat",
      storyLead:
        "Két franciaágyas szoba, egy kétágyas szoba és egy rugalmas családi szoba közül választhatnak.",
      storyBody:
        "A tartózkodás árát a kiválasztott hálószobák alapján számoljuk ki. Mind a négy szoba választásakor az egész villára készítjük el a foglalást.",
      secondBody:
        "A jól felszerelt konyha, a tágas étkező, a kert és a terasz gondoskodik a nap kényelmes ritmusáról. A medence, a kültéri jacuzzi, a hordószauna és a grillező minden évszakban külön élménnyel gazdagítja a pihenést.",
      directionEyebrow: "JÓ TUDNI",
      directionTitle: "Egyszerűen az érdeklődéstől a távozásig",
      visionTitle: "Szobák vagy a teljes villa",
      visionText:
        "Egy, több vagy mind a négy szobára is elkészítjük a megfelelő foglalást. Mind a négy szoba választásakor az egész villát foglaljuk le Önöknek.",
      missionTitle: "Gyors foglalási visszaigazolás",
      missionText:
        "Küldjék el nekünk az időpontot és a szobaválasztást. Gyorsan ellenőrizzük az elérhetőséget és a végösszeget, elküldjük a fizetési adatokat, majd a fizetés beérkezése után megerősítjük a foglalást.",
      localEyebrow: "BADACSONY KÖRNYÉKÉN",
      localTitle: "Tó, hegy és borvidék",
      localIntro:
        "Délelőtt járják be Badacsony ösvényeit, délután menjenek le a Balatonhoz, a napot pedig zárják egy szőlők közötti borteraszon.",
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
        "A Relax Villa medencéje és terasza",
        "A Relax Villa kültéri jakuzzija",
        "Közös étkezőasztal és konyha a Relax Villában",
      ],
      faqEyebrow: "RELAX VILLA GYIK",
      faqTitle: "Hasznos válaszok foglalás előtt",
      faqIntro:
        "A gyakorlati részletek számítanak. Ha valamire itt nincs válasz, fizetés előtt keressenek minket.",
      faqContact: "Kapcsolatfelvétel",
      checkInOutAnswer: "A bejelentkezés {checkIn} órától lehetséges. A kijelentkezés {checkOut} óráig történik. Ezeket az időpontokat a foglalási beállításokban naprakészen tartjuk.",
      faqs: [
        {
          question: "Foglalható külön szoba vagy a teljes villa?",
          answer:
            "Mindkét lehetőséget kínáljuk. Foglalhatnak egy hálószobát, több hálószobát vagy mind a négyet teljes villaként.",
        },
        {
          question: "Hozható háziállat?",
          answer:
            "Igen, háziállat felár ellenében hozható. Kérjük, az érdeklődésben jelezzék a háziállatok számát és fajtáját, hogy pontos tájékoztatást adhassunk.",
        },
        {
          question: "Mik a lemondási feltételek?",
          answer:
            "A foglalás megerősítése előtt megosztjuk az érvényes lemondási feltételeket. Fizetés előtt nyugodtan áttekinthetik őket.",
        },
        {
          question: "Hogyan történik a fizetés?",
          answer:
            "A foglalási igény után elküldjük a hivatalos IBAN-t és a közleményt. Amint a fizetés megérkezik a számlánkra, megerősítjük a foglalást, és WhatsAppon megosztjuk a tartózkodás részleteit.",
        },
        {
          question: "Mikor van a be- és kijelentkezés?",
          answer:
            "Az aktuális érkezési és távozási időpontokat a foglalási adatokkal együtt küldjük el. Utazás előtt ezeket újra ellenőrizhetik.",
        },
        {
          question: "Megfelelő a villa mozgásukban korlátozott vendégeknek?",
          answer:
            "Foglalás előtt jelezzék nekünk az akadálymentességgel kapcsolatos igényeiket, hogy közösen felmérhessük, megfelel-e a villa az elvárásaiknak.",
        },
      ],
    },
    rooms: {
      eyebrow: "HÁLÓSZOBÁK ÉS GALÉRIA",
      title: "Válasszák ki az Önöknek leginkább megfelelő szobát",
      intro:
        "Két franciaágyas szobát, egy kétágyas szobát és egy rugalmas családi szobát kínálunk. Válasszák ki a megfelelőt, vagy foglalják le együtt mind a négyet.",
      notice:
        "Az árat a kiválasztott hálószobák alapján számoljuk ki. Mind a négy szoba választásakor az egész villára készítjük el a foglalást.",
      bedroomNames: ["1. hálószoba", "2. hálószoba", "3. hálószoba", "4. hálószoba"],
      bedroomNotes: [
        "Franciaágyas szoba tetőablakkal, televízióval és erkély felé nyíló ajtóval.",
        "Világos, tágas franciaágyas szoba praktikus tárolóhellyel és közvetlenül az erkélyre nyíló ajtóval.",
        "Kétágyas szoba két külön ággyal gyerekeknek, barátoknak vagy külön ágyat választó vendégeknek.",
        "Rugalmas elrendezésű szoba egy franciaággyal és egy egyszemélyes ággyal, erkéllyel és légkondicionálóval.",
      ],
      sharedEyebrow: "A PROGRAMOK KÖZÖTT",
      sharedTitle: "Terek, ahol újra együtt van a társaság",
      sharedText:
        "A jól felszerelt konyha, az étkezők, a kert, a terasz, a grillező és a wellness-terek a villában töltött minden pillanatot különlegessé tesznek.",
      galleryEyebrow: "FEDEZZÉK FEL A HÁZAT",
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
      title: "A sablonos útikalauzon túl: Badacsony",
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
            "Elég a lényegben megegyezni: érkezési idősáv, első reggeli és egy közös vacsora. A nap többi részét Badacsony és a villa lehetőségei köré, a saját ritmusukban szervezhetik.",
          ],
        },
        {
          slug: "shared-table",
          category: "A VILLÁBAN",
          title: "Medence, szauna, vacsora: egy villanap menetrend nélkül",
          excerpt:
            "Van, amikor nem kell úti cél; a ház önmagában is elég lehetőséget ad a ritmusváltásra.",
          paragraphs: [
            "Kezdjék a napot a kertben, amíg kellemes az idő, frissüljenek fel a medencében, a jacuzzit vagy a hordószaunát pedig hagyják estére. Minden tér más élménnyel gazdagítja a nyugodt villanapot.",
            "A vacsora hangulatát adhatják helyi piaci alapanyagok vagy egy közeli borterasz. A jól felszerelt konyha, a nagy étkezőasztal, a terasz és a grillező mindent megad egy hosszú estéhez.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "KÉRDÉSEK ÉS KÖZVETLEN KAPCSOLAT",
      title: "Kérdezzenek tőlünk bármit a villáról",
      intro:
        "Írják meg kérdéseiket a szobákról, a felszereltségről, a megközelítésről, a környékről vagy a foglalásról; közvetlenül válaszolunk.",
      formEyebrow: "AZ ÖNÖK KÉRDÉSE",
      formTitle: "Miben segíthetünk?",
      formIntro:
        "Írják meg, mire kíváncsiak. Ha a kérdés egy konkrét tartózkodásról szól, az időpontot és a vendégek számát is megadhatják.",
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
        "Kérdésük a villáról, a szobákról, a felszereltségről, a helyszínről vagy a foglalásról.",
      formSubmit: "Üzenet küldése",
      formSending: "Küldés…",
      formCopy: "Érdeklődés másolása",
      formRequired: "A kötelező mezőket * jelöli.",
      formTrust:
        "A kapcsolatfelvételi űrlap nem hoz létre foglalást. A foglalást a fizetés beérkezése után erősítjük meg.",
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
        ["01", "A lényeg elküldése", "Adják meg az időpontot, a vendégek és háziállatok számát, valamint hogy szobát vagy teljes villát szeretnének."],
        ["02", "Fizetési adatok átvétele", "Ellenőrizzük az elérhetőséget és a végösszeget, majd elküldjük a hivatalos IBAN-t és a közleményt."],
        ["03", "A fizetés teljesítése", "Utalják át az összeget, majd küldjék el a bizonylatot WhatsAppon; a fizetés beérkezése után megerősítjük a foglalást."],
      ],
      noteTitle: "Fizetés és foglalási megerősítés",
      note:
        "Ellenőrizzék a hivatalos banki adatokat, majd teljesítsék a fizetést. Amint az összeg megérkezik, megerősítjük a foglalást és elküldjük a tartózkodás részleteit.",
      cta: "Időpont választása a főoldalon",
    },
  },
  tr: {
    navigation: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      rooms: "Odalar ve Galeri",
      blog: "Blog",
      contact: "İletişim",
      book: "Rezervasyon talebi",
      menu: "Menüyü aç",
      language: "Dil seç",
    },
    common: {
      address: "8257 Badacsonytomaj, Füredi út 5, Macaristan",
      wholeVilla: "Tek oda, birden fazla oda veya villanın tamamı için size uygun rezervasyon seçeneğini hazırlıyoruz.",
      explore: "Keşfet",
      booking: "Rezervasyon ve ödeme",
      bookingNote:
        "Ödemeniz hesabımıza ulaştığında rezervasyonunuzu onaylıyor, tüm konaklama bilgilerini WhatsApp üzerinden sizinle paylaşıyoruz.",
      contact: "İletişim",
      contactPending: "E-posta ve WhatsApp bilgileri yayına girmeden önce eklenecektir.",
      availability: "Uygunluğu kontrol et",
      backHome: "Ana sayfaya dön",
    },
    about: {
      eyebrow: "BADACSONY'DE KENDİ RİTMİNİZDE",
      title: "Badacsony'de günü kendi ritminizde yaşayın",
      intro:
        "Relax Villa, Badacsonytomaj'da dört farklı yatak odası ve dolu dolu bir villa deneyimi sunar. İster tek oda, ister birden fazla oda, isterseniz villanın tamamını rezerve edebilirsiniz.",
      storyEyebrow: "ODA VEYA TÜM VİLLA",
      storyTitle: "Konaklamanıza uygun odaları seçin",
      storyLead:
        "İki çift kişilik oda, bir iki yataklı oda ve bir aile odası arasından seçim yapın.",
      storyBody:
        "Konaklama ücretini seçtiğiniz yatak odalarına göre hesaplarız. Dört odanın tamamını seçtiğinizde rezervasyonunuzu tüm villa olarak oluştururuz.",
      secondBody:
        "Tam donanımlı mutfak, ferah yemek alanı, bahçe ve teras günün rahatça akmasını sağlar. Havuz, açık hava jakuzisi, fıçı sauna ve barbekü alanı ise konaklamanıza dört mevsim ayrı bir keyif katar.",
      directionEyebrow: "BİLMENİZDE FAYDA VAR",
      directionTitle: "Rezervasyondan çıkışa kadar kolay",
      visionTitle: "İster oda ister tüm villa",
      visionText:
        "Tek oda, birden fazla oda veya dört odanın tamamı için size uygun rezervasyonu oluştururuz. Dört odanın tamamını seçtiğinizde villayı bütünüyle rezerve ederiz.",
      missionTitle: "Hızlı rezervasyon imkânı",
      missionText:
        "Tarihlerinizi ve oda seçiminizi bize iletin. Uygunluğu ve toplam ücreti hızlıca kontrol eder, ödeme bilgilerini sizinle paylaşırız. Ödemeniz ulaştığında rezervasyonunuzu onaylarız.",
      localEyebrow: "BADACSONY ÇEVRESİNDE",
      localTitle: "Göl, tepe ve şarap rotaları",
      localIntro:
        "Sabah Badacsony patikalarında yürüyün, öğleden sonra Balaton kıyısına inin, günü bağların arasındaki şarap teraslarından birinde tamamlayın.",
      localFeatures: [
        {
          title: "Badacsony Tepesi'nde yürüyüş",
          text: "Bazalt oluşumlarının arasındaki işaretli patikaları takip edin ve Balaton Gölü'ne bakan seyir noktalarından birine ulaşın.",
        },
        {
          title: "Yerel şarap teraslarını ziyaret edin",
          text: "Öğleden sonrayı tepenin çevresindeki mahzenlerde geçirin ve Badacsony'nin en bilinen yerel üzüm çeşitlerinden Kéknyelű'yü tadın.",
        },
        {
          title: "Göle zaman ayırın",
          text: "Bir plaj günü planlayın, göl kıyısındaki bir kasabayı ziyaret edin veya Káli Havzası'nın köyleri ve pazarlarına doğru ilerleyin.",
        },
      ],
      localImageAlts: [
        "Relax Villa'nın havuzu ve terası",
        "Relax Villa'nın açık hava jakuzisi",
        "Relax Villa'daki ortak yemek masası ve mutfak",
      ],
      faqEyebrow: "RELAX VILLA SSS",
      faqTitle: "Rezervasyondan önce yararlı yanıtlar",
      faqIntro:
        "Pratik ayrıntılar önemlidir. Sorunuzun yanıtını burada bulamazsanız ödeme yapmadan önce bize ulaşın.",
      faqContact: "Bize ulaşın",
      checkInOutAnswer: "Giriş saati {checkIn}, çıkış saati {checkOut}. Bu saatleri yönetim panelindeki rezervasyon ayarlarından güncel tutuyoruz.",
      faqs: [
        {
          question: "Tek bir oda veya tüm villa rezerve edilebilir mi?",
          answer:
            "Her iki seçeneği de sunuyoruz. Tek oda, birden fazla oda veya dört odanın tamamını tüm villa olarak rezerve edebilirsiniz.",
        },
        {
          question: "Evcil hayvan kabul ediliyor mu?",
          answer:
            "Evet, ek ücret karşılığında evcil hayvan kabul ediyoruz. Size doğru bilgi verebilmemiz için talebinizde evcil hayvanların sayısını ve türünü belirtin.",
        },
        {
          question: "İptal koşulları nelerdir?",
          answer:
            "Rezervasyonunuzu onaylamadan önce geçerli iptal koşullarını sizinle paylaşırız. Ödeme yapmadan önce koşulları kontrol edebilirsiniz.",
        },
        {
          question: "Ödeme nasıl yapılır?",
          answer:
            "Rezervasyon talebinizin ardından resmi IBAN bilgisini ve ödeme açıklamasını göndeririz. Ödemeniz hesabımıza ulaştığında rezervasyonunuzu onaylar, konaklama bilgilerini WhatsApp üzerinden paylaşırız.",
        },
        {
          question: "Giriş ve çıkış saatleri nedir?",
          answer:
            "Güncel giriş ve çıkış saatlerini rezervasyon bilgilerinizle birlikte paylaşırız. Seyahatten önce bu saatleri yeniden kontrol edebilirsiniz.",
        },
        {
          question: "Villa, hareket kabiliyeti kısıtlı misafirler için uygun mu?",
          answer:
            "Villanın ihtiyaçlarınıza uygunluğunu birlikte değerlendirebilmemiz için erişilebilirlikle ilgili gereksinimlerinizi rezervasyondan önce bize bildirin.",
        },
      ],
    },
    rooms: {
      eyebrow: "YATAK ODALARI VE GALERİ",
      title: "Size en uygun odayı seçin",
      intro:
        "İki çift kişilik oda, bir iki yataklı oda ve esnek bir aile odası sunuyoruz. Size en uygun odayı seçebilir, dilerseniz dört odanın tamamını birlikte rezerve edebilirsiniz.",
      notice:
        "Ücreti seçtiğiniz yatak odalarına göre hesaplarız. Dört odanın tamamını seçtiğinizde rezervasyonunuzu tüm villa olarak oluştururuz.",
      bedroomNames: ["Yatak Odası 1", "Yatak Odası 2", "Yatak Odası 3", "Yatak Odası 4"],
      bedroomNotes: [
        "Çatı penceresi, televizyonu ve balkona açılan kapıları bulunan çift kişilik oda.",
        "Çift kişilik yatağı, kullanışlı depolama alanı ve balkona doğrudan açılan kapısıyla aydınlık ve ferah bir oda.",
        "Çocuklar, arkadaşlar veya ayrı yatak tercih eden misafirler için iki tek kişilik yataklı oda.",
        "Bir çift kişilik ve bir tek kişilik yatak, balkon erişimi ve klima bulunan esnek oda.",
      ],
      sharedEyebrow: "PLANLARIN ARASINDA",
      sharedTitle: "Herkesi yeniden bir araya getiren alanlar",
      sharedText:
        "Tam donanımlı mutfak, yemek alanları, bahçe, teras, barbekü ve spa bölümleri villada geçirdiğiniz her ana ayrı bir keyif katar.",
      galleryEyebrow: "EVİ KEŞFEDİN",
      galleryTitle: "Rezervasyondan önce odayı ve evi inceleyin",
      galleryText:
        "Yatak odaları, yaşam alanları, havuz, jakuzi, fıçı sauna, teras ve bahçenin güncel 38 fotoğrafına göz atın.",
      galleryTabs: {
        all: "Tüm fotoğraflar",
        bedrooms: "Yatak odaları",
        shared: "Yaşam alanları",
        outdoors: "Havuz ve spa",
      },
      photoLabel: "Fotoğraf",
      previousImage: "Önceki fotoğraf",
      nextImage: "Sonraki fotoğraf",
      openImage: "Görseli aç",
      cta: "Tarihlerinizi sorun",
    },
    blog: {
      eyebrow: "BADACSONY'DEN NOTLAR",
      title: "Sıradan gezi rehberlerinin ötesinde: Badacsony",
      intro:
        "Bölgeyi tanımak, daha az plan yapmak ve villadan iyi yararlanmak isteyen gruplar için yararlı yazılar.",
      read: "Yazıyı oku",
      articles: [
        {
          slug: "slow-day",
          category: "TEPE VE GÖL",
          title: "Balaton ile bazalt arasında Badacsony",
          excerpt:
            "Volkanik tepeyi, Balaton kıyısını ve üzüm bağlarını tek bir peyzaj olarak gördüğünüzde bölge daha anlamlı hale gelir.",
          paragraphs: [
            "Badacsony, Balaton Gölü'nün kuzey kıyısındaki volkanik bir tanık tepedir. Bazalt oluşumları, seyir noktaları ve üzüm bağları ayrı ayrı görülecek yerler değil, aynı arazinin farklı yorumlarıdır.",
            "Çok sayıda durağı tamamlamaya çalışmak yerine bir patika, mahzen veya kıyı şeridi seçin. Villaya döndüğünüzde havuz ve teras, günün geri kalanını plansız bırakmanız için yeterince alan sunar.",
          ],
        },
        {
          slug: "pack-together",
          category: "GRUP PLANLAMASI",
          title: "Dört yatak odası, tek grup: önce oda dağılımını planlayın",
          excerpt:
            "Yola çıkmadan önce yapılacak on dakikalık oda planı, kapıda bir saatlik kararsızlığı önleyebilir.",
          paragraphs: [
            "Villada çift kişilik, iki yataklı ve esnek yatak düzenleri bulunur. Varıştan önce odaları çiftlere, çocuklara ve tek başına uyuyacak kişilere göre eşleştirin. Balkon veya klimaya en çok kimin ihtiyaç duyduğunu belirleyin.",
            "Yalnızca temel konularda anlaşın: varış aralığı, ilk kahvaltı ve ortak bir akşam yemeği. Geri kalan zamanı Badacsony'nin ve villanın sunduğu olanaklara göre kendi ritminizde planlayın.",
          ],
        },
        {
          slug: "shared-table",
          category: "VİLLADA",
          title: "Havuz, sauna, akşam yemeği: programsız bir villa günü",
          excerpt:
            "Bazı günlerde bir varış noktasına gerek yoktur. Ev zaten temponuzu değiştirecek kadar seçenek sunar.",
          paragraphs: [
            "Hava ılıkken güne bahçede başlayın, havuzda serinleyin ve jakuziyi ya da fıçı saunayı akşam saatlerine bırakın. Her alan, villada geçen sakin bir günü farklı bir deneyime dönüştürür.",
            "Akşam yemeğinin havasını yerel pazar ürünleri veya yakındaki bir şarap terası belirlesin. Tam donanımlı mutfak, geniş yemek masası, teras ve barbekü alanı uzun akşamlar için ihtiyacınız olan her şeyi sunar.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "MERAK ETTİKLERİNİZ & DOĞRUDAN İLETİŞİM",
      title: "Merak ettiklerinizi bize sorun",
      intro:
        "Odalar, villa olanakları, erişilebilirlik, konum veya rezervasyon süreci hakkında aklınıza takılanları yazın; size doğrudan yanıt verelim.",
      formEyebrow: "SORUNUZ",
      formTitle: "Size nasıl yardımcı olabiliriz?",
      formIntro:
        "Merak ettiğiniz konuyu açıkça yazın. Belirli bir konaklama hakkında soruyorsanız tarihleri ve misafir sayısını da ekleyebilirsiniz.",
      formFields: {
        name: "Ad soyad",
        email: "E-posta adresi",
        whatsapp: "İletişim numarası",
        arrival: "Varış",
        departure: "Ayrılış",
        guests: "Misafir sayısı",
        language: "Tercih edilen dil",
        message: "Mesaj",
      },
      formPlaceholder: "Villa, odalar, olanaklar, konum veya rezervasyon süreciyle ilgili sorunuzu yazın.",
      formSubmit: "Mesajı gönder",
      formSending: "Gönderiliyor…",
      formCopy: "Talebi kopyala",
      formRequired: "Zorunlu alanlar * ile işaretlenmiştir.",
      formTrust:
        "İletişim formu rezervasyon oluşturmaz. Rezervasyonunuz, ödemeniz bize ulaştıktan sonra onaylanır.",
      formDateError: "Ayrılış tarihi varış tarihinden sonra olmalıdır.",
      formCopied:
        "Çevrimiçi gönderim henüz bağlı değil. Mesajınız gönderilmedi. Talep ayrıntıları panoya kopyalandı.",
      formDestinationMissing:
        "Mesajınız gönderilemedi. Lütfen tekrar deneyin veya e-posta ya da WhatsApp üzerinden doğrudan bizimle iletişime geçin.",
      formNameError: "Lütfen en az 2 karakterden oluşan adınızı ve soyadınızı girin.",
      formMessageError: "Lütfen en az 10 karakterden oluşan bir mesaj yazın.",
      formRateLimited: "Bu e-posta adresiyle çok fazla mesaj gönderildi. Lütfen bir saat bekleyip tekrar deneyin.",
      formReady: "Mesajınız ulaştı. Verdiğiniz iletişim bilgileri üzerinden size yanıt vereceğiz.",
      visit: "Villa adresi",
      write: "Doğrudan iletişim",
      writeText: "Onaylanan e-posta ve WhatsApp bilgileri burada görünecektir.",
      map: "Haritada aç",
      processEyebrow: "TARİHLERDEN VARIŞA",
      processTitle: "Üç adımda doğrudan rezervasyon",
      steps: [
        ["01", "Temel bilgileri gönderin", "Tarihleri, misafir ve evcil hayvan sayısını, ayrıca oda mı yoksa tüm villa mı istediğinizi belirtin."],
        ["02", "Ödeme bilgilerini alın", "Uygunluğu ve toplam ücreti kontrol eder, resmi IBAN bilgisini ve ödeme açıklamasını sizinle paylaşırız."],
        ["03", "Ödemeyi tamamlayın", "Banka havalesini yaptıktan sonra dekontu WhatsApp üzerinden gönderin; ödemeniz ulaştığında rezervasyonunuzu onaylayalım."],
      ],
      noteTitle: "Ödeme ve rezervasyon onayı",
      note:
        "Resmi banka bilgilerini kontrol edip ödemeyi tamamlayın. Ödemeniz bize ulaştığında rezervasyonunuzu onaylar ve konaklama ayrıntılarını sizinle paylaşırız.",
      cta: "Ana sayfadan tarih seçin",
    },
  },
} as const satisfies Record<Language, object>;

export type SecondaryCopy = (typeof secondaryCopy)[Language];
