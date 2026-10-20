import assert from "node:assert/strict";
import test from "node:test";

import { calculateBookingQuote, isWholeVillaSelection, rangeContainsBlockedDate } from "../lib/booking/pricing.ts";
import type { BookingSettings, MonthlyRate, RoomMonthlyRate } from "../lib/supabase/types.ts";

const settings: BookingSettings = {
  id: 1, currency: "HUF", weekend_days: [5, 6], payment_hold_hours: 48,
  child_fee: 3000, pet_fee: 5000, iban: "", bank_beneficiary: "", bank_name: "", bank_account_number: "", bic_swift: "", contact_email: "info@example.com", whatsapp_number: "", max_guests: 9,
  check_in_time: "15:00", check_out_time: "10:00", cancellation_free_days: 14, late_cancellation_refund_percent: 0, privacy_retention_months: 24,
  legal_operator_name: "Harmony Balaton Villa", legal_operator_address: "8257 Badacsonytomaj", updated_at: "2026-10-01T00:00:00Z", updated_by: null,
};

const monthlyRates: MonthlyRate[] = [{ id: "villa-oct", month: "2026-10-01", weekday_rate: 100000, weekend_rate: 120000, minimum_nights: 2, active: true, created_at: "", updated_at: "", updated_by: null }];
const roomRates: RoomMonthlyRate[] = [1, 2, 3, 4].map((roomId) => ({ id: `room-${roomId}`, room_id: roomId, month: "2026-10-01", weekday_rate: roomId * 10000, weekend_rate: roomId * 12000, minimum_nights: roomId === 2 ? 3 : 2, active: true, created_at: "", updated_at: "", updated_by: null }));

test("all four rooms use the whole-villa package", () => {
  const quote = calculateBookingQuote({ arrival: "2026-10-05", departure: "2026-10-07", children: 0, pets: 0, rates: monthlyRates, roomRates, roomIds: [4, 2, 1, 3], settings });
  assert.equal(isWholeVillaSelection([4, 2, 1, 3]), true);
  assert.deepEqual(quote && { nights: quote.nights, subtotal: quote.subtotal, total: quote.total, minimumNights: quote.minimumNights, complete: quote.complete }, { nights: 2, subtotal: 200000, total: 200000, minimumNights: 2, complete: true });
});

test("selected room prices are added and the strictest minimum stay wins", () => {
  const quote = calculateBookingQuote({ arrival: "2026-10-05", departure: "2026-10-08", children: 2, pets: 1, rates: monthlyRates, roomRates, roomIds: [1, 2], settings });
  assert.equal(quote?.subtotal, 90000);
  assert.equal(quote?.childFee, 3000);
  assert.equal(quote?.petFee, 5000);
  assert.equal(quote?.total, 98000);
  assert.equal(quote?.minimumNights, 3);
  assert.equal(quote?.complete, true);
});

test("a blocked selected room invalidates the date range but another room remains available", () => {
  const ranges = [{ source: "reservation" as const, room_id: 2, start_date: "2026-10-10", end_date: "2026-10-12" }];
  assert.equal(rangeContainsBlockedDate("2026-10-10", "2026-10-11", ranges, [2]), true);
  assert.equal(rangeContainsBlockedDate("2026-10-10", "2026-10-11", ranges, [1]), false);
});

test("quote is marked incomplete when any selected room has no configured rate", () => {
  const quote = calculateBookingQuote({ arrival: "2026-10-05", departure: "2026-10-07", children: 0, pets: 0, rates: monthlyRates, roomRates: roomRates.filter((rate) => rate.room_id !== 2), roomIds: [1, 2], settings });
  assert.equal(quote?.complete, false);
});
