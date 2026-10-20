import type { Language } from "@/app/site-content";

type ProfessionalCopy = {
  skipToContent: string;
  menuTitle: string;
  menuDescription: string;
  bookingDataError: string;
  retry: string;
  policyAgreement: string;
  policyRequired: string;
  policyLinks: string;
  holdDeadline: string;
  holdExplanation: string;
  trackBooking: string;
  policies: string;
  privacy: string;
  bookingTerms: string;
  cancellation: string;
  statusTitle: string;
  statusIntro: string;
  reference: string;
  email: string;
  checkStatus: string;
  statusNotFound: string;
  statusError: string;
  statusLabels: Record<"payment_pending" | "confirmed" | "cancelled" | "expired", string>;
  paymentLabels: Record<"awaiting_transfer" | "received" | "refunded", string>;
  arrivalDeparture: string;
  rooms: string;
  total: string;
  policyUpdated: string;
  privacyIntro: string;
  controllerTitle: string;
  controllerText: string;
  dataTitle: string;
  dataText: string;
  purposeTitle: string;
  purposeText: string;
  retentionTitle: string;
  retentionText: string;
  rightsTitle: string;
  rightsText: string;
  securityTitle: string;
  securityText: string;
  termsIntro: string;
  requestTitle: string;
  requestText: string;
  paymentTitle: string;
  paymentText: string;
  stayTitle: string;
  stayText: string;
  accuracyTitle: string;
  accuracyText: string;
  cancellationIntro: string;
  freeCancellationTitle: string;
  freeCancellationText: string;
  lateCancellationTitle: string;
  lateCancellationText: string;
  refundTitle: string;
  refundText: string;
  ownerCancellationTitle: string;
  ownerCancellationText: string;
};

