import type { Metadata } from "next";
import ReservationStatusContent from "./page-content";

export const metadata: Metadata = { title: "Reservation Status | Relax Villa Panzió", description: "Securely check a Relax Villa reservation with its reference and email address." };
export default function ReservationStatusPage() { return <ReservationStatusContent />; }
