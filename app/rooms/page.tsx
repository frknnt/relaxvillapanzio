import type { Metadata } from "next";

import { RoomsPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Four Bedrooms & Full Gallery | Relax Villa Badacsonytomaj",
  description:
    "Explore all four bedrooms, shared living areas, garden, pool, outdoor hot tub and barrel sauna included in every Relax Villa booking.",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
