import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

import type {
  AvailabilityRange,
  BookingSettings,
  MonthlyRate,
  RoomMonthlyRate,
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

export function isBlockedDate(
  date: Date,
  ranges: AvailabilityRange[],
  roomIds: number[],
) {
  const key = dateKey(date);
  return ranges.some(
    (range) =>
      roomIds.includes(range.room_id) &&
      key >= range.start_date &&
      key < range.end_date,
  );
}

export function isWholeVillaSelection(roomIds: number[]) {
  return (
    roomIds.length === 4 &&
    [1, 2, 3, 4].every((roomId) => roomIds.includes(roomId))
  );
}

export function hasRateForDate(
  date: Date,
  rates: MonthlyRate[],
  roomRates: RoomMonthlyRate[],
  roomIds: number[],
) {
  const month = monthKey(date);
  if (isWholeVillaSelection(roomIds)) {
    return rates.some((rate) => rate.active && rate.month === month);
  }

  return (
    roomIds.length > 0 &&
    roomIds.every((roomId) =>
      roomRates.some(
        (rate) =>
          rate.active && rate.room_id === roomId && rate.month === month,
      ),
    )
  );
}

export function rangeContainsBlockedDate(
  arrival: string,
  departure: string,
  ranges: AvailabilityRange[],
  roomIds: number[],
) {
  if (!arrival || !departure || departure <= arrival) return false;

  let cursor = parseISO(arrival);
  const end = parseISO(departure);
  while (cursor < end) {
    if (isBlockedDate(cursor, ranges, roomIds)) return true;
    cursor = addDays(cursor, 1);
  }
  return false;
}

export function calculateBookingQuote({
  arrival,
  departure,
  pets,
  rates,
  roomRates,
  roomIds,
  settings,
}: {
  arrival: string;
  departure: string;
  pets: number;
  rates: MonthlyRate[];
  roomRates: RoomMonthlyRate[];
  roomIds: number[];
  settings: BookingSettings | null;
}): BookingQuote | null {
  if (
    !arrival ||
    !departure ||
    departure <= arrival ||
    !settings ||
    roomIds.length === 0
  ) {
    return null;
  }

  const from = parseISO(arrival);
  const to = parseISO(departure);
  const nights = differenceInCalendarDays(to, from);
  if (nights < 1) return null;

  let subtotal = 0;
  let minimumNights = 1;
  let complete = true;
  let cursor = from;
  const wholeVilla = isWholeVillaSelection(roomIds);

  while (cursor < to) {
    const isoDay = Number(format(cursor, "i"));
    const weekend = settings.weekend_days.includes(isoDay);
    const month = monthKey(cursor);

    if (wholeVilla) {
      const rate = rates.find(
        (candidate) => candidate.active && candidate.month === month,
      );

      if (!rate) {
        complete = false;
        cursor = addDays(cursor, 1);
        continue;
      }

      subtotal += weekend ? rate.weekend_rate : rate.weekday_rate;
      minimumNights = Math.max(minimumNights, rate.minimum_nights);
    } else {
      const selectedRates = roomIds.map((roomId) =>
        roomRates.find(
          (candidate) =>
            candidate.active &&
            candidate.room_id === roomId &&
            candidate.month === month,
        ),
      );

      if (selectedRates.some((rate) => !rate)) {
        complete = false;
        cursor = addDays(cursor, 1);
        continue;
      }

      for (const rate of selectedRates) {
        if (!rate) continue;
        subtotal += weekend ? rate.weekend_rate : rate.weekday_rate;
        minimumNights = Math.max(minimumNights, rate.minimum_nights);
      }
    }

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
    tr: "tr-TR",
  } as const;

  return new Intl.NumberFormat(localeMap[locale as keyof typeof localeMap] ?? "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
