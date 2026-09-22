"use client";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Language } from "@/app/site-content";
import { secondaryCopy } from "@/app/secondary-content";
import { useLanguage } from "@/components/site/language-provider";

const routes = [
  ["/", "home"],
  ["/about", "about"],
  ["/rooms", "rooms"],
  ["/blog", "blog"],
  ["/contact", "contact"],
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const copy = secondaryCopy[language];
  const textTone = overlay ? "text-white" : "text-[#26272b]";
  const subtleBorder = overlay ? "border-white/20" : "border-[#ded8cf]";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header
      className={`${
        overlay ? "absolute inset-x-0 top-0" : "relative bg-white"
      } z-40 ${textTone}`}
    >
      <div className="mx-auto flex min-h-24 w-full max-w-[1630px] items-center justify-between px-5 sm:px-8 lg:min-h-28">
        <a href="/" aria-label="Relax Villa home" className="group flex items-center gap-3">
          <span className="relative grid h-12 w-16 place-items-center" aria-hidden="true">
            <span
              className={`absolute left-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] ${
                overlay ? "border-white/25" : "border-[#2d2f33]/15"
              }`}
            />
            <span className="absolute right-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] border-[#ad9872] border-l-transparent" />
          </span>
          <span className="hidden text-left text-[11px] font-semibold uppercase leading-tight tracking-[.24em] sm:block">
            Relax
            <br />
            Villa
          </span>
        </a>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-7" aria-label="Main navigation">
          {routes.map(([href, key]) => (
            <a
              key={href}
              href={href}
              className={`border-b py-2 text-[11px] font-semibold uppercase tracking-[.12em] transition ${
                pathname === href
                  ? "border-[#b9a176] text-[#b9a176]"
                  : `border-transparent ${overlay ? "text-white/75 hover:text-white" : "text-[#6e6f72] hover:text-[#26272b]"}`
              }`}
            >
              {copy.navigation[key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={`hidden items-center rounded-full border p-1 backdrop-blur-md md:flex ${subtleBorder} ${
              overlay ? "bg-black/10" : "bg-[#faf8f5]"
            }`}
            aria-label={copy.navigation.language}
          >
            {(["en", "de", "hu"] as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
                  language === item
                    ? overlay
                      ? "bg-white text-[#27282c]"
                      : "bg-[#2d2f33] text-white"
                    : overlay
                      ? "text-white/75 hover:text-white"
                      : "text-[#747579] hover:text-[#27282c]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <a
            href="/#availability"
            className="hidden min-h-11 items-center rounded-full bg-[#aa9771] px-4 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#95825f] sm:inline-flex xl:px-6"
          >
            {copy.navigation.book}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={copy.navigation.menu}
            className={`relative z-[60] grid size-11 place-items-center rounded-full border backdrop-blur-md transition lg:hidden ${subtleBorder} ${
              overlay
                ? "bg-black/10 hover:bg-white hover:text-[#27282c]"
                : "bg-[#faf8f5] hover:bg-[#2d2f33] hover:text-white"
            }`}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label={copy.navigation.menu}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
          />
          <div
            id="mobile-site-menu"
            className="fixed inset-x-4 top-20 z-50 max-h-[calc(100dvh-6rem)] origin-top overflow-y-auto rounded-[3px] border border-white/10 bg-[#24262d]/[.98] p-7 text-white shadow-2xl backdrop-blur-xl sm:right-8 sm:left-auto sm:w-[380px] lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Menu navigation">
              {routes.map(([href, key]) => (
                <a
                  key={href}
                  href={href}
                  className="border-b border-white/10 py-4 text-left text-sm font-semibold uppercase tracking-[.13em] text-white/75 transition hover:pl-2 hover:text-white"
                >
                  {copy.navigation[key]}
                </a>
              ))}
              <a
                href="/#availability"
                className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-[#aa9771] px-6 text-center text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#95825f]"
              >
                {copy.navigation.book}
              </a>
            </nav>
            <div className="mt-6 flex gap-2 md:hidden">
              {(["en", "de", "hu"] as Language[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLanguage(item);
                    setMenuOpen(false);
                  }}
                  className={`flex-1 rounded-full border border-white/20 py-2 text-xs uppercase ${
                    language === item ? "bg-white text-[#24262d]" : "text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
