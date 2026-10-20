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
