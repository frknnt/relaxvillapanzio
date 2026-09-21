"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  Banknote,
  BedDouble,
  BookOpenText,
  CalendarOff,
  ChevronRight,
  CircleGauge,
  Images,
  LogOut,
  Menu,
  MessagesSquare,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export type AdminView =
  | "dashboard"
  | "reservations"
  | "support"
  | "rates"
  | "availability"
  | "blog"
  | "gallery"
  | "settings";

type NavItem = {
  id: AdminView;
  label: string;
  mobileLabel: string;
  icon: ComponentType<{ className?: string }>;
};

export const ADMIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Genel bakış", mobileLabel: "Özet", icon: CircleGauge },
  { id: "reservations", label: "Rezervasyonlar", mobileLabel: "Rezerv.", icon: BedDouble },
  { id: "support", label: "Destek talepleri", mobileLabel: "Destek", icon: MessagesSquare },
  { id: "rates", label: "Dönemsel fiyatlar", mobileLabel: "Fiyat", icon: Banknote },
  { id: "availability", label: "Kapalı tarihler", mobileLabel: "Takvim", icon: CalendarOff },
  { id: "blog", label: "Blog yazıları", mobileLabel: "Blog", icon: BookOpenText },
  { id: "gallery", label: "Galeri", mobileLabel: "Galeri", icon: Images },
  { id: "settings", label: "Rezervasyon ayarları", mobileLabel: "Ayar", icon: Settings2 },
];

const PRIMARY_MOBILE_NAV = ADMIN_NAV.slice(0, 4);
const SECONDARY_MOBILE_NAV = ADMIN_NAV.slice(4);

export function AdminShell({
  activeView,
  onViewChange,
  displayName,
  email,
  onSignOut,
  signingOut,
  children,
}: {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  displayName: string;
  email: string;
  onSignOut: () => void;
  signingOut: boolean;
  children: ReactNode;
}) {
  const activeLabel = ADMIN_NAV.find((item) => item.id === activeView)?.label;

  return (
    <div className="min-h-dvh bg-[#f5f2ed] text-[#2d2f33]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col bg-[#25272a] text-white lg:flex">
        <div className="border-b border-white/8 px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-white/20 text-[0.7rem] font-semibold tracking-[0.16em]">
              RV
            </span>
            <span>
              <span className="block text-sm font-semibold">Relax Villa</span>
              <span className="mt-0.5 block text-[0.65rem] tracking-[0.18em] text-white/40 uppercase">
                Yönetim paneli
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Yönetim menüsü">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition",
                  active
                    ? "bg-white text-[#292a2d] shadow-sm"
                    : "text-white/58 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon className={cn("size-[1.1rem]", active ? "text-[#9a855f]" : "text-white/42 group-hover:text-white/70")} />
                <span className="flex-1 font-medium">{item.label}</span>
                {active ? <ChevronRight className="size-3.5 text-[#aaa096]" /> : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/8 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#b59f75] text-xs font-bold text-[#26272b]">
              {(displayName || email).slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{displayName || "Yönetici"}</span>
              <span className="block truncate text-xs text-white/38">{email}</span>
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onSignOut}
            disabled={signingOut}
            className="w-full justify-start text-white/55 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="size-4" />
            {signingOut ? "Çıkış yapılıyor…" : "Oturumu kapat"}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2ddd5] bg-[#f5f2ed]/90 px-4 backdrop-blur-md sm:px-6 lg:px-9">
          <div>
            <p className="text-[0.62rem] font-bold tracking-[0.2em] text-[#9a855f] uppercase lg:hidden">Relax Villa</p>
            <p className="text-sm font-semibold text-[#38393c]">{activeLabel}</p>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <span className="hidden max-w-32 truncate text-xs text-[#77787b] sm:block">{displayName || email}</span>
            <button
              type="button"
              onClick={onSignOut}
              disabled={signingOut}
              className="grid size-9 place-items-center rounded-full border border-[#dcd6ce] bg-white text-[#5e5f62] shadow-sm"
              aria-label="Oturumu kapat"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[96rem] p-4 pb-28 sm:p-6 sm:pb-28 lg:p-9 lg:pb-10">
          {children}
        </main>
      </div>

      <nav
        aria-label="Mobil yönetim menüsü"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#ded9d1] bg-white/96 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_rgba(35,36,39,0.08)] backdrop-blur-xl lg:hidden"
      >
        <div className="grid h-[4.35rem] grid-cols-5 items-stretch px-1.5">
          {PRIMARY_MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "relative flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[0.6rem] font-semibold transition",
                  active ? "text-[#8c7854]" : "text-[#85868a]",
                )}
              >
                {active ? <span className="absolute top-0 h-0.5 w-7 rounded-full bg-[#9a855f]" /> : null}
                <Icon className="size-[1.15rem]" />
                <span>{item.mobileLabel}</span>
              </button>
            );
          })}

          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className={cn(
                  "relative flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[0.6rem] font-semibold transition",
                  SECONDARY_MOBILE_NAV.some((item) => item.id === activeView)
                    ? "text-[#8c7854]"
                    : "text-[#85868a]",
                )}
                aria-label="Diğer yönetim bölümlerini aç"
              >
                {SECONDARY_MOBILE_NAV.some((item) => item.id === activeView) ? (
                  <span className="absolute top-0 h-0.5 w-7 rounded-full bg-[#9a855f]" />
                ) : null}
                <Menu className="size-[1.15rem]" />
                <span>Diğer</span>
              </button>
            </DrawerTrigger>

            <DrawerContent className="border-[#ded9d1] bg-[#f8f6f2] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
              <DrawerHeader className="px-1 pb-3 text-left">
                <DrawerTitle className="text-lg text-[#2d2f33]">Diğer bölümler</DrawerTitle>
                <DrawerDescription>İçerik ve rezervasyon ayarlarına buradan ulaşabilirsiniz.</DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-2">
                {SECONDARY_MOBILE_NAV.map((item) => {
                  const Icon = item.icon;
                  const active = activeView === item.id;
                  return (
                    <DrawerClose asChild key={item.id}>
                      <button
                        type="button"
                        onClick={() => onViewChange(item.id)}
                        className={cn(
                          "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left transition",
                          active
                            ? "border-[#cdbf9f] bg-[#eee7da] text-[#755f3b]"
                            : "border-[#e3ded6] bg-white text-[#484a4e]",
                        )}
                      >
                        <span className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl",
                          active ? "bg-[#9a855f] text-white" : "bg-[#f1ede7] text-[#817052]",
                        )}>
                          <Icon className="size-[1.1rem]" />
                        </span>
                        <span className="flex-1 text-sm font-semibold">{item.label}</span>
                        <ChevronRight className="size-4 text-[#aaa096]" />
                      </button>
                    </DrawerClose>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
    </div>
  );
}
