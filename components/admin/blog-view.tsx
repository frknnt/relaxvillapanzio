"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BookOpenText, Edit3, ExternalLink, Plus, RefreshCw, Search, Trash2, UploadCloud } from "lucide-react";
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
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { BlogPost, BlogStatus, SupportedLanguage } from "@/lib/supabase/types";
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
import { cn } from "@/lib/utils";

type BlogForm = {
  slug: string;
  status: BlogStatus;
  cover_url: string;
  category_en: string;
  category_de: string;
  category_hu: string;
  title_en: string;
  title_de: string;
  title_hu: string;
  excerpt_en: string;
  excerpt_de: string;
  excerpt_hu: string;
  content_en: string;
  content_de: string;
  content_hu: string;
};

type LanguageField = "category" | "title" | "excerpt" | "content";

const languages: Array<{ id: SupportedLanguage; label: string; name: string }> = [
  { id: "en", label: "EN", name: "English" },
  { id: "de", label: "DE", name: "Deutsch" },
  { id: "hu", label: "HU", name: "Magyar" },
];

const emptyForm: BlogForm = {
  slug: "",
  status: "draft",
  cover_url: "",
  category_en: "Travel",
  category_de: "Reise",
  category_hu: "Utazás",
  title_en: "",
  title_de: "",
  title_hu: "",
  excerpt_en: "",
  excerpt_de: "",
  excerpt_hu: "",
  content_en: "",
  content_de: "",
  content_hu: "",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function cssImageUrl(url: string) {
  return `url("${url.replace(/["\n\r]/g, "")}")`;
}

function toDateTime(value: string | null) {
  if (!value) return "Henüz yayınlanmadı";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function BlogView({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | BlogStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts((data ?? []) as BlogPost[]);
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Blog yazıları yüklenemedi.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        !normalized ||
        [post.title_en, post.title_de, post.title_hu, post.slug]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesQuery && (filter === "all" || post.status === filter);
    });
  }, [filter, posts, query]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setCoverFile(null);
    setLanguage("en");
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      slug: post.slug,
      status: post.status,
      cover_url: post.cover_url,
      category_en: post.category_en,
      category_de: post.category_de,
      category_hu: post.category_hu,
      title_en: post.title_en,
      title_de: post.title_de,
      title_hu: post.title_hu,
      excerpt_en: post.excerpt_en,
      excerpt_de: post.excerpt_de,
      excerpt_hu: post.excerpt_hu,
      content_en: post.content_en,
      content_de: post.content_de,
      content_hu: post.content_hu,
    });
    setCoverFile(null);
    setLanguage("en");
    setDialogOpen(true);
  }

  function updateLanguageField(field: LanguageField, value: string) {
    const key = `${field}_${language}` as keyof BlogForm;
    setForm((current) => ({ ...current, [key]: value }));
  }

  function getLanguageField(field: LanguageField) {
    const key = `${field}_${language}` as keyof BlogForm;
    return String(form[key]);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    const supabase = getSupabaseBrowserClient();
    let uploadedPath: string | null = null;
    try {
      const normalizedSlug = slugify(form.slug || form.title_en);
      if (!normalizedSlug) throw new Error("Geçerli bir URL kısa adı girin.");
      if (!form.title_en.trim() || !form.title_de.trim() || !form.title_hu.trim()) {
        throw new Error("Her üç dil için de yazı başlığı girilmelidir.");
      }

      let coverUrl = form.cover_url.trim();
      if (coverFile) {
        const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
        if (!allowedTypes.has(coverFile.type)) {
          throw new Error("Kapak görseli JPEG, PNG, WebP veya AVIF olmalı.");
        }
        if (coverFile.size > 20 * 1024 * 1024) {
          throw new Error("Kapak görseli en fazla 20 MB olabilir.");
        }

        const extension =
          coverFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
          "jpg";
        uploadedPath = `blog/${Date.now()}-${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("villa-media")
          .upload(uploadedPath, coverFile, {
            cacheControl: "31536000",
            contentType: coverFile.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        coverUrl = supabase.storage
          .from("villa-media")
          .getPublicUrl(uploadedPath).data.publicUrl;
      }

      const payload = {
        ...form,
        cover_url: coverUrl,
        slug: normalizedSlug,
        published_at:
          form.status === "published"
            ? editing?.published_at ?? new Date().toISOString()
            : null,
        updated_by: userId,
      };
      const result = editing
        ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
        : await supabase.from("blog_posts").insert({ ...payload, created_by: userId });
      if (result.error) throw result.error;

      setDialogOpen(false);
      setCoverFile(null);
      await load();
      setFeedback({ tone: "success", message: editing ? "Blog yazısı güncellendi." : "Blog yazısı oluşturuldu." });
    } catch (caught) {
      if (uploadedPath) {
        await supabase.storage.from("villa-media").remove([uploadedPath]);
      }
      const message = getErrorMessage(caught, "Blog yazısı kaydedilemedi.");
      setFeedback({
        tone: "error",
        message: message.includes("blog_posts_slug_key")
          ? "Bu URL kısa adı başka bir yazıda kullanılıyor."
          : message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(post: BlogPost) {
    if (!window.confirm(`“${post.title_en}” yazısını kalıcı olarak silmek istiyor musunuz?`)) return;
    setDeletingId(post.id);
    setFeedback(null);
    try {
      const { error } = await getSupabaseBrowserClient().from("blog_posts").delete().eq("id", post.id);
      if (error) throw error;
      await load();
      setFeedback({ tone: "success", message: "Blog yazısı silindi." });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Blog yazısı silinemedi.") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="İçerik yönetimi"
        title="Blog yazıları"
        description="İngilizce, Almanca ve Macarca içerikleri tek kayıtta düzenleyip taslak veya yayınlanmış olarak yönetin."
        action={<Button onClick={openCreate} className="w-full sm:w-auto"><Plus className="size-4" />Yeni yazı</Button>}
      />

      <FeedbackBanner feedback={feedback} />

      <section className={`${panelClass} grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:p-5`}>
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#929397]" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Başlık veya URL kısa adı ara" className={`${adminInputClass} pl-9`} />
        </label>
        <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className={adminInputClass}>
          <option value="all">Tüm yazılar</option>
          <option value="draft">Taslaklar</option>
          <option value="published">Yayınlananlar</option>
        </select>
        <Button variant="outline" onClick={() => void load()} disabled={loading} className="bg-white">
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />Yenile
        </Button>
      </section>

      {loading ? (
        <BusyState label="Blog yazıları yükleniyor…" />
      ) : filtered.length === 0 ? (
        <EmptyState title={posts.length ? "Filtreye uygun yazı yok" : "Henüz blog yazısı yok"} description={posts.length ? "Arama veya durum filtresini değiştirin." : "İlk çok dilli blog yazınızı oluşturun."} icon={<BookOpenText className="size-5" />} />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <article key={post.id} className={`${panelClass} overflow-hidden`}>
              <div
                className="relative h-36 bg-[#e8e2d9] bg-cover bg-center"
                style={post.cover_url ? { backgroundImage: `linear-gradient(to top, rgba(24,24,25,.32), transparent), ${cssImageUrl(post.cover_url)}` } : undefined}
              >
                {!post.cover_url ? (
                  <div className="grid h-full place-items-center text-[#a5967f]"><BookOpenText className="size-7" /></div>
                ) : null}
                <Badge variant="outline" className={cn("absolute top-3 right-3 bg-white/92 backdrop-blur", post.status === "published" ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-600")}>
                  {post.status === "published" ? "Yayında" : "Taslak"}
                </Badge>
              </div>
              <div className="p-5">
                <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#9a855f] uppercase">{post.category_en}</p>
                <h2 className="mt-2 line-clamp-2 min-h-12 text-lg leading-6 font-semibold tracking-[-0.025em]">{post.title_en}</h2>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#77787b]">{post.excerpt_en || "Henüz özet eklenmedi."}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eeeae4] pt-4">
                  <div>
                    <p className="font-mono text-[0.65rem] text-[#999a9d]">/{post.slug}</p>
                    <p className="mt-1 text-[0.65rem] text-[#999a9d]">{toDateTime(post.published_at)}</p>
                  </div>
                  <div className="flex gap-1">
                    {post.status === "published" ? (
                      <Button asChild variant="ghost" size="icon-sm"><a href={`/blog/${encodeURIComponent(post.slug)}`} target="_blank" rel="noreferrer" aria-label="Yazıyı aç"><ExternalLink className="size-4" /></a></Button>
                    ) : null}
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(post)} aria-label="Yazıyı düzenle"><Edit3 className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => void remove(post)} disabled={deletingId === post.id} className="text-red-600 hover:bg-red-50 hover:text-red-700" aria-label="Yazıyı sil">
                      {deletingId === post.id ? <InlineSpinner /> : <Trash2 className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="max-h-[94dvh] overflow-y-auto p-0 sm:max-w-4xl">
          <DialogHeader className="border-b border-[#e9e5de] px-5 py-5 text-left sm:px-6">
            <DialogTitle>{editing ? "Blog yazısını düzenle" : "Yeni blog yazısı"}</DialogTitle>
            <DialogDescription>Her dil sekmesindeki içeriği ayrı ayrı doldurun.</DialogDescription>
          </DialogHeader>
          <form onSubmit={save}>
            <div className="grid gap-5 px-5 py-5 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <Field label="URL kısa adı" hint="Sadece küçük harf, sayı ve tire kullanılır.">
                  <div className="flex items-center rounded-lg border border-[#dcd6cd] bg-white shadow-sm focus-within:border-[#9c8964] focus-within:ring-2 focus-within:ring-[#9c8964]/15">
                    <span className="pl-3 text-sm text-[#999a9d]">/blog/</span>
                    <input type="text" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} onBlur={() => !form.slug && setForm((current) => ({ ...current, slug: slugify(current.title_en) }))} className="h-10 min-w-0 flex-1 bg-transparent px-1 pr-3 text-sm outline-none" />
                  </div>
                </Field>
                <Field label="Yayın durumu">
                  <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BlogStatus }))} className={adminInputClass}>
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <Field label="Kapak görseli URL’si" hint="Bir bağlantı yapıştırın veya bilgisayardan yeni görsel yükleyin.">
                  <input type="text" value={form.cover_url} onChange={(event) => setForm((current) => ({ ...current, cover_url: event.target.value }))} placeholder="/images/… veya https://…" className={adminInputClass} />
                </Field>
                <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dcd6cd] bg-white px-4 text-sm font-medium shadow-sm transition hover:border-[#b6a37e] hover:bg-[#faf8f5]">
                  <UploadCloud className="size-4 text-[#927b52]" />
                  {coverFile ? "Görsel seçildi" : "Görsel yükle"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              {coverFile ? (
                <p className="-mt-2 truncate rounded-lg bg-[#f7f4ef] px-3 py-2 text-xs text-[#747579]">
                  Seçilen dosya: {coverFile.name}
                </p>
              ) : null}

              <div className="flex gap-1 rounded-xl bg-[#f0ede7] p-1" role="tablist" aria-label="İçerik dili">
                {languages.map((item) => (
                  <button key={item.id} type="button" role="tab" aria-selected={language === item.id} onClick={() => setLanguage(item.id)} className={cn("flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm", language === item.id ? "bg-white text-[#2d2f33] shadow-sm" : "text-[#7f8083] hover:text-[#46474a]")}>
                    {item.label} <span className="hidden font-normal text-[#999a9d] sm:inline">· {item.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-5 rounded-xl border border-[#e7e2da] p-4 sm:p-5">
                <Field label={`Kategori (${language.toUpperCase()})`}>
                  <input type="text" value={getLanguageField("category")} onChange={(event) => updateLanguageField("category", event.target.value)} required className={adminInputClass} />
                </Field>
                <Field label={`Başlık (${language.toUpperCase()})`}>
                  <input type="text" value={getLanguageField("title")} onChange={(event) => updateLanguageField("title", event.target.value)} onBlur={() => language === "en" && !form.slug && setForm((current) => ({ ...current, slug: slugify(current.title_en) }))} required className={adminInputClass} />
                </Field>
                <Field label={`Kısa özet (${language.toUpperCase()})`}>
                  <textarea value={getLanguageField("excerpt")} onChange={(event) => updateLanguageField("excerpt", event.target.value)} rows={3} className={adminTextareaClass} />
                </Field>
                <Field label={`Yazı içeriği (${language.toUpperCase()})`} hint="Paragrafları boş satırlarla ayırabilirsiniz.">
                  <textarea value={getLanguageField("content")} onChange={(event) => updateLanguageField("content", event.target.value)} rows={10} className={`${adminTextareaClass} min-h-56`} />
                </Field>
              </div>

              <p className="rounded-xl bg-[#f7f4ef] px-4 py-3 text-xs leading-5 text-[#747579]">
                Yayına almadan önce EN, DE ve HU sekmelerindeki başlıkları kontrol edin. Taslak yazılar yalnızca yönetim panelinde görünür.
              </p>
            </div>
            <DialogFooter className="border-t border-[#e9e5de] px-5 py-4 sm:px-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Vazgeç</Button>
              <Button type="submit" disabled={saving}>{saving ? <InlineSpinner /> : null}{saving ? "Kaydediliyor…" : form.status === "published" ? "Kaydet ve yayınla" : "Taslak olarak kaydet"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
