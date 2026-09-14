import type { Metadata } from "next";

import { BlogPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Relax Villa Journal | Badacsonytomaj",
  description:
    "Practical ideas for planning a relaxed whole-villa stay with your group in Badacsonytomaj.",
};

export default function BlogPage() {
  return <BlogPageContent />;
}
