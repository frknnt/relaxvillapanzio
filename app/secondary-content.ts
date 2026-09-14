import type { Language } from "./site-content";

export const secondaryCopy = {
  en: {
    navigation: {
      home: "Home",
      about: "About",
      rooms: "Bedrooms & Gallery",
      blog: "Journal",
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
        "Your dates are confirmed directly with the host. Payment is then made by bank transfer and the receipt is sent through WhatsApp.",
      contact: "Contact",
      contactPending: "Email and WhatsApp details will be added before launch.",
      availability: "Check availability",
      backHome: "Back to home",
    },
    about: {
      eyebrow: "ABOUT US",
      title: "About Relax Villa",
      intro:
        "Relax Villa is a four-bedroom home in Badacsonytomaj, reserved exclusively for one group at a time.",
      storyEyebrow: "THE WHOLE PLACE IS YOURS",
      storyTitle: "Designed around the way groups really stay",
      storyLead:
        "Some trips are less about a schedule and more about having room to reconnect.",
      storyBody:
        "At Relax Villa, every bedroom and shared space belongs to the same booking. There are no separate room guests, no shared common areas and no need to split your group across different properties.",
      secondBody:
        "Start the morning around one table, find a quiet corner in the afternoon, then come back together in the evening. The villa gives everyone space without losing the feeling of being together.",
      directionEyebrow: "OUR VISION & MISSION",
      visionTitle: "Our vision",
      visionText:
        "To be the private villa guests remember as the place where their group could truly slow down, reconnect and enjoy Badacsony together.",
      missionTitle: "Our mission",
      missionText:
        "To welcome one group at a time into a carefully prepared home, with clear direct booking and the freedom to enjoy every space in complete privacy.",
      facts: [
        ["One group", "Exclusive use of the complete property throughout your stay."],
        ["Four bedrooms", "Every bedroom is included—none are booked separately."],
        ["Direct booking", "Dates and payment steps are agreed directly with the host."],
      ],
      promiseEyebrow: "A SIMPLE PROMISE",
      promiseTitle: "Privacy, space and one complete stay",
      promiseText:
        "From arrival to departure, the villa remains your group's private base in Badacsonytomaj.",
      cta: "Explore the bedrooms",
    },
    rooms: {
      eyebrow: "BEDROOMS & GALLERY",
      title: "Four bedrooms, included in every stay",
      intro:
        "Explore the sleeping spaces and shared areas. The bedrooms are shown separately here, but they are always reserved together as part of the complete villa.",
      notice: "One booking includes all four bedrooms and the villa's shared spaces.",
      bedroomNames: ["Bedroom One", "Bedroom Two", "Bedroom Three", "Bedroom Four"],
      bedroomNotes: [
        "A bright double bedroom with a skylight, television and doors opening toward the balcony.",
        "A calm double bedroom with bedside lighting, storage and direct balcony access.",
        "A practical twin room with two separate single beds for family or friends travelling together.",
        "A flexible room with one double and one single bed, plus balcony access and air conditioning.",
      ],
      sharedEyebrow: "BEYOND THE BEDROOMS",
      sharedTitle: "Spaces made to share",
      sharedText:
        "The kitchen, dining areas and outdoor spaces are all part of the same private stay.",
      galleryEyebrow: "FULL PHOTO TOUR",
      galleryTitle: "See every space before you arrive",
      galleryText:
        "Browse 38 recent photos of the bedrooms, living spaces, pool, hot tub, sauna and garden.",
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
      eyebrow: "RELAX VILLA JOURNAL",
      title: "Ideas for an easy villa stay",
      intro:
        "Simple notes for planning your time together, from the first shared breakfast to a slow day around Badacsonytomaj.",
      read: "Read article",
      articles: [
        {
          slug: "slow-day",
          category: "LOCAL RHYTHM",
          title: "A slow day in Badacsonytomaj",
          excerpt:
            "Leave space in the plan. Begin nearby, follow the mood of the group and return to the villa without watching the clock.",
          paragraphs: [
            "A good villa day does not need a long checklist. Start with an unhurried breakfast, decide together what everyone feels like doing and keep the route flexible.",
            "The most useful plan is often a simple one: one place you would like to see, time for a meal and enough room in the day to enjoy the villa itself.",
          ],
        },
        {
          slug: "pack-together",
          category: "STAY WELL",
          title: "What to plan for a whole-villa stay",
          excerpt:
            "A little coordination before arrival makes the shared spaces feel effortless from the first evening.",
          paragraphs: [
            "Agree on arrival times, meal ideas and any essentials before the trip. It keeps the first hours relaxed and lets everyone settle in at their own pace.",
            "Because the complete villa is yours, think in terms of shared moments as well as individual needs: breakfast together, quiet time and an evening around one table.",
          ],
        },
        {
          slug: "shared-table",
          category: "AT THE VILLA",
          title: "Meals made for one shared table",
          excerpt:
            "Keep the menu uncomplicated and make the meal itself part of the time you came to share.",
          paragraphs: [
            "Villa meals work best when they are easy to prepare together. Choose a few flexible dishes, divide small tasks and leave plenty of time for conversation.",
            "The point is not a perfect menu. It is having everyone in one place, with nowhere else they need to be.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "CONTACT & BOOKING",
      title: "Plan your private villa stay",
      intro:
        "Send your preferred dates for the complete villa. Availability and payment details are confirmed directly with the host.",
      formEyebrow: "BOOKING ENQUIRY",
      formTitle: "Tell us about your stay",
      formIntro:
        "All enquiries are for the complete four-bedroom villa. Complete the form and we will prepare your message for the host.",
      formFields: {
        name: "Full name",
        email: "Email address",
        whatsapp: "WhatsApp number",
        arrival: "Arrival",
        departure: "Departure",
        guests: "Number of guests",
        language: "Preferred language",
        message: "Message",
      },
      formPlaceholder: "Tell us anything that will help us understand your stay.",
      formSubmit: "Send booking enquiry",
      formCopy: "Copy booking enquiry",
      formRequired: "Required fields are marked with *.",
      formTrust:
        "Your request is not a confirmed booking until the host replies in writing.",
      formDateError: "Departure must be later than arrival.",
      formCopied:
        "Online sending is not connected yet. Your message has not been sent; the enquiry details were copied.",
      formDestinationMissing:
        "Online sending is not connected yet and copying failed. Your information has not been sent.",
      formReady: "Your enquiry is ready. Please complete sending it in the opened app.",
      visit: "Villa address",
      write: "Direct contact",
      writeText: "Email and WhatsApp details will appear here once confirmed.",
      map: "Open in maps",
      processEyebrow: "HOW BOOKING WORKS",
      processTitle: "A clear three-step booking",
      steps: [
        ["01", "Request your dates", "Choose arrival, departure and the number of guests for the complete villa."],
        ["02", "Receive confirmation", "The host confirms availability and shares the IBAN and payment reference."],
        ["03", "Send the receipt", "Complete the bank transfer, then send the payment receipt through WhatsApp."],
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
      blog: "Journal",
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
        "Ihre Reisedaten werden direkt mit dem Gastgeber bestätigt. Anschließend zahlen Sie per Banküberweisung und senden den Beleg über WhatsApp.",
      contact: "Kontakt",
      contactPending: "E-Mail- und WhatsApp-Daten werden vor dem Start ergänzt.",
      availability: "Verfügbarkeit prüfen",
      backHome: "Zur Startseite",
    },
    about: {
      eyebrow: "ÜBER UNS",
      title: "Über Relax Villa",
      intro:
        "Relax Villa ist ein Haus mit vier Schlafzimmern in Badacsonytomaj und wird immer exklusiv an eine Gruppe vermietet.",
      storyEyebrow: "DIE GANZE VILLA GEHÖRT IHNEN",
      storyTitle: "Für die Art gestaltet, wie Gruppen wirklich reisen",
      storyLead:
        "Bei manchen Reisen geht es weniger um einen Zeitplan als um Raum für echte gemeinsame Zeit.",
      storyBody:
        "In der Relax Villa gehören jedes Schlafzimmer und alle Gemeinschaftsbereiche zu derselben Buchung. Es gibt keine weiteren Zimmergäste, keine geteilten Bereiche und Ihre Gruppe muss nicht auf mehrere Unterkünfte verteilt werden.",
      secondBody:
        "Beginnen Sie den Morgen an einem Tisch, finden Sie am Nachmittag einen ruhigen Platz und kommen Sie abends wieder zusammen. Die Villa bietet Freiraum, ohne das Gefühl der Gemeinschaft zu verlieren.",
      directionEyebrow: "UNSERE VISION & MISSION",
      visionTitle: "Unsere Vision",
      visionText:
        "Eine private Villa zu sein, an die sich Gäste als den Ort erinnern, an dem ihre Gruppe wirklich entschleunigen, sich wieder näherkommen und Badacsony gemeinsam genießen konnte.",
      missionTitle: "Unsere Mission",
      missionText:
        "Jeweils eine Gruppe in einem sorgfältig vorbereiteten Zuhause willkommen zu heißen – mit klarer Direktbuchung und der Freiheit, jeden Bereich vollkommen privat zu genießen.",
      facts: [
        ["Eine Gruppe", "Exklusive Nutzung der gesamten Unterkunft während Ihres Aufenthalts."],
        ["Vier Schlafzimmer", "Alle Schlafzimmer sind enthalten und werden nie einzeln vermietet."],
        ["Direkte Buchung", "Reisedaten und Zahlungsschritte werden direkt abgestimmt."],
      ],
      promiseEyebrow: "EIN EINFACHES VERSPRECHEN",
      promiseTitle: "Privatsphäre, Raum und ein kompletter Aufenthalt",
      promiseText:
        "Von der Anreise bis zur Abreise bleibt die Villa der private Rückzugsort Ihrer Gruppe in Badacsonytomaj.",
      cta: "Schlafzimmer entdecken",
    },
    rooms: {
      eyebrow: "SCHLAFZIMMER & GALERIE",
      title: "Vier Schlafzimmer bei jedem Aufenthalt inklusive",
      intro:
        "Entdecken Sie Schlaf- und Gemeinschaftsbereiche. Die Zimmer werden hier einzeln gezeigt, aber immer gemeinsam als komplette Villa reserviert.",
      notice: "Eine Buchung umfasst alle vier Schlafzimmer und die Gemeinschaftsbereiche der Villa.",
      bedroomNames: ["Schlafzimmer 1", "Schlafzimmer 2", "Schlafzimmer 3", "Schlafzimmer 4"],
      bedroomNotes: [
        "Ein helles Doppelzimmer mit Dachfenster, Fernseher und Türen zum Balkon.",
        "Ein ruhiges Doppelzimmer mit Nachttischbeleuchtung, Stauraum und direktem Balkonzugang.",
        "Ein praktisches Zweibettzimmer mit zwei getrennten Einzelbetten für gemeinsam reisende Familien oder Freunde.",
        "Ein flexibles Zimmer mit einem Doppel- und einem Einzelbett, Balkonzugang und Klimaanlage.",
      ],
      sharedEyebrow: "MEHR ALS SCHLAFZIMMER",
      sharedTitle: "Räume für gemeinsame Zeit",
      sharedText:
        "Küche, Essbereiche und Außenbereiche gehören vollständig zu Ihrem privaten Aufenthalt.",
      galleryEyebrow: "VOLLSTÄNDIGER FOTORUNDGANG",
      galleryTitle: "Sehen Sie jeden Bereich vor Ihrer Anreise",
      galleryText:
        "Entdecken Sie 38 aktuelle Fotos der Schlafzimmer, Wohnbereiche, des Pools, Whirlpools, der Sauna und des Gartens.",
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
      eyebrow: "RELAX VILLA JOURNAL",
      title: "Ideen für einen entspannten Villenaufenthalt",
      intro:
        "Einfache Anregungen für Ihre gemeinsame Zeit – vom ersten Frühstück bis zu einem ruhigen Tag rund um Badacsonytomaj.",
      read: "Artikel lesen",
      articles: [
        {
          slug: "slow-day",
          category: "REGIONALER RHYTHMUS",
          title: "Ein langsamer Tag in Badacsonytomaj",
          excerpt:
            "Lassen Sie Platz im Plan, starten Sie in der Nähe und kehren Sie ohne Blick auf die Uhr zur Villa zurück.",
          paragraphs: [
            "Ein guter Villentag braucht keine lange Checkliste. Beginnen Sie mit einem ruhigen Frühstück, entscheiden Sie gemeinsam nach Stimmung und halten Sie den Weg flexibel.",
            "Oft genügt ein einfacher Plan: ein Ort, den Sie sehen möchten, Zeit für eine Mahlzeit und genug Raum, um auch die Villa selbst zu genießen.",
          ],
        },
        {
          slug: "pack-together",
          category: "GUT ANKOMMEN",
          title: "Was Sie für einen Villenaufenthalt planen können",
          excerpt:
            "Ein wenig Abstimmung vor der Anreise macht die gemeinsamen Räume vom ersten Abend an unkompliziert.",
          paragraphs: [
            "Stimmen Sie Ankunftszeiten, Essensideen und wichtige Dinge vor der Reise ab. So bleiben die ersten Stunden entspannt und jeder kann in Ruhe ankommen.",
            "Da die ganze Villa Ihnen gehört, denken Sie an gemeinsame Momente ebenso wie an individuelle Bedürfnisse: Frühstück, Ruhezeit und einen Abend an einem Tisch.",
          ],
        },
        {
          slug: "shared-table",
          category: "IN DER VILLA",
          title: "Mahlzeiten an einem gemeinsamen Tisch",
          excerpt:
            "Halten Sie das Menü unkompliziert und machen Sie die Mahlzeit selbst zu einem Teil Ihrer gemeinsamen Zeit.",
          paragraphs: [
            "Villengerichte gelingen am besten, wenn sie gemeinsam einfach zuzubereiten sind. Wählen Sie flexible Speisen, verteilen Sie kleine Aufgaben und lassen Sie Zeit für Gespräche.",
            "Es geht nicht um ein perfektes Menü, sondern darum, alle an einem Ort zu haben – ohne den nächsten Termin im Blick.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "KONTAKT & BUCHUNG",
      title: "Planen Sie Ihren privaten Villenaufenthalt",
      intro:
        "Senden Sie Ihre Wunschdaten für die komplette Villa. Verfügbarkeit und Zahlungsdaten werden direkt mit dem Gastgeber bestätigt.",
      formEyebrow: "BUCHUNGSANFRAGE",
      formTitle: "Erzählen Sie uns von Ihrem Aufenthalt",
      formIntro:
        "Alle Anfragen gelten für die komplette Villa mit vier Schlafzimmern. Füllen Sie das Formular aus und wir bereiten Ihre Nachricht an den Gastgeber vor.",
      formFields: {
        name: "Vollständiger Name",
        email: "E-Mail-Adresse",
        whatsapp: "WhatsApp-Nummer",
        arrival: "Anreise",
        departure: "Abreise",
        guests: "Anzahl der Gäste",
        language: "Bevorzugte Sprache",
        message: "Nachricht",
      },
      formPlaceholder: "Teilen Sie uns mit, was für Ihren Aufenthalt wichtig ist.",
      formSubmit: "Buchungsanfrage senden",
      formCopy: "Buchungsanfrage kopieren",
      formRequired: "Pflichtfelder sind mit * gekennzeichnet.",
      formTrust:
        "Ihre Anfrage ist erst nach der schriftlichen Bestätigung durch den Gastgeber eine bestätigte Buchung.",
      formDateError: "Die Abreise muss nach der Anreise liegen.",
      formCopied:
        "Der Online-Versand ist noch nicht eingerichtet. Ihre Nachricht wurde nicht gesendet; die Anfrage wurde kopiert.",
      formDestinationMissing:
        "Der Online-Versand ist noch nicht eingerichtet und das Kopieren ist fehlgeschlagen. Ihre Angaben wurden nicht gesendet.",
      formReady: "Ihre Anfrage ist vorbereitet. Bitte senden Sie sie in der geöffneten App ab.",
      visit: "Adresse der Villa",
      write: "Direkter Kontakt",
      writeText: "E-Mail- und WhatsApp-Daten erscheinen hier nach der Bestätigung.",
      map: "In Karten öffnen",
      processEyebrow: "SO FUNKTIONIERT DIE BUCHUNG",
      processTitle: "Drei klare Buchungsschritte",
      steps: [
        ["01", "Reisedaten anfragen", "Wählen Sie Anreise, Abreise und Gästezahl für die komplette Villa."],
        ["02", "Bestätigung erhalten", "Der Gastgeber bestätigt die Verfügbarkeit und sendet IBAN und Verwendungszweck."],
        ["03", "Beleg senden", "Überweisen Sie den Betrag und senden Sie den Zahlungsbeleg über WhatsApp."],
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
      blog: "Napló",
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
        "Az időpontot közvetlenül a házigazda igazolja vissza. Ezután banki átutalással fizethet, a bizonylatot pedig WhatsAppon küldheti el.",
      contact: "Kapcsolat",
      contactPending: "Az e-mail- és WhatsApp-adatok az indulás előtt kerülnek fel.",
      availability: "Szabad időpontok",
      backHome: "Vissza a főoldalra",
    },
    about: {
      eyebrow: "RÓLUNK",
      title: "A Relax Villáról",
      intro:
        "A Relax Villa négy hálószobás ház Badacsonytomajban, amelyet egyszerre mindig csak egy társaság használ.",
      storyEyebrow: "AZ EGÉSZ VILLA AZ ÖNÖKÉ",
      storyTitle: "Olyan pihenéshez tervezve, ahogyan egy társaság igazán együtt van",
      storyLead:
        "Vannak utazások, amelyek nem a sűrű programról, hanem a zavartalan közös időről szólnak.",
      storyBody:
        "A Relax Villában minden hálószoba és közös tér ugyanahhoz a foglaláshoz tartozik. Nincsenek más szobavendégek vagy megosztott helyiségek, és a társaságnak nem kell több szálláshely között oszlania.",
      secondBody:
        "Indítsák a reggelt egy asztalnál, délután találjanak egy csendes sarkot, este pedig legyenek újra együtt. A villa mindenkinek teret ad, miközben megőrzi az együttlét érzését.",
      directionEyebrow: "JÖVŐKÉPÜNK ÉS KÜLDETÉSÜNK",
      visionTitle: "Jövőképünk",
      visionText:
        "Olyan privát villává válni, amelyre vendégeink úgy emlékeznek: itt társaságuk valóban lelassulhatott, újra egymásra találhatott, és együtt élvezhette Badacsony hangulatát.",
      missionTitle: "Küldetésünk",
      missionText:
        "Egyszerre egy társaságot fogadni gondosan előkészített otthonunkban, átlátható közvetlen foglalással és azzal a szabadsággal, hogy minden teret teljesen privát módon élvezhessenek.",
      facts: [
        ["Egy társaság", "A teljes ingatlan kizárólagos használata a tartózkodás alatt."],
        ["Négy hálószoba", "Minden hálószoba a foglalás része, külön nem bérelhetők."],
        ["Közvetlen foglalás", "Az időpont és a fizetés lépései közvetlenül egyeztethetők."],
      ],
      promiseEyebrow: "EGYSZERŰ ÍGÉRET",
      promiseTitle: "Privát tér, kényelem és egy teljes pihenés",
      promiseText:
        "Az érkezéstől a távozásig a villa az Önök saját badacsonytomaji bázisa marad.",
      cta: "Hálószobák megtekintése",
    },
    rooms: {
      eyebrow: "HÁLÓSZOBÁK ÉS GALÉRIA",
      title: "Négy hálószoba minden foglalásban",
      intro:
        "Tekintsék meg a háló- és közös tereket. A szobákat itt külön mutatjuk be, de mindig együtt, a teljes villa részeként foglalhatók.",
      notice: "Egy foglalás mind a négy hálószobát és a villa közös tereit is tartalmazza.",
      bedroomNames: ["1. hálószoba", "2. hálószoba", "3. hálószoba", "4. hálószoba"],
      bedroomNotes: [
        "Világos franciaágyas szoba tetőablakkal, televízióval és erkélyre nyíló ajtóval.",
        "Nyugodt franciaágyas szoba éjjeli világítással, tárolóhellyel és közvetlen erkélykapcsolattal.",
        "Praktikus kétágyas szoba két külön ággyal, együtt utazó családoknak vagy barátoknak.",
        "Rugalmas elrendezésű szoba egy franciaággyal és egy egyszemélyes ággyal, erkéllyel és légkondicionálóval.",
      ],
      sharedEyebrow: "A HÁLÓSZOBÁKON TÚL",
      sharedTitle: "Közös pillanatokhoz tervezett terek",
      sharedText:
        "A konyha, az étkezők és a kültéri terek mind a privát pihenés részei.",
      galleryEyebrow: "TELJES FOTÓGALÉRIA",
      galleryTitle: "Nézzenek meg minden teret érkezés előtt",
      galleryText:
        "Böngésszenek 38 friss fotót a hálószobákról, közös terekről, medencéről, jakuzziról, szaunáról és a kertről.",
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
      eyebrow: "RELAX VILLA NAPLÓ",
      title: "Ötletek egy könnyed villapihenéshez",
      intro:
        "Egyszerű gondolatok a közös idő megtervezéséhez, az első reggelitől egy nyugodt badacsonytomaji napig.",
      read: "Cikk olvasása",
      articles: [
        {
          slug: "slow-day",
          category: "HELYI RITMUS",
          title: "Egy lassú nap Badacsonytomajban",
          excerpt:
            "Hagyjanak helyet a tervben, induljanak a közelből, és térjenek vissza a villába az óra figyelése nélkül.",
          paragraphs: [
            "Egy jó villanaphoz nem kell hosszú programlista. Kezdjék egy ráérős reggelivel, döntsenek együtt az aznapi hangulat szerint, és maradjon rugalmas az útvonal.",
            "Gyakran egy egyszerű terv a leghasznosabb: egy hely, amelyet szeretnének látni, idő egy közös étkezésre és elég tér magának a villának az élvezetéhez.",
          ],
        },
        {
          slug: "pack-together",
          category: "KÖNNYŰ ÉRKEZÉS",
          title: "Mire érdemes készülni egy teljes-villa pihenéshez",
          excerpt:
            "Egy kis egyeztetés indulás előtt már az első estétől könnyeddé teszi a közös tereket.",
          paragraphs: [
            "Egyeztessék az érkezési időt, az étkezési ötleteket és a fontos dolgokat még az utazás előtt. Így az első órák nyugodtak maradnak, és mindenki a saját tempójában érkezhet meg.",
            "Mivel az egész villa az Önöké, az egyéni igények mellett gondoljanak a közös pillanatokra is: reggelire, csendes időre és egy estére egy asztal körül.",
          ],
        },
        {
          slug: "shared-table",
          category: "A VILLÁBAN",
          title: "Közös étkezések egy asztal körül",
          excerpt:
            "Legyen egyszerű a menü, és váljon maga az étkezés is a közösen töltött idő részévé.",
          paragraphs: [
            "A villában azok az ételek működnek a legjobban, amelyeket könnyű együtt elkészíteni. Válasszanak rugalmas fogásokat, osszák fel az apró feladatokat, és hagyjanak időt a beszélgetésre.",
            "Nem a tökéletes menü a lényeg, hanem az, hogy mindenki egy helyen legyen, és sehová se kelljen sietni.",
          ],
        },
      ],
    },
    contactPage: {
      eyebrow: "KAPCSOLAT ÉS FOGLALÁS",
      title: "Tervezzék meg privát villapihenésüket",
      intro:
        "Küldjék el a teljes villára vonatkozó kívánt időpontot. Az elérhetőséget és a fizetési adatokat közvetlenül a házigazda igazolja vissza.",
      formEyebrow: "FOGLALÁSI ÉRDEKLŐDÉS",
      formTitle: "Meséljenek tervezett pihenésükről",
      formIntro:
        "Minden érdeklődés a teljes, négy hálószobás villára vonatkozik. Töltsék ki az űrlapot, mi pedig előkészítjük az üzenetet a házigazdának.",
      formFields: {
        name: "Teljes név",
        email: "E-mail-cím",
        whatsapp: "WhatsApp-szám",
        arrival: "Érkezés",
        departure: "Távozás",
        guests: "Vendégek száma",
        language: "Kapcsolattartás nyelve",
        message: "Üzenet",
      },
      formPlaceholder: "Írják meg, mi segítene a pihenésük megtervezésében.",
      formSubmit: "Foglalási érdeklődés küldése",
      formCopy: "Foglalási érdeklődés másolása",
      formRequired: "A kötelező mezőket * jelöli.",
      formTrust:
        "A kérés csak a házigazda írásos visszaigazolása után válik megerősített foglalássá.",
      formDateError: "A távozás dátumának az érkezés után kell lennie.",
      formCopied:
        "Az online küldés még nincs beállítva. Az üzenetet nem küldtük el; a kérés adatait kimásoltuk.",
      formDestinationMissing:
        "Az online küldés még nincs beállítva, és a másolás nem sikerült. Az adatokat nem küldtük el.",
      formReady: "Az érdeklődés elkészült. Kérjük, küldjék el a megnyitott alkalmazásban.",
      visit: "A villa címe",
      write: "Közvetlen kapcsolat",
      writeText: "A megerősített e-mail- és WhatsApp-adatok itt jelennek majd meg.",
      map: "Megnyitás térképen",
      processEyebrow: "A FOGLALÁS MENETE",
      processTitle: "Három átlátható lépés",
      steps: [
        ["01", "Időpont kérése", "Válasszák ki az érkezést, távozást és a vendégek számát a teljes villához."],
        ["02", "Visszaigazolás", "A házigazda megerősíti az elérhetőséget, majd elküldi az IBAN-t és a közleményt."],
        ["03", "Bizonylat küldése", "Az átutalás után küldjék el a fizetési bizonylatot WhatsAppon."],
      ],
      noteTitle: "Átutalás előtt",
      note:
        "Fizetés előtt kérjük, várják meg az időpont írásos visszaigazolását és a hivatalos banki adatokat.",
      cta: "Időpont választása a főoldalon",
    },
  },
} as const satisfies Record<Language, object>;

export type SecondaryCopy = (typeof secondaryCopy)[Language];
