"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Images, RefreshCw, Trash2, UploadCloud } from "lucide-react";
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
import type { GalleryImageRecord } from "@/lib/supabase/types";
import {
  adminInputClass,
  adminTextareaClass,
  BusyState,
  EmptyState,
  FeedbackBanner,
  type Feedback,
  Field,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";

type GalleryCategory = GalleryImageRecord["category"];

type GalleryForm = {
  category: GalleryCategory;
  room: string;
  alt_en: string;
  alt_de: string;
  alt_hu: string;
  caption_en: string;
  caption_de: string;
  caption_hu: string;
  sort_order: string;
  visible: boolean;
};

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  bedrooms: "Yatak odaları",
  shared: "Ortak alanlar",
  outdoors: "Dış alan",
  blog: "Blog görselleri",
};

const emptyForm: GalleryForm = {
  category: "shared",
  room: "",
  alt_en: "",
  alt_de: "",
  alt_hu: "",
  caption_en: "",
  caption_de: "",
  caption_hu: "",
  sort_order: "0",
  visible: true,
};

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "villa-image";
  return `${base}.${extension}`;
}

function cssImageUrl(url: string) {
  return `url("${url.replace(/["\n\r]/g, "")}")`;
}

export function GalleryView({ userId }: { userId: string }) {
  const [images, setImages] = useState<GalleryImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [filter, setFilter] = useState<"all" | GalleryCategory>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImageRecord | null>(null);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("gallery_images")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setImages((data ?? []) as GalleryImageRecord[]);
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Galeri yüklenemedi.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const filtered = useMemo(
    () => images.filter((image) => filter === "all" || image.category === filter),
    [filter, images],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreviewUrl("");
    setDialogOpen(true);
  }

  function openEdit(image: GalleryImageRecord) {
    setEditing(image);
    setForm({
      category: image.category,
      room: image.room ? String(image.room) : "",
      alt_en: image.alt_en,
      alt_de: image.alt_de,
      alt_hu: image.alt_hu,
      caption_en: image.caption_en,
      caption_de: image.caption_de,
      caption_hu: image.caption_hu,
      sort_order: String(image.sort_order),
      visible: image.visible,
    });
    setFile(null);
    setPreviewUrl(image.public_url);
    setDialogOpen(true);
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(selected.type)) {
      setFeedback({ tone: "error", message: "Yalnızca JPEG, PNG, WebP veya AVIF görseller yüklenebilir." });
      event.target.value = "";
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      setFeedback({ tone: "error", message: "Görsel boyutu 20 MB sınırını aşamaz." });
      event.target.value = "";
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    if (!form.alt_en) {
      const baseAlt = selected.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      setForm((current) => ({ ...current, alt_en: baseAlt }));
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    const supabase = getSupabaseBrowserClient();
    let uploadedPath = "";

    try {
      if (!editing && !file) throw new Error("Yüklenecek görseli seçin.");
      const room = form.category === "bedrooms" && form.room ? Number(form.room) : null;
      if (room !== null && (!Number.isInteger(room) || room < 1 || room > 4)) {
        throw new Error("Oda numarası 1 ile 4 arasında olmalı.");
      }

      const metadata = {
        category: form.category,
        room,
        alt_en: form.alt_en.trim(),
        alt_de: form.alt_de.trim(),
        alt_hu: form.alt_hu.trim(),
        caption_en: form.caption_en.trim(),
        caption_de: form.caption_de.trim(),
        caption_hu: form.caption_hu.trim(),
        sort_order: Number(form.sort_order) || 0,
        visible: form.visible,
      };

      if (editing) {
        const { error } = await supabase.from("gallery_images").update(metadata).eq("id", editing.id);
        if (error) throw error;
      } else if (file) {
        uploadedPath = `gallery/${form.category}/${Date.now()}-${crypto.randomUUID()}-${safeFileName(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from("villa-media")
          .upload(uploadedPath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from("villa-media").getPublicUrl(uploadedPath);
        const { error: insertError } = await supabase.from("gallery_images").insert({
          ...metadata,
          storage_path: uploadedPath,
          public_url: publicData.publicUrl,
          created_by: userId,
        });
        if (insertError) throw insertError;
      }

      setDialogOpen(false);
      await load();
      setFeedback({ tone: "success", message: editing ? "Görsel bilgileri güncellendi." : "Görsel galeriye yüklendi." });
    } catch (caught) {
      if (uploadedPath) {
        await supabase.storage.from("villa-media").remove([uploadedPath]);
      }
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Görsel kaydedilemedi.") });
    } finally {
      setSaving(false);
    }
  }

  async function remove(image: GalleryImageRecord) {
    if (!window.confirm("Bu görseli galeriden ve depolama alanından kalıcı olarak silmek istiyor musunuz?")) return;
    setDeletingId(image.id);
    setFeedback(null);
    const supabase = getSupabaseBrowserClient();
    try {
      const { error: metadataError } = await supabase.from("gallery_images").delete().eq("id", image.id);
      if (metadataError) throw metadataError;
      const { error: storageError } = await supabase.storage.from("villa-media").remove([image.storage_path]);
      await load();
      setFeedback({
        tone: storageError ? "error" : "success",
        message: storageError
          ? `Galeri kaydı silindi ancak depolama dosyası kaldı: ${storageError.message}`
          : "Görsel galeriden silindi.",
      });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Görsel silinemedi.") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Medya yönetimi"
        title="Galeri"
        description="Villa görsellerini güvenli depolama alanına yükleyin; oda, sıralama ve üç dilde alternatif metin bilgilerini yönetin."
        action={<Button onClick={openCreate} className="w-full sm:w-auto"><ImagePlus className="size-4" />Görsel yükle</Button>}
      />

      <FeedbackBanner feedback={feedback} />

      <section className={`${panelClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5`}>
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>Tümü ({images.length})</FilterButton>
          {(Object.keys(CATEGORY_LABELS) as GalleryCategory[]).map((category) => (
            <FilterButton key={category} active={filter === category} onClick={() => setFilter(category)}>
              {CATEGORY_LABELS[category]} ({images.filter((item) => item.category === category).length})
            </FilterButton>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading} className="bg-white">
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />Yenile
        </Button>
      </section>

      {loading ? (
        <BusyState label="Galeri yükleniyor…" />
      ) : filtered.length === 0 ? (
        <EmptyState title={images.length ? "Bu kategoride görsel yok" : "Henüz galeri görseli yok"} description="Yeni bir görsel yükleyerek galeri içeriğini oluşturmaya başlayın." icon={<Images className="size-5" />} />
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((image) => (
            <article key={image.id} className={`${panelClass} overflow-hidden`}>
              <div className="relative aspect-[4/3] bg-[#ebe6de] bg-cover bg-center" style={{ backgroundImage: cssImageUrl(image.public_url) }}>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent p-4 pt-10 text-white">
                  <span className="text-xs font-medium">{CATEGORY_LABELS[image.category]}{image.room ? ` · Oda ${image.room}` : ""}</span>
                  <span className="rounded-full bg-black/30 px-2 py-0.5 text-[0.65rem] backdrop-blur">#{image.sort_order}</span>
                </div>
                {!image.visible ? <Badge variant="secondary" className="absolute top-3 left-3 bg-white/90">Gizli</Badge> : null}
              </div>
              <div className="p-4">
                <p className="line-clamp-2 min-h-10 text-sm leading-5 text-[#55565a]">{image.alt_en || "Alternatif metin eklenmedi."}</p>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#eeeae4] pt-3">
                  <span className="truncate text-[0.65rem] text-[#999a9d]">{image.storage_path.split("/").pop()}</span>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(image)} aria-label="Görsel bilgilerini düzenle"><Edit3 className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => void remove(image)} disabled={deletingId === image.id} className="text-red-600 hover:bg-red-50 hover:text-red-700" aria-label="Görseli sil">
                      {deletingId === image.id ? <InlineSpinner /> : <Trash2 className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="max-h-[94dvh] overflow-y-auto p-0 sm:max-w-3xl">
          <DialogHeader className="border-b border-[#e9e5de] px-5 py-5 text-left sm:px-6">
            <DialogTitle>{editing ? "Görsel bilgilerini düzenle" : "Galeriye görsel yükle"}</DialogTitle>
            <DialogDescription>{editing ? "Dosyayı değiştirmeden kategori ve açıklama bilgilerini güncelleyin." : "JPEG, PNG, WebP veya AVIF; en fazla 20 MB."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={save}>
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              {!editing ? (
                <label className="group relative grid min-h-48 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-[#d7d0c6] bg-[#faf8f5] transition hover:border-[#a89169] hover:bg-[#f7f3ec]">
                  {previewUrl ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: cssImageUrl(previewUrl) }} />
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#ede7dd] text-[#917b54]"><UploadCloud className="size-5" /></div>
                      <p className="mt-3 text-sm font-semibold">Görsel seçmek için dokunun</p>
                      <p className="mt-1 text-xs text-[#85868a]">veya dosyayı bu alana sürükleyin</p>
                    </div>
                  )}
                  {previewUrl ? <span className="absolute bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">Başka görsel seç</span> : null}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={chooseFile} required className="sr-only" />
                </label>
              ) : (
                <div className="aspect-[16/7] rounded-2xl bg-[#ebe6de] bg-cover bg-center" style={{ backgroundImage: cssImageUrl(previewUrl) }} />
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Kategori">
                  <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as GalleryCategory, room: event.target.value === "bedrooms" ? current.room : "" }))} className={adminInputClass}>
                    {(Object.keys(CATEGORY_LABELS) as GalleryCategory[]).map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}
                  </select>
                </Field>
                <Field label="Oda numarası" hint="Sadece yatak odaları için">
                  <select value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} disabled={form.category !== "bedrooms"} className={adminInputClass}>
                    <option value="">Belirtilmedi</option>
                    {[1, 2, 3, 4].map((room) => <option key={room} value={room}>Oda {room}</option>)}
                  </select>
                </Field>
                <Field label="Sıra">
                  <input type="number" step="1" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))} className={adminInputClass} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Alt metin · EN"><textarea rows={3} value={form.alt_en} onChange={(event) => setForm((current) => ({ ...current, alt_en: event.target.value }))} className={adminTextareaClass} /></Field>
                <Field label="Alt metin · DE"><textarea rows={3} value={form.alt_de} onChange={(event) => setForm((current) => ({ ...current, alt_de: event.target.value }))} className={adminTextareaClass} /></Field>
                <Field label="Alt metin · HU"><textarea rows={3} value={form.alt_hu} onChange={(event) => setForm((current) => ({ ...current, alt_hu: event.target.value }))} className={adminTextareaClass} /></Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Açıklama · EN"><textarea rows={3} value={form.caption_en} onChange={(event) => setForm((current) => ({ ...current, caption_en: event.target.value }))} className={adminTextareaClass} /></Field>
                <Field label="Açıklama · DE"><textarea rows={3} value={form.caption_de} onChange={(event) => setForm((current) => ({ ...current, caption_de: event.target.value }))} className={adminTextareaClass} /></Field>
                <Field label="Açıklama · HU"><textarea rows={3} value={form.caption_hu} onChange={(event) => setForm((current) => ({ ...current, caption_hu: event.target.value }))} className={adminTextareaClass} /></Field>
              </div>

              <label className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e0d8] bg-[#faf8f5] p-4">
                <span><span className="block text-sm font-semibold">Sitede görünür</span><span className="mt-1 block text-xs leading-5 text-[#7f8083]">Gizli görseller yalnızca panelde listelenir.</span></span>
                <Switch checked={form.visible} onCheckedChange={(checked) => setForm((current) => ({ ...current, visible: checked }))} />
              </label>
            </div>
            <DialogFooter className="border-t border-[#e9e5de] px-5 py-4 sm:px-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Vazgeç</Button>
              <Button type="submit" disabled={saving}>{saving ? <InlineSpinner /> : null}{saving ? (editing ? "Kaydediliyor…" : "Yükleniyor…") : editing ? "Değişiklikleri kaydet" : "Görseli yükle"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={active ? "rounded-full bg-[#2d2f33] px-3 py-1.5 text-xs font-semibold text-white" : "rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold text-[#6f6b65] transition hover:bg-[#e9e3da]"}>{children}</button>;
}
