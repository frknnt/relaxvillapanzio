import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Booking Terms | Relax Villa Panzió", description: "Reservation, payment and stay terms for Relax Villa Panzió." };
export default function BookingTermsPage() { return <PolicyPage kind="booking" />; }
