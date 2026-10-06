-- Professional booking, policy and availability safeguards.
-- Safe to run more than once.

alter table public.booking_settings
  add column if not exists cancellation_free_days smallint not null default 14,
  add column if not exists late_cancellation_refund_percent smallint not null default 0,
  add column if not exists privacy_retention_months smallint not null default 24,
  add column if not exists legal_operator_name text not null default 'Relax Villa Panzió',
  add column if not exists legal_operator_address text not null default '8257 Badacsonytomaj, Füredi út 5';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'booking_settings_policy_values_valid'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_policy_values_valid check (
        cancellation_free_days between 0 and 365
        and late_cancellation_refund_percent between 0 and 100
        and privacy_retention_months between 1 and 120
        and char_length(trim(legal_operator_name)) between 2 and 160
        and char_length(trim(legal_operator_address)) between 5 and 300
      );
  end if;
end;
$$;

revoke select on table public.booking_settings from anon;
grant select (
  id,
  currency,
  weekend_days,
  payment_hold_hours,
  pet_fee,
  contact_email,
  whatsapp_number,
  max_guests,
  check_in_time,
  check_out_time,
  cancellation_free_days,
  late_cancellation_refund_percent,
  privacy_retention_months,
  legal_operator_name,
  legal_operator_address,
  updated_at
) on table public.booking_settings to anon;

-- Payment account details are not readable through the generic public settings
-- endpoint. They are returned only after a validated, rate-limited reservation
-- request has been created.
create or replace function private.create_room_reservation_secure_impl(
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
  booking_scope text,
  bank_beneficiary text,
  bank_name text,
  bank_account_number text,
  iban text,
  bic_swift text
)
language sql
security definer
set search_path = ''
as $$
  select
    created.reservation_id,
    created.reference_code,
    created.subtotal,
    created.pet_fee,
    created.total_price,
    created.currency,
    created.hold_expires_at,
    created.room_ids,
    created.booking_scope,
    settings.bank_beneficiary,
    settings.bank_name,
    settings.bank_account_number,
    settings.iban,
    settings.bic_swift
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
  ) created
  cross join public.booking_settings settings
  where settings.id = 1;
$$;

revoke all on function private.create_room_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
revoke all on function private.create_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;
revoke all on function private.create_room_reservation_secure_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
grant execute on function private.create_room_reservation_secure_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) to anon, authenticated;
revoke all on function public.create_room_reservation(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
revoke all on function public.create_reservation(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;

create or replace function public.create_room_reservation_secure(
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
  booking_scope text,
  bank_beneficiary text,
  bank_name text,
  bank_account_number text,
  iban text,
  bic_swift text
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from private.create_room_reservation_secure_impl(
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
  );
$$;

revoke all on function public.create_room_reservation_secure(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
grant execute on function public.create_room_reservation_secure(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) to anon, authenticated;

-- Availability must only block the rooms allocated to a reservation. Expired
-- payment holds no longer block inventory.
create or replace function private.get_room_availability_impl(
  p_from date,
  p_to date
)
returns table (
  source text,
  room_id smallint,
  start_date date,
  end_date date
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_from is null
    or p_to is null
    or p_from < current_date - 1
    or p_to <= p_from
    or p_to > current_date + 800
    or p_to - p_from > 800
  then
    raise exception using errcode = '22023', message = 'INVALID_DATE_RANGE';
  end if;

  return query
  select
    'reservation'::text,
    allocated.room_id,
    reservation.check_in,
    reservation.check_out
  from public.reservations reservation
  cross join lateral unnest(reservation.room_ids) as allocated(room_id)
  join public.rooms room on room.id = allocated.room_id and room.active
  where (
      reservation.status = 'confirmed'
      or (
        reservation.status = 'payment_pending'
        and (reservation.hold_expires_at is null or reservation.hold_expires_at > now())
      )
    )
    and daterange(reservation.check_in, reservation.check_out, '[)')
      && daterange(p_from, p_to, '[)')

  union all

  select
    'block'::text,
    room.id,
    block.start_date,
    block.end_date
  from public.availability_blocks block
  join public.rooms room
    on room.active and (block.room_id is null or block.room_id = room.id)
  where block.active
    and daterange(block.start_date, block.end_date, '[)')
      && daterange(p_from, p_to, '[)');
end;
$$;

revoke all on function private.get_room_availability_impl(date, date)
  from public, anon, authenticated;
grant execute on function private.get_room_availability_impl(date, date)
  to anon, authenticated;

-- Do not allow an administrator to block dates that already have an active
-- room allocation. This protects direct table writes as well as the admin UI.
create or replace function private.prevent_availability_reservation_overlap()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.active and exists (
    select 1
    from public.reservation_rooms allocation
    where (new.room_id is null or allocation.room_id = new.room_id)
      and (
        allocation.status = 'confirmed'
        or (
          allocation.status = 'payment_pending'
          and (allocation.hold_expires_at is null or allocation.hold_expires_at > now())
        )
      )
      and daterange(allocation.check_in, allocation.check_out, '[)')
        && daterange(new.start_date, new.end_date, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'BLOCK_OVERLAPS_RESERVATION';
  end if;
  return new;
end;
$$;

revoke all on function private.prevent_availability_reservation_overlap()
  from public, anon, authenticated;

drop trigger if exists prevent_availability_reservation_overlap
  on public.availability_blocks;
create trigger prevent_availability_reservation_overlap
before insert or update of room_id, start_date, end_date, active
on public.availability_blocks
for each row execute function private.prevent_availability_reservation_overlap();

-- A guest may retrieve only a deliberately limited reservation summary by
-- presenting both the random reference code and matching email address.
create or replace function private.get_reservation_status_impl(
  p_reference text,
  p_email text
)
returns table (
  reference_code text,
  status public.reservation_status,
  payment_status public.payment_status,
  check_in date,
  check_out date,
  total_price integer,
  currency text,
  hold_expires_at timestamptz,
  room_ids smallint[],
  booking_scope text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    reservation.reference_code,
    reservation.status,
    reservation.payment_status,
    reservation.check_in,
    reservation.check_out,
    reservation.total_price,
    reservation.currency,
    reservation.hold_expires_at,
    reservation.room_ids,
    reservation.booking_scope
  from public.reservations reservation
  where reservation.reference_code = upper(trim(p_reference))
    and reservation.email = lower(trim(p_email))
    and char_length(trim(p_reference)) between 10 and 40
    and char_length(trim(p_email)) between 3 and 254
  limit 1;
$$;

revoke all on function private.get_reservation_status_impl(text, text)
  from public, anon, authenticated;
grant execute on function private.get_reservation_status_impl(text, text)
  to anon, authenticated;

create or replace function public.get_reservation_status(
  p_reference text,
  p_email text
)
returns table (
  reference_code text,
  status public.reservation_status,
  payment_status public.payment_status,
  check_in date,
  check_out date,
  total_price integer,
  currency text,
  hold_expires_at timestamptz,
  room_ids smallint[],
  booking_scope text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from private.get_reservation_status_impl(p_reference, p_email);
$$;

revoke all on function public.get_reservation_status(text, text)
  from public, anon, authenticated;
grant execute on function public.get_reservation_status(text, text)
  to anon, authenticated;
