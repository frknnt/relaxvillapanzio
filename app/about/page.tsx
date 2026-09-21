import type { Metadata } from "next";

import { AboutPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "The Villa & Badacsony | Relax Villa Badacsonytomaj",
  description:
    "Meet Relax Villa: a whole-house stay with four bedrooms, private wellness spaces and direct access to the rhythm of Badacsony and Lake Balaton.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
