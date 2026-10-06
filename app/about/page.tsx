import type { Metadata } from "next";

import { AboutPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "The Villa & Badacsony | Relax Villa Badacsonytomaj",
  description:
    "Meet Relax Villa: book a private room or reserve all four bedrooms, with garden and wellness spaces close to Badacsony and Lake Balaton.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
