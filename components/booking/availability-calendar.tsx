"use client";

import { useMemo } from "react";
import { addYears, parseISO, startOfToday } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  hasRateForDate,
  isBlockedDate,
} from "@/lib/booking/pricing";
import type {
  AvailabilityRange,
  MonthlyRate,
  RoomMonthlyRate,
} from "@/lib/supabase/types";
import type { Language } from "@/app/site-content";

export function AvailabilityCalendar({
  arrival,
  departure,
  ranges,
  rates,
  roomRates,
  roomIds,
  onChange,
  locale,
}: {
  arrival: string;
  departure: string;
  ranges: AvailabilityRange[];
  rates: MonthlyRate[];
  roomRates: RoomMonthlyRate[];
  roomIds: number[];
  onChange: (arrival: string, departure: string) => void;
  locale: Language;
}) {
  const isMobile = useIsMobile();
  const today = startOfToday();
  const selected = useMemo<DateRange | undefined>(() => {
    if (!arrival) return undefined;
    return {
      from: parseISO(arrival),
      to: departure ? parseISO(departure) : undefined,
    };
  }, [arrival, departure]);

  const localeCode =
    locale === "de"
      ? "de-DE"
      : locale === "hu"
        ? "hu-HU"
        : locale === "tr"
          ? "tr-TR"
          : "en-GB";

  return (
    <Calendar
      mode="range"
      selected={selected}
      onSelect={(range) => {
        onChange(
          range?.from ? toLocalDate(range.from) : "",
          range?.to ? toLocalDate(range.to) : "",
        );
      }}
      numberOfMonths={isMobile ? 1 : 2}
      startMonth={today}
      endMonth={addYears(today, 2)}
      defaultMonth={selected?.from ?? today}
      disabled={(date) =>
        date < today ||
        isBlockedDate(date, ranges, roomIds) ||
        !hasRateForDate(date, rates, roomRates, roomIds)
      }
      excludeDisabled
      showOutsideDays={false}
      formatters={{
        formatCaption: (date) =>
          new Intl.DateTimeFormat(localeCode, {
            month: "long",
            year: "numeric",
          }).format(date),
        formatWeekdayName: (date) =>
          new Intl.DateTimeFormat(localeCode, { weekday: "short" })
            .format(date)
            .slice(0, 2),
      }}
      className="mx-auto w-full max-w-full overflow-hidden bg-white p-1 [--cell-size:1.95rem] min-[360px]:[--cell-size:2.2rem] sm:p-4 sm:[--cell-size:2.45rem] md:[--cell-size:2.25rem] lg:[--cell-size:2.65rem]"
      classNames={{
        root: "w-full max-w-full overflow-hidden",
        months: "relative flex w-full flex-col justify-center gap-8 md:flex-row md:gap-10",
        month: "mx-auto flex w-full min-w-0 max-w-[390px] flex-col gap-4",
        month_grid: "w-full min-w-0 table-fixed border-collapse",
        day_button:
          "rounded-md hover:bg-[#eee8dd] data-[range-start=true]:bg-[#a08f6d] data-[range-start=true]:text-white data-[range-end=true]:bg-[#a08f6d] data-[range-end=true]:text-white data-[range-middle=true]:bg-[#eee8dd] data-[range-middle=true]:text-[#292b2f]",
        disabled: "text-[#bbb8b2] opacity-45 line-through",
        today: "rounded-md ring-1 ring-[#a08f6d]",
      }}
    />
  );
}

function toLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
