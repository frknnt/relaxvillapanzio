"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { professionalCopy } from "@/app/professional-copy";
import { secondaryCopy } from "@/app/secondary-content";
import type { Language } from "@/app/site-content";
import { useLanguage } from "@/components/site/language-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const routes = [["/", "home"], ["/about", "about"], ["/rooms", "rooms"], ["/blog", "blog"], ["/contact", "contact"]] as const;

function isActiveRoute(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const copy = secondaryCopy[language];
  const professional = professionalCopy[language];
  const textTone = overlay ? "text-white" : "text-[#26272b]";
  const subtleBorder = overlay ? "border-white/25" : "border-[#ded8cf]";

  return (
    <header className={`${overlay ? "absolute inset-x-0 top-0" : "relative bg-white"} z-40 ${textTone}`}>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#292a2e] shadow-xl transition focus:translate-y-0">{professional.skipToContent}</a>
      <div className="mx-auto flex min-h-24 w-full max-w-[1630px] items-center justify-between px-5 sm:px-8 lg:min-h-28">
        <Link href="/" aria-label="Relax Villa Panzió" className="group flex min-h-11 items-center gap-3">
          <span className="relative grid h-12 w-16 place-items-center" aria-hidden="true">
            <span className={`absolute left-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] ${overlay ? "border-white/25" : "border-[#2d2f33]/15"}`} />
            <span className="absolute right-0 h-8 w-12 -skew-x-12 rounded-full border-[9px] border-[#ad9872] border-l-transparent" />
          </span>
          <span className="hidden text-left text-[11px] font-semibold uppercase leading-tight tracking-[.24em] sm:block">Relax<br />Villa</span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-7" aria-label={copy.navigation.menu}>
          {routes.map(([href, key]) => {
            const active = isActiveRoute(pathname, href);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`min-h-11 border-b py-3 text-[11px] font-semibold uppercase tracking-[.12em] transition ${active ? "border-[#b9a176] text-[#b9a176]" : `border-transparent ${overlay ? "text-white/80 hover:text-white" : "text-[#606166] hover:text-[#26272b]"}`}`}>{copy.navigation[key]}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className={`hidden items-center rounded-full border p-1 backdrop-blur-md md:flex ${subtleBorder} ${overlay ? "bg-black/10" : "bg-[#faf8f5]"}`} aria-label={copy.navigation.language}>
            {(["en", "de", "hu", "tr"] as Language[]).map((item) => (
              <button key={item} type="button" aria-pressed={language === item} aria-label={`${copy.navigation.language}: ${item.toUpperCase()}`} onClick={() => setLanguage(item)} className={`min-h-9 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${language === item ? overlay ? "bg-white text-[#27282c]" : "bg-[#2d2f33] text-white" : overlay ? "text-white/80 hover:text-white" : "text-[#606166] hover:text-[#27282c]"}`}>{item}</button>
            ))}
          </div>
          <Link href="/#availability" className="hidden min-h-11 items-center rounded-full bg-[#806c45] px-4 text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#685630] sm:inline-flex xl:px-6">{copy.navigation.book}</Link>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button type="button" aria-label={copy.navigation.menu} className={`grid size-11 place-items-center rounded-full border backdrop-blur-md transition lg:hidden ${subtleBorder} ${overlay ? "bg-black/10 hover:bg-white hover:text-[#27282c]" : "bg-[#faf8f5] hover:bg-[#2d2f33] hover:text-white"}`}><Menu className="size-5" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(92vw,390px)] border-white/10 bg-[#24262d] p-0 text-white sm:max-w-[390px]">
              <SheetHeader className="border-b border-white/10 p-7 pr-14 text-left">
                <SheetTitle className="text-xl text-white">{professional.menuTitle}</SheetTitle>
                <SheetDescription className="text-white/60">{professional.menuDescription}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col px-7" aria-label={copy.navigation.menu}>
                {routes.map(([href, key]) => (
                  <SheetClose asChild key={href}>
                    <Link href={href} aria-current={isActiveRoute(pathname, href) ? "page" : undefined} className="flex min-h-14 items-center border-b border-white/10 text-sm font-semibold uppercase tracking-[.13em] text-white/80 transition hover:pl-2 hover:text-white">{copy.navigation[key]}</Link>
                  </SheetClose>
                ))}
                <SheetClose asChild><Link href="/#availability" className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-[#9b8355] px-6 text-center text-xs font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#b39b6b]">{copy.navigation.book}</Link></SheetClose>
              </nav>
              <div className="mt-7 grid grid-cols-4 gap-2 px-7" aria-label={copy.navigation.language}>
                {(["en", "de", "hu", "tr"] as Language[]).map((item) => (
                  <button key={item} type="button" aria-pressed={language === item} onClick={() => { setLanguage(item); setMenuOpen(false); }} className={`min-h-11 rounded-full border text-xs font-semibold uppercase ${language === item ? "border-white bg-white text-[#24262d]" : "border-white/20 text-white"}`}>{item}</button>
                ))}
              </div>
              <div className="mt-auto p-7 text-xs text-white/50">8257 Badacsonytomaj · Füredi út 5</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
