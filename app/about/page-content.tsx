"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Compass, Eye } from "lucide-react";

import { secondaryCopy } from "@/app/secondary-content";
import { siteCopy } from "@/app/site-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { VillaFeaturesSection } from "@/components/site/villa-features-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const localPhotos = [
  "/images/gallery/outdoor-02.jpg",
  "/images/gallery/outdoor-05.jpg",
  "/images/gallery/shared-03.jpg",
];

export function AboutPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.about;

  return (
    <main className="overflow-x-clip bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/about-main.jpg"
          imageAlt="Relax Villa shared interior"
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="px-6 py-28 sm:px-10 md:py-36 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
          <div className="max-w-xl">
            <p className="eyebrow">{t.storyEyebrow}</p>
            <h2 className="section-title mt-5">{t.storyTitle}</h2>
            <p className="mt-8 text-xl leading-8 text-[#515358]">{t.storyLead}</p>
            <p className="mt-5 text-base leading-7 text-[#747579]">{t.storyBody}</p>
            <p className="mt-5 text-base leading-7 text-[#747579]">{t.secondBody}</p>
          </div>
          <div className="relative mx-auto min-h-[650px] w-full max-w-[720px]">
            <img
              src="/images/story.jpg"
              alt="Relax Villa living space"
              className="absolute right-0 top-0 h-[82%] w-[76%] rounded-[8px] object-cover shadow-[0_24px_70px_rgba(26,26,26,.15)]"
            />
            <img
              src="/images/about-detail.jpg"
              alt="Relax Villa interior detail"
              className="absolute bottom-0 left-0 h-[54%] w-[48%] rounded-[7px] border-[7px] border-white object-cover shadow-[0_22px_50px_rgba(18,18,18,.22)]"
            />
            <div className="absolute bottom-[6%] right-[2%] max-w-[230px] bg-[#26292f] p-7 text-white shadow-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#d2bd92]">
                Badacsonytomaj
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">{copy.common.wholeVilla}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] items-start gap-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-20">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="eyebrow">{t.localEyebrow}</p>
            <h2 className="section-title mt-5 max-w-[15ch]">{t.localTitle}</h2>
            <p className="mt-6 max-w-[38rem] text-lg leading-8 text-[#595b60]">
              {t.localIntro}
            </p>
            <div className="mt-7 space-y-5">
              {t.localFeatures.map((feature) => (
                <article key={feature.title} className="flex items-start gap-5">
                  <Bookmark
                    className="mt-1 size-9 shrink-0 text-[#9c8964]"
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-.03em] sm:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 max-w-[37rem] text-base leading-7 text-[#66686c]">
                      {feature.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            {localPhotos.map((photo, index) => (
              <img
                key={photo}
                src={photo}
                alt={t.localImageAlts[index]}
                loading="lazy"
                className="aspect-[1.5] w-full rounded-[8px] object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#25282e] px-6 py-24 text-white sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-14 lg:grid-cols-[.56fr_1.44fr] lg:gap-24">
          <div className="max-w-lg">
            <p className="eyebrow !text-[#d6c29b]">{t.directionEyebrow}</p>
            <h2 className="mt-5 text-balance text-[clamp(2.6rem,4.6vw,5rem)] font-extrabold uppercase leading-[.98] tracking-[-.05em]">
              {t.visionTitle}
              <span className="block text-white/32">&amp; {t.missionTitle}</span>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-2">
            <article className="bg-[#292c32] p-9 sm:p-12">
              <div className="flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-white/15 text-[#d6c29b]">
                  <Eye className="size-6" strokeWidth={1.4} />
                </span>
                <span className="text-5xl font-extrabold tracking-[-.06em] text-white/10">01</span>
              </div>
              <h3 className="mt-12 text-3xl font-bold tracking-[-.035em]">{t.visionTitle}</h3>
              <p className="mt-5 text-base leading-8 text-white/65">{t.visionText}</p>
            </article>
            <article className="bg-[#292c32] p-9 sm:p-12">
              <div className="flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-white/15 text-[#d6c29b]">
                  <Compass className="size-6" strokeWidth={1.4} />
                </span>
                <span className="text-5xl font-extrabold tracking-[-.06em] text-white/10">02</span>
              </div>
              <h3 className="mt-12 text-3xl font-bold tracking-[-.035em]">{t.missionTitle}</h3>
              <p className="mt-5 text-base leading-8 text-white/65">{t.missionText}</p>
            </article>
          </div>
        </div>
      </section>

      <VillaFeaturesSection t={siteCopy[language]} />

      <section className="bg-[#faf9f7] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] items-start gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-20">
          <div className="max-w-lg">
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2 className="section-title mt-5">{t.faqTitle}</h2>
            <p className="mt-7 text-lg leading-8 text-[#5d5f63]">{t.faqIntro}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-3 text-base font-semibold text-[#8d7855] underline-offset-4 hover:underline"
            >
              {t.faqContact}
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {t.faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="border-0 bg-white shadow-[0_10px_35px_rgba(35,35,35,.045)]"
              >
                <AccordionTrigger className="faq-trigger min-h-20 items-center rounded-none px-6 py-5 text-base font-semibold tracking-[-.02em] hover:no-underline sm:text-lg [&>svg]:hidden">
                  {faq.question}
                  <span className="faq-plus ml-auto shrink-0 text-2xl font-light leading-none text-[#9c8964]" aria-hidden="true" />
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-base leading-7 text-[#616368]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
