"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
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

const articleUi = {
  en: {
    back: "Back to blog",
    book: "Request your dates",
    loading: "Loading article…",
    missingEyebrow: "RELAX VILLA BLOG",
    missingTitle: "Article not found",
    missingText: "This article is no longer available. Return to the blog to explore the latest posts.",
  },
  de: {
    back: "Zurück zum Blog",
    book: "Reisedaten anfragen",
    loading: "Artikel wird geladen…",
    missingEyebrow: "RELAX VILLA BLOG",
    missingTitle: "Artikel nicht gefunden",
    missingText: "Dieser Artikel ist nicht mehr verfügbar. Im Blog finden Sie die neuesten Beiträge.",
  },
  hu: {
    back: "Vissza a bloghoz",
    book: "Időpont kérése",
    loading: "A cikk betöltése…",
    missingEyebrow: "RELAX VILLA BLOG",
    missingTitle: "A cikk nem található",
    missingText: "Ez a cikk már nem érhető el. A legfrissebb bejegyzésekhez térjen vissza a bloghoz.",
  },
} as const satisfies Record<Language, object>;

type LocalizedBlogField = "category" | "title" | "excerpt" | "content";

type ArticleContent = {
  category: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  cover: string;
};

function getLocalizedPostField(
  post: BlogPost,
  field: LocalizedBlogField,
  language: Language,
) {
  const fields = {
    category: { en: post.category_en, de: post.category_de, hu: post.category_hu },
    title: { en: post.title_en, de: post.title_de, hu: post.title_hu },
    excerpt: { en: post.excerpt_en, de: post.excerpt_de, hu: post.excerpt_hu },
    content: { en: post.content_en, de: post.content_de, hu: post.content_hu },
  } satisfies Record<LocalizedBlogField, Record<Language, string>>;
  const translations = fields[field];

  return (
    translations[language]?.trim() ||
    translations.en?.trim() ||
    translations.de?.trim() ||
    translations.hu?.trim() ||
    ""
  );
}

function toPlainTextParagraphs(content: string) {
  const normalized = content.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return [];

  return normalized
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function BlogArticlePageContent({
  slug,
  initialPost,
}: {
  slug: string;
  initialPost: BlogPost | null;
}) {
  const { language } = useLanguage();
  const t = secondaryCopy[language].blog;
  const ui = articleUi[language];
  const [postResult, setPostResult] = useState<{
    slug: string;
    post: BlogPost | null;
    hasLoaded: boolean;
  }>({ slug, post: initialPost, hasLoaded: true });
  const post = postResult.slug === slug ? postResult.post : null;
  const hasLoaded = postResult.slug === slug && postResult.hasLoaded;

  useEffect(() => {
    let isActive = true;

    async function loadPost() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("blog_posts")
          .select(PUBLIC_BLOG_POST_COLUMNS)
          .eq("slug", slug)
          .eq("status", "published")
          .limit(1);

        if (error) throw error;
        if (isActive) {
          setPostResult({
            slug,
            post: ((data ?? [])[0] as BlogPost | undefined) ?? null,
            hasLoaded: true,
          });
        }
      } catch {
        if (isActive) setPostResult({ slug, post: null, hasLoaded: true });
      }
    }

    void loadPost();
    return () => {
      isActive = false;
    };
  }, [slug]);

  const staticArticleIndex = t.articles.findIndex((article) => article.slug === slug);
  const staticArticle = staticArticleIndex >= 0 ? t.articles[staticArticleIndex] : null;

  const article = useMemo<ArticleContent | null>(() => {
    if (post) {
      const excerpt = getLocalizedPostField(post, "excerpt", language);
      const paragraphs = toPlainTextParagraphs(
        getLocalizedPostField(post, "content", language),
      );

      return {
        category: getLocalizedPostField(post, "category", language),
        title: getLocalizedPostField(post, "title", language),
        excerpt,
        paragraphs: paragraphs.length ? paragraphs : excerpt ? [excerpt] : [],
        cover: post.cover_url?.trim() || "/images/story.jpg",
      };
    }

    if (staticArticle) {
      return {
        category: staticArticle.category,
        title: staticArticle.title,
        excerpt: staticArticle.excerpt,
        paragraphs: [...staticArticle.paragraphs],
        cover: articleImages[staticArticleIndex % articleImages.length],
      };
    }

    return null;
  }, [language, post, staticArticle, staticArticleIndex]);

  if (!article && !hasLoaded) {
    return (
      <main className="min-h-screen bg-[#faf8f5] text-[#26272b]">
        <SiteHeader />
        <div className="mx-auto flex min-h-[60vh] max-w-[1500px] items-center justify-center px-6 text-sm font-semibold uppercase tracking-[.14em] text-[#8e805f]">
          {ui.loading}
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#faf8f5] text-[#26272b]">
        <SiteHeader />
        <section className="mx-auto flex min-h-[64vh] max-w-3xl flex-col items-start justify-center px-6 py-24 sm:px-10">
          <p className="eyebrow">{ui.missingEyebrow}</p>
          <h1 className="mt-5 text-balance text-5xl font-extrabold uppercase leading-none tracking-[-.05em] sm:text-7xl">
            {ui.missingTitle}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#696a6e]">{ui.missingText}</p>
          <Link
            href="/blog"
            className="mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#2d2f33] px-7 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#9a8764]"
          >
            <ArrowLeft className="size-4" />
            {ui.back}
          </Link>
        </section>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="overflow-x-clip bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image={article.cover}
          imageAlt={article.title}
          eyebrow={article.category || t.eyebrow}
          title={article.title}
          intro={article.excerpt}
        />
      </div>

      <article className="px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#8e805f] transition hover:text-[#26272b]"
          >
            <ArrowLeft className="size-4" />
            {ui.back}
          </Link>

          <div className="mt-12 space-y-7">
            {article.paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 32)}`}
                className="whitespace-pre-line text-lg leading-8 text-[#55565a] md:text-xl md:leading-9"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 border-t border-[#ded8ce] pt-10">
            <Link
              href="/#availability"
              className="inline-flex min-h-13 items-center gap-3 rounded-full bg-[#2d2f33] px-7 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#9a8764]"
            >
              {ui.book}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
