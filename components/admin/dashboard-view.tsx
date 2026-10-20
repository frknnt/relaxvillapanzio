"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  Banknote,
  BedDouble,
  CalendarCheck2,
  Clock3,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Reservation } from "@/lib/supabase/types";
import {
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  formatDate,
  formatMoney,
  getErrorMessage,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";

const STATUS_LABELS: Record<Reservation["status"], string> = {
  payment_pending: "Ödeme bekleniyor",
  confirmed: "Onaylandı",
  cancelled: "İptal",
  expired: "Süresi doldu",
};

function statusClass(status: Reservation["status"]) {
  if (status === "confirmed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "payment_pending") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function dateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nightsBetween(start: string, end: string) {
  return Math.max(
    0,
    Math.round(
      (new Date(`${end}T12:00:00`).getTime() -
        new Date(`${start}T12:00:00`).getTime()) /
        86_400_000,
    ),
  );
}

export function DashboardView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setReservations((data ?? []) as Reservation[]);
    } catch (caught) {
      setFeedback({
        tone: "error",
        message: getErrorMessage(caught, "Rezervasyon özeti yüklenemedi."),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const metrics = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(12, 0, 0, 0);
    const today = dateOnly(todayDate);
    const horizonDate = new Date(todayDate);
    horizonDate.setDate(horizonDate.getDate() + 30);
    const horizon = dateOnly(horizonDate);

    const pending = reservations.filter((item) => item.status === "payment_pending");
    const confirmed = reservations.filter((item) => item.status === "confirmed");
    const upcoming = confirmed.filter((item) => item.check_out > today);
    const occupiedNights = upcoming.reduce((total, item) => {
      const start = item.check_in < today ? today : item.check_in;
      const end = item.check_out > horizon ? horizon : item.check_out;
      return total + nightsBetween(start, end);
    }, 0);

    return {
      pendingCount: pending.length,
      pendingValue: pending.reduce((total, item) => total + item.total_price, 0),
      upcomingCount: upcoming.length,
      confirmedRevenue: confirmed.reduce((total, item) => total + item.total_price, 0),
      occupiedNights,
      occupancy: Math.min(100, Math.round((occupiedNights / 30) * 100)),
      currency: reservations[0]?.currency ?? "HUF",
    };
  }, [reservations]);

  const cards = [
    {
      label: "Ödeme bekleyen",
      value: String(metrics.pendingCount),
      detail: formatMoney(metrics.pendingValue, metrics.currency),
      icon: Clock3,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Yaklaşan konaklama",
      value: String(metrics.upcomingCount),
      detail: "aktif onaylı rezervasyon",
      icon: CalendarCheck2,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Onaylı rezervasyon geliri",
      value: formatMoney(metrics.confirmedRevenue, metrics.currency),
      detail: "tüm zamanlar",
      icon: Banknote,
      iconClass: "bg-[#f4efe5] text-[#8b7550]",
    },
    {
      label: "30 günlük doluluk",
      value: `%${metrics.occupancy}`,
      detail: `${metrics.occupiedNights} gece dolu`,
      icon: TrendingUp,
      iconClass: "bg-sky-50 text-sky-700",
    },
  ];

  return (
    <div className="min-w-0 space-y-7">
      <SectionHeading
        eyebrow="Bugünün özeti"
        title="Genel bakış"
        description="Rezervasyon ve ödeme akışının güncel durumunu tek bakışta izleyin."
        action={
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
            Yenile
          </Button>
        }
      />

      <FeedbackBanner feedback={feedback} />

      {loading ? (
        <BusyState label="Panel özeti hazırlanıyor…" />
      ) : (
        <>
          <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className={`${panelClass} min-w-0 overflow-hidden p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid size-10 place-items-center rounded-xl ${card.iconClass}`}>
                      <Icon className="size-[1.1rem]" />
                    </div>
                    <ArrowDownRight className="size-4 text-[#d1ccc4]" />
                  </div>
                  <p className="mt-5 text-xs font-medium text-[#77787b]">{card.label}</p>
                  <p className="mt-1 break-words text-xl font-semibold tracking-[-0.035em] text-[#28292c] sm:text-2xl">{card.value}</p>
                  <p className="mt-1 text-xs text-[#98999b]">{card.detail}</p>
                </article>
              );
            })}
          </section>

          <section className={`${panelClass} min-w-0 overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebe7e0] px-4 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-[#303135]">Son rezervasyonlar</h2>
                <p className="mt-1 text-xs text-[#85868a]">En yeni başvurular ve ödeme durumları</p>
              </div>
              <span className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-xs font-semibold text-[#756b5d]">
                {reservations.length} toplam
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="Henüz rezervasyon yok"
                  description="Yeni rezervasyon talepleri geldiğinde burada görünecek."
                  icon={<BedDouble className="size-5" />}
                />
              </div>
            ) : (
              <div className="divide-y divide-[#eeeae4]">
                {reservations.slice(0, 6).map((reservation) => (
                  <article key={reservation.id} className="grid min-w-0 gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-center sm:px-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-[#303135]">{reservation.guest_name}</h3>
                        <span className="max-w-full truncate font-mono text-[0.66rem] text-[#96979a]">{reservation.reference_code}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#848589]">{reservation.email}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-[#3d3e41]">
                        {formatDate(reservation.check_in)} – {formatDate(reservation.check_out)}
                      </p>
                      <p className="mt-1 text-xs text-[#88898c]">
                        {reservation.adults + reservation.children} misafir · {formatMoney(reservation.total_price, reservation.currency)}
                      </p>
                    </div>
                    <Badge variant="outline" className={statusClass(reservation.status)}>
                      {STATUS_LABELS[reservation.status]}
                    </Badge>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
