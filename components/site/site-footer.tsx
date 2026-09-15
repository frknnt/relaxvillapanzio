"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { secondaryCopy } from "@/app/secondary-content";
import { useLanguage } from "@/components/site/language-provider";

export function SiteFooter() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const links = [
    ["/", copy.navigation.home],
    ["/about", copy.navigation.about],
    ["/rooms", copy.navigation.rooms],
    ["/blog", copy.navigation.blog],
    ["/contact", copy.navigation.contact],
  ] as const;

  return (
    <footer className="relative min-h-[510px] px-6 py-28 text-white sm:px-10 lg:px-16">
      <img
        src="/images/footer.jpg"
        alt="Relax Villa"
        className="absolute inset-0 h-full w-full object-cover grayscale"
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
            {copy.common.contactPending}
          </address>
        </div>
        <div>
          <h3 className="text-sm font-bold">{copy.common.explore}</h3>
          <nav className="mt-5 flex flex-col gap-3 text-sm text-white/65">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="w-fit transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-bold">{copy.common.booking}</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            {copy.common.wholeVilla} {copy.common.bookingNote}
          </p>
          <Link
            href="/#availability"
            className="mt-7 inline-flex items-center gap-3 border-b border-[#d2bd92] pb-2 text-xs font-semibold uppercase tracking-[.15em] text-[#d2bd92]"
          >
            {copy.common.availability}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
