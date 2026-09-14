"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  UsersRound,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { secondaryCopy } from "@/app/secondary-content";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/app/site-config";
import { useLanguage } from "@/components/site/language-provider";
import { PageHero } from "@/components/site/page-hero";
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

export function ContactPageContent() {
  const { language } = useLanguage();
  const copy = secondaryCopy[language];
  const t = copy.contactPage;
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [formStatus, setFormStatus] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const deliveryConfigured = Boolean(WHATSAPP_NUMBER || CONTACT_EMAIL);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus(null);

    const data = new FormData(event.currentTarget);
    const arrival = String(data.get("arrival") ?? "");
    const departure = String(data.get("departure") ?? "");

    if (arrival && departure && departure <= arrival) {
      setFormStatus({ message: t.formDateError, tone: "error" });
      return;
    }

    const message = [
      "Relax Villa booking enquiry",
      `${t.formFields.name}: ${String(data.get("name") ?? "")}`,
      `${t.formFields.email}: ${String(data.get("email") ?? "")}`,
      `${t.formFields.whatsapp}: ${String(data.get("whatsapp") ?? "-")}`,
      `${t.formFields.arrival}: ${arrival}`,
      `${t.formFields.departure}: ${departure}`,
      `${t.formFields.guests}: ${String(data.get("guests") ?? "")}`,
      `${t.formFields.language}: ${String(data.get("preferredLanguage") ?? language)}`,
      `${t.formFields.message}: ${String(data.get("message") ?? "")}`,
    ].join("\n");

    if (WHATSAPP_NUMBER) {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setFormStatus({ message: t.formReady, tone: "success" });
      return;
    }

    if (CONTACT_EMAIL) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Relax Villa booking enquiry",
      )}&body=${encodeURIComponent(message)}`;
      setFormStatus({ message: t.formReady, tone: "success" });
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      setFormStatus({ message: t.formCopied, tone: "success" });
    } catch {
      setFormStatus({ message: t.formDestinationMissing, tone: "error" });
    }
  };

  return (
    <main className="overflow-hidden bg-white text-[#26272b]">
      <div className="relative">
        <SiteHeader overlay />
        <PageHero
          image="/images/footer.jpg"
          imageAlt="Relax Villa garden"
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
        />
      </div>

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div className="max-w-lg">
            <p className="eyebrow">{t.formEyebrow}</p>
            <h2 className="section-title mt-5">{t.formTitle}</h2>
            <p className="mt-7 text-base leading-7 text-[#707175]">{t.formIntro}</p>
            <div className="mt-10 border-l-2 border-[#b6a27b] pl-6">
              <p className="text-sm font-semibold leading-6 text-[#4d4f53]">{t.formTrust}</p>
              <p className="mt-3 text-sm leading-6 text-[#87888a]">{t.formRequired}</p>
            </div>
            <div className="mt-10 flex items-center gap-4 text-[#7f6f53]">
              <span className="grid size-12 place-items-center rounded-full border border-[#cabda7] bg-white">
                <CheckCircle2 className="size-5" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[.12em]">
                {copy.common.wholeVilla}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[8px] border border-[#e2ddd5] bg-white p-6 shadow-[0_20px_55px_rgba(34,35,38,.08)] sm:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField id="contact-name" label={`${t.formFields.name} *`}>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] px-4 text-base shadow-none"
                />
              </FormField>
              <FormField id="contact-email" label={`${t.formFields.email} *`}>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] px-4 text-base shadow-none"
                />
              </FormField>
              <FormField id="contact-whatsapp" label={t.formFields.whatsapp}>
                <Input
                  id="contact-whatsapp"
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] px-4 text-base shadow-none"
                />
              </FormField>
              <div className="space-y-2.5">
                <Label htmlFor="contact-language" className="text-sm text-[#424449]">
                  {t.formFields.language} *
                </Label>
                <Select key={language} name="preferredLanguage" defaultValue={language}>
                  <SelectTrigger
                    id="contact-language"
                    className="min-h-13 w-full rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] px-4 text-base shadow-none"
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

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <FormField id="contact-arrival" label={`${t.formFields.arrival} *`}>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9c8964]" />
                  <Input
                    id="contact-arrival"
                    name="arrival"
                    type="date"
                    min={today}
                    required
                    className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] pl-11 text-base shadow-none"
                  />
                </div>
              </FormField>
              <FormField id="contact-departure" label={`${t.formFields.departure} *`}>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9c8964]" />
                  <Input
                    id="contact-departure"
                    name="departure"
                    type="date"
                    min={today}
                    required
                    className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] pl-11 text-base shadow-none"
                  />
                </div>
              </FormField>
              <FormField id="contact-guests" label={`${t.formFields.guests} *`}>
                <div className="relative">
                  <UsersRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9c8964]" />
                  <Input
                    id="contact-guests"
                    name="guests"
                    type="number"
                    min={1}
                    required
                    className="min-h-13 rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] pl-11 text-base shadow-none"
                  />
                </div>
              </FormField>
            </div>

            <div className="mt-6 space-y-2.5">
              <Label htmlFor="contact-message" className="text-sm text-[#424449]">
                {t.formFields.message} *
              </Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                placeholder={t.formPlaceholder}
                className="min-h-36 resize-y rounded-[3px] border-[#dcd6cd] bg-[#fcfbf9] p-4 text-base leading-7 shadow-none"
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
                className="min-h-13 shrink-0 rounded-full bg-[#2d3036] px-7 text-xs font-semibold uppercase tracking-[.14em] text-white hover:bg-[#9c8964]"
              >
                <Send className="size-4" />
                {deliveryConfigured ? t.formSubmit : t.formCopy}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[1fr_1fr]">
          <article className="relative min-h-[470px] overflow-hidden rounded-[8px] p-9 text-white shadow-[0_18px_50px_rgba(29,31,35,.13)] sm:p-12">
            <img
              src="/images/hero-mobile.jpg"
              alt="Relax Villa in Badacsonytomaj"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,29,32,.42),rgba(25,28,31,.88))]" />
            <div className="relative flex h-full min-h-[390px] flex-col justify-end">
              <span className="grid size-14 place-items-center rounded-full border border-white/30 bg-black/10 backdrop-blur">
                <MapPin className="size-6" strokeWidth={1.5} />
              </span>
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[.2em] text-[#decba5]">
                {t.visit}
              </p>
              <address className="mt-3 max-w-xl text-3xl font-bold not-italic leading-tight tracking-[-.035em] sm:text-4xl">
                {copy.common.address}
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=8257%20Badacsonytomaj%2C%20F%C3%BCredi%20%C3%BAt%205"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 border-b border-[#d7c49d] pb-2 text-xs font-semibold uppercase tracking-[.14em] text-[#d7c49d]"
              >
                {t.map}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </article>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <article className="border border-[#e5e0d8] bg-[#faf8f5] p-9 sm:p-11">
              <div className="flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#9c8964] shadow-sm">
                  <MessageCircle className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-[-.03em]">{t.write}</h2>
                  <p className="mt-3 text-base leading-7 text-[#747579]">{t.writeText}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-3 border-t border-[#e2ddd4] pt-7 text-sm text-[#76777a] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <span className="flex items-center gap-3">
                  <Mail className="size-4 text-[#9c8964]" />
                  {copy.common.contactPending}
                </span>
                <span className="flex items-center gap-3">
                  <MessageCircle className="size-4 text-[#9c8964]" />
                  WhatsApp
                </span>
              </div>
            </article>

            <article className="bg-[#292c32] p-9 text-white sm:p-11">
              <span className="grid size-12 place-items-center rounded-full border border-white/20 text-[#d4c198]">
                <Landmark className="size-5" strokeWidth={1.5} />
              </span>
              <h2 className="mt-7 text-2xl font-bold tracking-[-.03em]">{t.noteTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/65">{t.note}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f5] px-6 py-24 sm:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1450px]">
          <p className="eyebrow">{t.processEyebrow}</p>
          <h2 className="section-title mt-5">{t.processTitle}</h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-[#e5e0d8] bg-[#e5e0d8] lg:grid-cols-3">
            {t.steps.map(([number, title, description]) => (
              <article key={number} className="bg-white p-9 sm:p-11">
                <span className="text-5xl font-extrabold tracking-[-.06em] text-[#e1d9cc]">{number}</span>
                <h3 className="mt-7 text-2xl font-bold tracking-[-.03em]">{title}</h3>
                <p className="mt-4 text-base leading-7 text-[#747579]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-end">
            <Link
              href="/#availability"
              className="inline-flex min-h-13 items-center gap-3 rounded-full border border-[#2d2f33] px-7 text-xs font-semibold uppercase tracking-[.14em] transition hover:bg-[#2d2f33] hover:text-white"
            >
              {t.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
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
