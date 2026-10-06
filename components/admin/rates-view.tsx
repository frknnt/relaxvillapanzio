"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CalendarRange,
  CheckCircle2,
  Copy,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  adminInputClass,
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  Field,
  formatMoney,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MonthlyRate, RoomMonthlyRate } from "@/lib/supabase/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";

const roomIds = [1, 2, 3, 4] as const;

type ManagedRate = {
  id: string;
  scope: "whole_villa" | "room";
  roomId: number | null;
  month: string;
  weekdayRate: number;
  weekendRate: number;
  minimumNights: number;
  active: boolean;
};

type RateRowForm = {
  weekdayRate: string;
  weekendRate: string;
  minimumNights: string;
  active: boolean;
};

type PlanForm = {
  month: string;
  wholeVilla: RateRowForm;
  rooms: Record<(typeof roomIds)[number], RateRowForm>;
};

type MonthPlan = {
  month: string;
  wholeVilla: ManagedRate | null;
  rooms: Array<ManagedRate | null>;
  complete: boolean;
};

const emptyRateRow = (): RateRowForm => ({
  weekdayRate: "",
  weekendRate: "",
  minimumNights: "2",
  active: true,
});

function emptyPlan(month = ""): PlanForm {
  return {
    month,
    wholeVilla: emptyRateRow(),
    rooms: {
      1: emptyRateRow(),
      2: emptyRateRow(),
      3: emptyRateRow(),
      4: emptyRateRow(),
    },
  };
}

