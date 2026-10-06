import type { Metadata } from "next";

import { BlogPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Badacsony Blog | Relax Villa",
  description:
    "Practical notes on Badacsony’s basalt trails, Lake Balaton, local wine culture and planning a room or whole-villa stay with family or friends.",
};

export default function BlogPage() {
  return <BlogPageContent initialPosts={[]} />;
}
