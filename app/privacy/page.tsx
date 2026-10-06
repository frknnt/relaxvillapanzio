import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Privacy Notice | Relax Villa Panzió", description: "How Relax Villa Panzió handles reservation and contact information." };
export default function PrivacyPage() { return <PolicyPage kind="privacy" />; }
