"use client";

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
    <main className="overflow-x-clip bg-white text-[#26272b]">
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

      <section className="px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {t.articles.map((article, index) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_18px_50px_rgba(28,29,32,.09)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[1.5] overflow-hidden">
                    <img
                      src={articleImages[index]}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 left-0 bg-[#24262b] px-4 py-2 text-sm font-semibold tracking-[.04em] text-white">
                      0{index + 1} / 0{t.articles.length}
                    </span>
                </div>
                <div className="grid min-h-[190px] flex-1 grid-cols-[46px_1fr]">
                  <div className="flex justify-start border-r border-[#ece9e5] px-3 pt-6">
                    <span
                      className="text-sm font-semibold uppercase tracking-[.16em] text-[#c8c8c8]"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="flex flex-col px-7 py-9 lg:px-6 xl:px-8">
                    <h2 className="text-balance text-[clamp(1.45rem,2vw,2rem)] font-bold leading-[1.25] tracking-[-.035em]">
                      {article.title}
                    </h2>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
