import type { Metadata } from "next";

import { AboutPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "The Villa & Badacsony | Harmony Balaton Villa Badacsonytomaj",
  description:
    "Meet Harmony Balaton Villa: book a private room or reserve all four bedrooms, with garden and wellness spaces close to Badacsony and Lake Balaton.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
