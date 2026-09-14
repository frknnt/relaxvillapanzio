"use client";

import Link from "next/link";
import { ArrowRight, House, Maximize2 } from "lucide-react";
import { useState } from "react";

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

const bedroomImages = [
  ["/images/room-1.jpg"],
  ["/images/room-2.jpg", "/images/room-2-detail.jpg"],
  ["/images/room-3.jpg"],
  ["/images/room-4.jpg"],
] as const;

const sharedImages = [
  "/images/about-main.jpg",
  "/images/story.jpg",
  "/images/about-detail.jpg",
  "/images/mood.jpg",
  "/images/local-1.jpg",
  "/images/footer.jpg",
] as const;

export function RoomsPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.rooms;
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/room-1.jpg"
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
          {bedroomImages.map((images, index) => (
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
                    src={images[0]}
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
                    onClick={() => setActiveImage(images[1] ?? null)}
                    aria-label={`${t.openImage}: ${t.bedroomNames[index]}`}
                    className="group absolute bottom-5 right-5 h-[38%] w-[38%] overflow-hidden rounded-[6px] border-[5px] border-white bg-white shadow-2xl"
                  >
                    <img
                      src={images[1]}
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
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow">{t.sharedEyebrow}</p>
            <h2 className="section-title mt-5">{t.sharedTitle}</h2>
            <p className="mt-6 text-base leading-7 text-[#737477]">{t.sharedText}</p>
          </div>
          <div className="grid auto-rows-[230px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sharedImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={t.openImage}
                className={`group relative overflow-hidden rounded-[7px] ${
                  index === 0 || index === 3 ? "sm:row-span-2" : ""
                }`}
              >
                <img
                  src={image}
                  alt={t.sharedTitle}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-[#2d2f33] opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </button>
            ))}
          </div>
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
            <img src={activeImage} alt={t.title} className="max-h-[88vh] w-full object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
