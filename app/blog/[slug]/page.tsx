import type { Metadata } from "next";

import { getSupabasePublicServerClient } from "@/lib/supabase/server";
import { PUBLIC_BLOG_POST_COLUMNS } from "@/lib/supabase/public-columns";
import type { BlogPost } from "@/lib/supabase/types";
import { BlogArticlePageContent } from "./page-content";

export const dynamic = "force-dynamic";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

async function getPublishedPost(slug: string) {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_BLOG_POST_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as BlogPost;
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Relax Villa Blog | Badacsonytomaj",
      description:
        "Practical notes on Badacsony, Lake Balaton and making the most of a private whole-villa stay.",
    };
  }

  const title = post.title_en || post.title_hu || post.title_de;
  const description = post.excerpt_en || post.excerpt_hu || post.excerpt_de;

  return {
    title: `${title} | Relax Villa`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const initialPost = await getPublishedPost(slug);

  return <BlogArticlePageContent slug={slug} initialPost={initialPost} />;
}
