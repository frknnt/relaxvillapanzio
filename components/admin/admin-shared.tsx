"use client";

import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Feedback = {
  tone: "success" | "error";
  message: string;
} | null;

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[0.68rem] font-bold tracking-[0.22em] text-[#9a855f] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#222326] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737477]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-[#36373a]", className)}>
      <span>{label}</span>
      {children}
      {hint ? (
        <span className="text-xs font-normal leading-5 text-[#85868a]">{hint}</span>
      ) : null}
    </label>
  );
}

export function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;

  const Icon = feedback.tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={feedback.tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
        feedback.tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{feedback.message}</span>
    </div>
  );
}

export function BusyState({ label = "Veriler yükleniyor…" }: { label?: string }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-[#ddd8cf] bg-white/70">
      <div className="flex items-center gap-2 text-sm text-[#747579]">
        <LoaderCircle className="size-4 animate-spin" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d3ca] bg-white px-6 text-center">
      {icon ? (
        <div className="mb-4 grid size-11 place-items-center rounded-full bg-[#f1ede7] text-[#8e7a58]">
          {icon}
        </div>
      ) : null}
      <h3 className="font-semibold text-[#2d2f33]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-[#77787c]">{description}</p>
    </div>
  );
}

export function InlineSpinner() {
  return <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />;
}

export function formatMoney(value: number, currency = "HUF") {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(`${value.slice(0, 10)}T12:00:00`));
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

export const adminInputClass =
  "h-10 w-full rounded-lg border border-[#dcd6cd] bg-white px-3 text-sm text-[#2d2f33] shadow-sm outline-none transition focus:border-[#9c8964] focus:ring-2 focus:ring-[#9c8964]/15 disabled:cursor-not-allowed disabled:bg-[#f5f3ef] disabled:opacity-70";

export const adminTextareaClass =
  "min-h-24 w-full resize-y rounded-lg border border-[#dcd6cd] bg-white px-3 py-2.5 text-sm leading-6 text-[#2d2f33] shadow-sm outline-none transition placeholder:text-[#aaa9a6] focus:border-[#9c8964] focus:ring-2 focus:ring-[#9c8964]/15 disabled:cursor-not-allowed disabled:bg-[#f5f3ef] disabled:opacity-70";

export const panelClass =
  "rounded-2xl border border-[#e5e0d8] bg-white shadow-[0_14px_40px_rgba(45,47,51,0.045)]";
