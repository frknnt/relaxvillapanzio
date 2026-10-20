import type { Metadata } from "next";

import { BlogArticlePageContent } from "./page-content";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Harmony Balaton Villa Blog | Badacsonytomaj",
    description:
      "Badacsony, Balaton Gölü ve Harmony Balaton Villa'da konaklama üzerine yerel notlar ve pratik öneriler.",
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  return <BlogArticlePageContent slug={slug} initialPost={null} />;
}
