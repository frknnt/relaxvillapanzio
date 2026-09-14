import type { Metadata } from "next";

import { RoomsPageContent } from "./page-content";

export const metadata: Metadata = {
  title: "Bedrooms & Gallery | Relax Villa",
  description:
    "View all four bedrooms and the shared spaces included in every complete-villa reservation at Relax Villa.",
};

export default function RoomsPage() {
  return <RoomsPageContent />;
}
