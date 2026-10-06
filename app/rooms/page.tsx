import type { Metadata } from "next";

import { RoomsPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Rooms & Full Gallery | Relax Villa Badacsonytomaj",
  description:
    "Explore four bedrooms, shared living areas, garden, pool, outdoor hot tub and barrel sauna, available for room or whole-villa stays at Relax Villa.",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