export const professionalCopy: Record<Language, ProfessionalCopy> = {
  en: {
    skipToContent: "Skip to main content",
    menuTitle: "Menu",
    menuDescription: "Navigate Harmony Balaton Villa and choose your language.",
    bookingDataError: "Live availability and prices could not be loaded. Please retry before choosing dates.",
    retry: "Retry",
    policyAgreement: "I have read and accept the booking terms, cancellation policy and privacy notice.",
    policyRequired: "Please accept the booking and privacy terms to continue.",
    policyLinks: "View policies",
    holdDeadline: "Payment deadline",
    holdExplanation: "Your selected rooms are held until this deadline. The request expires automatically if the transfer is not received in time.",
    trackBooking: "Check reservation status",
    policies: "Policies",
    privacy: "Privacy notice",
    bookingTerms: "Booking terms",
    cancellation: "Cancellation policy",
    statusTitle: "Check your reservation",
    statusIntro: "Enter the reference code and the same email address used in the request.",
    reference: "Reservation reference",
    email: "Email address",
    checkStatus: "Check status",
    statusNotFound: "No matching reservation was found. Check the reference and email address.",
    statusError: "The reservation status could not be loaded. Please try again.",
    statusLabels: { payment_pending: "Payment pending", confirmed: "Confirmed", cancelled: "Cancelled", expired: "Expired" },
    paymentLabels: { awaiting_transfer: "Transfer pending", received: "Payment received", refunded: "Refunded" },
    arrivalDeparture: "Stay dates",
    rooms: "Selected rooms",
    total: "Total",
    policyUpdated: "Operational policy · last updated October 2026",
    privacyIntro: "This notice explains how information sent through the reservation and contact forms is handled.",
    controllerTitle: "Data controller",
    controllerText: "The accommodation operator shown below controls the data. Privacy questions can be sent to the listed contact email.",
    dataTitle: "Data we collect",
    dataText: "We process your name, email, phone number, stay details, selected rooms, guest counts, notes and the operational records needed to manage your request.",
    purposeTitle: "Purpose and legal basis",
    purposeText: "We use the data to answer enquiries, prepare and perform the accommodation agreement, process payment, prevent misuse and meet accounting or legal obligations.",
    retentionTitle: "Retention",
    retentionText: "Reservation and support records are retained for the period shown below, unless a longer statutory period applies. Unneeded data is then deleted or anonymised.",
    rightsTitle: "Your choices and rights",
    rightsText: "You may request access, correction, deletion, restriction or portability, and may object where applicable. You may also complain to the Hungarian data protection authority (NAIH).",
    securityTitle: "Security and recipients",
    securityText: "Access is limited to authorised administrators and service providers needed to operate hosting, database and communications. Form data is validated and protected by access controls.",
    termsIntro: "These terms describe how a booking request becomes a confirmed reservation.",
    requestTitle: "Request and availability",
    requestText: "Choose one or more rooms, or all four rooms for the whole villa. A request is created only after the form passes the live availability and price checks.",
    paymentTitle: "Payment and confirmation",
    paymentText: "The full displayed total must arrive by the payment deadline. The reservation is confirmed after the payment is marked as received. An unpaid request expires automatically at the deadline.",
    stayTitle: "Arrival, departure and house use",
    stayText: "The current arrival and departure times are shown below. Guests must provide accurate information, respect capacity and use the property and amenities responsibly.",
    accuracyTitle: "Prices and corrections",
    accuracyText: "The total shown in the request is calculated from the selected rooms, dates, configured monthly rates, child fee and pet fee. If a clear technical pricing error occurs, the operator will contact you before confirmation.",
    cancellationIntro: "To cancel or change a reservation, contact us directly and include your reservation reference.",
    freeCancellationTitle: "Request a cancellation",
    freeCancellationText: "Send your cancellation or change request to the contact email shown above. Include the reservation reference and the email address used for the booking.",
    lateCancellationTitle: "Contact us as soon as possible",
    lateCancellationText: "We review the applicable conditions for your reservation and confirm the next steps directly with you.",
    refundTitle: "Refund timing",
    refundText: "Approved refunds are returned to the original transfer account after the cancellation is verified. Bank processing times may apply.",
    ownerCancellationTitle: "Cancellation by the operator",
    ownerCancellationText: "If the operator cannot provide the confirmed stay, payments received for that reservation are refunded in full.",
  },
  de: {
    skipToContent: "Zum Hauptinhalt springen", menuTitle: "Menü", menuDescription: "Harmony Balaton Villa durchsuchen und Sprache wählen.",
    bookingDataError: "Live-Verfügbarkeit und Preise konnten nicht geladen werden. Bitte erneut versuchen.", retry: "Erneut versuchen",
    policyAgreement: "Ich habe die Buchungsbedingungen, Stornierungsbedingungen und Datenschutzhinweise gelesen und akzeptiere sie.", policyRequired: "Bitte akzeptieren Sie die Buchungs- und Datenschutzbedingungen.", policyLinks: "Bedingungen ansehen",
    holdDeadline: "Zahlungsfrist", holdExplanation: "Die gewählten Zimmer bleiben bis zu dieser Frist reserviert. Ohne rechtzeitigen Zahlungseingang verfällt die Anfrage automatisch.", trackBooking: "Reservierungsstatus prüfen",
    policies: "Bedingungen", privacy: "Datenschutzhinweise", bookingTerms: "Buchungsbedingungen", cancellation: "Stornierungsbedingungen",
    statusTitle: "Reservierung prüfen", statusIntro: "Geben Sie den Referenzcode und dieselbe E-Mail-Adresse wie bei der Anfrage ein.", reference: "Reservierungsreferenz", email: "E-Mail-Adresse", checkStatus: "Status prüfen", statusNotFound: "Keine passende Reservierung gefunden. Prüfen Sie Referenz und E-Mail-Adresse.", statusError: "Der Reservierungsstatus konnte nicht geladen werden. Bitte erneut versuchen.",
    statusLabels: { payment_pending: "Zahlung ausstehend", confirmed: "Bestätigt", cancelled: "Storniert", expired: "Abgelaufen" }, paymentLabels: { awaiting_transfer: "Überweisung ausstehend", received: "Zahlung erhalten", refunded: "Erstattet" },
    arrivalDeparture: "Reisedaten", rooms: "Gewählte Zimmer", total: "Gesamt", policyUpdated: "Betriebliche Richtlinie · aktualisiert Oktober 2026",
    privacyIntro: "Diese Hinweise erklären den Umgang mit Angaben aus Reservierungs- und Kontaktformularen.", controllerTitle: "Verantwortlicher", controllerText: "Der unten genannte Beherbergungsbetrieb ist verantwortlich. Datenschutzfragen können an die angegebene E-Mail-Adresse gesendet werden.", dataTitle: "Verarbeitete Daten", dataText: "Wir verarbeiten Name, E-Mail, Telefonnummer, Aufenthaltsdaten, Zimmerauswahl, Gästezahlen, Notizen und betriebliche Vorgangsdaten.", purposeTitle: "Zweck und Rechtsgrundlage", purposeText: "Die Daten dienen der Beantwortung von Anfragen, Vorbereitung und Durchführung des Beherbergungsvertrags, Zahlungsabwicklung, Missbrauchsprävention und gesetzlichen Pflichten.", retentionTitle: "Speicherdauer", retentionText: "Reservierungs- und Supportdaten werden für den unten genannten Zeitraum gespeichert, sofern keine längere gesetzliche Pflicht gilt; danach werden sie gelöscht oder anonymisiert.", rightsTitle: "Ihre Rechte", rightsText: "Sie können Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragbarkeit verlangen und gegebenenfalls widersprechen. Beschwerden sind bei der ungarischen Datenschutzbehörde NAIH möglich.", securityTitle: "Sicherheit und Empfänger", securityText: "Zugriff erhalten nur autorisierte Administratoren und notwendige Hosting-, Datenbank- und Kommunikationsdienstleister. Formulardaten werden validiert und zugriffsgeschützt.",
    termsIntro: "Diese Bedingungen erklären, wie aus einer Anfrage eine bestätigte Reservierung wird.", requestTitle: "Anfrage und Verfügbarkeit", requestText: "Wählen Sie ein oder mehrere Zimmer oder alle vier Zimmer als ganze Villa. Die Anfrage wird erst nach Live-Prüfung von Verfügbarkeit und Preis erstellt.", paymentTitle: "Zahlung und Bestätigung", paymentText: "Der vollständig angezeigte Betrag muss bis zur Zahlungsfrist eingehen. Nach Erfassung des Zahlungseingangs wird die Reservierung bestätigt; unbezahlte Anfragen verfallen automatisch.", stayTitle: "An- und Abreise", stayText: "Die aktuellen Zeiten stehen unten. Gäste müssen korrekte Angaben machen, die Kapazität beachten und Unterkunft sowie Ausstattung verantwortungsvoll nutzen.", accuracyTitle: "Preise und Korrekturen", accuracyText: "Der Gesamtbetrag ergibt sich aus Zimmern, Daten, Monatsraten, Kindergebühr und Haustiergebühr. Bei einem eindeutigen technischen Preisfehler erfolgt vor Bestätigung eine Kontaktaufnahme.",
    cancellationIntro: "Wenn Sie eine Reservierung stornieren oder ändern möchten, kontaktieren Sie uns direkt und nennen Sie Ihre Reservierungsreferenz.", freeCancellationTitle: "Stornierung anfragen", freeCancellationText: "Senden Sie Ihre Stornierungs- oder Änderungsanfrage an die oben angegebene E-Mail-Adresse. Geben Sie die Reservierungsreferenz und die bei der Buchung verwendete E-Mail-Adresse an.", lateCancellationTitle: "Kontaktieren Sie uns möglichst früh", lateCancellationText: "Wir prüfen die für Ihre Reservierung geltenden Bedingungen und bestätigen Ihnen die nächsten Schritte direkt.", refundTitle: "Erstattungsdauer", refundText: "Genehmigte Erstattungen gehen nach Prüfung auf das ursprüngliche Überweisungskonto zurück; Banklaufzeiten können anfallen.", ownerCancellationTitle: "Stornierung durch den Betreiber", ownerCancellationText: "Kann der bestätigte Aufenthalt nicht bereitgestellt werden, werden die dafür erhaltenen Zahlungen vollständig erstattet.",
  },
  hu: {
    skipToContent: "Ugrás a fő tartalomra", menuTitle: "Menü", menuDescription: "Navigáció és nyelvválasztás a Harmony Balaton Villa oldalán.", bookingDataError: "Az élő elérhetőség és az árak nem tölthetők be. Kérjük, próbálja újra.", retry: "Újra",
    policyAgreement: "Elolvastam és elfogadom a foglalási feltételeket, a lemondási szabályzatot és az adatkezelési tájékoztatót.", policyRequired: "A folytatáshoz fogadja el a foglalási és adatkezelési feltételeket.", policyLinks: "Szabályzatok megtekintése", holdDeadline: "Fizetési határidő", holdExplanation: "A kiválasztott szobákat eddig tartjuk fenn. Ha az átutalás nem érkezik meg időben, a kérés automatikusan lejár.", trackBooking: "Foglalás állapotának ellenőrzése",
    policies: "Szabályzatok", privacy: "Adatkezelési tájékoztató", bookingTerms: "Foglalási feltételek", cancellation: "Lemondási szabályzat",
    statusTitle: "Foglalás ellenőrzése", statusIntro: "Adja meg a hivatkozási kódot és a kérésnél használt e-mail-címet.", reference: "Foglalási hivatkozás", email: "E-mail-cím", checkStatus: "Állapot ellenőrzése", statusNotFound: "Nem található egyező foglalás. Ellenőrizze a hivatkozást és az e-mail-címet.", statusError: "A foglalás állapota nem tölthető be. Próbálja újra.", statusLabels: { payment_pending: "Fizetésre vár", confirmed: "Megerősítve", cancelled: "Lemondva", expired: "Lejárt" }, paymentLabels: { awaiting_transfer: "Átutalásra vár", received: "Fizetés beérkezett", refunded: "Visszatérítve" }, arrivalDeparture: "Tartózkodás", rooms: "Kiválasztott szobák", total: "Összesen", policyUpdated: "Működési szabályzat · frissítve: 2026. október",
    privacyIntro: "A tájékoztató bemutatja a foglalási és kapcsolatfelvételi űrlapokon megadott adatok kezelését.", controllerTitle: "Adatkezelő", controllerText: "Az adatkezelő az alább megjelölt szálláshely-üzemeltető. Adatvédelmi kérdéseit a megadott e-mail-címre küldheti.", dataTitle: "Kezelt adatok", dataText: "A nevet, e-mail-címet, telefonszámot, tartózkodási adatokat, szobaválasztást, vendégszámot, megjegyzéseket és a kérés kezeléséhez szükséges műveleti adatokat kezeljük.", purposeTitle: "Cél és jogalap", purposeText: "Az adatokat megkeresések megválaszolására, a szállásszerződés előkészítésére és teljesítésére, fizetéskezelésre, visszaélés-megelőzésre és jogi kötelezettségekre használjuk.", retentionTitle: "Megőrzési idő", retentionText: "A foglalási és ügyfélszolgálati adatokat az alább jelzett ideig őrizzük, kivéve, ha jogszabály hosszabb időt ír elő; ezután töröljük vagy anonimizáljuk.", rightsTitle: "Az Ön jogai", rightsText: "Kérhet hozzáférést, helyesbítést, törlést, korlátozást vagy hordozhatóságot, és adott esetben tiltakozhat. Panasszal a NAIH-hoz fordulhat.", securityTitle: "Biztonság és címzettek", securityText: "Csak jogosult adminisztrátorok és a tárhelyhez, adatbázishoz, kommunikációhoz szükséges szolgáltatók férhetnek hozzá. Az űrlapadatokat ellenőrizzük és hozzáférés-védelemmel kezeljük.",
    termsIntro: "A feltételek bemutatják, hogyan lesz a kérésből megerősített foglalás.", requestTitle: "Kérés és elérhetőség", requestText: "Válasszon egy vagy több szobát, vagy mind a négyet teljes villaként. Kérés csak az élő elérhetőség- és árellenőrzés után jön létre.", paymentTitle: "Fizetés és megerősítés", paymentText: "A teljes megjelenített összegnek a határidőig be kell érkeznie. A foglalást a fizetés beérkezésének rögzítése után erősítjük meg; a nem fizetett kérés automatikusan lejár.", stayTitle: "Érkezés és távozás", stayText: "Az aktuális időpontok alább láthatók. A vendégek pontos adatokat adnak meg, betartják a kapacitást, és felelősen használják a szállást és a felszerelést.", accuracyTitle: "Árak és javítások", accuracyText: "A végösszeg a kiválasztott szobákból, dátumokból, havi árakból, gyermekdíjból és kisállatdíjból áll. Egyértelmű technikai árhiba esetén megerősítés előtt felvesszük Önnel a kapcsolatot.",
    cancellationIntro: "Foglalás lemondásához vagy módosításához lépjen velünk közvetlenül kapcsolatba, és adja meg a foglalási hivatkozást.", freeCancellationTitle: "Lemondási kérelem", freeCancellationText: "A lemondási vagy módosítási kérelmet küldje a fent megadott e-mail-címre. Adja meg a foglalási hivatkozást és a foglalásnál használt e-mail-címet.", lateCancellationTitle: "Minél előbb lépjen kapcsolatba velünk", lateCancellationText: "Ellenőrizzük a foglalására vonatkozó feltételeket, és közvetlenül visszajelzünk a további lépésekről.", refundTitle: "Visszatérítés", refundText: "A jóváhagyott visszatérítést ellenőrzés után az eredeti átutalási számlára küldjük; banki átfutási idő előfordulhat.", ownerCancellationTitle: "Üzemeltetői lemondás", ownerCancellationText: "Ha a megerősített tartózkodás nem biztosítható, az arra kapott összeget teljes egészében visszatérítjük.",
  },
  tr: {
    skipToContent: "Ana içeriğe geç", menuTitle: "Menü", menuDescription: "Harmony Balaton Villa sayfalarında gezinin ve dilinizi seçin.", bookingDataError: "Canlı müsaitlik ve fiyatlar yüklenemedi. Tarih seçmeden önce yeniden deneyin.", retry: "Yeniden dene",
    policyAgreement: "Rezervasyon koşullarını, iptal politikasını ve gizlilik bildirimini okudum ve kabul ediyorum.", policyRequired: "Devam etmek için rezervasyon ve gizlilik koşullarını kabul edin.", policyLinks: "Politikaları görüntüle", holdDeadline: "Son ödeme zamanı", holdExplanation: "Seçtiğiniz odalar bu zamana kadar sizin için tutulur. Havale zamanında ulaşmazsa talep otomatik olarak sona erer.", trackBooking: "Rezervasyon durumunu kontrol et",
    policies: "Politikalar", privacy: "Gizlilik bildirimi", bookingTerms: "Rezervasyon koşulları", cancellation: "İptal politikası",
    statusTitle: "Rezervasyonunuzu kontrol edin", statusIntro: "Talep sırasında kullandığınız referans kodunu ve e-posta adresini girin.", reference: "Rezervasyon referansı", email: "E-posta adresi", checkStatus: "Durumu kontrol et", statusNotFound: "Eşleşen rezervasyon bulunamadı. Referansı ve e-posta adresini kontrol edin.", statusError: "Rezervasyon durumu yüklenemedi. Lütfen yeniden deneyin.", statusLabels: { payment_pending: "Ödeme bekleniyor", confirmed: "Onaylandı", cancelled: "İptal edildi", expired: "Süresi doldu" }, paymentLabels: { awaiting_transfer: "Havale bekleniyor", received: "Ödeme alındı", refunded: "İade edildi" }, arrivalDeparture: "Konaklama tarihleri", rooms: "Seçilen odalar", total: "Toplam", policyUpdated: "İşletme politikası · son güncelleme Ekim 2026",
    privacyIntro: "Bu bildirim, rezervasyon ve iletişim formlarında paylaşılan bilgilerin nasıl işlendiğini açıklar.", controllerTitle: "Veri sorumlusu", controllerText: "Aşağıda bilgileri bulunan konaklama işletmecisi veri sorumlusudur. Gizlilik sorularınızı belirtilen iletişim e-postasına gönderebilirsiniz.", dataTitle: "Topladığımız veriler", dataText: "Ad, e-posta, telefon, konaklama tarihleri, oda seçimi, misafir sayıları, notlar ve talebin yönetilmesi için gereken işlem kayıtlarını işleriz.", purposeTitle: "Amaç ve hukuki dayanak", purposeText: "Verileri soruları yanıtlamak, konaklama sözleşmesini hazırlamak ve yürütmek, ödemeyi takip etmek, kötüye kullanımı önlemek ve yasal yükümlülükleri yerine getirmek için kullanırız.", retentionTitle: "Saklama süresi", retentionText: "Rezervasyon ve destek kayıtları, daha uzun bir yasal süre gerekmedikçe aşağıda belirtilen süre boyunca saklanır; ardından silinir veya anonimleştirilir.", rightsTitle: "Haklarınız", rightsText: "Erişim, düzeltme, silme, kısıtlama veya taşınabilirlik talep edebilir ve uygun durumlarda itiraz edebilirsiniz. Macaristan veri koruma kurumu NAIH'e şikâyette bulunabilirsiniz.", securityTitle: "Güvenlik ve alıcılar", securityText: "Erişim yalnızca yetkili yöneticiler ile barındırma, veritabanı ve iletişim için gereken hizmet sağlayıcılarla sınırlıdır. Form verileri doğrulanır ve erişim kontrolleriyle korunur.",
    termsIntro: "Bu koşullar, rezervasyon talebinin nasıl onaylı rezervasyona dönüştüğünü açıklar.", requestTitle: "Talep ve müsaitlik", requestText: "Bir veya daha fazla oda ya da tüm villa için dört odanın tamamını seçebilirsiniz. Talep, canlı müsaitlik ve fiyat kontrolü başarıyla tamamlandıktan sonra oluşturulur.", paymentTitle: "Ödeme ve onay", paymentText: "Ekranda gösterilen toplam tutarın son ödeme zamanına kadar ulaşması gerekir. Ödeme alındı olarak işaretlendiğinde rezervasyon onaylanır; ödenmeyen talep süre sonunda otomatik kapanır.", stayTitle: "Giriş, çıkış ve kullanım", stayText: "Güncel giriş ve çıkış saatleri aşağıda gösterilir. Misafirler doğru bilgi vermeli, kapasiteye uymalı ve tesisi sorumlu biçimde kullanmalıdır.", accuracyTitle: "Fiyatlar ve düzeltmeler", accuracyText: "Toplam tutar; seçilen odalar, tarihler, yönetim panelindeki aylık fiyatlar, çocuk ücreti ve evcil hayvan ücretinden hesaplanır. Açık bir teknik fiyat hatası oluşursa onaydan önce sizinle iletişime geçilir.",
    cancellationIntro: "Rezervasyonunuzu iptal etmek veya değiştirmek için bizimle doğrudan iletişime geçin ve rezervasyon referansınızı paylaşın.", freeCancellationTitle: "İptal talebi oluşturun", freeCancellationText: "İptal veya değişiklik talebinizi yukarıdaki iletişim e-postasına gönderin. Rezervasyon referansınızı ve rezervasyonda kullandığınız e-posta adresini ekleyin.", lateCancellationTitle: "En kısa sürede iletişime geçin", lateCancellationText: "Rezervasyonunuza uygulanan koşulları kontrol edip sonraki adımları sizinle doğrudan paylaşırız.", refundTitle: "İade süreci", refundText: "Uygun olması halinde iade tutarı ve işlem süresi incelemeden sonra tarafınıza bildirilir.", ownerCancellationTitle: "İşletmecinin iptali", ownerCancellationText: "İşletmeci onaylı konaklamayı sağlayamazsa ilgili rezervasyon için alınan ödeme tamamen iade edilir.",
  },
};
