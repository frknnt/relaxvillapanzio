"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CalendarDays, CheckCircle2, Clock3, Loader2 } from "lucide-react";

import { professionalCopy } from "@/app/professional-copy";
import { useLanguage } from "@/components/site/language-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { formatMoney } from "@/lib/booking/pricing";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { PublicReservationStatus } from "@/lib/supabase/types";

export default function ReservationStatusContent() {
  const { language } = useLanguage();
  const copy = professionalCopy[language];
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<PublicReservationStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!isSupabaseConfigured()) {
      setError(copy.statusError);
      return;
    }
    setLoading(true);
    try {
      const { data, error: requestError } = await getSupabaseBrowserClient().rpc("get_reservation_status", {
        p_reference: reference.trim().toUpperCase(),
        p_email: email.trim().toLowerCase(),
      });
      if (requestError) throw requestError;
      const item = (data?.[0] ?? null) as PublicReservationStatus | null;
      if (!item) setError(copy.statusNotFound);
      else setResult(item);
    } catch {
      setError(copy.statusError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-[70vh] bg-[#faf8f5] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="pt-4">
            <p className="eyebrow">Relax Villa Panzió</p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-[-.04em] text-[#292a2e] sm:text-5xl">{copy.statusTitle}</h1>
            <p className="mt-5 text-base leading-8 text-[#68696d]">{copy.statusIntro}</p>
          </div>
          <section className="rounded-2xl border border-[#e0dbd2] bg-white p-5 shadow-[0_20px_60px_rgba(37,39,42,.08)] sm:p-8">
            <form onSubmit={submit} autoComplete="off" className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[#45464a]">
                {copy.reference}
                <input value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} required minLength={10} maxLength={40} autoComplete="off" className="min-h-12 rounded-lg border border-[#dcd6cc] px-4 font-mono font-normal uppercase outline-none focus:border-[#78633e] focus:ring-2 focus:ring-[#78633e]/15" />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#45464a]">
                {copy.email}
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} autoComplete="off" className="min-h-12 rounded-lg border border-[#dcd6cc] px-4 font-normal outline-none focus:border-[#78633e] focus:ring-2 focus:ring-[#78633e]/15" />
              </label>
              <button disabled={loading} className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#303238] px-6 text-sm font-semibold text-white transition hover:bg-[#78633e] disabled:cursor-wait disabled:opacity-60">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}{copy.checkStatus}
              </button>
            </form>

            {error ? <p role="alert" className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm leading-6 text-red-800"><AlertCircle className="mt-1 size-4 shrink-0" />{error}</p> : null}
            {result ? (
              <div aria-live="polite" className="mt-6 space-y-4 border-t border-[#ebe6de] pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs uppercase tracking-[.14em] text-[#77623e]">{copy.reference}</p><p className="mt-1 font-mono text-lg font-bold">{result.reference_code}</p></div>
                  <span className="rounded-full bg-[#eee8dd] px-3 py-1.5 text-xs font-semibold text-[#5f4c2c]">{copy.statusLabels[result.status]}</span>
                </div>
                <dl className="grid gap-3 rounded-xl bg-[#f7f4ef] p-4 sm:grid-cols-2">
                  <div><dt className="text-xs text-[#77787b]">{copy.arrivalDeparture}</dt><dd className="mt-1 flex items-center gap-2 font-semibold"><CalendarDays className="size-4" />{result.check_in} — {result.check_out}</dd></div>
                  <div><dt className="text-xs text-[#77787b]">{copy.rooms}</dt><dd className="mt-1 font-semibold">{result.room_ids.map((id) => `${language === "tr" ? "Oda" : language === "de" ? "Zimmer" : language === "hu" ? "Szoba" : "Room"} ${id}`).join(", ")}</dd></div>
                  <div><dt className="text-xs text-[#77787b]">{copy.total}</dt><dd className="mt-1 font-semibold">{formatMoney(result.total_price, result.currency, language)}</dd></div>
                  <div><dt className="text-xs text-[#77787b]">{copy.paymentLabels[result.payment_status]}</dt><dd className="mt-1 font-semibold">{copy.statusLabels[result.status]}</dd></div>
                </dl>
                {result.status === "payment_pending" && result.hold_expires_at ? <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><Clock3 className="mt-0.5 size-4 shrink-0" />{copy.holdDeadline}: {new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Budapest" }).format(new Date(result.hold_expires_at))}</p> : null}
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
