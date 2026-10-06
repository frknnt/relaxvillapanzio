"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BedDouble, ChevronLeft, ChevronRight, DoorOpen, Maximize2, Users, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { galleryImages, type GalleryImage } from "@/app/rooms/gallery-data";
import { secondaryCopy } from "@/app/secondary-content";
import type { Language } from "@/app/site-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/booking/pricing";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { PUBLIC_BOOKING_SETTINGS_COLUMNS, PUBLIC_GALLERY_IMAGE_COLUMNS, PUBLIC_ROOM_COLUMNS, PUBLIC_ROOM_MONTHLY_RATE_COLUMNS } from "@/lib/supabase/public-columns";
import type { BookingSettings, GalleryImageRecord, RoomMonthlyRate, VillaRoom } from "@/lib/supabase/types";

const factCopy = {
  en: { capacity: "Up to {count} guests", bed: ["Double bed", "Double bed", "Two single beds", "Double + single bed"], bathroom: "Shared bathrooms nearby", climate: ["Skylight & TV", "Direct balcony access", "Flexible twin layout", "Air conditioning & balcony"], from: "From", cta: "Choose this room" },
  de: { capacity: "Bis zu {count} Gäste", bed: ["Doppelbett", "Doppelbett", "Zwei Einzelbetten", "Doppel- + Einzelbett"], bathroom: "Gemeinschaftsbäder in der Nähe", climate: ["Dachfenster & TV", "Direkter Balkonzugang", "Flexible Zweibettaufteilung", "Klimaanlage & Balkon"], from: "Ab", cta: "Dieses Zimmer wählen" },
  hu: { capacity: "Legfeljebb {count} vendég", bed: ["Franciaágy", "Franciaágy", "Két külön ágy", "Franciaágy + egyszemélyes ágy"], bathroom: "Közeli közös fürdőszobák", climate: ["Tetőablak és TV", "Közvetlen erkélykapcsolat", "Rugalmas kétágyas elrendezés", "Légkondicionáló és erkély"], from: "Ettől", cta: "Szoba kiválasztása" },
  tr: { capacity: "En fazla {count} misafir", bed: ["Çift kişilik yatak", "Çift kişilik yatak", "İki tek kişilik yatak", "Çift + tek kişilik yatak"], bathroom: "Yakındaki ortak banyolar", climate: ["Çatı penceresi ve TV", "Doğrudan balkon erişimi", "Esnek iki yataklı düzen", "Klima ve balkon"], from: "Başlangıç", cta: "Bu odayı seç" },
} satisfies Record<Language, { capacity: string; bed: string[]; bathroom: string; climate: string[]; from: string; cta: string }>;

function toGalleryImage(record: GalleryImageRecord): GalleryImage | null {
  if (
    record.category !== "bedrooms" &&
    record.category !== "shared" &&
    record.category !== "outdoors"
  ) {
    return null;
  }

  const src = record.public_url?.trim();
  if (!src) return null;

  const room =
    record.room === 1 || record.room === 2 || record.room === 3 || record.room === 4
      ? record.room
      : undefined;

  return {
    id: record.id,
    src,
    category: record.category,
    room,
    order: Number.isFinite(record.sort_order) ? record.sort_order : 0,
    alt: {
      en: record.alt_en,
      de: record.alt_de,
      hu: record.alt_hu,
      tr: record.alt_tr,
    },
    caption: {
      en: record.caption_en,
      de: record.caption_de,
      hu: record.caption_hu,
      tr: record.caption_tr,
    },
  };
}

function mergeGalleryImages(remoteImages: GalleryImage[]) {
  if (!remoteImages.length) return [...galleryImages];

  const seenSources = new Set<string>();
  return [...remoteImages, ...galleryImages].filter((image) => {
    const sourceKey = image.src.trim().toLocaleLowerCase();
    if (!sourceKey || seenSources.has(sourceKey)) return false;
    seenSources.add(sourceKey);
    return true;
  });
}

function getLocalizedGalleryText(
  image: GalleryImage,
  field: "alt" | "caption",
  language: Language,
) {
  const translations = image[field];
  if (!translations) return "";

  return (
    translations[language]?.trim() ||
    translations.en?.trim() ||
    translations.de?.trim() ||
    translations.hu?.trim() ||
    translations.tr?.trim() ||
    ""
  );
}

