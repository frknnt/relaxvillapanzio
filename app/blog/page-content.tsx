"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { secondaryCopy } from "@/app/secondary-content";
import type { Language } from "@/app/site-content";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { PUBLIC_BLOG_POST_COLUMNS } from "@/lib/supabase/public-columns";
import type { BlogPost } from "@/lib/supabase/types";

const articleImages = ["/images/local-1.jpg", "/images/local-2.jpg", "/images/local-3.jpg"];

type LocalizedBlogField = "category" | "title" | "excerpt" | "content";

type BlogCard = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  cover: string;
};

function getLocalizedPostField(
  post: BlogPost,
  field: LocalizedBlogField,
  language: Language,
) {
  const fields = {
    category: {
      en: post.category_en,
      de: post.category_de,
      hu: post.category_hu,
      tr: post.category_tr,
    },
    title: {
      en: post.title_en,
      de: post.title_de,
      hu: post.title_hu,
      tr: post.title_tr,
    },
    excerpt: {
      en: post.excerpt_en,
      de: post.excerpt_de,
      hu: post.excerpt_hu,
      tr: post.excerpt_tr,
    },
    content: {
      en: post.content_en,
      de: post.content_de,
      hu: post.content_hu,
      tr: post.content_tr,
    },
  } satisfies Record<LocalizedBlogField, Record<Language, string>>;
  const translations = fields[field];

  return (
    translations[language]?.trim() ||
    translations.en?.trim() ||
    translations.de?.trim() ||
    translations.hu?.trim() ||
    translations.tr?.trim() ||
    ""
  );
}

export function BlogPageContent({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.blog;
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[] | null>(initialPosts);

  useEffect(() => {
    let isActive = true;

    async function loadPublishedPosts() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("blog_posts")
          .select(PUBLIC_BLOG_POST_COLUMNS)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        if (isActive) {
          setPublishedPosts(((data ?? []) as BlogPost[]).filter((post) => post.slug.trim()));
        }
      } catch {
        if (isActive) setPublishedPosts([]);
      }
    }

    void loadPublishedPosts();
    return () => {
      isActive = false;
    };
  }, []);

  const articles = useMemo<BlogCard[]>(() => {
    if (publishedPosts?.length) {
      return publishedPosts.map((post, index) => ({
        slug: post.slug,
        category: getLocalizedPostField(post, "category", language),
        title: getLocalizedPostField(post, "title", language),
        excerpt: getLocalizedPostField(post, "excerpt", language),
        cover: post.cover_url?.trim() || articleImages[index % articleImages.length],
      }));
    }

    return t.articles.map((article, index) => ({
      slug: article.slug,
      category: article.category,
      title: article.title,
      excerpt: article.excerpt,
      cover: articleImages[index % articleImages.length],
    }));
  }, [language, publishedPosts, t.articles]);

  return (
    <main id="main-content" className="overflow-x-clip bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/story.jpg"
          imageAlt="Harmony Balaton Villa dining area"
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {articles.map((article, index) => (
              <article
                key={article.slug}
                className="overflow-hidden rounded-[12px] bg-white shadow-[0_18px_50px_rgba(28,29,32,.09)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Link
                  href={`/blog/${encodeURIComponent(article.slug)}`}
                  className="group flex h-full flex-col"
                  aria-label={`${t.read}: ${article.title}`}
                >
                  <div className="relative aspect-[1.5] overflow-hidden">
                    <Image
                      src={article.cover}
                      alt=""
                      fill
                      unoptimized={article.cover.startsWith("http")}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0 left-0 bg-[#24262b] px-4 py-2 text-sm font-semibold tracking-[.04em] text-white">
                      {String(index + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="grid min-h-[230px] flex-1 grid-cols-[46px_1fr]">
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
                      {article.excerpt ? (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#737477]">
                          {article.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[.13em] text-[#9a8764]">
                        {t.read}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
