"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

import { secondaryCopy } from "@/app/secondary-content";
import { professionalCopy } from "@/app/professional-copy";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/app/site-config";
import { useLanguage } from "@/components/site/language-provider";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

function navigateReliably(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.location.assign(event.currentTarget.href);
}

export function SiteFooter() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const professional = professionalCopy[language];
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);
  const [contactEmail, setContactEmail] = useState(CONTACT_EMAIL);
  const links = [
    ["/", copy.navigation.home],
    ["/about", copy.navigation.about],
    ["/rooms", copy.navigation.rooms],
    ["/blog", copy.navigation.blog],
    ["/contact", copy.navigation.contact],
  ] as const;

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    void getSupabaseBrowserClient()
      .from("booking_settings")
      .select("whatsapp_number, contact_email")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.whatsapp_number) {
          setWhatsappNumber(String(data.whatsapp_number));
        }
        if (active && data?.contact_email) {
          setContactEmail(String(data.contact_email));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="relative min-h-[510px] px-6 py-28 text-white sm:px-10 lg:px-16">
      <Image
        src="/images/footer.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-[#20232a]/90" />
      <div className="relative mx-auto grid max-w-[1500px] gap-14 md:grid-cols-[1.1fr_.8fr_1.1fr]">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-white/20 text-sm font-bold text-[#d6c29b]">
              RV
            </span>
            <span className="text-sm font-semibold uppercase tracking-[.2em]">Relax Villa Panzio</span>
          </div>
          <h3 className="text-sm font-bold">{copy.common.contact}</h3>
          <address className="mt-5 max-w-xs not-italic text-sm leading-7 text-white/65">
            {copy.common.address}
            <br />
            {whatsappNumber || copy.common.contactPending}
            {contactEmail ? (
              <>
                <br />
                <a href={`mailto:${contactEmail}`} className="break-all transition hover:text-white">
                  {contactEmail}
                </a>
              </>
            ) : null}
          </address>
        </div>
        <div>
          <h3 className="text-sm font-bold">{copy.common.explore}</h3>
          <nav className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            {links.map(([href, label]) => (
              <Link key={href} href={href} onClick={navigateReliably} className="w-fit transition hover:text-white">
                {label}
              </Link>
            ))}
            <Link href="/reservation-status" onClick={navigateReliably} className="w-fit transition hover:text-white">{professional.trackBooking}</Link>
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-bold">{copy.common.booking}</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            {copy.common.wholeVilla} {copy.common.bookingNote}
          </p>
          <Link
            href="/#availability"
            onClick={navigateReliably}
            className="mt-7 inline-flex items-center gap-3 border-b border-[#d2bd92] pb-2 text-xs font-semibold uppercase tracking-[.15em] text-[#d2bd92]"
          >
            {copy.common.availability}
            <ArrowRight className="size-4" />
          </Link>
          <div className="mt-8 border-t border-white/15 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/45">{professional.policies}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/65">
              <Link href="/privacy" onClick={navigateReliably} className="hover:text-white">{professional.privacy}</Link>
              <Link href="/booking-terms" onClick={navigateReliably} className="hover:text-white">{professional.bookingTerms}</Link>
              <Link href="/cancellation-policy" onClick={navigateReliably} className="hover:text-white">{professional.cancellation}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
