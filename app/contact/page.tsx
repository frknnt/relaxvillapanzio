import type { Metadata } from "next";

import { ContactPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Availability & Direct Booking | Relax Villa Badacsonytomaj",
  description:
    "Ask about dates and pricing for the complete four-bedroom Relax Villa in Badacsonytomaj. Direct confirmation and payment by bank transfer.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
