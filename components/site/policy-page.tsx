"use client";

import { useEffect, useState } from "react";
import { Clock3, Mail, MapPin, ShieldCheck } from "lucide-react";

import { professionalCopy } from "@/app/professional-copy";
import { CONTACT_EMAIL } from "@/app/site-config";
import { useLanguage } from "@/components/site/language-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { PUBLIC_BOOKING_SETTINGS_COLUMNS } from "@/lib/supabase/public-columns";
import type { BookingSettings } from "@/lib/supabase/types";

type PolicyKind = "privacy" | "booking" | "cancellation";

const fallback: Pick<BookingSettings, "cancellation_free_days" | "late_cancellation_refund_percent" | "privacy_retention_months" | "legal_operator_name" | "legal_operator_address" | "contact_email" | "payment_hold_hours" | "check_in_time" | "check_out_time"> = {
  cancellation_free_days: 14,
  late_cancellation_refund_percent: 0,
  privacy_retention_months: 24,
  legal_operator_name: "Harmony Balaton Villa",
  legal_operator_address: "8257 Badacsonytomaj, Füredi út 5",
  contact_email: CONTACT_EMAIL,
  payment_hold_hours: 48,
  check_in_time: "15:00",
  check_out_time: "10:00",
};

export function PolicyPage({ kind }: { kind: PolicyKind }) {
  const { language } = useLanguage();
  const copy = professionalCopy[language];
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    void getSupabaseBrowserClient()
      .from("booking_settings")
      .select(PUBLIC_BOOKING_SETTINGS_COLUMNS)
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) setSettings({ ...fallback, ...(data as BookingSettings) });
      });
    return () => { active = false; };
  }, []);

  const title = kind === "privacy" ? copy.privacy : kind === "booking" ? copy.bookingTerms : copy.cancellation;
  const intro = kind === "privacy" ? copy.privacyIntro : kind === "booking" ? copy.termsIntro : copy.cancellationIntro;

  const sections = kind === "privacy"
    ? [
        [copy.controllerTitle, copy.controllerText],
        [copy.dataTitle, copy.dataText],
        [copy.purposeTitle, copy.purposeText],
        [copy.retentionTitle, `${copy.retentionText} ${settings.privacy_retention_months} ${language === "tr" ? "ay" : language === "de" ? "Monate" : language === "hu" ? "hónap" : "months"}.`],
        [copy.rightsTitle, copy.rightsText],
        [copy.securityTitle, copy.securityText],
      ]
    : kind === "booking"
      ? [
          [copy.requestTitle, copy.requestText],
          [copy.paymentTitle, `${copy.paymentText} (${settings.payment_hold_hours} ${language === "tr" ? "saat" : language === "de" ? "Stunden" : language === "hu" ? "óra" : "hours"}.)`],
          [copy.stayTitle, `${copy.stayText} ${settings.check_in_time.slice(0, 5)} / ${settings.check_out_time.slice(0, 5)}.`],
          [copy.accuracyTitle, copy.accuracyText],
        ]
      : [
          [copy.freeCancellationTitle, copy.freeCancellationText],
          [copy.lateCancellationTitle, copy.lateCancellationText],
          [copy.refundTitle, copy.refundText],
          [copy.ownerCancellationTitle, copy.ownerCancellationText],
        ];

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="bg-[#faf8f5] px-5 py-16 text-[#292a2e] sm:px-8 sm:py-24 lg:px-16">
        <article className="mx-auto max-w-4xl rounded-2xl border border-[#e2ddd4] bg-white p-6 shadow-[0_20px_60px_rgba(37,39,42,.08)] sm:p-10 lg:p-14">
          <p className="eyebrow">{copy.policies}</p>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-.04em] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#66676b]">{intro}</p>

          <div className="mt-8 grid gap-3 rounded-xl bg-[#f3efe8] p-5 text-sm sm:grid-cols-2">
            <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#765f37]" /><strong>{settings.legal_operator_name}</strong></p>
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-[#765f37]" />{settings.legal_operator_address}</p>
            <p className="flex items-start gap-2 sm:col-span-2"><Mail className="mt-0.5 size-4 shrink-0 text-[#765f37]" /><a className="break-all underline underline-offset-4" href={`mailto:${settings.contact_email}`}>{settings.contact_email || CONTACT_EMAIL}</a></p>
          </div>

          <div className="mt-10 divide-y divide-[#ebe6de]">
            {sections.map(([heading, body]) => (
              <section key={heading} className="py-7 first:pt-0 last:pb-0">
                <h2 className="text-xl font-semibold tracking-[-.02em]">{heading}</h2>
                <p className="mt-3 text-base leading-8 text-[#66676b]">{body}</p>
              </section>
            ))}
          </div>
          <p className="mt-10 flex items-center gap-2 border-t border-[#ebe6de] pt-5 text-xs text-[#77787b]"><Clock3 className="size-4" />{copy.policyUpdated}</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
