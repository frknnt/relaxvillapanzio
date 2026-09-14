import type { Metadata } from "next";

import { ContactPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Contact Relax Villa | Badacsonytomaj",
  description:
    "Contact Relax Villa and request dates for the complete four-bedroom property in Badacsonytomaj.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