function nextMonthValue() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${value.slice(0, 7)}-01T12:00:00`));
}

function rateToForm(rate: ManagedRate | null): RateRowForm {
  if (!rate) return emptyRateRow();
  return {
    weekdayRate: String(rate.weekdayRate),
    weekendRate: String(rate.weekendRate),
    minimumNights: String(rate.minimumNights),
    active: rate.active,
  };
}

function validateRateRow(row: RateRowForm, label: string) {
  const weekdayRate = Number(row.weekdayRate);
  const weekendRate = Number(row.weekendRate);
  const minimumNights = Number(row.minimumNights);
  if (
    row.weekdayRate.trim() === "" ||
    row.weekendRate.trim() === "" ||
    row.minimumNights.trim() === "" ||
    !Number.isFinite(weekdayRate) ||
    !Number.isFinite(weekendRate) ||
    !Number.isInteger(weekdayRate) ||
    !Number.isInteger(weekendRate) ||
    weekdayRate < 0 ||
    weekendRate < 0 ||
    !Number.isInteger(minimumNights) ||
    minimumNights < 1 ||
    minimumNights > 30
  ) {
    throw new Error(`${label} için geçerli fiyatları ve 1–30 arasında minimum geceyi girin.`);
  }
  return {
    weekday_rate: weekdayRate,
    weekend_rate: weekendRate,
    minimum_nights: minimumNights,
    active: row.active,
  };
}

function RateFields({
  label,
  value,
  currency,
  onChange,
}: {
  label: string;
  value: RateRowForm;
  currency: string;
  onChange: (next: RateRowForm) => void;
}) {
  return (
    <section className="rounded-xl border border-[#e5e0d8] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#2d2f33]">{label}</h3>
          <p className="mt-1 text-xs leading-5 text-[#7f8083]">Gecelik ücret ve minimum konaklama</p>
        </div>
        <label className="flex min-h-11 items-center gap-2 text-xs font-medium text-[#626469]">
          <span>{value.active ? "Aktif" : "Pasif"}</span>
          <Switch
            checked={value.active}
            onCheckedChange={(active) => onChange({ ...value, active })}
            aria-label={`${label} rezervasyona açık`}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={`Hafta içi (${currency})`}>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={value.weekdayRate}
            onChange={(event) => onChange({ ...value, weekdayRate: event.target.value })}
            required
            className={adminInputClass}
          />
        </Field>
        <Field label={`Hafta sonu (${currency})`}>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={value.weekendRate}
            onChange={(event) => onChange({ ...value, weekendRate: event.target.value })}
            required
            className={adminInputClass}
          />
        </Field>
      </div>
      <div className="mt-3 max-w-56">
        <Field label="Minimum gece">
          <input
            type="number"
            min="1"
            max="30"
            step="1"
            inputMode="numeric"
            value={value.minimumNights}
            onChange={(event) => onChange({ ...value, minimumNights: event.target.value })}
            required
            className={adminInputClass}
          />
        </Field>
      </div>
    </section>
  );
}

function RateSummary({
  label,
  rate,
  currency,
}: {
  label: string;
  rate: ManagedRate | null;
  currency: string;
}) {
  if (!rate) {
    return (
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <AlertTriangle aria-hidden="true" className="size-4" />
          {label}
        </div>
        <p className="mt-2 text-xs leading-5 text-amber-800">Fiyat girilmedi</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#e7e2da] bg-[#faf8f5] p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#303236]">{label}</p>
        <Badge
          variant="outline"
          className={
            rate.active
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }
        >
          {rate.active ? "Aktif" : "Pasif"}
        </Badge>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs text-[#77797d]">
        <div className="flex justify-between gap-3">
          <dt>Hafta içi</dt>
          <dd className="font-semibold text-[#303236]">{formatMoney(rate.weekdayRate, currency)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Hafta sonu</dt>
          <dd className="font-semibold text-[#303236]">{formatMoney(rate.weekendRate, currency)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Minimum</dt>
          <dd className="font-semibold text-[#303236]">{rate.minimumNights} gece</dd>
        </div>
      </dl>
    </div>
  );
}

export function RatesView({ userId }: { userId: string }) {
  const [rates, setRates] = useState<ManagedRate[]>([]);
  const [currency, setCurrency] = useState("HUF");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingMonth, setDeletingMonth] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planTab, setPlanTab] = useState("rooms");
  const [form, setForm] = useState<PlanForm>(() => emptyPlan(nextMonthValue()));
  const [adjustmentPercent, setAdjustmentPercent] = useState("10");

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const [villaResult, roomResult, settingsResult] = await Promise.all([
        supabase.from("monthly_rates").select("*").order("month", { ascending: true }),
        supabase
          .from("room_monthly_rates")
          .select("*")
          .order("month", { ascending: true })
          .order("room_id", { ascending: true }),
        supabase.from("booking_settings").select("currency").eq("id", 1).maybeSingle(),
      ]);
      if (villaResult.error) throw villaResult.error;
      if (roomResult.error) throw roomResult.error;
      if (settingsResult.error) throw settingsResult.error;

      const villaRates = (villaResult.data ?? []).map((rate) => {
        const item = rate as MonthlyRate;
        return {
          id: item.id,
          scope: "whole_villa" as const,
          roomId: null,
          month: item.month,
          weekdayRate: item.weekday_rate,
          weekendRate: item.weekend_rate,
          minimumNights: item.minimum_nights,
          active: item.active,
        };
      });
      const individualRates = (roomResult.data ?? []).map((rate) => {
        const item = rate as RoomMonthlyRate;
        return {
          id: item.id,
          scope: "room" as const,
          roomId: item.room_id,
          month: item.month,
          weekdayRate: item.weekday_rate,
          weekendRate: item.weekend_rate,
          minimumNights: item.minimum_nights,
          active: item.active,
        };
      });

      setRates(
        [...villaRates, ...individualRates].sort(
          (left, right) =>
            left.month.localeCompare(right.month) || (left.roomId ?? 0) - (right.roomId ?? 0),
        ),
      );
      setCurrency(String(settingsResult.data?.currency ?? "HUF"));
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Fiyatlar yüklenemedi.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const plans = useMemo<MonthPlan[]>(() => {
    const months = [...new Set(rates.map((rate) => rate.month))];
    return months.map((month) => {
      const wholeVilla = rates.find(
        (rate) => rate.month === month && rate.scope === "whole_villa",
      ) ?? null;
      const rooms = roomIds.map(
        (roomId) =>
          rates.find(
            (rate) => rate.month === month && rate.scope === "room" && rate.roomId === roomId,
          ) ?? null,
      );
      return {
        month,
        wholeVilla,
        rooms,
        complete: Boolean(wholeVilla) && rooms.every(Boolean),
      };
    });
  }, [rates]);

  function openPlan(month?: string) {
    const normalizedMonth = month?.slice(0, 7) ?? nextMonthValue();
    const wholeVilla = rates.find(
      (rate) => rate.month.slice(0, 7) === normalizedMonth && rate.scope === "whole_villa",
    ) ?? null;
    const roomForms = Object.fromEntries(
      roomIds.map((roomId) => [
        roomId,
        rateToForm(
          rates.find(
            (rate) =>
              rate.month.slice(0, 7) === normalizedMonth &&
              rate.scope === "room" &&
              rate.roomId === roomId,
          ) ?? null,
        ),
      ]),
    ) as PlanForm["rooms"];

    setForm({
      month: normalizedMonth,
      wholeVilla: rateToForm(wholeVilla),
      rooms: roomForms,
    });
    setPlanTab(wholeVilla ? "rooms" : "villa");
    setDialogOpen(true);
  }

  function copyPreviousMonth() {
    if (!form.month) return;
    const date = new Date(`${form.month}-01T12:00:00`);
    date.setMonth(date.getMonth() - 1);
    const previous = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const wholeVilla = rates.find((rate) => rate.month.slice(0, 7) === previous && rate.scope === "whole_villa") ?? null;
    const rooms = Object.fromEntries(roomIds.map((roomId) => [roomId, rateToForm(rates.find((rate) => rate.month.slice(0, 7) === previous && rate.scope === "room" && rate.roomId === roomId) ?? null)])) as PlanForm["rooms"];
    if (!wholeVilla || roomIds.some((roomId) => !rooms[roomId].weekdayRate)) {
      setFeedback({ tone: "error", message: `${monthLabel(previous)} için kopyalanabilecek eksiksiz fiyat planı bulunamadı.` });
      return;
    }
    setForm((current) => ({ ...current, wholeVilla: rateToForm(wholeVilla), rooms }));
  }

  function applyPercentageAdjustment() {
    const percent = Number(adjustmentPercent);
    if (!Number.isFinite(percent) || percent < -100 || percent > 500) {
      setFeedback({ tone: "error", message: "Fiyat değişimi %-100 ile %500 arasında olmalı." });
      return;
    }
    const adjust = (row: RateRowForm): RateRowForm => ({
      ...row,
      weekdayRate: row.weekdayRate ? String(Math.max(0, Math.round(Number(row.weekdayRate) * (1 + percent / 100)))) : "",
      weekendRate: row.weekendRate ? String(Math.max(0, Math.round(Number(row.weekendRate) * (1 + percent / 100)))) : "",
    });
    setForm((current) => ({ ...current, wholeVilla: adjust(current.wholeVilla), rooms: Object.fromEntries(roomIds.map((roomId) => [roomId, adjust(current.rooms[roomId])])) as PlanForm["rooms"] }));
  }

  function distributeVillaToRooms() {
    if (!form.wholeVilla.weekdayRate || !form.wholeVilla.weekendRate) {
      setFeedback({ tone: "error", message: "Önce tüm villa fiyatlarını girin." });
      return;
    }
    const base: RateRowForm = {
      weekdayRate: String(Math.round(Number(form.wholeVilla.weekdayRate) / 4)),
      weekendRate: String(Math.round(Number(form.wholeVilla.weekendRate) / 4)),
      minimumNights: form.wholeVilla.minimumNights,
      active: form.wholeVilla.active,
    };
    setForm((current) => ({ ...current, rooms: Object.fromEntries(roomIds.map((roomId) => [roomId, { ...base }])) as PlanForm["rooms"] }));
  }

  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      if (!userId) throw new Error("Yönetici oturumu bulunamadı. Lütfen yeniden giriş yapın.");
      if (!form.month) throw new Error("Lütfen fiyatlandırılacak ayı seçin.");
      const wholeVilla = validateRateRow(form.wholeVilla, "Tüm villa");
      const rooms = roomIds.map((roomId) => ({
        room_id: roomId,
        ...validateRateRow(form.rooms[roomId], `Oda ${roomId}`),
      }));

      const { error } = await getSupabaseBrowserClient().rpc("admin_upsert_monthly_rate_plan", {
        p_month: `${form.month}-01`,
        p_whole_villa: wholeVilla,
        p_rooms: rooms,
      });
      if (error) throw error;

      setDialogOpen(false);
      await load();
      setFeedback({
        tone: "success",
        message: `${monthLabel(form.month)} için tüm villa ve dört oda fiyatları kaydedildi.`,
      });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Fiyat planı kaydedilemedi.") });
    } finally {
      setSaving(false);
    }
  }

  async function removePlan(month: string) {
    setDeletingMonth(month);
    setFeedback(null);
    try {
      const { error } = await getSupabaseBrowserClient().rpc("admin_delete_monthly_rate_plan", {
        p_month: month,
      });
      if (error) throw error;
      await load();
      setFeedback({ tone: "success", message: "Aylık fiyat planı silindi." });
      setDeleteTarget(null);
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Fiyat planı silinemedi.") });
    } finally {
      setDeletingMonth(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Fiyat yönetimi"
        title="Aylık villa ve oda fiyatları"
        description="Her ay için tüm villa paketini ve dört odanın fiyatlarını tek ekrandan yönetin. Müşteri iki oda seçerse sistem seçilen iki odanın fiyatını otomatik toplar."
        action={
          <Button onClick={() => openPlan()} className="w-full sm:w-auto">
            <Plus aria-hidden="true" className="size-4" />
            Yeni ay fiyatları
          </Button>
        }
      />
      <FeedbackBanner feedback={feedback} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-[#6f7074]">
          Eksiksiz bir ayda 1 villa paketi ve 4 oda fiyatı bulunur.
        </p>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
          <RefreshCw aria-hidden="true" className={loading ? "size-4 animate-spin" : "size-4"} />
          Yenile
        </Button>
      </div>

      {loading ? (
        <BusyState label="Dönem fiyatları yükleniyor…" />
      ) : plans.length === 0 ? (
        <EmptyState
          title="Henüz aylık fiyat planı yok"
          description="Rezervasyon hesabını açmak için tüm villa ve dört oda fiyatlarını birlikte ekleyin."
          icon={<Banknote className="size-5" />}
        />
      ) : (
        <div className="space-y-5">
          {plans.map((plan) => (
            <article key={plan.month} className={`${panelClass} overflow-hidden`}>
              <div className="flex flex-col gap-4 border-b border-[#ebe7e0] bg-[#faf8f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full border border-[#d8cdbb] bg-white text-[#927d58]">
                    <CalendarRange aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold capitalize tracking-[-0.025em]">{monthLabel(plan.month)}</h2>
                    <p className="mt-0.5 text-xs text-[#7d7f82]">Tüm villa + {plan.rooms.filter(Boolean).length}/4 oda</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      plan.complete
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }
                  >
                    {plan.complete ? (
                      <CheckCircle2 aria-hidden="true" className="size-3.5" />
                    ) : (
                      <AlertTriangle aria-hidden="true" className="size-3.5" />
                    )}
                    {plan.complete ? "Eksiksiz" : "Eksik fiyat"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => openPlan(plan.month)} className="bg-white">
                    <Edit3 aria-hidden="true" className="size-4" />
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(plan.month)}
                    disabled={deletingMonth === plan.month}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    aria-label={`${monthLabel(plan.month)} fiyat planını sil`}
                  >
                    {deletingMonth === plan.month ? <InlineSpinner /> : <Trash2 aria-hidden="true" className="size-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-5">
                <RateSummary label="Tüm villa" rate={plan.wholeVilla} currency={currency} />
                {roomIds.map((roomId, index) => (
                  <RateSummary key={roomId} label={`Oda ${roomId}`} rate={plan.rooms[index]} currency={currency} />
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aylık fiyat planı</DialogTitle>
            <DialogDescription>
              Tüm villa paketini ve dört odanın ayrı fiyatlarını birlikte kaydedin. Birden fazla oda seçildiğinde oda fiyatları otomatik toplanır.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={savePlan} className="grid gap-5">
            <Field label="Fiyatlandırılacak ay">
              <input
                type="month"
                value={form.month}
                onChange={(event) => setForm((current) => ({ ...current, month: event.target.value }))}
                required
                className={adminInputClass}
              />
            </Field>

            <div className="grid gap-3 rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4 sm:grid-cols-[auto_minmax(9rem,.4fr)_auto] sm:items-end">
              <Button type="button" variant="outline" onClick={copyPreviousMonth} className="bg-white"><Copy className="size-4" />Önceki ayı kopyala</Button>
              <Field label="Tüm fiyatları değiştir (%)" hint="Eksi değer indirim uygular.">
                <input type="number" min="-100" max="500" step="1" value={adjustmentPercent} onChange={(event) => setAdjustmentPercent(event.target.value)} className={adminInputClass} />
              </Field>
              <Button type="button" variant="outline" onClick={applyPercentageAdjustment} className="bg-white">Oranı uygula</Button>
              <Button type="button" variant="outline" onClick={distributeVillaToRooms} className="bg-white sm:col-span-3">Villa fiyatını 4 odaya eşit bölüştür ve minimum geceyi uygula</Button>
            </div>

            <Tabs value={planTab} onValueChange={setPlanTab}>
              <TabsList className="grid h-11 w-full grid-cols-2">
                <TabsTrigger value="villa">Tüm villa</TabsTrigger>
                <TabsTrigger value="rooms">Oda fiyatları · 4 oda</TabsTrigger>
              </TabsList>
              <TabsContent value="villa" className="mt-3">
                <RateFields
                  label="Tüm villa · 4 oda"
                  value={form.wholeVilla}
                  currency={currency}
                  onChange={(wholeVilla) => setForm((current) => ({ ...current, wholeVilla }))}
                />
              </TabsContent>
              <TabsContent value="rooms" className="mt-3 grid gap-3 md:grid-cols-2">
                {roomIds.map((roomId) => (
                  <RateFields
                    key={roomId}
                    label={`Oda ${roomId}`}
                    value={form.rooms[roomId]}
                    currency={currency}
                    onChange={(room) =>
                      setForm((current) => ({
                        ...current,
                        rooms: { ...current.rooms, [roomId]: room },
                      }))
                    }
                  />
                ))}
              </TabsContent>
            </Tabs>

            <div className="rounded-lg border border-[#e1d8ca] bg-[#faf8f5] px-4 py-3 text-xs leading-5 text-[#66686c]">
              Kaydettiğinizde bu ayın villa paketi ve dört oda fiyatı tek işlemde güncellenir. Müşteri tarafındaki toplam fiyat anında seçilen odalara göre hesaplanır.
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Vazgeç
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <InlineSpinner /> : null}
                {saving ? "Kaydediliyor…" : "Tüm fiyatları kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Aylık fiyat planını sil"
        description={deleteTarget ? `${monthLabel(deleteTarget)} villa paketi ve tüm oda fiyatları kalıcı olarak silinecek.` : ""}
        busy={Boolean(deletingMonth)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && void removePlan(deleteTarget)}
      />
    </div>
  );
}
