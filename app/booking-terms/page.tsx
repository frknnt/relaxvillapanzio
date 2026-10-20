import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Booking Terms | Harmony Balaton Villa", description: "Reservation, payment and stay terms for Harmony Balaton Villa." };
export default function BookingTermsPage() { return <PolicyPage kind="booking" />; }
