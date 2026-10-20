-- Add a one-time child fee that mirrors the existing one-time pet fee.
-- The fee is snapshotted onto each reservation so historical totals stay stable.

alter table public.booking_settings
  add column if not exists child_fee integer not null default 0;

alter table public.reservations
  add column if not exists child_fee integer not null default 0;

alter table public.reservations
  drop constraint if exists reservations_public_input_valid;

alter table public.reservations
  add constraint reservations_public_input_valid check (
    char_length(trim(guest_name)) between 2 and 120
    and char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    and char_length(trim(phone)) between 5 and 40
    and char_length(notes) <= 2000
    and (check_out - check_in) between 1 and 60
    and total_price = subtotal + child_fee + pet_fee
    and jsonb_typeof(pricing_snapshot) = 'array'
  );

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'booking_settings_child_fee_nonnegative'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_child_fee_nonnegative
      check (child_fee >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_child_fee_nonnegative'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_child_fee_nonnegative
      check (child_fee >= 0);
  end if;
end;
$$;

grant select (child_fee) on table public.booking_settings
  to anon, authenticated;
grant insert (child_fee), update (child_fee) on table public.booking_settings
  to authenticated;
grant select (child_fee) on table public.reservations
  to authenticated;

create or replace function private.apply_child_fee_snapshot()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_child_fee integer;
begin
  select settings.child_fee
  into v_child_fee
  from public.booking_settings settings
  where settings.id = 1;

  if not found then
    raise exception using errcode = 'P0001', message = 'BOOKING_SETTINGS_MISSING';
  end if;

  new.child_fee := case
    when coalesce(new.children, 0) > 0 then v_child_fee
    else 0
  end;
  new.total_price := new.subtotal + new.pet_fee + new.child_fee;

  return new;
end;
$$;

revoke all on function private.apply_child_fee_snapshot()
  from public, anon, authenticated;

drop trigger if exists apply_child_fee_snapshot on public.reservations;
create trigger apply_child_fee_snapshot
before insert on public.reservations
for each row execute function private.apply_child_fee_snapshot();

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
language sql
volatile
security definer
set search_path = ''
as $$
  select
    created.reservation_id,
    created.reference_code,
    created.subtotal,
    created.pet_fee,
    reservation.total_price,
    created.currency,
    created.hold_expires_at,
    created.room_ids,
    created.booking_scope
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
  join public.reservations reservation
    on reservation.id = created.reservation_id;
$$;

revoke all on function private.create_room_reservation_with_fees_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
grant execute on function private.create_room_reservation_with_fees_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) to anon, authenticated;

create or replace function public.create_room_reservation(
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
language sql
volatile
security invoker
set search_path = ''
as $$
  select *
  from private.create_room_reservation_with_fees_impl(
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
volatile
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
  from private.create_room_reservation_with_fees_impl(
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
