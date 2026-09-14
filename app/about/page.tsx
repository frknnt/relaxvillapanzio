import type { Metadata } from "next";

import { AboutPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "About Relax Villa | Badacsonytomaj",
  description:
    "Discover Relax Villa, a private four-bedroom villa reserved as one complete property in Badacsonytomaj.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
