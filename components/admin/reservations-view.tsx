"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ban,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  PawPrint,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Reservation, ReservationStatus } from "@/lib/supabase/types";
import {
  adminInputClass,
  adminTextareaClass,
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  formatDate,
  formatMoney,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  payment_pending: "Ödeme bekleniyor",
  confirmed: "Onaylandı",
  cancelled: "İptal edildi",
  expired: "Süresi doldu",
};

const PAYMENT_LABELS: Record<Reservation["payment_status"], string> = {
  awaiting_transfer: "Havale bekleniyor",
  received: "Ödeme alındı",
  refunded: "İade edildi",
};

function statusClass(status: ReservationStatus) {
  if (status === "confirmed") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "payment_pending") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "cancelled") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function toDateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ReservationStatus>("all");
  const [timing, setTiming] = useState<"all" | "upcoming" | "past">("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionStatus, setActionStatus] = useState<ReservationStatus | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const items = (data ?? []) as Reservation[];
      setReservations(items);
      setSelected((current) =>
        current ? items.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (caught) {
      setFeedback({
        tone: "error",
        message: getErrorMessage(caught, "Rezervasyonlar yüklenemedi."),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr");
    const today = localDateString();
    return reservations.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.guest_name, item.reference_code, item.email, item.phone]
          .join(" ")
          .toLocaleLowerCase("tr")
          .includes(normalized);
      const matchesStatus = status === "all" || item.status === status;
      const matchesTiming =
        timing === "all" ||
        (timing === "upcoming" ? item.check_out >= today : item.check_out < today);
      return matchesQuery && matchesStatus && matchesTiming;
    });
  }, [query, reservations, status, timing]);

  async function changeStatus(nextStatus: ReservationStatus) {
    if (!selected) return;
    setActionStatus(nextStatus);
    setFeedback(null);
    try {
      const { error } = await getSupabaseBrowserClient().rpc(
        "admin_set_reservation_status",
        {
          p_reservation_id: selected.id,
          p_status: nextStatus,
          p_note: actionNote.trim(),
        },
      );
      if (error) throw error;
      await load();
      setActionNote("");
      setFeedback({
        tone: "success",
        message:
          nextStatus === "confirmed"
            ? "Ödeme alındı ve rezervasyon onaylandı."
            : nextStatus === "cancelled"
              ? "Rezervasyon iptal edildi."
              : "Rezervasyon ödeme bekliyor durumuna yeniden açıldı.",
      });
    } catch (caught) {
      setFeedback({
        tone: "error",
        message: getErrorMessage(caught, "Rezervasyon durumu değiştirilemedi."),
      });
    } finally {
      setActionStatus(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Rezervasyon yönetimi"
        title="Rezervasyonlar"
        description="Havale bekleyen talepleri inceleyin, ödeme geldiğinde onaylayın veya uygun olmayan rezervasyonları kapatın."
        action={
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
            Yenile
          </Button>
        }
      />

      <FeedbackBanner feedback={feedback} />

      <section className={`${panelClass} p-4 sm:p-5`}>
        <div className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_13rem_13rem_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#929397]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="İsim, e-posta veya referans ara"
              className={`${adminInputClass} pl-9`}
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className={adminInputClass}>
            <option value="all">Tüm durumlar</option>
            <option value="payment_pending">Ödeme bekleyen</option>
            <option value="confirmed">Onaylı</option>
            <option value="cancelled">İptal</option>
            <option value="expired">Süresi dolan</option>
          </select>
          <select value={timing} onChange={(event) => setTiming(event.target.value as typeof timing)} className={adminInputClass}>
            <option value="all">Tüm tarihler</option>
            <option value="upcoming">Yaklaşan / aktif</option>
            <option value="past">Geçmiş</option>
          </select>
          <div className="flex items-center justify-end rounded-lg bg-[#f3f0eb] px-3 text-xs font-medium text-[#77716a]">
            {filtered.length} kayıt
          </div>
        </div>
      </section>

      {loading ? (
        <BusyState label="Rezervasyonlar yükleniyor…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={reservations.length === 0 ? "Henüz rezervasyon yok" : "Filtreye uygun sonuç yok"}
          description={reservations.length === 0 ? "Müşteri rezervasyonları burada listelenecek." : "Arama veya filtreleri değiştirerek tekrar deneyin."}
          icon={<BedDouble className="size-5" />}
        />
      ) : (
        <>
          <section className="grid gap-3 md:hidden">
            {filtered.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setActionNote("");
                }}
                className={`${panelClass} w-full p-4 text-left transition active:scale-[0.99]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#303135]">{item.guest_name}</p>
                    <p className="mt-1 font-mono text-[0.68rem] text-[#929397]">{item.reference_code}</p>
                  </div>
                  <Badge variant="outline" className={statusClass(item.status)}>{STATUS_LABELS[item.status]}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#55565a]">
                  <CalendarDays className="size-4 text-[#9a855f]" />
                  {formatDate(item.check_in)} – {formatDate(item.check_out)}
                </div>
                <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#eeeae4] pt-3">
                  <p className="text-xs text-[#85868a]">{item.adults + item.children} misafir{item.pets ? ` · ${item.pets} evcil hayvan` : ""}</p>
                  <p className="font-semibold">{formatMoney(item.total_price, item.currency)}</p>
                </div>
              </button>
            ))}
          </section>

          <section className={`${panelClass} hidden overflow-hidden md:block`}>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#faf8f5] hover:bg-[#faf8f5]">
                  <TableHead className="pl-5">Misafir</TableHead>
                  <TableHead>Konaklama</TableHead>
                  <TableHead>Kişi</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="pr-5 text-right">Detay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer" onClick={() => { setSelected(item); setActionNote(""); }}>
                    <TableCell className="pl-5">
                      <p className="max-w-48 truncate font-semibold text-[#303135]">{item.guest_name}</p>
                      <p className="mt-1 font-mono text-[0.66rem] text-[#97989b]">{item.reference_code}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatDate(item.check_in)}</p>
                      <p className="mt-1 text-xs text-[#85868a]">{formatDate(item.check_out)} çıkış</p>
                    </TableCell>
                    <TableCell>{item.adults + item.children}{item.pets ? <span className="ml-1 text-xs text-[#8b7652]">+{item.pets} 🐾</span> : null}</TableCell>
                    <TableCell className="font-semibold">{formatMoney(item.total_price, item.currency)}</TableCell>
                    <TableCell><Badge variant="outline" className={statusClass(item.status)}>{STATUS_LABELS[item.status]}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button size="sm" variant="ghost">İncele</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto p-0 sm:max-w-3xl">
          {selected ? (
            <>
              <DialogHeader className="border-b border-[#e9e5de] px-5 py-5 text-left sm:px-6">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <DialogTitle className="text-xl tracking-[-0.025em]">{selected.guest_name}</DialogTitle>
                  <Badge variant="outline" className={statusClass(selected.status)}>{STATUS_LABELS[selected.status]}</Badge>
                </div>
                <DialogDescription className="font-mono text-xs">{selected.reference_code} · {toDateTime(selected.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 px-5 py-5 sm:px-6">
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoCard icon={CalendarDays} label="Tarihler" value={`${formatDate(selected.check_in)} – ${formatDate(selected.check_out)}`} />
                  <InfoCard icon={Users} label="Misafir" value={`${selected.adults} yetişkin · ${selected.children} çocuk`} />
                  <InfoCard icon={PawPrint} label="Evcil hayvan" value={selected.pets ? `${selected.pets} adet` : "Yok"} />
                  <InfoCard icon={WalletCards} label="Ödeme" value={PAYMENT_LABELS[selected.payment_status]} />
                </section>

                <section className="grid gap-3 rounded-xl bg-[#f7f4ef] p-4 sm:grid-cols-2">
                  <a href={`mailto:${selected.email}`} className="flex min-w-0 items-center gap-2 text-sm text-[#4f5054] hover:text-[#8b7652]">
                    <Mail className="size-4 shrink-0" /><span className="truncate">{selected.email}</span>
                  </a>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-[#4f5054] hover:text-[#8b7652]">
                    <Phone className="size-4 shrink-0" />{selected.phone}
                  </a>
                </section>

                <section>
                  <h3 className="text-sm font-semibold">Fiyat özeti</h3>
                  <div className="mt-3 overflow-hidden rounded-xl border border-[#e7e2da]">
                    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#ebe7e0] px-4 py-3 text-sm">
                      <span className="text-[#717276]">Konaklama</span>
                      <strong>{formatMoney(selected.subtotal, selected.currency)}</strong>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#ebe7e0] px-4 py-3 text-sm">
                      <span className="text-[#717276]">Evcil hayvan ücreti</span>
                      <strong>{formatMoney(selected.pet_fee, selected.currency)}</strong>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-4 bg-[#faf8f5] px-4 py-3">
                      <span className="font-semibold">Toplam</span>
                      <strong className="text-lg">{formatMoney(selected.total_price, selected.currency)}</strong>
                    </div>
                  </div>
                </section>

                {selected.pricing_snapshot?.length ? (
                  <details className="rounded-xl border border-[#e7e2da] px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold">Gecelik fiyat dökümü ({selected.pricing_snapshot.length} gece)</summary>
                    <div className="mt-3 divide-y divide-[#eeeae4]">
                      {selected.pricing_snapshot.map((night) => (
                        <div key={night.date} className="flex items-center justify-between gap-3 py-2 text-xs">
                          <span>{formatDate(night.date)} · {night.kind === "weekend" ? "Hafta sonu" : "Hafta içi"}</span>
                          <strong>{formatMoney(night.rate, selected.currency)}</strong>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}

                {selected.notes ? (
                  <section>
                    <h3 className="text-sm font-semibold">Müşteri notu</h3>
                    <p className="mt-2 rounded-xl border border-[#e7e2da] bg-[#fffdf9] p-4 text-sm leading-6 text-[#55565a]">{selected.notes}</p>
                  </section>
                ) : null}

                <section className="border-t border-[#e9e5de] pt-5">
                  <label className="grid gap-2 text-sm font-medium">
                    İşlem notu <span className="font-normal text-[#8a8b8e]">(isteğe bağlı)</span>
                    <textarea
                      value={actionNote}
                      onChange={(event) => setActionNote(event.target.value)}
                      placeholder="Örn. Havale banka hesabında doğrulandı."
                      maxLength={1000}
                      className={adminTextareaClass}
                    />
                  </label>
                  {selected.hold_expires_at ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#85868a]"><Clock3 className="size-3.5" /> Bekleme süresi: {toDateTime(selected.hold_expires_at)}</p>
                  ) : null}
                </section>
              </div>

              <DialogFooter className="border-t border-[#e9e5de] px-5 py-4 sm:px-6">
                {selected.status !== "payment_pending" ? (
                  <Button variant="outline" onClick={() => void changeStatus("payment_pending")} disabled={Boolean(actionStatus)}>
                    {actionStatus === "payment_pending" ? <InlineSpinner /> : <RotateCcw className="size-4" />}
                    Yeniden aç
                  </Button>
                ) : null}
                {selected.status !== "cancelled" ? (
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => void changeStatus("cancelled")} disabled={Boolean(actionStatus)}>
                    {actionStatus === "cancelled" ? <InlineSpinner /> : <Ban className="size-4" />}
                    İptal et
                  </Button>
                ) : null}
                {selected.status !== "confirmed" ? (
                  <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => void changeStatus("confirmed")} disabled={Boolean(actionStatus)}>
                    {actionStatus === "confirmed" ? <InlineSpinner /> : <CheckCircle2 className="size-4" />}
                    Ödemeyi onayla
                  </Button>
                ) : null}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#e8e3dc] p-3.5">
      <div className="flex items-center gap-2 text-xs text-[#85868a]"><Icon className="size-3.5 text-[#9a855f]" />{label}</div>
      <p className="mt-2 text-sm font-semibold leading-5 text-[#38393c]">{value}</p>
    </div>
  );
}
