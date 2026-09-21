"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Banknote, CalendarRange, Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MonthlyRate } from "@/lib/supabase/types";
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

type RateForm = {
  month: string;
  weekdayRate: string;
  weekendRate: string;
  minimumNights: string;
  active: boolean;
};

const emptyForm: RateForm = {
  month: "",
  weekdayRate: "",
  weekendRate: "",
  minimumNights: "2",
  active: true,
};

function monthLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(
    new Date(`${value.slice(0, 7)}-01T12:00:00`),
  );
}

export function RatesView({ userId }: { userId: string }) {
  const [rates, setRates] = useState<MonthlyRate[]>([]);
  const [currency, setCurrency] = useState("HUF");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MonthlyRate | null>(null);
  const [form, setForm] = useState<RateForm>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const [ratesResult, settingsResult] = await Promise.all([
        supabase.from("monthly_rates").select("*").order("month", { ascending: true }),
        supabase.from("booking_settings").select("currency").eq("id", 1).maybeSingle(),
      ]);
      if (ratesResult.error) throw ratesResult.error;
      if (settingsResult.error) throw settingsResult.error;
      setRates((ratesResult.data ?? []) as MonthlyRate[]);
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

  function openCreate() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
    setEditing(null);
    setForm({
      ...emptyForm,
      month: `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`,
    });
    setDialogOpen(true);
  }

  function openEdit(rate: MonthlyRate) {
    setEditing(rate);
    setForm({
      month: rate.month.slice(0, 7),
      weekdayRate: String(rate.weekday_rate),
      weekendRate: String(rate.weekend_rate),
      minimumNights: String(rate.minimum_nights),
      active: rate.active,
    });
    setDialogOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const weekdayRate = Number(form.weekdayRate);
      const weekendRate = Number(form.weekendRate);
      const minimumNights = Number(form.minimumNights);
      if (!form.month || weekdayRate < 0 || weekendRate < 0 || minimumNights < 1 || minimumNights > 30) {
        throw new Error("Lütfen fiyat ve minimum gece alanlarını geçerli değerlerle doldurun.");
      }

      const payload = {
        month: `${form.month}-01`,
        weekday_rate: weekdayRate,
        weekend_rate: weekendRate,
        minimum_nights: minimumNights,
        active: form.active,
        updated_by: userId,
      };
      const supabase = getSupabaseBrowserClient();
      const result = editing
        ? await supabase.from("monthly_rates").update(payload).eq("id", editing.id)
        : await supabase.from("monthly_rates").insert(payload);
      if (result.error) throw result.error;

      setDialogOpen(false);
      await load();
      setFeedback({
        tone: "success",
        message: editing ? "Dönem fiyatı güncellendi." : "Yeni dönem fiyatı eklendi.",
      });
    } catch (caught) {
      const message = getErrorMessage(caught, "Fiyat kaydedilemedi.");
      setFeedback({
        tone: "error",
        message: message.includes("monthly_rates_month_key")
          ? "Bu ay için zaten bir fiyat tanımı var. Mevcut kaydı düzenleyin."
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(rate: MonthlyRate) {
    if (!window.confirm(`${monthLabel(rate.month)} fiyatını kalıcı olarak silmek istiyor musunuz?`)) return;
    setDeletingId(rate.id);
    setFeedback(null);
    try {
      const { error } = await getSupabaseBrowserClient().from("monthly_rates").delete().eq("id", rate.id);
      if (error) throw error;
      await load();
      setFeedback({ tone: "success", message: "Dönem fiyatı silindi." });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Fiyat silinemedi.") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Fiyat yönetimi"
        title="Dönemsel fiyatlar"
        description="Her ay için hafta içi ve hafta sonu gecelik ücretlerini, minimum konaklama süresiyle birlikte tanımlayın."
        action={<Button onClick={openCreate} className="w-full sm:w-auto"><Plus className="size-4" />Yeni ay ekle</Button>}
      />

      <FeedbackBanner feedback={feedback} />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />Yenile
        </Button>
      </div>

      {loading ? (
        <BusyState label="Dönem fiyatları yükleniyor…" />
      ) : rates.length === 0 ? (
        <EmptyState title="Henüz dönem fiyatı yok" description="Rezervasyon hesabının çalışması için ilk aylık fiyatı ekleyin." icon={<Banknote className="size-5" />} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {rates.map((rate) => (
            <article key={rate.id} className={`${panelClass} overflow-hidden`}>
              <div className="flex items-start justify-between gap-4 border-b border-[#ebe7e0] bg-[#faf8f5] px-5 py-4">
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#988461] uppercase">Fiyat dönemi</p>
                  <h2 className="mt-1.5 text-lg font-semibold capitalize tracking-[-0.025em]">{monthLabel(rate.month)}</h2>
                </div>
                <Badge variant="outline" className={rate.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}>
                  {rate.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#ebe7e0] px-5 py-5">
                <div className="pr-4">
                  <p className="text-xs text-[#85868a]">Hafta içi / gece</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em]">{formatMoney(rate.weekday_rate, currency)}</p>
                </div>
                <div className="pl-4">
                  <p className="text-xs text-[#85868a]">Hafta sonu / gece</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-[-0.03em]">{formatMoney(rate.weekend_rate, currency)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[#ebe7e0] px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-xs text-[#7e7f82]"><CalendarRange className="size-3.5" />Minimum {rate.minimum_nights} gece</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(rate)}><Edit3 className="size-4" />Düzenle</Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => void remove(rate)} disabled={deletingId === rate.id} className="text-red-600 hover:bg-red-50 hover:text-red-700" aria-label="Fiyatı sil">
                    {deletingId === rate.id ? <InlineSpinner /> : <Trash2 className="size-4" />}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Dönem fiyatını düzenle" : "Yeni dönem fiyatı"}</DialogTitle>
            <DialogDescription>Seçilen ay boyunca rezervasyon hesaplamasında kullanılacak gecelik ücretleri belirleyin.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="grid gap-5">
            <Field label="Ay">
              <input type="month" value={form.month} onChange={(event) => setForm((current) => ({ ...current, month: event.target.value }))} required className={adminInputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Hafta içi gecelik ücret (${currency})`}>
                <input type="number" min="0" step="1" inputMode="numeric" value={form.weekdayRate} onChange={(event) => setForm((current) => ({ ...current, weekdayRate: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label={`Hafta sonu gecelik ücret (${currency})`}>
                <input type="number" min="0" step="1" inputMode="numeric" value={form.weekendRate} onChange={(event) => setForm((current) => ({ ...current, weekendRate: event.target.value }))} required className={adminInputClass} />
              </Field>
            </div>
            <Field label="Minimum konaklama" hint="1 ile 30 gece arasında bir değer girin.">
              <input type="number" min="1" max="30" step="1" inputMode="numeric" value={form.minimumNights} onChange={(event) => setForm((current) => ({ ...current, minimumNights: event.target.value }))} required className={adminInputClass} />
            </Field>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
              <span>
                <span className="block text-sm font-semibold">Rezervasyona açık</span>
                <span className="mt-1 block text-xs leading-5 text-[#7f8083]">Pasif dönemler müşteriye fiyat vermez.</span>
              </span>
              <Switch checked={form.active} onCheckedChange={(checked) => setForm((current) => ({ ...current, active: checked }))} />
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Vazgeç</Button>
              <Button type="submit" disabled={saving}>{saving ? <InlineSpinner /> : null}{saving ? "Kaydediliyor…" : "Kaydet"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
