import type { Metadata } from "next";
import ReservationStatusContent from "./page-content";

export const metadata: Metadata = { title: "Reservation Status | Harmony Balaton Villa", description: "Securely check a Harmony Balaton Villa reservation with its reference and email address." };
export default function ReservationStatusPage() { return <ReservationStatusContent />; }
