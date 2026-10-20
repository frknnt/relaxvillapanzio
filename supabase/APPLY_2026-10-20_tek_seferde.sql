-- Harmony Balaton Villa: 20 Ekim 2026 güncellemesi (tek seferde çalıştırın)
-- 1) Rezervasyon sonucu düzeltmesi  2) Genel istek sınırı  3) HBV- rezervasyon kodu
-- Herhangi bir adım hata verirse hiçbir değişiklik uygulanmaz.

begin;

-- URGENT FIX for add_child_booking_fee.sql
--
-- The child-fee version of create_room_reservation_with_fees_impl was a single
-- SQL statement that created the reservation and joined public.reservations in
-- the same query. That join uses the snapshot taken before the insert, so it
-- never sees the new row and the function returned ZERO rows: the reservation
-- was saved and the dates were held, but the guest saw a booking error instead
-- of the reference code and bank details.
--
-- This version runs the insert and the read-back as two separate statements,
-- so the stored row (with child fee total and final reference code) is returned.
-- Safe to run more than once.

create or replace function private.create_room_reservation_with_fees_impl(
  p_guest_name text,
  p_email text,
  p_phone text,
  p_language text,
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_pets integer,
  p_room_ids smallint[],
  p_notes text default '',
  p_website text default ''
)
returns table (
  reservation_id uuid,
  reference_code text,
  subtotal integer,
  pet_fee integer,
  total_price integer,
  currency text,
  hold_expires_at timestamptz,
  room_ids smallint[],
  booking_scope text
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_created record;
begin
  select created.*
  into v_created
  from private.create_room_reservation_impl(
    p_guest_name,
    p_email,
    p_phone,
    p_language,
    p_check_in,
    p_check_out,
    p_adults,
    p_children,
    p_pets,
    p_room_ids,
    p_notes,
    p_website
  ) created;

  return query
  select
    v_created.reservation_id,
    stored.reference_code,
    v_created.subtotal,
    v_created.pet_fee,
    stored.total_price,
    v_created.currency,
    v_created.hold_expires_at,
    v_created.room_ids,
    v_created.booking_scope
  from public.reservations stored
  where stored.id = v_created.reservation_id;
end;
$$;

-- Global protection against fake reservation requests that lock the calendar.
--
-- The existing per-email limit (3 requests / hour) can be bypassed by using a
-- different email address for every request. This trigger adds limits that do
-- not depend on the email address:
--
--   * at most 10 new public reservation requests per hour (whole site)
--   * at most 3 new public reservation requests per hour per phone number
--   * at most 15 unpaid, unexpired payment holds at the same time
--
-- Requests over the limit fail with RATE_LIMITED, which the booking form
-- already shows to the guest as a friendly "try again later" message.
-- Inserts made by an active administrator are never limited.
--
-- To change a limit, edit the constants below and run this file again.
-- Safe to run more than once.

create or replace function private.enforce_global_booking_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_max_requests_per_hour constant integer := 10;
  c_max_requests_per_phone_per_hour constant integer := 3;
  c_max_active_holds constant integer := 15;
  v_phone_digits text;
begin
  if new.status <> 'payment_pending' then
    return new;
  end if;

  if (select auth.uid()) is not null and private.is_admin() then
    return new;
  end if;

  -- Serialise concurrent public requests so the counts below are exact.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtext('relax-villa-global-booking-rate-limit')
  );

  if (
    select count(*)
    from public.reservations recent
    where recent.created_at > pg_catalog.now() - interval '1 hour'
  ) >= c_max_requests_per_hour then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  v_phone_digits := pg_catalog.regexp_replace(coalesce(new.phone, ''), '[^0-9]', '', 'g');

  if v_phone_digits <> '' and (
    select count(*)
    from public.reservations recent
    where recent.created_at > pg_catalog.now() - interval '1 hour'
      and pg_catalog.regexp_replace(recent.phone, '[^0-9]', '', 'g') = v_phone_digits
  ) >= c_max_requests_per_phone_per_hour then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  if (
    select count(*)
    from public.reservations pending
    where pending.status = 'payment_pending'
      and (pending.hold_expires_at is null or pending.hold_expires_at > pg_catalog.now())
  ) >= c_max_active_holds then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_global_booking_rate_limit()
  from public, anon, authenticated;

drop trigger if exists enforce_global_booking_rate_limit on public.reservations;
create trigger enforce_global_booking_rate_limit
before insert on public.reservations
for each row execute function private.enforce_global_booking_rate_limit();

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

-- Brand new reservation reference codes as Harmony Balaton Villa.
--
-- New codes look like HBV-261020-1A2B3C4D instead of RV-261020-1A2B3C4D.
-- Existing reservations keep their original RV- codes, so guests can still
-- look up older bookings on the reservation status page.
-- Safe to run more than once.

create or replace function private.apply_brand_reference_prefix()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.reference_code like 'RV-%' then
    new.reference_code := 'HBV-' || substr(new.reference_code, 4);
  end if;
  return new;
end;
$$;

revoke all on function private.apply_brand_reference_prefix()
  from public, anon, authenticated;

drop trigger if exists apply_brand_reference_prefix on public.reservations;
create trigger apply_brand_reference_prefix
before insert on public.reservations
for each row execute function private.apply_brand_reference_prefix();

-- Run fix_booking_result_after_child_fee.sql first: it makes the booking
-- result return the stored (HBV-) code that the guest must use.

commit;
