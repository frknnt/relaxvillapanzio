"use client";

import { ArrowRight, LoaderCircle, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { secondaryCopy } from "@/app/secondary-content";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/app/site-config";
import { useLanguage } from "@/components/site/language-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

export function ContactPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.contactPage;
  const [formStatus, setFormStatus] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [effectiveWhatsapp, setEffectiveWhatsapp] = useState(WHATSAPP_NUMBER);
  const [effectiveEmail, setEffectiveEmail] = useState(CONTACT_EMAIL);
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=8257%20Badacsonytomaj%2C%20F%C3%BCredi%20%C3%BAt%205";

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;
    void getSupabaseBrowserClient()
      .from("booking_settings")
      .select("whatsapp_number, contact_email")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data?.whatsapp_number) {
          setEffectiveWhatsapp(String(data.whatsapp_number));
        }
        if (active && data?.contact_email) {
          setEffectiveEmail(String(data.contact_email));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus(null);
    const formElement = event.currentTarget;

    const data = new FormData(formElement);
    const website = String(data.get("website") ?? "");
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const phone = String(data.get("whatsapp") ?? "").trim();
    const preferredLanguage = String(data.get("preferredLanguage") ?? language);
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) {
      setFormStatus({ message: t.formNameError, tone: "error" });
      const nameField = formElement.elements.namedItem("name");
      if (nameField instanceof HTMLElement) nameField.focus();
      return;
    }

    if (message.length < 10) {
      setFormStatus({ message: t.formMessageError, tone: "error" });
      const messageField = formElement.elements.namedItem("message");
      if (messageField instanceof HTMLElement) messageField.focus();
      return;
    }

    try {
      if (!isSupabaseConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
      setSubmitting(true);
      const { error } = await getSupabaseBrowserClient().rpc("create_support_request", {
        p_name: name,
        p_email: email,
        p_phone: phone,
        p_language: preferredLanguage,
        p_message: message,
        p_website: website,
      });
      if (error) {
        if (website.trim() && error.message.includes("INVALID_REQUEST")) {
          formElement.reset();
          setFormStatus({ message: t.formReady, tone: "success" });
          return;
        }
        throw error;
      }

      formElement.reset();
      setFormStatus({ message: t.formReady, tone: "success" });
    } catch (caught) {
      const message =
        caught && typeof caught === "object" && "message" in caught
          ? String(caught.message)
          : "";
      setFormStatus({
        message: message.includes("RATE_LIMITED")
          ? t.formRateLimited
          : t.formDestinationMissing,
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="overflow-x-clip bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <section className="relative flex min-h-[490px] items-center justify-center overflow-hidden px-6 pt-20 text-center text-white sm:min-h-[540px]">
          <img
            src="/images/gallery/outdoor-04.jpg"
            alt="Relax Villa pool and outdoor area"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,24,27,.46),rgba(19,24,27,.64))]" />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-[#ddcaa5] sm:text-xs">
              {t.eyebrow}
            </p>
            <h1 className="mt-5 text-[clamp(3.2rem,7vw,6.1rem)] font-extrabold uppercase leading-[.95] tracking-[-.055em]">
              {t.title}
            </h1>
          </div>
        </section>
      </div>

      <section className="px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1360px] items-start gap-14 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,.8fr)] lg:gap-16">
          <form
            onSubmit={handleSubmit}
            className="min-w-0"
          >
            <div className="sr-only" aria-hidden="true">
              <Label htmlFor="contact-website">Website</Label>
              <Input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="eyebrow">{t.formEyebrow}</p>
            <h2 className="section-title mt-4">{t.formTitle}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#707175]">{t.formIntro}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#87888a]">{t.intro}</p>
            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <FormField id="contact-name" label={`${t.formFields.name} *`}>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  className="min-h-13 rounded-[3px] border-[#dedbd5] bg-white px-4 text-base shadow-none"
                />
              </FormField>
              <FormField id="contact-email" label={`${t.formFields.email} *`}>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="min-h-13 rounded-[3px] border-[#dedbd5] bg-white px-4 text-base shadow-none"
                />
              </FormField>
              <FormField id="contact-whatsapp" label={t.formFields.whatsapp}>
                <Input
                  id="contact-whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  className="min-h-13 rounded-[3px] border-[#dedbd5] bg-white px-4 text-base shadow-none"
                />
              </FormField>
              <div className="space-y-2.5">
                <Label htmlFor="contact-language" className="text-sm text-[#424449]">
                  {t.formFields.language} *
                </Label>
                <Select key={language} name="preferredLanguage" defaultValue={language}>
                  <SelectTrigger
                    id="contact-language"
                    className="min-h-13 w-full rounded-[3px] border-[#dedbd5] bg-white px-4 text-base shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="hu">Magyar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <Label htmlFor="contact-message" className="text-sm text-[#424449]">
                {t.formFields.message} *
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                minLength={10}
                maxLength={4000}
                placeholder={t.formPlaceholder}
                className="min-h-36 resize-y rounded-[3px] border-[#dedbd5] bg-white p-4 text-base leading-7 shadow-none"
              />
            </div>

            <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div role="status" aria-live="polite" className="min-h-6 max-w-xl text-sm leading-6">
                {formStatus ? (
                  <span className={formStatus.tone === "error" ? "text-red-700" : "text-[#55705d]"}>
                    {formStatus.message}
                  </span>
                ) : null}
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="min-h-13 shrink-0 rounded-full border border-[#9c8964] bg-transparent px-7 text-xs font-semibold uppercase tracking-[.14em] text-[#746448] hover:bg-[#9c8964] hover:text-white"
              >
                {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                {submitting ? t.formSending : t.formSubmit}
              </Button>
            </div>
          </form>

          <aside className="rounded-[7px] bg-white p-7 shadow-[0_18px_60px_rgba(32,33,35,.12)] ring-1 ring-[#eee8df] sm:p-10">
            <div className="flex gap-5 border-b border-[#e9e4dc] pb-8">
              <MapPin className="mt-1 size-6 shrink-0 text-[#9c8964]" strokeWidth={1.5} />
              <div>
                <h2 className="text-xl font-bold tracking-[-.03em]">{t.visit}</h2>
                <address className="mt-3 text-base not-italic leading-7 text-[#747579]">
                  {copy.common.address}
                </address>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8b7855] hover:text-[#26272b]"
                >
                  {t.map}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>

            <div className="border-b border-[#e9e4dc] py-8">
              <div className="flex gap-5">
                <Mail className="mt-1 size-6 shrink-0 text-[#9c8964]" strokeWidth={1.5} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-[-.03em]">{t.formFields.email}</h2>
                  {effectiveEmail ? (
                    <a href={`mailto:${effectiveEmail}`} className="mt-3 block break-all text-base text-[#747579] hover:text-[#8b7855]">
                      {effectiveEmail}
                    </a>
                  ) : (
                    <p className="mt-3 text-base leading-7 text-[#747579]">{copy.common.contactPending}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="py-8">
              <div className="flex gap-5">
                <MessageCircle className="mt-1 size-6 shrink-0 text-[#9c8964]" strokeWidth={1.5} />
                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-[-.03em]">WhatsApp</h2>
                  {effectiveWhatsapp ? (
                    <a
                      href={`https://wa.me/${effectiveWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-base text-[#747579] hover:text-[#8b7855]"
                    >
                      {effectiveWhatsapp}
                    </a>
                  ) : (
                    <p className="mt-3 text-base leading-7 text-[#747579]">{t.writeText}</p>
                  )}
                </div>
              </div>
            </div>

          </aside>
        </div>
      </section>

      <section aria-label={t.visit} className="relative h-[390px] bg-[#ece9e2] sm:h-[480px]">
        <iframe
          src="https://www.google.com/maps?q=8257%20Badacsonytomaj%2C%20F%C3%BCredi%20%C3%BAt%205%2C%20Hungary&output=embed"
          title={`${t.visit}: ${copy.common.address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 left-6 inline-flex items-center gap-3 rounded-[3px] bg-white px-5 py-4 text-xs font-semibold uppercase tracking-[.12em] text-[#292c32] shadow-[0_9px_25px_rgba(0,0,0,.15)] hover:text-[#8b7855] sm:bottom-10 sm:left-10"
        >
          <MapPin className="size-4 text-[#9c8964]" />
          {t.map}
          <ArrowRight className="size-4" />
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={id} className="text-sm text-[#424449]">
        {label}
      </Label>
      {children}
    </div>
  );
}
