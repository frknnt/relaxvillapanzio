"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CalendarOff, Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";
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
import type { AvailabilityBlock } from "@/lib/supabase/types";
import {
  adminInputClass,
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  Field,
  formatDate,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";

type BlockForm = {
  label: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

const emptyForm: BlockForm = {
  label: "Kapalı tarih",
  startDate: "",
  endDate: "",
  active: true,
};

function nightCount(start: string, end: string) {
  return Math.max(
    0,
    Math.round(
      (new Date(`${end}T12:00:00`).getTime() -
        new Date(`${start}T12:00:00`).getTime()) /
        86_400_000,
    ),
  );
}

export function AvailabilityView({ userId }: { userId: string }) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AvailabilityBlock | null>(null);
  const [form, setForm] = useState<BlockForm>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("availability_blocks")
        .select("*")
        .order("start_date", { ascending: true });
      if (error) throw error;
      setBlocks((data ?? []) as AvailabilityBlock[]);
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Kapalı tarihler yüklenemedi.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(block: AvailabilityBlock) {
    setEditing(block);
    setForm({
      label: block.label,
      startDate: block.start_date,
      endDate: block.end_date,
      active: block.active,
    });
    setDialogOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      if (!form.label.trim() || !form.startDate || !form.endDate) {
        throw new Error("Açıklama ile başlangıç ve bitiş tarihlerini doldurun.");
      }
      if (form.endDate <= form.startDate) {
        throw new Error("Bitiş tarihi başlangıç tarihinden sonra olmalı.");
      }

      const payload = {
        label: form.label.trim(),
        start_date: form.startDate,
        end_date: form.endDate,
        active: form.active,
      };
      const supabase = getSupabaseBrowserClient();
      const result = editing
        ? await supabase.from("availability_blocks").update(payload).eq("id", editing.id)
        : await supabase.from("availability_blocks").insert({ ...payload, created_by: userId });
      if (result.error) throw result.error;

      setDialogOpen(false);
      await load();
      setFeedback({ tone: "success", message: editing ? "Kapalı tarih güncellendi." : "Yeni kapalı tarih eklendi." });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Kapalı tarih kaydedilemedi.") });
    } finally {
      setSaving(false);
    }
  }

  async function remove(block: AvailabilityBlock) {
    if (!window.confirm(`“${block.label}” tarih engelini silmek istiyor musunuz?`)) return;
    setDeletingId(block.id);
    setFeedback(null);
    try {
      const { error } = await getSupabaseBrowserClient().from("availability_blocks").delete().eq("id", block.id);
      if (error) throw error;
      await load();
      setFeedback({ tone: "success", message: "Kapalı tarih silindi." });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Kapalı tarih silinemedi.") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Takvim yönetimi"
        title="Kapalı tarihler"
        description="Bakım, özel kullanım veya farklı nedenlerle rezervasyona kapatmak istediğiniz tarih aralıklarını yönetin."
        action={<Button onClick={openCreate} className="w-full sm:w-auto"><Plus className="size-4" />Tarih kapat</Button>}
      />

      <FeedbackBanner feedback={feedback} />

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />Yenile
        </Button>
      </div>

      {loading ? (
        <BusyState label="Kapalı tarihler yükleniyor…" />
      ) : blocks.length === 0 ? (
        <EmptyState title="Kapalı tarih bulunmuyor" description="Takvim şu an yönetici kaynaklı bir engele sahip değil." icon={<CalendarOff className="size-5" />} />
      ) : (
        <section className={`${panelClass} overflow-hidden`}>
          <div className="divide-y divide-[#ebe7e0]">
            {blocks.map((block) => (
              <article key={block.id} className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,0.8fr)_auto] sm:items-center sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold text-[#303135]">{block.label}</h2>
                    <Badge variant="outline" className={block.active ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-slate-50 text-slate-600"}>
                      {block.active ? "Takvim kapalı" : "Pasif"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-[#88898d]">{nightCount(block.start_date, block.end_date)} gecelik engel</p>
                </div>
                <div className="rounded-xl bg-[#f7f4ef] px-4 py-3 text-sm">
                  <p className="font-medium">{formatDate(block.start_date)} – {formatDate(block.end_date)}</p>
                  <p className="mt-1 text-xs text-[#88898c]">Bitiş günü tekrar müsaittir</p>
                </div>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(block)}><Edit3 className="size-4" />Düzenle</Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => void remove(block)} disabled={deletingId === block.id} className="text-red-600 hover:bg-red-50 hover:text-red-700" aria-label="Kapalı tarihi sil">
                    {deletingId === block.id ? <InlineSpinner /> : <Trash2 className="size-4" />}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Kapalı tarihi düzenle" : "Tarih aralığını kapat"}</DialogTitle>
            <DialogDescription>Bu aralık müşteri rezervasyonlarında müsait görünmeyecek.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="grid gap-5">
            <Field label="Açıklama" hint="Örn. Villa bakımı veya özel kullanım">
              <input type="text" value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} maxLength={120} required className={adminInputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Başlangıç">
                <input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label="Bitiş (çıkış günü)">
                <input type="date" min={form.startDate || undefined} value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} required className={adminInputClass} />
              </Field>
            </div>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
              <span>
                <span className="block text-sm font-semibold">Engel aktif</span>
                <span className="mt-1 block text-xs leading-5 text-[#7f8083]">Pasif kayıtlar takvimi kapatmaz.</span>
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