export function RoomsPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.rooms;
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [remoteImages, setRemoteImages] = useState<GalleryImage[]>([]);
  const [roomData, setRoomData] = useState<VillaRoom[]>([]);
  const [startingRates, setStartingRates] = useState<Record<number, number>>({});
  const [currency, setCurrency] = useState("HUF");
  const allGalleryImages = useMemo(() => mergeGalleryImages(remoteImages), [remoteImages]);
  const bedroomImageGroups = useMemo(
    () =>
      ([1, 2, 3, 4] as const).map((room) =>
        allGalleryImages.filter((image) => image.room === room),
      ),
    [allGalleryImages],
  );

  useEffect(() => {
    let isActive = true;

    async function loadGalleryImages() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("gallery_images")
          .select(PUBLIC_GALLERY_IMAGE_COLUMNS)
          .eq("visible", true)
          .in("category", ["bedrooms", "shared", "outdoors"])
          .order("category", { ascending: true })
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (isActive) {
          setRemoteImages(
            ((data ?? []) as GalleryImageRecord[])
              .map(toGalleryImage)
              .filter((image): image is GalleryImage => Boolean(image)),
          );
        }
      } catch {
        if (isActive) setRemoteImages([]);
      }
    }

    void loadGalleryImages();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const month = new Date().toISOString().slice(0, 7) + "-01";
    void Promise.all([
      getSupabaseBrowserClient().from("rooms").select(PUBLIC_ROOM_COLUMNS).eq("active", true).order("id"),
      getSupabaseBrowserClient().from("room_monthly_rates").select(PUBLIC_ROOM_MONTHLY_RATE_COLUMNS).eq("active", true).gte("month", month),
      getSupabaseBrowserClient().from("booking_settings").select(PUBLIC_BOOKING_SETTINGS_COLUMNS).eq("id", 1).maybeSingle(),
    ]).then(([roomsResult, ratesResult, settingsResult]) => {
      if (!active || roomsResult.error || ratesResult.error || settingsResult.error) return;
      setRoomData((roomsResult.data ?? []) as VillaRoom[]);
      const minimums: Record<number, number> = {};
      for (const rate of (ratesResult.data ?? []) as RoomMonthlyRate[]) {
        const value = Math.min(rate.weekday_rate, rate.weekend_rate);
        minimums[rate.room_id] = minimums[rate.room_id] === undefined ? value : Math.min(minimums[rate.room_id], value);
      }
      setStartingRates(minimums);
      if (settingsResult.data) setCurrency((settingsResult.data as BookingSettings).currency);
    });
    return () => { active = false; };
  }, []);

  const getImageAlt = (image: GalleryImage) => {
    const localizedAlt = getLocalizedGalleryText(image, "alt", language);
    if (localizedAlt) return localizedAlt;

    if (image.room) {
      return `${t.bedroomNames[image.room - 1]} — ${t.photoLabel} ${image.order}`;
    }

    const category =
      image.category === "bedrooms"
        ? t.galleryTabs.bedrooms
        : image.category === "shared"
          ? t.galleryTabs.shared
          : t.galleryTabs.outdoors;
    return `${category} — ${t.photoLabel} ${image.order}`;
  };

  const getImageCaption = (image: GalleryImage) =>
    getLocalizedGalleryText(image, "caption", language);

  const showAdjacentImage = (direction: -1 | 1) => {
    if (!activeImage) return;
    const currentIndex = allGalleryImages.findIndex((image) => image.src === activeImage.src);
    const nextIndex =
      (currentIndex + direction + allGalleryImages.length) % allGalleryImages.length;
    setActiveImage(allGalleryImages[nextIndex]);
  };

  const galleryTabs = [
    { value: "all", label: t.galleryTabs.all, images: allGalleryImages },
    {
      value: "bedrooms",
      label: t.galleryTabs.bedrooms,
      images: allGalleryImages.filter((image) => image.category === "bedrooms"),
    },
    {
      value: "shared",
      label: t.galleryTabs.shared,
      images: allGalleryImages.filter((image) => image.category === "shared"),
    },
    {
      value: "outdoors",
      label: t.galleryTabs.outdoors,
      images: allGalleryImages.filter((image) => image.category === "outdoors"),
    },
  ] as const;
  const activeImageIndex = activeImage
    ? allGalleryImages.findIndex((image) => image.src === activeImage.src)
    : -1;

  return (
    <>
      <SiteHeader overlay />
      <main id="main-content" className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <PageHero
          image="/images/gallery/bedroom-1-01.jpg"
          imageAlt={t.bedroomNames[0]}
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1500px] space-y-24 md:space-y-32">
          {bedroomImageGroups.map((images, index) => (
            <article
                  key={t.bedroomNames[index]}
              className={`grid items-center gap-10 lg:grid-cols-[1.3fr_.7fr] lg:gap-20 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative min-h-[440px] sm:min-h-[560px]">
                <button
                  type="button"
                  onClick={() => setActiveImage(images[0])}
                  aria-label={`${t.openImage}: ${t.bedroomNames[index]}`}
                  className="group absolute inset-0 overflow-hidden rounded-[8px] text-left shadow-[0_20px_55px_rgba(30,31,34,.12)]"
                >
                  <Image
                    src={images[0].src}
                    alt={t.bedroomNames[index]}
                    fill
                    unoptimized={images[0].src.startsWith("http")}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/90 text-[#2d2f33] shadow-md transition group-hover:bg-[#2d2f33] group-hover:text-white">
                    <Maximize2 className="size-4" />
                  </span>
                </button>
                {images[1] ? (
                  <button
                    type="button"
                    onClick={() => setActiveImage(images[1])}
                    aria-label={`${t.openImage}: ${t.bedroomNames[index]}`}
                    className="group absolute bottom-5 right-5 h-[38%] w-[38%] overflow-hidden rounded-[6px] border-[5px] border-white bg-white shadow-2xl"
                  >
                    <Image
                      src={images[1].src}
                      alt={t.bedroomNames[index]}
                      fill
                      unoptimized={images[1].src.startsWith("http")}
                      sizes="(min-width: 1024px) 20vw, 40vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </button>
                ) : null}
              </div>
              <div className="max-w-lg">
                <p className="eyebrow">0{index + 1} · {t.eyebrow}</p>
                <h2 className="mt-5 text-balance text-[clamp(2.3rem,4vw,4.2rem)] font-bold leading-[1.02] tracking-[-.05em]">
                  {t.bedroomNames[index]}
                </h2>
                <p className="mt-7 text-lg leading-8 text-[#696a6e]">{t.bedroomNotes[index]}</p>
                <div className="mt-7 grid gap-2 text-sm text-[#56575b] sm:grid-cols-2">
                  <p className="flex min-h-11 items-center gap-2 rounded-lg bg-[#f7f4ef] px-3"><Users className="size-4 text-[#806c45]" />{factCopy[language].capacity.replace("{count}", String(roomData.find((room) => room.id === index + 1)?.max_guests ?? [2, 2, 2, 3][index]))}</p>
                  <p className="flex min-h-11 items-center gap-2 rounded-lg bg-[#f7f4ef] px-3"><BedDouble className="size-4 text-[#806c45]" />{factCopy[language].bed[index]}</p>
                  <p className="flex min-h-11 items-center gap-2 rounded-lg bg-[#f7f4ef] px-3"><DoorOpen className="size-4 text-[#806c45]" />{factCopy[language].bathroom}</p>
                  <p className="flex min-h-11 items-center gap-2 rounded-lg bg-[#f7f4ef] px-3"><Wind className="size-4 text-[#806c45]" />{factCopy[language].climate[index]}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {startingRates[index + 1] !== undefined ? <p className="text-sm text-[#66676b]"><span className="font-semibold text-[#806c45]">{factCopy[language].from}</span> {formatMoney(startingRates[index + 1], currency, language)} / {language === "tr" ? "gece" : language === "de" ? "Nacht" : language === "hu" ? "éj" : "night"}</p> : null}
                  <Link href={`/?rooms=${index + 1}#availability`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#303238] px-5 text-xs font-semibold uppercase tracking-[.1em] text-white transition hover:bg-[#806c45]">{factCopy[language].cta}<ArrowRight className="size-4" /></Link>
                </div>
                <p className="mt-6 border-l-2 border-[#b6a27b] pl-5 text-sm font-semibold uppercase leading-6 tracking-[.12em] text-[#8f7e5e]">
                  {t.notice}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 max-w-3xl">
            <p className="eyebrow">{t.galleryEyebrow}</p>
            <h2 className="section-title mt-5">{t.galleryTitle}</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#737477]">{t.galleryText}</p>
          </div>

          <Tabs defaultValue="all" className="gap-0">
            <div className="pb-2">
              <TabsList
                variant="line"
                aria-label={t.galleryEyebrow}
                className="grid h-auto w-full grid-cols-2 gap-1 border-b border-[#ded8ce] p-0 sm:inline-flex sm:w-fit sm:min-w-max sm:gap-2"
              >
                {galleryTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="min-h-12 w-full flex-none rounded-none px-2 text-[10px] font-semibold uppercase tracking-[.1em] text-[#77787b] data-[state=active]:text-[#292b2f] sm:w-auto sm:px-6 sm:text-xs sm:tracking-[.12em]"
                  >
                    {tab.label}
                    <span className="text-[10px] text-[#a08f6d]">{tab.images.length}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {galleryTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-10">
                <div className="grid auto-rows-[155px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {tab.images.map((image, index) => {
                    const caption = getImageCaption(image);

                    return (
                      <button
                        key={image.id ?? image.src}
                        type="button"
                        onClick={() => setActiveImage(image)}
                        aria-label={`${t.openImage}: ${getImageAlt(image)}`}
                        className={`group relative overflow-hidden rounded-[7px] bg-[#ece8e1] text-left shadow-[0_10px_28px_rgba(31,31,31,.07)] outline-none transition focus-visible:ring-2 focus-visible:ring-[#a08f6d] focus-visible:ring-offset-4 ${
                          index % 11 === 0
                            ? "col-span-2 row-span-2"
                            : index % 7 === 3
                              ? "row-span-2"
                              : ""
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={getImageAlt(image)}
                          fill
                          unoptimized={image.src.startsWith("http")}
                          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/35" />
                        {caption ? (
                          <span className="absolute bottom-4 left-4 max-w-[calc(100%-4.75rem)] translate-y-2 text-xs font-semibold leading-5 text-white opacity-0 drop-shadow transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                            {caption}
                          </span>
                        ) : null}
                        <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/92 text-[#2d2f33] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Maximize2 className="size-4" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-12 flex justify-end">
            <Link
              href="/#availability"
              className="inline-flex min-h-13 items-center gap-3 rounded-full border border-[#2d2f33] px-7 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-[#2d2f33] hover:text-white"
            >
              {t.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(activeImage)} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-[min(1200px,calc(100%-2rem))] overflow-hidden border-0 bg-[#17191d] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.notice}</DialogDescription>
          </DialogHeader>
          {activeImage ? (
            <div className="relative flex min-h-[45vh] items-center justify-center bg-[#17191d]">
              <Image
                src={activeImage.src}
                alt={getImageAlt(activeImage)}
                fill
                unoptimized={activeImage.src.startsWith("http")}
                sizes="100vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => showAdjacentImage(-1)}
                aria-label={t.previousImage}
                className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#25272b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => showAdjacentImage(1)}
                aria-label={t.nextImage}
                className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#25272b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
              >
                <ChevronRight className="size-5" />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-[11px] font-semibold tracking-[.12em] text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {allGalleryImages.length}
              </span>
              {getImageCaption(activeImage) ? (
                <span className="absolute bottom-16 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 rounded bg-black/60 px-3 py-2 text-center text-xs leading-5 text-white backdrop-blur-sm sm:bottom-4 sm:left-4 sm:w-auto sm:max-w-[38%] sm:translate-x-0 sm:text-left">
                  {getImageCaption(activeImage)}
                </span>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      </main>
      <SiteFooter />
    </>
  );
}
