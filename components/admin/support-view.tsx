"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock3,
  Mail,
  MessagesSquare,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminInputClass,
  adminTextareaClass,
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SupportRequest, SupportStatus } from "@/lib/supabase/types";

const STATUS_LABELS: Record<SupportStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  resolved: "Çözüldü",
  closed: "Kapalı",
};

const LANGUAGE_LABELS = {
  en: "İngilizce",
  de: "Almanca",
  hu: "Macarca",
} as const;

function statusClass(status: SupportStatus) {
  if (status === "new") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "in_progress") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "resolved") return "border-emerald-200 bg-emerald-50 text-emerald-700";
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

export function SupportView({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | SupportStatus>("all");
  const [selected, setSelected] = useState<SupportRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const items = (data ?? []) as SupportRequest[];
      setRequests(items);
      setSelected((current) =>
        current ? items.find((item) => item.id === current.id) ?? null : null,
      );
    } catch (caught) {
      setFeedback({
        tone: "error",
        message: getErrorMessage(caught, "Destek talepleri yüklenemedi."),
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
    return requests.filter((request) => {
      const matchesQuery =
        !normalized ||
        [request.name, request.email, request.phone, request.message]
          .join(" ")
          .toLocaleLowerCase("tr")
          .includes(normalized);
      return matchesQuery && (filter === "all" || request.status === filter);
    });
  }, [filter, query, requests]);

  function openRequest(request: SupportRequest) {
    setSelected(request);
    setAdminNotes(request.admin_notes);
  }

  async function saveRequest(nextStatus: SupportStatus) {
    if (!selected) return;
    setSaving(true);
    setFeedback(null);
    const resolved = nextStatus === "resolved" || nextStatus === "closed";

    try {
      const { error } = await getSupabaseBrowserClient()
        .from("support_requests")
        .update({
          status: nextStatus,
          admin_notes: adminNotes.trim(),
          resolved_at: resolved ? selected.resolved_at ?? new Date().toISOString() : null,
          resolved_by: resolved ? userId : null,
        })
        .eq("id", selected.id);
      if (error) throw error;
      await load();
      setFeedback({ tone: "success", message: "Destek talebi güncellendi." });
    } catch (caught) {
      setFeedback({
        tone: "error",
        message: getErrorMessage(caught, "Destek talebi güncellenemedi."),
      });
    } finally {
      setSaving(false);
    }
  }

  const newCount = requests.filter((request) => request.status === "new").length;

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Müşteri iletişimi"
        title="Destek talepleri"
        description="İletişim sayfasından gelen mesajları okuyun, müşteriye ulaşın ve çözüm durumunu takip edin."
        action={
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />
            Yenile
          </Button>
        }
      />

      <FeedbackBanner feedback={feedback} />

      <section className={`${panelClass} grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:p-5`}>
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#929397]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="İsim, e-posta, telefon veya mesaj ara"
            className={`${adminInputClass} pl-9`}
          />
        </label>
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className={adminInputClass}>
          <option value="all">Tüm durumlar</option>
          <option value="new">Yeni</option>
          <option value="in_progress">İşlemde</option>
          <option value="resolved">Çözüldü</option>
          <option value="closed">Kapalı</option>
        </select>
        <div className="flex items-center justify-end rounded-lg bg-[#f3f0eb] px-3 text-xs font-medium text-[#77716a]">
          {newCount} yeni · {filtered.length} sonuç
        </div>
      </section>

      {loading ? (
        <BusyState label="Destek talepleri yükleniyor…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={requests.length ? "Filtreye uygun talep yok" : "Henüz destek talebi yok"}
          description={requests.length ? "Arama veya durum filtresini değiştirin." : "İletişim formundan gelen mesajlar burada listelenecek."}
          icon={<MessagesSquare className="size-5" />}
        />
      ) : (
        <>
          <section className="grid gap-3 md:hidden">
            {filtered.map((request) => (
              <button
                type="button"
                key={request.id}
                onClick={() => openRequest(request)}
                className={`${panelClass} w-full p-4 text-left transition active:scale-[0.99]`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#303135]">{request.name}</p>
                    <p className="mt-1 text-xs text-[#85868a]">{toDateTime(request.created_at)}</p>
                  </div>
                  <Badge variant="outline" className={statusClass(request.status)}>{STATUS_LABELS[request.status]}</Badge>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#66676b]">{request.message}</p>
                <p className="mt-3 truncate border-t border-[#eeeae4] pt-3 text-xs text-[#85868a]">{request.email}</p>
              </button>
            ))}
          </section>

          <section className={`${panelClass} hidden overflow-hidden md:block`}>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#faf8f5] hover:bg-[#faf8f5]">
                  <TableHead className="pl-5">Müşteri</TableHead>
                  <TableHead>Mesaj</TableHead>
                  <TableHead>Dil</TableHead>
                  <TableHead>Geliş</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="pr-5 text-right">Detay</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((request) => (
                  <TableRow key={request.id} className="cursor-pointer" onClick={() => openRequest(request)}>
                    <TableCell className="pl-5">
                      <p className="max-w-44 truncate font-semibold text-[#303135]">{request.name}</p>
                      <p className="mt-1 max-w-44 truncate text-xs text-[#85868a]">{request.email}</p>
                    </TableCell>
                    <TableCell><p className="line-clamp-2 max-w-lg text-sm leading-5 text-[#66676b]">{request.message}</p></TableCell>
                    <TableCell className="text-sm">{LANGUAGE_LABELS[request.language]}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{toDateTime(request.created_at)}</TableCell>
                    <TableCell><Badge variant="outline" className={statusClass(request.status)}>{STATUS_LABELS[request.status]}</Badge></TableCell>
                    <TableCell className="pr-5 text-right"><Button size="sm" variant="ghost">İncele</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </>
      )}

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto p-0 sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader className="border-b border-[#e9e5de] px-5 py-5 text-left sm:px-6">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <DialogTitle className="text-xl tracking-[-0.025em]">{selected.name}</DialogTitle>
                  <Badge variant="outline" className={statusClass(selected.status)}>{STATUS_LABELS[selected.status]}</Badge>
                </div>
                <DialogDescription>{toDateTime(selected.created_at)} · {LANGUAGE_LABELS[selected.language]}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-5 px-5 py-5 sm:px-6">
                <section className="grid gap-3 rounded-xl bg-[#f7f4ef] p-4 sm:grid-cols-2">
                  <a href={`mailto:${selected.email}`} className="flex min-w-0 items-center gap-2 text-sm text-[#4f5054] hover:text-[#8b7652]">
                    <Mail className="size-4 shrink-0" /><span className="truncate">{selected.email}</span>
                  </a>
                  {selected.phone ? (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-[#4f5054] hover:text-[#8b7652]">
                      <Phone className="size-4 shrink-0" />{selected.phone}
                    </a>
                  ) : <span className="text-sm text-[#929397]">Telefon belirtilmedi</span>}
                </section>

                <section>
                  <h3 className="text-sm font-semibold">Müşteri mesajı</h3>
                  <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#e7e2da] bg-[#fffdf9] p-4 text-sm leading-6 text-[#55565a]">{selected.message}</p>
                </section>

                <label className="grid gap-2 text-sm font-medium">
                  Yönetici notu <span className="font-normal text-[#8a8b8e]">(yalnızca panelde görünür)</span>
                  <textarea
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    maxLength={4000}
                    placeholder="Görüşme sonucu veya takip notu ekleyin."
                    className={adminTextareaClass}
                  />
                </label>

                {selected.resolved_at ? (
                  <p className="flex items-center gap-1.5 text-xs text-[#85868a]"><Clock3 className="size-3.5" /> Sonuçlandırıldı: {toDateTime(selected.resolved_at)}</p>
                ) : null}
              </div>

              <DialogFooter className="border-t border-[#e9e5de] px-5 py-4 sm:px-6">
                <Button variant="outline" onClick={() => void saveRequest(selected.status)} disabled={saving}>
                  {saving ? <InlineSpinner /> : null}Notu kaydet
                </Button>
                {selected.status !== "new" ? (
                  <Button variant="outline" onClick={() => void saveRequest("new")} disabled={saving}>
                    {saving ? <InlineSpinner /> : <RotateCcw className="size-4" />}Yeni olarak aç
                  </Button>
                ) : null}
                {selected.status !== "in_progress" ? (
                  <Button variant="outline" onClick={() => void saveRequest("in_progress")} disabled={saving}>
                    {saving ? <InlineSpinner /> : <Clock3 className="size-4" />}İşleme al
                  </Button>
                ) : null}
                {selected.status !== "closed" ? (
                  <Button variant="outline" onClick={() => void saveRequest("closed")} disabled={saving}>
                    {saving ? <InlineSpinner /> : <Archive className="size-4" />}Kapat
                  </Button>
                ) : null}
                {selected.status !== "resolved" ? (
                  <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => void saveRequest("resolved")} disabled={saving}>
                    {saving ? <InlineSpinner /> : <CheckCircle2 className="size-4" />}Çözüldü
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
