import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Cancellation Policy | Relax Villa Panzió", description: "Cancellation and refund rules for Relax Villa Panzió reservations." };
export default function CancellationPolicyPage() { return <PolicyPage kind="cancellation" />; }
