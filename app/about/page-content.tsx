"use client";

import Link from "next/link";
import { ArrowRight, BedDouble, Compass, Eye, House, UsersRound } from "lucide-react";

import { secondaryCopy } from "@/app/secondary-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const factIcons = [UsersRound, BedDouble, House];

export function AboutPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.about;

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
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

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-7 md:grid-cols-3">
          {t.facts.map(([title, description], index) => {
            const Icon = factIcons[index];
            return (
              <article
                key={title}
                className="border border-[#e5e0d8] bg-white p-9 shadow-[0_12px_38px_rgba(37,39,43,.05)] md:p-11"
              >
                <span className="grid size-14 place-items-center rounded-full bg-[#f1ede7] text-[#9c8964]">
                  <Icon className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-8 text-2xl font-bold tracking-[-.03em]">{title}</h3>
                <p className="mt-4 text-base leading-7 text-[#747579]">{description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative flex min-h-[610px] items-center justify-center px-6 py-28 text-center text-white sm:px-10">
        <img
          src="/images/mood.jpg"
          alt="Relax Villa outdoor area"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#12171b]/65" />
        <div className="relative max-w-4xl">
          <p className="eyebrow !text-[#decba5]">{t.promiseEyebrow}</p>
          <h2 className="mt-5 text-balance text-[clamp(2.4rem,5vw,5rem)] font-extrabold uppercase leading-[1.02] tracking-[-.045em]">
            {t.promiseTitle}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/76">{t.promiseText}</p>
          <Link
            href="/rooms"
            className="mt-10 inline-flex min-h-13 items-center gap-3 rounded-full border border-white/45 px-7 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-white hover:text-[#26272b]"
          >
            {t.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
