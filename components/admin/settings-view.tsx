"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Banknote, Clock3, CreditCard, Mail, MessageCircle, RefreshCw, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { BookingSettings } from "@/lib/supabase/types";
import {
  adminInputClass,
  BusyState,
  FeedbackBanner,
  type Feedback,
  Field,
  getErrorMessage,
  InlineSpinner,
  panelClass,
  SectionHeading,
} from "@/components/admin/admin-shared";
import { cn } from "@/lib/utils";

type SettingsForm = {
  currency: string;
  weekendDays: number[];
  paymentHoldHours: string;
  petFee: string;
  iban: string;
  bankBeneficiary: string;
  bankName: string;
  bankAccountNumber: string;
  bicSwift: string;
  contactEmail: string;
  whatsappNumber: string;
  maxGuests: string;
  checkInTime: string;
  checkOutTime: string;
};

const defaultForm: SettingsForm = {
  currency: "HUF",
  weekendDays: [5, 6],
  paymentHoldHours: "48",
  petFee: "0",
  iban: "",
  bankBeneficiary: "",
  bankName: "",
  bankAccountNumber: "",
  bicSwift: "",
  contactEmail: "",
  whatsappNumber: "",
  maxGuests: "12",
  checkInTime: "15:00",
  checkOutTime: "10:00",
};

const days = [
  { id: 1, label: "Pzt" },
  { id: 2, label: "Sal" },
  { id: 3, label: "Çar" },
  { id: 4, label: "Per" },
  { id: 5, label: "Cum" },
  { id: 6, label: "Cmt" },
  { id: 7, label: "Paz" },
];

function timeValue(value: string) {
  return value.slice(0, 5);
}

