import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

import type {
  AvailabilityRange,
  BookingSettings,
  MonthlyRate,
} from "@/lib/supabase/types";

export type BookingQuote = {
  nights: number;
  subtotal: number;
  petFee: number;
  total: number;
  currency: string;
  minimumNights: number;
  complete: boolean;
};

export function dateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function monthKey(date: Date) {
  return format(date, "yyyy-MM-01");
}

export function isBlockedDate(date: Date, ranges: AvailabilityRange[]) {
  const key = dateKey(date);
  return ranges.some(
    (range) => key >= range.start_date && key < range.end_date,
  );
}

export function hasRateForDate(date: Date, rates: MonthlyRate[]) {
  return rates.some((rate) => rate.active && rate.month === monthKey(date));
}

export function rangeContainsBlockedDate(
  arrival: string,
  departure: string,
  ranges: AvailabilityRange[],
) {
  if (!arrival || !departure || departure <= arrival) return false;

  let cursor = parseISO(arrival);
  const end = parseISO(departure);
  while (cursor < end) {
    if (isBlockedDate(cursor, ranges)) return true;
    cursor = addDays(cursor, 1);
  }
  return false;
}

export function calculateBookingQuote({
  arrival,
  departure,
  pets,
  rates,
  settings,
}: {
  arrival: string;
  departure: string;
  pets: number;
  rates: MonthlyRate[];
  settings: BookingSettings | null;
}): BookingQuote | null {
  if (!arrival || !departure || departure <= arrival || !settings) return null;

  const from = parseISO(arrival);
  const to = parseISO(departure);
  const nights = differenceInCalendarDays(to, from);
  if (nights < 1) return null;

  let subtotal = 0;
  let minimumNights = 1;
  let complete = true;
  let cursor = from;

  while (cursor < to) {
    const rate = rates.find(
      (candidate) => candidate.active && candidate.month === monthKey(cursor),
    );

    if (!rate) {
      complete = false;
      cursor = addDays(cursor, 1);
      continue;
    }

    const isoDay = Number(format(cursor, "i"));
    const weekend = settings.weekend_days.includes(isoDay);
    subtotal += weekend ? rate.weekend_rate : rate.weekday_rate;
    minimumNights = Math.max(minimumNights, rate.minimum_nights);
    cursor = addDays(cursor, 1);
  }

  const petFee = pets > 0 ? settings.pet_fee : 0;

  return {
    nights,
    subtotal,
    petFee,
    total: subtotal + petFee,
    currency: settings.currency,
    minimumNights,
    complete,
  };
}

export function formatMoney(value: number, currency = "HUF", locale = "en") {
  const localeMap = {
    en: "en-GB",
    de: "de-DE",
    hu: "hu-HU",
  } as const;

  return new Intl.NumberFormat(localeMap[locale as keyof typeof localeMap] ?? "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
