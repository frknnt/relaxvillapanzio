"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Loader2,
  MessageCircle,
  Minus,
  Plus,
  Search,
} from "lucide-react";

import { AvailabilityCalendar } from "@/components/booking/availability-calendar";
import { useLanguage } from "@/components/site/language-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { VillaFeaturesSection } from "@/components/site/villa-features-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  calculateBookingQuote,
  formatMoney,
  rangeContainsBlockedDate,
} from "@/lib/booking/pricing";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import {
  PUBLIC_BOOKING_SETTINGS_COLUMNS,
  PUBLIC_MONTHLY_RATE_COLUMNS,
} from "@/lib/supabase/public-columns";
import type {
  AvailabilityRange,
  BookingResult,
  BookingSettings,
  MonthlyRate,
} from "@/lib/supabase/types";
import { type Language, siteCopy } from "./site-content";
import { BANK_IBAN, WHATSAPP_NUMBER } from "./site-config";

const roomImages = [
  "/images/gallery/bedroom-1-01.jpg",
  "/images/gallery/bedroom-2-01.jpg",
  "/images/gallery/bedroom-3-01.jpg",
  "/images/gallery/bedroom-4-01.jpg",
];

function GuestCounter({
  value,
  onChange,
  label,
  hero = false,
  min = 0,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  hero?: boolean;
  min?: number;
}) {
  return (
    <div className={`flex min-w-0 flex-1 justify-between ${hero ? "flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-2" : "items-center gap-2"}`}>
      <span className="truncate text-sm font-medium text-[#2b2c30]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid size-7 place-items-center rounded-full border border-[#dcd7cf] transition hover:border-[#a08f6d] hover:text-[#8b7958]"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(20, value + 1))}
          className="grid size-7 place-items-center rounded-full border border-[#dcd7cf] transition hover:border-[#a08f6d] hover:text-[#8b7958]"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null);
  const [monthlyRates, setMonthlyRates] = useState<MonthlyRate[]>([]);
  const [availabilityRanges, setAvailabilityRanges] = useState<AvailabilityRange[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    website: "",
  });
  const t = siteCopy[language];
  const today = useMemo(() => localDateString(new Date()), []);
  const maxBookingDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 730);
    return localDateString(date);
  }, []);

  const loadBookingData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setAvailabilityLoading(false);
      return;
    }

    setAvailabilityLoading(true);
    const supabase = getSupabaseBrowserClient();
    const until = new Date();
    until.setFullYear(until.getFullYear() + 2);

    const [settingsResult, ratesResult, availabilityResult] = await Promise.all([
      supabase
        .from("booking_settings")
        .select(PUBLIC_BOOKING_SETTINGS_COLUMNS)
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("monthly_rates")
        .select(PUBLIC_MONTHLY_RATE_COLUMNS)
        .eq("active", true)
        .order("month"),
      supabase.rpc("get_availability", {
        p_from: today,
        p_to: localDateString(until),
      }),
    ]);

    if (settingsResult.data) {
      setBookingSettings(settingsResult.data as BookingSettings);
    }
    if (ratesResult.data) {
      setMonthlyRates(ratesResult.data as MonthlyRate[]);
    }
    if (availabilityResult.data) {
      setAvailabilityRanges(availabilityResult.data as AvailabilityRange[]);
    }

    setAvailabilityLoading(false);
  }, [today]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBookingData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadBookingData]);

  const scrollTo = (target: string) => {
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const quote = useMemo(
    () =>
      calculateBookingQuote({
        arrival,
        departure,
        pets,
        rates: monthlyRates,
        settings: bookingSettings,
      }),
    [arrival, departure, pets, monthlyRates, bookingSettings],
  );

  const startBooking = () => {
    if (!arrival || !departure || departure <= arrival) {
      setFormError(t.dateError);
      return;
    }

    if (rangeContainsBlockedDate(arrival, departure, availabilityRanges)) {
      setFormError(t.dateUnavailable);
      return;
    }

    if (!quote?.complete) {
      setFormError(t.priceMissing);
      return;
    }

    if (quote.nights < quote.minimumNights) {
      setFormError(`${t.minimumNights}: ${quote.minimumNights}`);
      return;
    }

    if (quote.nights > 60) {
      setFormError(t.maximumStay);
      return;
    }

    if (
      bookingSettings &&
      adults + children > bookingSettings.max_guests
    ) {
      setFormError(`${t.maximumGuests}: ${bookingSettings.max_guests}`);
      return;
    }

    setFormError("");
    setDialogError("");
    setBookingResult(null);
    setPaymentOpen(true);
  };

  const submitReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quote?.complete || !bookingSettings || bookingSubmitting) return;

    setBookingSubmitting(true);
    setDialogError("");

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("create_reservation", {
      p_guest_name: guestForm.name,
      p_email: guestForm.email,
      p_phone: guestForm.phone,
      p_language: language,
      p_check_in: arrival,
      p_check_out: departure,
      p_adults: adults,
      p_children: children,
      p_pets: pets,
      p_notes: guestForm.notes,
      p_website: guestForm.website,
    });

    setBookingSubmitting(false);

    if (error) {
      if (error.message.includes("DATES_UNAVAILABLE") || error.code === "23P01") {
        setDialogError(t.dateUnavailable);
        void loadBookingData();
      } else if (error.message.includes("RATE_NOT_CONFIGURED")) {
        setDialogError(t.priceMissing);
      } else if (error.message.includes("MINIMUM_NIGHTS_NOT_MET")) {
        setDialogError(`${t.minimumNights}: ${quote.minimumNights}`);
      } else if (error.message.includes("TOO_MANY_GUESTS")) {
        setDialogError(`${t.maximumGuests}: ${bookingSettings.max_guests}`);
      } else if (error.message.includes("STAY_TOO_LONG")) {
        setDialogError(t.maximumStay);
      } else if (error.message.includes("RATE_LIMITED")) {
        setDialogError(t.bookingRateLimited);
      } else {
        setDialogError(t.bookingError);
      }
      return;
    }

    const result = (data?.[0] ?? null) as BookingResult | null;
    if (!result) {
      setDialogError("Reservation could not be created.");
      return;
    }

    setBookingResult(result);
    setAvailabilityRanges((current) => [
      ...current,
      { source: "reservation", start_date: arrival, end_date: departure },
    ]);
  };

  const effectiveIban = bookingSettings?.iban || BANK_IBAN;
  const effectiveWhatsapp = bookingSettings?.whatsapp_number || WHATSAPP_NUMBER;
  const paymentDetails = [
    { key: "beneficiary", label: t.accountHolder, value: bookingSettings?.bank_beneficiary || "" },
    { key: "bank", label: t.bankNameLabel, value: bookingSettings?.bank_name || "" },
    { key: "account", label: t.bankAccountNumber, value: bookingSettings?.bank_account_number || "" },
    { key: "iban", label: t.iban, value: effectiveIban },
    { key: "bic", label: t.bicSwift, value: bookingSettings?.bic_swift || "" },
  ].filter((detail) => detail.value);

  const whatsappUrl = useMemo(() => {
    const message = [
      "Relax Villa booking / payment receipt",
      bookingResult ? `${t.bookingReference}: ${bookingResult.reference_code}` : null,
      `${t.arrival}: ${arrival || "-"}`,
      `${t.departure}: ${departure || "-"}`,
      `${t.guests}: ${adults + children}`,
      `${t.pets}: ${pets}`,
      bookingResult
        ? `${t.bookingTotal}: ${formatMoney(bookingResult.total_price, bookingResult.currency, language)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return effectiveWhatsapp
      ? `https://wa.me/${effectiveWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      : "#";
  }, [arrival, departure, adults, children, pets, t, bookingResult, effectiveWhatsapp, language]);

  const copyPaymentDetail = async (key: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(key);
    window.setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <main id="top" className="overflow-hidden bg-white text-[#26272b]">
      <section className="relative min-h-[760px] text-white sm:min-h-[720px] lg:min-h-[680px]">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero-mobile.jpg" />
          <img
            src="/images/hero.jpg"
            alt={t.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,22,23,.58)_0%,rgba(18,20,21,.22)_42%,rgba(12,14,16,.68)_100%)]" />
        <SiteHeader overlay />

        <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1500px] flex-col items-center justify-center px-4 pb-16 pt-32 text-center sm:min-h-[720px] sm:px-10 sm:pb-20 sm:pt-36 lg:min-h-[680px] lg:pb-24">
          <p className="mb-5 max-w-full text-balance text-[10px] font-semibold uppercase leading-5 tracking-[.22em] text-[#d3c19f] sm:text-xs sm:tracking-[.36em]">
            {t.heroEyebrow}
          </p>
          <h1 className="hero-title w-full max-w-5xl break-words text-balance text-[clamp(2.05rem,5.6vw,5.7rem)] font-extrabold uppercase leading-[.98] tracking-[-.045em]">
            {t.heroTitle}
          </h1>
          <p className="hero-copy mt-6 w-full max-w-2xl text-balance text-base leading-7 text-white/80 md:text-lg">
            {t.heroText}
          </p>
          <div className="hero-address mt-5 max-w-full break-words text-center text-[9px] uppercase leading-5 tracking-[.12em] text-white/70 sm:text-xs sm:tracking-[.18em]">
            8257 Badacsonytomaj, Füredi út 5
          </div>

          <div className="mt-9 w-full max-w-[1344px] rounded-[5px] bg-white p-1.5 text-[#24262d] shadow-[0_20px_55px_rgba(8,9,10,.32)] sm:mt-11">
            <div className="grid grid-cols-2 lg:grid-cols-[minmax(290px,1.05fr)_minmax(150px,.65fr)_minmax(160px,.7fr)_minmax(160px,.7fr)_minmax(170px,.72fr)]">
              <div className="col-span-2 flex min-w-0 border-b border-[#e9e6e1] lg:col-span-1 lg:border-b-0 lg:border-r">
                <HeroDateField
                  label={t.arrival}
                  value={arrival}
                  min={today}
                  max={maxBookingDate}
                  onChange={setArrival}
                />
                <div className="my-3 w-px bg-[#e9e6e1]" aria-hidden="true" />
                <HeroDateField
                  label={t.departure}
                  value={departure}
                  min={arrival || today}
                  max={maxBookingDate}
                  onChange={setDeparture}
                />
              </div>
              <div className="flex min-h-18 min-w-0 items-center border-r border-[#e9e6e1] px-3 lg:px-3">
                <GuestCounter value={adults} onChange={setAdults} label={t.adults} hero min={1} />
              </div>
              <div className="flex min-h-18 min-w-0 items-center px-3 lg:border-r lg:border-[#e9e6e1]">
                <GuestCounter value={children} onChange={setChildren} label={t.children} hero />
              </div>
              <div className="flex min-h-18 min-w-0 items-center border-r border-[#e9e6e1] px-3">
                <GuestCounter value={pets} onChange={setPets} label={t.pets} hero />
              </div>
              <button
                type="button"
                onClick={() => scrollTo("availability")}
                className="flex min-h-18 items-center justify-center gap-2 rounded-[3px] bg-[#30343a] px-4 text-xs font-semibold uppercase tracking-[.12em] text-white transition hover:bg-[#a08f6d] lg:min-h-18"
              >
                <Search className="size-4" />
                {t.availability}
              </button>
            </div>
          </div>
        </div>
      </section>

      <AboutSection t={t} />
      <MoodSection t={t} />

      <section
        id="gallery"
        className="scroll-mt-16 bg-[#faf8f5] px-6 py-28 sm:px-10 md:py-36 lg:px-16"
      >
        <div className="mx-auto max-w-[1630px]">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow">{t.roomsEyebrow}</p>
            <h2 className="section-title mt-4">{t.roomsTitle}</h2>
            <p className="mt-5 text-base leading-7 text-[#737477]">{t.roomsText}</p>
          </div>
          <div className="grid min-h-[590px] gap-6 lg:grid-cols-[1.55fr_1fr_1fr_1fr]">
            {roomImages.map((image, index) => (
              <button
                key={image}
                onClick={() => setGalleryImage(image)}
                className="group relative min-h-[430px] overflow-hidden rounded-[8px] text-left shadow-[0_18px_45px_rgba(28,29,31,.12)] lg:min-h-0"
              >
                <img
                  src={image}
                  alt={`${t.roomNames[index]} — ${t.imageAlt}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,17,20,.82)_100%)]" />
                <span className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.16em] text-white/70">
                    {t.included}
                  </span>
                  <span className="block text-2xl font-bold tracking-tight">
                    {t.roomNames[index]}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <Link
              href="/rooms"
              className="group inline-flex items-center gap-3 rounded-full border border-[#2d2f33] px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-[#2d2f33] hover:text-white"
            >
              {t.gallery}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <VillaFeaturesSection t={t} />
      <TestimonialsSection t={t} />

      <section
        id="availability"
        className="scroll-mt-0 bg-[#faf8f5] px-6 py-28 sm:px-10 md:py-36 lg:px-16"
      >
        <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-[.72fr_1.28fr]">
          <div className="max-w-xl">
            <p className="eyebrow">{t.bookingEyebrow}</p>
            <h2 className="section-title mt-4">{t.bookingTitle}</h2>
            <p className="mt-6 text-base leading-7 text-[#6f7073]">
              {t.bookingText}
            </p>
            <div className="mt-10 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-[#b6a47f] text-[#9a8866]">
                <MessageCircle className="size-5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9a8866]">
                  {t.bookingHelp}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  8257 Badacsonytomaj · Füredi út 5
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[8px] bg-[#f1ede7] p-4 shadow-[0_16px_45px_rgba(38,39,43,.07)] sm:p-7">
              <div className="overflow-hidden rounded-[5px] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece8e2] px-5 py-4 sm:px-7">
                  <h3 className="text-sm font-bold uppercase tracking-[.12em]">
                    {t.selectDates}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-xs text-[#747570]">
                    <span className={`size-2 rounded-full ${availabilityLoading ? "animate-pulse bg-amber-500" : "bg-emerald-500"}`} />
                    {availabilityLoading ? t.availabilityLoading : t.availability}
                  </span>
                </div>
                <AvailabilityCalendar
                  arrival={arrival}
                  departure={departure}
                  ranges={availabilityRanges}
                  rates={monthlyRates}
                  locale={language}
                  onChange={(nextArrival, nextDeparture) => {
                    setArrival(nextArrival);
                    setDeparture(nextDeparture);
                    setFormError("");
                  }}
                />
                {!availabilityLoading && monthlyRates.length === 0 ? (
                  <div className="mx-5 mb-5 flex items-start gap-3 rounded-md bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 sm:mx-7">
                    <AlertCircle className="mt-1 size-4 shrink-0" />
                    {t.noRates}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <DateField
                  label={t.arrival}
                  value={arrival}
                  min={today}
                  max={maxBookingDate}
                  onChange={setArrival}
                  compact
                />
                <DateField
                  label={t.departure}
                  value={departure}
                  min={arrival || today}
                  max={maxBookingDate}
                  onChange={setDeparture}
                  compact
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[4px] bg-white px-3 py-4">
                  <GuestCounter value={adults} onChange={setAdults} label={t.adults} min={1} />
                </div>
                <div className="rounded-[4px] bg-white px-3 py-4">
                  <GuestCounter value={children} onChange={setChildren} label={t.children} />
                </div>
                <div className="rounded-[4px] bg-white px-3 py-4">
                  <GuestCounter value={pets} onChange={setPets} label={t.pets} />
                </div>
              </div>
              {quote ? (
                <div className="mt-3 flex flex-col gap-3 rounded-[4px] bg-[#25282e] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-white/75">
                    <Clock3 className="size-4 text-[#d7c49f]" />
                    <span>
                      {quote.nights} {t.nightsLabel} · {t.minimumNights}: {quote.minimumNights}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#d7c49f]">
                      {t.bookingTotal}
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      {quote.complete
                        ? formatMoney(quote.total, quote.currency, language)
                        : t.priceMissing}
                    </p>
                    {quote.petFee > 0 ? (
                      <p className="mt-1 text-xs text-white/60">
                        {t.petFeeLabel}: {formatMoney(quote.petFee, quote.currency, language)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            {formError ? (
              <p role="alert" className="mt-4 text-right text-sm font-medium text-red-700">
                {formError}
              </p>
            ) : null}
            <div className="mt-7 flex justify-end">
              <OutlineAction onClick={startBooking}>{t.request}</OutlineAction>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <button
        onClick={() => scrollTo("top")}
        aria-label={t.top}
        className={`fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full border border-[#bcb5a8] bg-white/95 text-[#33353a] shadow-lg backdrop-blur transition duration-300 hover:bg-[#2d2f33] hover:text-white ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-4" />
      </button>

      <Dialog
        open={paymentOpen}
        onOpenChange={(open) => {
          setPaymentOpen(open);
          if (!open) {
            setDialogError("");
            setBookingResult(null);
          }
        }}
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[8px] border-0 bg-[#faf8f5] p-0 sm:max-w-2xl">
          <DialogHeader className="bg-[#25282e] px-5 py-7 pr-12 text-left text-white sm:px-8 sm:py-8 sm:pr-14">
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cfbb92]">
              Relax Villa · Badacsonytomaj
            </p>
            <DialogTitle className="mt-2 text-3xl font-bold tracking-tight">
              {bookingResult ? t.bookingCreated : t.guestDetails}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-white/65">
              {bookingResult ? t.paymentPending : t.paymentDescription}
            </DialogDescription>
          </DialogHeader>
          {!bookingResult ? (
            <form onSubmit={submitReservation} className="space-y-5 px-5 pb-7 sm:px-8 sm:pb-8">
              <div className="grid gap-3 rounded-[5px] bg-white p-4 text-sm text-[#5e6064] sm:grid-cols-2 sm:p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9a8866]">
                    {t.selectDates}
                  </p>
                  <p className="mt-1 font-semibold text-[#2f3135]">
                    {arrival} — {departure}
                  </p>
                  <p className="mt-1 text-xs text-[#77787b]">
                    {quote?.nights ?? 0} {t.nightsLabel}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#9a8866]">
                    {t.bookingTotal}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#2f3135]">
                    {quote
                      ? formatMoney(quote.total, quote.currency, language)
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-[#77787b]">
                    {t.adults}: {adults} · {t.children}: {children} · {t.pets}: {pets}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[#66686c] sm:col-span-2">
                  {t.guestName}
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    value={guestForm.name}
                    onChange={(event) =>
                      setGuestForm((current) => ({ ...current, name: event.target.value }))
                    }
                    className="min-h-12 rounded-[4px] border border-[#ded8cf] bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#2f3135] outline-none transition focus:border-[#9a8866] focus:ring-2 focus:ring-[#9a8866]/15"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[#66686c]">
                  {t.guestEmail}
                  <input
                    required
                    type="email"
                    maxLength={160}
                    autoComplete="email"
                    value={guestForm.email}
                    onChange={(event) =>
                      setGuestForm((current) => ({ ...current, email: event.target.value }))
                    }
                    className="min-h-12 rounded-[4px] border border-[#ded8cf] bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#2f3135] outline-none transition focus:border-[#9a8866] focus:ring-2 focus:ring-[#9a8866]/15"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[#66686c]">
                  {t.guestPhone}
                  <input
                    required
                    type="tel"
                    minLength={6}
                    maxLength={40}
                    autoComplete="tel"
                    value={guestForm.phone}
                    onChange={(event) =>
                      setGuestForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    className="min-h-12 rounded-[4px] border border-[#ded8cf] bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#2f3135] outline-none transition focus:border-[#9a8866] focus:ring-2 focus:ring-[#9a8866]/15"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[#66686c] sm:col-span-2">
                  {t.bookingNotes}
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={guestForm.notes}
                    onChange={(event) =>
                      setGuestForm((current) => ({ ...current, notes: event.target.value }))
                    }
                    className="resize-y rounded-[4px] border border-[#ded8cf] bg-white px-4 py-3 text-sm font-normal normal-case leading-6 tracking-normal text-[#2f3135] outline-none transition focus:border-[#9a8866] focus:ring-2 focus:ring-[#9a8866]/15"
                  />
                </label>
                <label className="absolute -left-[9999px]" aria-hidden="true">
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={guestForm.website}
                    onChange={(event) =>
                      setGuestForm((current) => ({ ...current, website: event.target.value }))
                    }
                  />
                </label>
              </div>

              {dialogError ? (
                <p role="alert" className="flex items-start gap-2 rounded-[4px] bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                  <AlertCircle className="mt-1 size-4 shrink-0" />
                  {dialogError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={bookingSubmitting}
                className="flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-[#2f3135] px-6 text-sm font-semibold text-white transition hover:bg-[#9a8866] disabled:cursor-wait disabled:opacity-65"
              >
                {bookingSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                {bookingSubmitting ? t.sendingReservation : t.createReservation}
              </button>
            </form>
          ) : (
            <div className="space-y-5 px-5 pb-7 sm:px-8 sm:pb-8">
              <div className="rounded-[5px] border border-amber-200 bg-amber-50 p-5 text-amber-950">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Clock3 className="size-4" />
                  {t.paymentPending}
                </p>
                <div className="mt-4 grid gap-4 border-t border-amber-200 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-amber-800/70">
                      {t.bookingReference}
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold">
                      {bookingResult.reference_code}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-amber-800/70">
                      {t.bookingTotal}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {formatMoney(
                        bookingResult.total_price,
                        bookingResult.currency,
                        language,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[5px] bg-white p-5 text-sm text-[#5e6064]">
                {t.steps.map((step, index) => (
                  <p key={step} className="flex items-center gap-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#a08f6d] text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </p>
                ))}
              </div>

              <div className="rounded-[5px] border border-[#ded8cf] bg-white p-5">
                {paymentDetails.length ? (
                  <div className="divide-y divide-[#ebe6de]">
                    {paymentDetails.map((detail) => (
                      <div key={detail.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9a8866]">
                            {detail.label}
                          </p>
                          <p className={`mt-1 break-all text-sm font-semibold text-[#33353a] ${["account", "iban", "bic"].includes(detail.key) ? "font-mono" : ""}`}>
                            {detail.value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void copyPaymentDetail(detail.key, detail.value)}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#ddd6ca] px-3 py-2 text-xs font-semibold"
                          aria-label={`${detail.label}: ${t.copyLabel}`}
                        >
                          {copiedField === detail.key ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                          <span className="hidden sm:inline">{copiedField === detail.key ? t.copied : t.copyLabel}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#747579]">{t.bankPending}</p>
                )}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!effectiveWhatsapp}
                className={`flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#1f9d62] px-6 text-center text-sm font-semibold text-white transition hover:bg-[#198754] ${
                  effectiveWhatsapp ? "" : "pointer-events-none opacity-45"
                }`}
              >
                <MessageCircle className="size-5" />
                {t.receiptWhatsApp}
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(galleryImage)}
        onOpenChange={(open) => !open && setGalleryImage(null)}
      >
        <DialogContent className="max-w-[min(1100px,calc(100%-2rem))] overflow-hidden border-0 bg-[#17191d] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.gallery}</DialogTitle>
            <DialogDescription>{t.roomsText}</DialogDescription>
          </DialogHeader>
          {galleryImage ? (
            <img
              src={galleryImage}
              alt={t.imageAlt}
              className="max-h-[86vh] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DateField({
  label,
  value,
  min,
  max,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 px-5 ${
        compact
          ? "min-h-16 rounded-[4px] bg-white"
          : "min-h-20 border-b border-[#ebe8e2] xl:border-b-0 xl:border-r"
      }`}
    >
      <CalendarDays className="size-4 shrink-0 text-[#a08f6d]" />
      <span className="sr-only">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-full bg-transparent text-sm outline-none"
      />
    </label>
  );
}

function HeroDateField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-h-18 min-w-0 flex-1 flex-col items-start justify-center gap-1 px-3 text-left sm:px-5">
      <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#8a7b60]">
        {label}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-full min-w-0 bg-transparent text-sm text-[#30343a] outline-none focus-visible:ring-2 focus-visible:ring-[#a08f6d]"
      />
    </label>
  );
}

function OutlineAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full border border-[#2d2f33] px-7 py-3.5 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-[#2d2f33] hover:text-white"
    >
      {children}
      <ArrowRight className="size-4 transition group-hover:translate-x-1" />
    </button>
  );
}

function AboutSection({ t }: { t: (typeof siteCopy)[Language] }) {
  return (
    <section
      id="villa"
      className="relative scroll-mt-0 px-6 pb-28 pt-24 sm:px-10 sm:pt-32 md:pb-36 lg:px-16"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_90%_40%,rgba(160,143,109,.10),transparent_55%)]" />
      <div className="relative mx-auto grid min-h-[720px] w-full max-w-[1500px] items-center gap-20 lg:grid-cols-[.82fr_1.18fr]">
        <div className="max-w-xl lg:pl-4">
          <p className="eyebrow">{t.aboutEyebrow}</p>
          <h2 className="section-title mt-5">{t.aboutTitle}</h2>
          <p className="mt-8 text-xl leading-8 text-[#55575b]">{t.aboutLead}</p>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#757579]">
            {t.aboutBody}
          </p>
          <p className="mt-9 font-serif text-2xl italic text-[#6e6251]">
            {t.signature}
          </p>
        </div>
        <div className="relative mx-auto h-[560px] w-full max-w-[700px]">
          <img
            src="/images/about-main.jpg"
            alt={t.imageAlt}
            className="absolute right-0 top-0 h-[90%] w-[72%] rounded-[8px] object-cover shadow-[0_20px_60px_rgba(26,26,26,.12)]"
          />
          <div className="absolute bottom-0 left-[4%] h-[62%] w-[42%] rounded-[7px] border-[7px] border-white bg-white shadow-[0_20px_45px_rgba(18,18,18,.22)]">
            <img
              src="/images/about-detail.jpg"
              alt={t.imageAlt}
              className="h-full w-full rounded-[2px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MoodSection({ t }: { t: (typeof siteCopy)[Language] }) {
  return (
    <section className="relative flex min-h-[620px] items-center justify-center px-6 py-28 text-center text-white">
      <img
        src="/images/mood.jpg"
        alt={t.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#11161a]/50" />
      <div className="relative max-w-4xl">
        <p className="eyebrow !text-[#decba5]">{t.moodEyebrow}</p>
        <h2 className="mt-5 whitespace-pre-line text-balance text-[clamp(2.1rem,4.5vw,4.6rem)] font-extrabold uppercase leading-[1.06] tracking-[-.035em]">
          {t.moodTitle}
        </h2>
      </div>
    </section>
  );
}

function TestimonialsSection({ t }: { t: (typeof siteCopy)[Language] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="testimonials"
      className="relative flex min-h-[430px] items-center px-6 py-10 text-white sm:px-10 md:min-h-[450px] md:py-12 lg:px-16"
    >
      <img
        src="/images/gallery/outdoor-04.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#131a1e]/65" />
      <div className="relative mx-auto w-full max-w-[1230px] text-center">
        <p className="eyebrow !text-[.68rem] !tracking-[.2em] !text-[#decba5]">{t.testimonialsEyebrow}</p>
        <h2 className="mt-2 text-balance text-[clamp(1.9rem,3vw,2.75rem)] font-bold tracking-[-.035em]">
          {t.testimonialsTitle}
        </h2>
        <div
          aria-live="polite"
          className="mx-auto mt-5 grid max-w-[720px] items-center gap-4 rounded-lg bg-[#25282e] px-5 py-5 text-left shadow-2xl sm:px-6 md:min-h-[145px] md:grid-cols-[160px_1fr] md:gap-5 md:px-7 md:py-6"
        >
          <div className="flex items-center gap-3 md:border-r md:border-white/20 md:pr-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e8dcc8] text-base font-bold text-[#25282e]">
              {t.testimonialNames[activeIndex].charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold">{t.testimonialNames[activeIndex]}</p>
              <p className="mt-0.5 text-xs text-white/65">
                {t.testimonialMeta[activeIndex]}
              </p>
            </div>
          </div>
          <blockquote className="text-balance text-base font-normal italic leading-[1.5] text-white md:text-[1.05rem]">
            “{t.testimonials[activeIndex]}”
          </blockquote>
        </div>
        <div className="mt-2 flex justify-center gap-0.5" aria-label={t.testimonialNavigation}>
          {t.testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${t.testimonialShow} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className="grid size-10 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className={`grid size-4 place-items-center rounded-full border ${index === activeIndex ? "border-white" : "border-white/55"}`}>
                <span className={`size-1.5 rounded-full ${index === activeIndex ? "bg-white" : "bg-transparent"}`} />
              </span>
            </button>
          ))}
        </div>
        {t.testimonialNotice ? (
          <p className="mx-auto mt-1 max-w-lg text-xs leading-4 text-white/70">
            {t.testimonialNotice}
          </p>
        ) : null}
      </div>
    </section>
  );
}
