"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import { secondaryCopy } from "@/app/secondary-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const articleImages = ["/images/local-1.jpg", "/images/local-2.jpg", "/images/local-3.jpg"];

export function BlogPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.blog;

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/story.jpg"
          imageAlt="Relax Villa dining area"
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-7 lg:grid-cols-[1.35fr_.65fr]">
            <article className="group relative min-h-[610px] overflow-hidden rounded-[8px] text-white shadow-[0_22px_55px_rgba(27,29,32,.14)]">
              <img
                src={articleImages[0]}
                alt={t.articles[0].title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,23,.08)_25%,rgba(18,20,23,.9)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 max-w-3xl p-8 sm:p-12">
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#decba5]">
                  {t.articles[0].category}
                </p>
                <h2 className="mt-4 text-balance text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                  {t.articles[0].title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/76">
                  {t.articles[0].excerpt}
                </p>
                <a
                  href={`#${t.articles[0].slug}`}
                  className="mt-7 inline-flex items-center gap-3 border-b border-[#d7c49d] pb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#d7c49d]"
                >
                  {t.read}
                  <ArrowDown className="size-4" />
                </a>
              </div>
            </article>

            <div className="grid gap-7">
              {t.articles.slice(1).map((article, index) => (
                <article
                  key={article.slug}
                  className="group grid overflow-hidden rounded-[8px] bg-white shadow-[0_14px_40px_rgba(31,31,31,.08)] sm:grid-cols-[.9fr_1.1fr] lg:grid-cols-1"
                >
                  <div className="relative min-h-[250px] overflow-hidden">
                    <img
                      src={articleImages[index + 1]}
                      alt={article.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7 sm:p-9">
                    <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#9c8964]">
                      {article.category}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold leading-8 tracking-[-.03em]">{article.title}</h2>
                    <a
                      href={`#${article.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#9b8968]"
                    >
                      {t.read}
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1100px]">
          {t.articles.map((article, index) => (
            <article
              id={article.slug}
              key={article.slug}
              className="scroll-mt-16 border-b border-[#e5e0d8] py-16 first:pt-0 last:border-0 last:pb-0"
            >
              <div className="grid gap-10 md:grid-cols-[140px_1fr]">
                <div>
                  <span className="text-5xl font-extrabold tracking-[-.06em] text-[#e1d9cc]">
                    0{index + 1}
                  </span>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.18em] text-[#9c8964]">
                    {article.category}
                  </p>
                </div>
                <div>
                  <h2 className="text-balance text-3xl font-bold tracking-[-.035em] sm:text-4xl">
                    {article.title}
                  </h2>
                  <p className="mt-5 text-xl leading-8 text-[#55575b]">{article.excerpt}</p>
                  <div className="mt-7 space-y-5 text-base leading-8 text-[#747579]">
                    {article.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#272a30] px-6 py-20 text-center text-white sm:px-10">
        <h2 className="text-balance text-3xl font-bold tracking-[-.035em] sm:text-4xl">
          {copy.common.wholeVilla}
        </h2>
        <Link
          href="/#availability"
          className="mt-8 inline-flex min-h-13 items-center gap-3 rounded-full border border-white/35 px-7 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-white hover:text-[#272a30]"
        >
          {copy.common.availability}
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
