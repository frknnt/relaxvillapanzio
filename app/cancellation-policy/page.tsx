import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Cancellation Policy | Harmony Balaton Villa", description: "Cancellation and refund rules for Harmony Balaton Villa reservations." };
export default function CancellationPolicyPage() { return <PolicyPage kind="cancellation" />; }
