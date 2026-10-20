import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy-page";

export const metadata: Metadata = { title: "Privacy Notice | Harmony Balaton Villa", description: "How Harmony Balaton Villa handles reservation and contact information." };
export default function PrivacyPage() { return <PolicyPage kind="privacy" />; }
