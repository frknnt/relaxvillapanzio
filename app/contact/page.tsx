import type { Metadata } from "next";

import { ContactPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Contact & Questions | Harmony Balaton Villa Badacsonytomaj",
  description:
    "Ask the host about Harmony Balaton Villa's rooms, amenities, accessibility, location or booking process in Badacsonytomaj.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
