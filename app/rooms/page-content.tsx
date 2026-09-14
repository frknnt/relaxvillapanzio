"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, House, Maximize2 } from "lucide-react";
import { useState } from "react";

import { galleryImages, type GalleryImage } from "@/app/rooms/gallery-data";
import { secondaryCopy } from "@/app/secondary-content";
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

const bedroomImageGroups = ([1, 2, 3, 4] as const).map((room) =>
  galleryImages.filter((image) => image.room === room),
);

export function RoomsPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.rooms;
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const getImageAlt = (image: GalleryImage) => {
    if (image.room) {
      return `${t.bedroomNames[image.room - 1]} — ${t.photoLabel} ${image.order}`;
    }

    const category =
      image.category === "shared" ? t.galleryTabs.shared : t.galleryTabs.outdoors;
    return `${category} — ${t.photoLabel} ${image.order}`;
  };

  const showAdjacentImage = (direction: -1 | 1) => {
    if (!activeImage) return;
    const currentIndex = galleryImages.findIndex((image) => image.src === activeImage.src);
    const nextIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex]);
  };

  const galleryTabs = [
    { value: "all", label: t.galleryTabs.all, images: galleryImages },
    {
      value: "bedrooms",
      label: t.galleryTabs.bedrooms,
      images: galleryImages.filter((image) => image.category === "bedrooms"),
    },
    {
      value: "shared",
      label: t.galleryTabs.shared,
      images: galleryImages.filter((image) => image.category === "shared"),
    },
    {
      value: "outdoors",
      label: t.galleryTabs.outdoors,
      images: galleryImages.filter((image) => image.category === "outdoors"),
    },
  ] as const;
  const activeImageIndex = activeImage
    ? galleryImages.findIndex((image) => image.src === activeImage.src)
    : -1;

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/gallery/bedroom-1-01.jpg"
          imageAlt={t.bedroomNames[0]}
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        >
          <div className="mt-8 inline-flex max-w-2xl items-center gap-3 border border-white/25 bg-black/20 px-5 py-3 text-sm text-white/82 backdrop-blur-sm">
            <House className="size-4 shrink-0 text-[#d8c49a]" />
            {t.notice}
          </div>
        </PageHero>
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
                  <img
                    src={images[0].src}
                    alt={t.bedroomNames[index]}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
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
                    <img
                      src={images[1].src}
                      alt={t.bedroomNames[index]}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
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
                  {tab.images.map((image, index) => (
                    <button
                      key={image.src}
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
                      <img
                        src={image.src}
                        alt={getImageAlt(image)}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                      <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/92 text-[#2d2f33] opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Maximize2 className="size-4" />
                      </span>
                    </button>
                  ))}
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

      <SiteFooter />

      <Dialog open={Boolean(activeImage)} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-[min(1200px,calc(100%-2rem))] overflow-hidden border-0 bg-[#17191d] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.notice}</DialogDescription>
          </DialogHeader>
          {activeImage ? (
            <div className="relative flex min-h-[45vh] items-center justify-center bg-[#17191d]">
              <img
                src={activeImage.src}
                alt={getImageAlt(activeImage)}
                className="max-h-[88vh] w-full object-contain"
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
                {activeImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
