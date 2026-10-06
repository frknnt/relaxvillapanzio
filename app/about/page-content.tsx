"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, House, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

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
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

const localPhotos = [
  "/images/gallery/outdoor-02.jpg",
  "/images/gallery/outdoor-05.jpg",
  "/images/gallery/shared-03.jpg",
];

export function AboutPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.about;
  const [stayTimes, setStayTimes] = useState({ checkIn: "15:00", checkOut: "10:00" });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    void getSupabaseBrowserClient()
      .from("booking_settings")
      .select("check_in_time, check_out_time")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        setStayTimes({
          checkIn: String(data.check_in_time ?? "15:00").slice(0, 5),
          checkOut: String(data.check_out_time ?? "10:00").slice(0, 5),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  const checkInOutAnswer = t.checkInOutAnswer
    .replace("{checkIn}", stayTimes.checkIn)
    .replace("{checkOut}", stayTimes.checkOut);

  return (
    <main id="main-content" className="overflow-x-clip bg-white text-[#26272b]">
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

      <section id="stay-options" className="scroll-mt-20 px-6 py-28 sm:px-10 md:py-36 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] items-center gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
          <div className="max-w-xl">
            <p className="eyebrow">{t.storyEyebrow}</p>
            <h2 className="section-title mt-5">{t.storyTitle}</h2>
            <p className="mt-8 text-xl leading-8 text-[#515358]">{t.storyLead}</p>
            <p className="mt-5 text-base leading-7 text-[#747579]">{t.storyBody}</p>
            <p className="mt-5 text-base leading-7 text-[#747579]">{t.secondBody}</p>
          </div>
          <div className="mx-auto grid w-full max-w-[720px] gap-4 sm:grid-cols-2 lg:relative lg:block lg:min-h-[650px]">
            <div className="relative h-80 w-full overflow-hidden rounded-[8px] shadow-[0_18px_45px_rgba(26,26,26,.12)] sm:h-96 lg:absolute lg:right-0 lg:top-0 lg:h-[82%] lg:w-[76%] lg:shadow-[0_24px_70px_rgba(26,26,26,.15)]">
              <Image src="/images/story.jpg" alt="Relax Villa living space" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-[8px] shadow-[0_18px_45px_rgba(18,18,18,.14)] sm:h-96 lg:absolute lg:bottom-0 lg:left-0 lg:h-[54%] lg:w-[48%] lg:border-[7px] lg:border-white lg:shadow-[0_22px_50px_rgba(18,18,18,.22)]">
              <Image src="/images/about-detail.jpg" alt="Relax Villa interior detail" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
            <div className="bg-[#26292f] p-6 text-white shadow-xl sm:col-span-2 lg:absolute lg:bottom-[6%] lg:right-[2%] lg:max-w-[230px] lg:p-7">
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
              <div
                key={photo}
                className="relative aspect-[1.5] w-full overflow-hidden rounded-[8px]"
              >
                <Image src={photo} alt={t.localImageAlts[index]} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe9] px-6 py-20 sm:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <p className="eyebrow">{t.directionEyebrow}</p>
            <h2 className="section-title mt-5">{t.directionTitle}</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="border border-[#ded7cc] bg-white p-7 sm:p-9">
              <span className="grid size-12 place-items-center rounded-full bg-[#f1ece4] text-[#9c8964]">
                <House className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-7 text-2xl font-bold tracking-[-.035em]">{t.visionTitle}</h3>
              <p className="mt-4 max-w-[34rem] text-base leading-7 text-[#66686c]">{t.visionText}</p>
            </article>
            <article className="border border-[#ded7cc] bg-white p-7 sm:p-9">
              <span className="grid size-12 place-items-center rounded-full bg-[#f1ece4] text-[#9c8964]">
                <MessageCircle className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-7 text-2xl font-bold tracking-[-.035em]">{t.missionTitle}</h3>
              <p className="mt-4 max-w-[34rem] text-base leading-7 text-[#66686c]">{t.missionText}</p>
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
                  {index === 4 ? checkInOutAnswer : faq.answer}
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
