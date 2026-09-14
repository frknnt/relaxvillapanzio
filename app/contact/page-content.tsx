"use client";

import Link from "next/link";
import { ArrowRight, Landmark, Mail, MapPin, MessageCircle } from "lucide-react";

import { secondaryCopy } from "@/app/secondary-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function ContactPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.contactPage;

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/footer.jpg"
          imageAlt="Relax Villa garden"
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[1fr_1fr]">
          <article className="relative min-h-[470px] overflow-hidden rounded-[8px] p-9 text-white shadow-[0_18px_50px_rgba(29,31,35,.13)] sm:p-12">
            <img
              src="/images/hero-mobile.jpg"
              alt="Relax Villa in Badacsonytomaj"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,29,32,.42),rgba(25,28,31,.88))]" />
            <div className="relative flex h-full min-h-[390px] flex-col justify-end">
              <span className="grid size-14 place-items-center rounded-full border border-white/30 bg-black/10 backdrop-blur">
                <MapPin className="size-6" strokeWidth={1.5} />
              </span>
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[.2em] text-[#decba5]">
                {t.visit}
              </p>
              <address className="mt-3 max-w-xl text-3xl font-bold not-italic leading-tight tracking-[-.035em] sm:text-4xl">
                {copy.common.address}
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=8257%20Badacsonytomaj%2C%20F%C3%BCredi%20%C3%BAt%205"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 border-b border-[#d7c49d] pb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#d7c49d]"
              >
                {t.map}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </article>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <article className="border border-[#e5e0d8] bg-[#faf8f5] p-9 sm:p-11">
              <div className="flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#9c8964] shadow-sm">
                  <MessageCircle className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-[-.03em]">{t.write}</h2>
                  <p className="mt-3 text-base leading-7 text-[#747579]">{t.writeText}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3 border-t border-[#e2ddd4] pt-7 text-sm text-[#76777a] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <span className="flex items-center gap-3">
                  <Mail className="size-4 text-[#9c8964]" />
                  {copy.common.contactPending}
                </span>
                <span className="flex items-center gap-3">
                  <MessageCircle className="size-4 text-[#9c8964]" />
                  WhatsApp
                </span>
              </div>
            </article>

            <article className="bg-[#292c32] p-9 text-white sm:p-11">
              <span className="grid size-12 place-items-center rounded-full border border-white/20 text-[#d4c198]">
                <Landmark className="size-5" strokeWidth={1.5} />
              </span>
              <h2 className="mt-7 text-2xl font-bold tracking-[-.03em]">{t.noteTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/65">{t.note}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <p className="eyebrow">{t.processEyebrow}</p>
          <h2 className="section-title mt-5">{t.processTitle}</h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-[#e5e0d8] bg-[#e5e0d8] lg:grid-cols-3">
            {t.steps.map(([number, title, description]) => (
              <article key={number} className="bg-white p-9 sm:p-11">
                <span className="text-5xl font-extrabold tracking-[-.06em] text-[#e1d9cc]">{number}</span>
                <h3 className="mt-7 text-2xl font-bold tracking-[-.03em]">{title}</h3>
                <p className="mt-4 text-base leading-7 text-[#747579]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
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
    </main>
  );
}