export function SettingsView({ userId }: { userId: string }) {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const { data, error } = await getSupabaseBrowserClient()
        .from("booking_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setForm(defaultForm);
        setLastUpdated(null);
        setFeedback({ tone: "error", message: "Ayar kaydı bulunamadı. Varsayılan değerleri gözden geçirip kaydedin." });
        return;
      }
      const settings = data as BookingSettings;
      setForm({
        currency: settings.currency,
        weekendDays: settings.weekend_days,
        paymentHoldHours: String(settings.payment_hold_hours),
        petFee: String(settings.pet_fee),
        iban: settings.iban,
        bankBeneficiary: settings.bank_beneficiary,
        bankName: settings.bank_name,
        bankAccountNumber: settings.bank_account_number,
        bicSwift: settings.bic_swift,
        contactEmail: settings.contact_email,
        whatsappNumber: settings.whatsapp_number,
        maxGuests: String(settings.max_guests),
        checkInTime: timeValue(settings.check_in_time),
        checkOutTime: timeValue(settings.check_out_time),
      });
      setLastUpdated(settings.updated_at);
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Rezervasyon ayarları yüklenemedi.") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  function toggleWeekend(day: number) {
    setForm((current) => ({
      ...current,
      weekendDays: current.weekendDays.includes(day)
        ? current.weekendDays.filter((item) => item !== day)
        : [...current.weekendDays, day].sort((a, b) => a - b),
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const paymentHoldHours = Number(form.paymentHoldHours);
      const petFee = Number(form.petFee);
      const maxGuests = Number(form.maxGuests);
      const currency = form.currency.trim().toUpperCase();

      if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Para birimi üç harfli ISO kodu olmalı (örn. HUF). ");
      if (paymentHoldHours < 1 || paymentHoldHours > 336) throw new Error("Ödeme bekleme süresi 1 ile 336 saat arasında olmalı.");
      if (petFee < 0) throw new Error("Evcil hayvan ücreti negatif olamaz.");
      if (maxGuests < 1 || maxGuests > 30) throw new Error("Maksimum misafir sayısı 1 ile 30 arasında olmalı.");
      if (form.weekendDays.length === 0) throw new Error("En az bir hafta sonu günü seçin.");
      if (form.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
        throw new Error("Geçerli bir iletişim e-posta adresi girin.");
      }

      const { data, error } = await getSupabaseBrowserClient()
        .from("booking_settings")
        .upsert(
          {
            id: 1,
            currency,
            weekend_days: form.weekendDays,
            payment_hold_hours: paymentHoldHours,
            pet_fee: petFee,
            iban: form.iban.replace(/\s+/g, "").toUpperCase(),
            bank_beneficiary: form.bankBeneficiary.trim(),
            bank_name: form.bankName.trim(),
            bank_account_number: form.bankAccountNumber.trim(),
            bic_swift: form.bicSwift.replace(/\s+/g, "").toUpperCase(),
            contact_email: form.contactEmail.trim().toLowerCase(),
            whatsapp_number: form.whatsappNumber.trim(),
            max_guests: maxGuests,
            check_in_time: form.checkInTime,
            check_out_time: form.checkOutTime,
            updated_by: userId,
          },
          { onConflict: "id" },
        )
        .select("updated_at")
        .single();
      if (error) throw error;
      setLastUpdated(String(data.updated_at));
      setFeedback({ tone: "success", message: "Rezervasyon ve ödeme ayarları kaydedildi." });
    } catch (caught) {
      setFeedback({ tone: "error", message: getErrorMessage(caught, "Ayarlar kaydedilemedi.") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-7">
      <SectionHeading
        eyebrow="Sistem ayarları"
        title="Rezervasyon ayarları"
        description="Müşteriye gösterilen banka bilgilerini, ödeme bekleme süresini, kapasiteyi ve ücret kurallarını yönetin."
        action={
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading || saving} className="bg-white">
            <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />Yenile
          </Button>
        }
      />

      <FeedbackBanner feedback={feedback} />

      {loading ? (
        <BusyState label="Rezervasyon ayarları yükleniyor…" />
      ) : (
        <form onSubmit={save} className="space-y-5">
          <SettingsSection icon={CreditCard} title="Banka ve havale bilgileri" description="Rezervasyon sonrası müşteriye gösterilecek hesap bilgileri.">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Hesap sahibi / lehtar">
                <input type="text" value={form.bankBeneficiary} onChange={(event) => setForm((current) => ({ ...current, bankBeneficiary: event.target.value }))} className={adminInputClass} />
              </Field>
              <Field label="Banka adı">
                <input type="text" value={form.bankName} onChange={(event) => setForm((current) => ({ ...current, bankName: event.target.value }))} className={adminInputClass} />
              </Field>
              <Field label="Banka hesap numarası" hint="Macaristan içindeki yerel transferlerde kullanılan hesap numarası.">
                <input type="text" value={form.bankAccountNumber} onChange={(event) => setForm((current) => ({ ...current, bankAccountNumber: event.target.value }))} placeholder="12100011-…" autoComplete="off" maxLength={80} className={adminInputClass} />
              </Field>
              <Field label="IBAN" hint="Boşluklar kaydederken otomatik kaldırılır.">
                <input type="text" value={form.iban} onChange={(event) => setForm((current) => ({ ...current, iban: event.target.value.toUpperCase() }))} placeholder="HU00 0000 0000 0000 0000 0000 0000" autoComplete="off" maxLength={80} className={adminInputClass} />
              </Field>
              <Field label="BIC / SWIFT" hint="Uluslararası transferlerde bankayı tanımlayan kod.">
                <input type="text" value={form.bicSwift} onChange={(event) => setForm((current) => ({ ...current, bicSwift: event.target.value.toUpperCase() }))} placeholder="XXXXXXXX" autoComplete="off" maxLength={20} className={adminInputClass} />
              </Field>
              <Field label="Para birimi" hint="Örn. HUF veya EUR">
                <input type="text" value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase().slice(0, 3) }))} minLength={3} maxLength={3} required className={adminInputClass} />
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection icon={Clock3} title="Rezervasyon kuralları" description="Bekleme süresi, kapasite ve giriş-çıkış saatleri.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Ödeme bekleme (saat)" hint="1–336 saat">
                <input type="number" min="1" max="336" step="1" inputMode="numeric" value={form.paymentHoldHours} onChange={(event) => setForm((current) => ({ ...current, paymentHoldHours: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label="Maksimum misafir" hint="1–30 kişi">
                <input type="number" min="1" max="30" step="1" inputMode="numeric" value={form.maxGuests} onChange={(event) => setForm((current) => ({ ...current, maxGuests: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label="Giriş saati">
                <input type="time" value={form.checkInTime} onChange={(event) => setForm((current) => ({ ...current, checkInTime: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label="Çıkış saati">
                <input type="time" value={form.checkOutTime} onChange={(event) => setForm((current) => ({ ...current, checkOutTime: event.target.value }))} required className={adminInputClass} />
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection icon={Banknote} title="Ücret ve hafta sonu" description="Evcil hayvan sabit ücreti ve hafta sonu fiyatının uygulanacağı günler.">
            <div className="grid gap-5 lg:grid-cols-[minmax(14rem,0.55fr)_minmax(0,1.45fr)] lg:items-end">
              <Field label={`Evcil hayvan ücreti (${form.currency || "HUF"})`} hint="Rezervasyonda en az bir evcil hayvan varsa bir kez eklenir.">
                <input type="number" min="0" step="1" inputMode="numeric" value={form.petFee} onChange={(event) => setForm((current) => ({ ...current, petFee: event.target.value }))} required className={adminInputClass} />
              </Field>
              <Field label="Hafta sonu fiyatı uygulanacak günler" hint="ISO gün sırası kullanılır; Pazartesi 1, Pazar 7.">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {days.map((day) => {
                    const selected = form.weekendDays.includes(day.id);
                    return (
                      <button key={day.id} type="button" aria-pressed={selected} onClick={() => toggleWeekend(day.id)} className={cn("h-10 rounded-lg border text-xs font-semibold transition", selected ? "border-[#9a855f] bg-[#9a855f] text-white" : "border-[#dcd6cd] bg-white text-[#696a6e] hover:border-[#b8a887]")}>
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection icon={MessageCircle} title="Müşteri iletişimi" description="İletişim sayfasında, alt bilgide ve rezervasyon adımlarında kullanılacak bilgiler.">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="İletişim e-postası" hint="İletişim sayfasında ve site alt bilgisinde gösterilir.">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a855f]" />
                  <input type="email" value={form.contactEmail} onChange={(event) => setForm((current) => ({ ...current, contactEmail: event.target.value }))} placeholder="info@relaxvilla.hu" autoComplete="email" maxLength={254} className={cn(adminInputClass, "pl-10")} />
                </div>
              </Field>
              <Field label="WhatsApp numarası" hint="Ülke koduyla birlikte girin; örn. +36…">
                <input type="tel" value={form.whatsappNumber} onChange={(event) => setForm((current) => ({ ...current, whatsappNumber: event.target.value }))} placeholder="+36…" className={adminInputClass} />
              </Field>
              <div className="flex items-end rounded-xl bg-[#f7f4ef] p-4 text-xs leading-5 text-[#77787b] lg:col-span-2">
                Bu bilgiler değiştiğinde iletişim sayfası, footer ve rezervasyon sonrası yönlendirmeler otomatik güncellenir.
              </div>
            </div>
          </SettingsSection>

          <div className="sticky bottom-[4.85rem] z-20 flex flex-col gap-3 rounded-2xl border border-[#ddd7ce] bg-white/94 p-4 shadow-[0_16px_45px_rgba(37,39,42,0.14)] backdrop-blur sm:flex-row sm:items-center sm:justify-between lg:bottom-4">
            <p className="text-xs text-[#85868a]">
              {lastUpdated ? `Son güncelleme: ${new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lastUpdated))}` : "Ayarlar henüz kaydedilmedi."}
            </p>
            <Button type="submit" disabled={saving} className="sm:min-w-40">
              {saving ? <InlineSpinner /> : <Save className="size-4" />}{saving ? "Kaydediliyor…" : "Ayarları kaydet"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: typeof Users; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className={`${panelClass} overflow-hidden`}>
      <div className="flex items-start gap-3 border-b border-[#ebe7e0] bg-[#faf8f5] px-5 py-4 sm:px-6">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#eee8de] text-[#8f7953]"><Icon className="size-4" /></span>
        <div><h2 className="font-semibold text-[#303135]">{title}</h2><p className="mt-1 text-xs leading-5 text-[#85868a]">{description}</p></div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
