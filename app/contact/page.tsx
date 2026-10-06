import type { Metadata } from "next";

import { ContactPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Contact & Questions | Relax Villa Badacsonytomaj",
  description:
    "Ask the host about Relax Villa's rooms, amenities, accessibility, location or booking process in Badacsonytomaj.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
