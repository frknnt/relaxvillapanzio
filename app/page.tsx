"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Language, siteCopy } from "./site-content";

const WHATSAPP_NUMBER = "";
const BANK_IBAN = "";

const roomImages = [
  "/images/room-1.jpg",
  "/images/room-2.jpg",
  "/images/room-3.jpg",
  "/images/room-4.jpg",
];

const localImages = [
  "/images/local-1.jpg",
  "/images/local-2.jpg",
  "/images/local-3.jpg",
];

const facilityIcons = [Building2, BedDouble, CalendarDays, MessageCircle];

function GuestCounter({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4">
      <span className="truncate text-sm font-medium text-[#2b2c30]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="grid size-8 place-items-center rounded-full border border-[#dcd7cf] transition hover:border-[#a08f6d] hover:text-[#8b7958]"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(20, value + 1))}
          className="grid size-8 place-items-center rounded-full border border-[#dcd7cf] transition hover:border-[#a08f6d] hover:text-[#8b7958]"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function MiniCalendar({ month, offset = 0 }: { month: string; offset?: number }) {
  const days = Array.from({ length: 35 }, (_, index) => index - offset + 1);

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#2b2c30]">{month}</span>
        {offset > 1 ? <ChevronRight className="size-4 text-[#a08f6d]" /> : null}
      </div>
      <div className="mb-2 grid grid-cols-7 text-center text-[10px] uppercase tracking-wider text-[#9b9a96]">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-xs">
        {days.map((day, index) => {
          const visible = day > 0 && day <= 30;
          const selected =
            visible &&
            ((offset === 1 && day === 18) || (offset === 3 && day === 4));
          const ranged =
            visible &&
            ((offset === 1 && day > 18) || (offset === 3 && day < 4));

          return (
            <span
              key={index}
              className={`grid aspect-square place-items-center rounded-sm ${
                selected
                  ? "bg-[#a08f6d] font-semibold text-white"
                  : ranged
                    ? "bg-[#f0ede8] text-[#575757]"
                    : "text-[#676866]"
              }`}
            >
              {visible ? day : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [transferComplete, setTransferComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");
  const [showTop, setShowTop] = useState(false);
  const t = siteCopy[language];
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    document.documentElement.lang = language;
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [language]);

  const scrollTo = (target: string) => {
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const startBooking = () => {
    if (!arrival || !departure) {
      setFormError(t.dateError);
      return;
    }

    setFormError("");
    setPaymentOpen(true);
  };

  const whatsappUrl = useMemo(() => {
    const message = [
      "Relax Villa booking / payment receipt",
      `${t.arrival}: ${arrival || "-"}`,
      `${t.departure}: ${departure || "-"}`,
      `${t.guests}: ${adults + children}`,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [arrival, departure, adults, children, t]);

  const copyIban = async () => {
    if (!BANK_IBAN) return;
    await navigator.clipboard.writeText(BANK_IBAN);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main id="top" className="overflow-hidden bg-white text-[#26272b]">
      <section className="relative h-[100svh] min-h-[760px] max-h-[920px] overflow-hidden text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero-mobile.jpg" />
          <img
            src="/images/hero.jpg"
            alt={t.imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,22,23,.58)_0%,rgba(18,20,21,.22)_42%,rgba(12,14,16,.68)_100%)]" />

        <header className="relative z-20 mx-auto flex w-full max-w-[1630px] items-center justify-between px-5 py-7 sm:px-8 md:py-10">
          <button
            onClick={() => scrollTo("top")}
            aria-label="Relax Villa home"
            className="group flex items-center gap-3"
          >
            <span className="relative grid h-12 w-16 place-items-center">
              <span className="absolute left-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] border-white/25" />
              <span className="absolute right-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] border-[#ad9872] border-l-transparent" />
            </span>
            <span className="hidden text-left text-[11px] font-semibold uppercase leading-tight tracking-[.24em] sm:block">
              Relax
              <br />
              Villa
            </span>
          </button>

          <div className="hero-actions flex items-center gap-3">
            <div
              className="hidden items-center rounded-full border border-white/25 bg-black/10 p-1 backdrop-blur-md md:flex"
              aria-label="Choose language"
            >
              {(["en", "de", "hu"] as Language[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setLanguage(item)}
                  className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
                    language === item
                      ? "bg-white text-[#27282c]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button
              onClick={() => scrollTo("availability")}
              className="hidden h-11 rounded-full bg-[#aa9771] px-6 text-xs font-semibold uppercase tracking-[.14em] text-white hover:bg-[#95825f] sm:inline-flex"
            >
              {t.book}
            </Button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full border border-white/25 bg-black/10 backdrop-blur-md transition hover:bg-white hover:text-[#27282c]"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </header>

        <div
          className={`absolute right-[4%] top-24 z-30 w-[min(92vw,360px)] origin-top-right rounded-[2px] border border-white/15 bg-[#24262d]/95 p-7 shadow-2xl backdrop-blur-xl transition duration-300 ${
            menuOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }`}
        >
          <nav className="flex flex-col">
            {t.nav.map((item, index) => (
              <button
                key={item}
                onClick={() => scrollTo(t.navTargets[index])}
                className="border-b border-white/10 py-4 text-left text-sm font-semibold uppercase tracking-[.15em] text-white/75 transition hover:pl-2 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-6 flex gap-2 md:hidden">
            {(["en", "de", "hu"] as Language[]).map((item) => (
              <button
                key={item}
                onClick={() => setLanguage(item)}
                className={`flex-1 rounded-full border border-white/20 py-2 text-xs uppercase ${
                  language === item ? "bg-white text-[#24262d]" : "text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto flex h-[calc(100%-180px)] w-full max-w-[1250px] -translate-y-5 flex-col items-center justify-center px-5 text-center">
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
        </div>

        <div className="absolute bottom-0 left-1/2 z-20 w-[calc(100%-2rem)] max-w-[1360px] -translate-x-1/2 translate-y-1/2 bg-white text-[#24262d] shadow-[0_20px_60px_rgba(24,24,27,.2)] sm:w-[calc(100%-4rem)]">
          <div className="grid md:grid-cols-[1.1fr_1.1fr_.9fr_.9fr_auto]">
            <DateField
              label={t.arrival}
              value={arrival}
              min={today}
              onChange={setArrival}
            />
            <DateField
              label={t.departure}
              value={departure}
              min={arrival || today}
              onChange={setDeparture}
            />
            <div className="min-h-20 border-b border-[#ebe8e2] px-5 py-5 md:border-b-0 md:border-r">
              <GuestCounter value={adults} onChange={setAdults} label={t.guests} />
            </div>
            <div className="min-h-20 border-b border-[#ebe8e2] px-5 py-5 md:border-b-0 md:border-r">
              <GuestCounter value={children} onChange={setChildren} label={t.children} />
            </div>
            <button
              onClick={() => scrollTo("availability")}
              className="m-2 flex min-h-16 items-center justify-center gap-3 bg-[#30343a] px-7 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#a08f6d]"
            >
              <Search className="size-4" />
              {t.availability}
            </button>
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
            <OutlineAction onClick={() => setGalleryImage(roomImages[0])}>
              {t.gallery}
            </OutlineAction>
          </div>
        </div>
      </section>

      <FacilitiesSection t={t} />
      <StorySection t={t} />

      <section
        id="area"
        className="scroll-mt-12 px-6 py-28 sm:px-10 md:py-36 lg:px-16"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12">
            <p className="eyebrow">{t.localEyebrow}</p>
            <h2 className="section-title mt-4">{t.localTitle}</h2>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {t.localCards.map(([title, description], index) => (
              <article
                key={title}
                className="group overflow-hidden rounded-[7px] bg-white shadow-[0_12px_35px_rgba(31,31,31,.09)]"
              >
                <div className="relative aspect-[1.55] overflow-hidden">
                  <img
                    src={localImages[index]}
                    alt={title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 left-5 bg-[#25282e] px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-white">
                    0{index + 1} · LOCAL
                  </span>
                </div>
                <div className="grid min-h-56 grid-cols-[48px_1fr]">
                  <div className="border-r border-[#ece8e2] py-6 text-center text-[9px] font-semibold uppercase tracking-[.2em] text-[#9b8b6d] [writing-mode:vertical-rl]">
                    Badacsony
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold leading-7">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#77787b]">
                      {description}
                    </p>
                    <button
                      onClick={() => scrollTo("availability")}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#9b8968]"
                    >
                      {t.read}
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

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
              <div className="rounded-[5px] bg-white p-5 sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <button
                    aria-label="Previous month"
                    className="grid size-8 place-items-center rounded-full border border-[#ece8e2]"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <h3 className="text-sm font-bold uppercase tracking-[.12em]">
                    {t.selectDates}
                  </h3>
                  <button
                    aria-label="Next month"
                    className="grid size-8 place-items-center rounded-full border border-[#ece8e2]"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
                <div className="flex gap-8">
                  <MiniCalendar month="September 2026" offset={1} />
                  <div className="hidden w-px bg-[#ece8e2] sm:block" />
                  <div className="hidden flex-1 sm:block">
                    <MiniCalendar month="October 2026" offset={3} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <DateField
                  label={t.arrival}
                  value={arrival}
                  min={today}
                  onChange={setArrival}
                  compact
                />
                <DateField
                  label={t.departure}
                  value={departure}
                  min={arrival || today}
                  onChange={setDeparture}
                  compact
                />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
                <div className="flex min-h-16 items-center gap-3 rounded-[4px] bg-white px-5">
                  <Building2 className="size-4 text-[#9a8866]" />
                  <span className="text-sm font-medium">{t.entireVilla}</span>
                </div>
                <div className="rounded-[4px] bg-white px-4 py-4">
                  <GuestCounter value={adults} onChange={setAdults} label={t.adults} />
                </div>
                <div className="rounded-[4px] bg-white px-4 py-4">
                  <GuestCounter value={children} onChange={setChildren} label={t.children} />
                </div>
              </div>
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

      <Footer t={t} scrollTo={scrollTo} />

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

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[8px] border-0 bg-[#faf8f5] p-0 sm:max-w-2xl">
          <DialogHeader className="bg-[#25282e] px-8 py-8 pr-14 text-left text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cfbb92]">
              Relax Villa · Badacsonytomaj
            </p>
            <DialogTitle className="mt-2 text-3xl font-bold tracking-tight">
              {t.paymentTitle}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-white/65">
              {t.paymentDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 px-8 pb-8">
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
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9a8866]">
                    {t.iban}
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-[#33353a]">
                    {BANK_IBAN || t.bankPending}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyIban}
                  disabled={!BANK_IBAN}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ddd6ca] px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? t.copied : t.copyLabel}
                </button>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4d4f53]">
              <input
                type="checkbox"
                checked={transferComplete}
                onChange={(event) => setTransferComplete(event.target.checked)}
                className="size-4 accent-[#9a8866]"
              />
              {t.paid}
            </label>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!transferComplete}
              className={`flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#1f9d62] px-6 text-sm font-semibold text-white transition hover:bg-[#198754] ${
                transferComplete ? "" : "pointer-events-none opacity-45"
              }`}
            >
              <MessageCircle className="size-5" />
              {t.whatsapp}
            </a>
          </div>
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

function DateField({
  label,
  value,
  min,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-3 px-5 ${
        compact
          ? "min-h-16 rounded-[4px] bg-white"
          : "min-h-20 border-b border-[#ebe8e2] md:border-b-0 md:border-r"
      }`}
    >
      <CalendarDays className="size-4 shrink-0 text-[#a08f6d]" />
      <span className="sr-only">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="w-full bg-transparent text-sm outline-none"
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
      className="relative scroll-mt-0 px-6 pb-28 pt-64 sm:px-10 md:pb-36 md:pt-44 lg:px-16"
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

function FacilitiesSection({ t }: { t: (typeof siteCopy)[Language] }) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] px-6 pb-40 pt-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center">
          <p className="eyebrow">{t.facilitiesEyebrow}</p>
          <h2 className="section-title mt-4">{t.facilitiesTitle}</h2>
        </div>
        <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {t.facilities.map(([title, description], index) => {
            const Icon = facilityIcons[index];
            return (
              <div
                key={title}
                className="px-8 text-center lg:border-r lg:border-[#e5e0d8] lg:last:border-0"
              >
                <Icon strokeWidth={1.3} className="mx-auto size-11 text-[#a08f6d]" />
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#77787b]">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(4rem,10vw,11rem)] font-extrabold tracking-[-.06em] text-[#f0ede8]"
      >
        Private Holiday Together
      </div>
    </section>
  );
}

function StorySection({ t }: { t: (typeof siteCopy)[Language] }) {
  return (
    <section className="relative flex min-h-[650px] items-center px-6 py-28 text-white sm:px-10 lg:px-16">
      <img
        src="/images/story.jpg"
        alt={t.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#172026]/58" />
      <div className="relative mx-auto w-full max-w-[1230px] text-center">
        <p className="eyebrow !text-[#decba5]">{t.storyEyebrow}</p>
        <h2 className="mt-4 text-[clamp(2rem,3.5vw,3.6rem)] font-bold tracking-[-.035em]">
          {t.storyTitle}
        </h2>
        <div className="mx-auto mt-10 grid max-w-[1050px] items-center gap-8 bg-[#24272e]/95 px-8 py-10 text-left shadow-2xl md:grid-cols-[230px_1fr] md:px-12 md:py-12">
          <div className="flex items-center gap-4 md:border-r md:border-white/15 md:pr-8">
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#bba884] text-[#d7c49d]">
              <Building2 className="size-7" strokeWidth={1.4} />
            </span>
            <span className="text-[10px] font-semibold uppercase leading-5 tracking-[.17em] text-white/65">
              {t.storyMeta}
            </span>
          </div>
          <blockquote className="text-balance text-xl italic leading-8 text-white/90 md:text-2xl">
            “{t.storyQuote}”
          </blockquote>
        </div>
        <div className="mt-7 flex justify-center gap-2">
          <span className="size-2 rounded-full bg-white" />
          <span className="size-2 rounded-full border border-white/60" />
          <span className="size-2 rounded-full border border-white/60" />
        </div>
      </div>
    </section>
  );
}

function Footer({
  t,
  scrollTo,
}: {
  t: (typeof siteCopy)[Language];
  scrollTo: (target: string) => void;
}) {
  return (
    <footer
      id="contact"
      className="relative min-h-[510px] px-6 py-28 text-white sm:px-10 lg:px-16"
    >
      <img
        src="/images/footer.jpg"
        alt={t.imageAlt}
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div className="absolute inset-0 bg-[#20232a]/90" />
      <div className="relative mx-auto grid max-w-[1500px] gap-14 md:grid-cols-[1.1fr_.8fr_1.1fr]">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-white/20 text-sm font-bold text-[#d6c29b]">
              RV
            </span>
            <span className="text-sm font-semibold uppercase tracking-[.2em]">
              Relax Villa
            </span>
          </div>
          <h3 className="text-sm font-bold">{t.contact}</h3>
          <address className="mt-5 not-italic text-sm leading-7 text-white/65">
            8257 Badacsonytomaj
            <br />
            Füredi út 5 · {t.addressCountry}
            <br />
            {t.emailPlaceholder}
          </address>
        </div>
        <div>
          <h3 className="text-sm font-bold">{t.footerExplore}</h3>
          <nav className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            {t.nav.slice(0, 5).map((item, index) => (
              <button
                key={item}
                onClick={() => scrollTo(t.navTargets[index])}
                className="w-fit transition hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-bold">{t.footerBooking}</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            {t.footerNote}
          </p>
          <button
            onClick={() => scrollTo("availability")}
            className="mt-7 inline-flex items-center gap-3 border-b border-[#d2bd92] pb-2 text-xs font-semibold uppercase tracking-[.15em] text-[#d2bd92]"
          >
            {t.book}
            <ArrowRight className="size-4" />
          </button>
          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
            <span>{t.privacy}</span>
            <span>{t.terms}</span>
            <span>{t.cancellation}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
