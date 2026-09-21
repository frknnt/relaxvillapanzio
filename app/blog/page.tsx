import type { Metadata } from "next";

import { getSupabasePublicServerClient } from "@/lib/supabase/server";
import { PUBLIC_BLOG_POST_COLUMNS } from "@/lib/supabase/public-columns";
import type { BlogPost } from "@/lib/supabase/types";
import { BlogPageContent } from "./page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Badacsony Blog | Relax Villa",
  description:
    "Practical notes on Badacsony’s basalt trails, Lake Balaton, local wine culture and planning a private villa stay with family or friends.",
};

async function getPublishedPosts() {
  const supabase = getSupabasePublicServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select(PUBLIC_BLOG_POST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) return [];
  return (data ?? []) as BlogPost[];
}

export default async function BlogPage() {
  return <BlogPageContent initialPosts={await getPublishedPosts()} />;
}
