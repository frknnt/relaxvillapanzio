-- Flexible room inventory, room-level pricing and Turkish content support.
-- Existing reservations remain whole-villa bookings and existing package prices
-- remain the source of truth whenever all four rooms are selected.

create extension if not exists btree_gist with schema extensions;

create table if not exists public.rooms (
  id smallint primary key,
  code text not null unique,
  max_guests smallint not null,
  active boolean not null default true,
  individual_booking_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint rooms_id_bounds check (id between 1 and 4),
  constraint rooms_code_format check (code ~ '^room-[1-4]$'),
  constraint rooms_max_guests_bounds check (max_guests between 1 and 10)
);

insert into public.rooms (id, code, max_guests, active, individual_booking_enabled)
values
  (1, 'room-1', 2, true, true),
  (2, 'room-2', 2, true, true),
  (3, 'room-3', 2, true, true),
  (4, 'room-4', 3, true, true)
on conflict (id) do nothing;

create table if not exists public.room_monthly_rates (
  id uuid primary key default gen_random_uuid(),
  room_id smallint not null references public.rooms(id) on delete cascade,
  month date not null,
  weekday_rate integer not null,
  weekend_rate integer not null,
  minimum_nights smallint not null default 2,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  constraint room_monthly_rates_month_start check (extract(day from month) = 1),
  constraint room_monthly_rates_amount_bounds check (
    weekday_rate between 0 and 30000000
    and weekend_rate between 0 and 30000000
  ),
  constraint room_monthly_rates_minimum_nights check (minimum_nights between 1 and 30),
  constraint room_monthly_rates_room_month_key unique (room_id, month)
);

create index if not exists room_monthly_rates_active_lookup_idx
  on public.room_monthly_rates (room_id, month)
  where active;

-- Seed immediately usable room prices from the current package price. The
-- package row is retained and still wins whenever all four rooms are booked.
insert into public.room_monthly_rates (
  room_id,
  month,
  weekday_rate,
  weekend_rate,
  minimum_nights,
  active
)
select
  room.id,
  package.month,
  round(package.weekday_rate / 4.0)::integer,
  round(package.weekend_rate / 4.0)::integer,
  package.minimum_nights,
  package.active
from public.monthly_rates package
cross join public.rooms room
on conflict (room_id, month) do nothing;

alter table public.availability_blocks
  add column if not exists room_id smallint references public.rooms(id) on delete cascade;

create index if not exists availability_blocks_room_dates_idx
  on public.availability_blocks (room_id, start_date, end_date)
  where active;

alter table public.reservations
  add column if not exists room_ids smallint[] not null default array[1, 2, 3, 4]::smallint[],
  add column if not exists booking_scope text not null default 'whole_villa';

alter table public.reservations
  drop constraint if exists reservations_room_ids_valid,
  add constraint reservations_room_ids_valid check (
    cardinality(room_ids) between 1 and 4
    and room_ids <@ array[1, 2, 3, 4]::smallint[]
  ),
  drop constraint if exists reservations_booking_scope_valid,
  add constraint reservations_booking_scope_valid check (
    booking_scope in ('whole_villa', 'room_selection')
  );

update public.reservations
set
  room_ids = array[1, 2, 3, 4]::smallint[],
  booking_scope = 'whole_villa'
where room_ids is distinct from array[1, 2, 3, 4]::smallint[]
   or booking_scope is distinct from 'whole_villa';

create table if not exists public.reservation_rooms (
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  room_id smallint not null references public.rooms(id) on delete restrict,
  check_in date not null,
  check_out date not null,
  status public.reservation_status not null,
  hold_expires_at timestamptz,
  primary key (reservation_id, room_id),
  constraint reservation_rooms_dates_valid check (check_out > check_in),
  constraint reservation_rooms_no_overlap exclude using gist (
    room_id with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('payment_pending', 'confirmed'))
);

create index if not exists reservation_rooms_inventory_idx
  on public.reservation_rooms (room_id, check_in, check_out);

insert into public.reservation_rooms (
  reservation_id,
  room_id,
  check_in,
  check_out,
  status,
  hold_expires_at
)
select
  reservation.id,
  room.id,
  reservation.check_in,
  reservation.check_out,
  reservation.status,
  reservation.hold_expires_at
from public.reservations reservation
cross join public.rooms room
on conflict (reservation_id, room_id) do update
set
  check_in = excluded.check_in,
  check_out = excluded.check_out,
  status = excluded.status,
  hold_expires_at = excluded.hold_expires_at;

-- A booking may price only the selected bedrooms, but the property is never
-- shared by unrelated guest groups. Keep the reservation-level exclusion
-- constraint from the base schema as the final concurrency guard.
do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'reservations_no_overlap'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_no_overlap
      exclude using gist (
        daterange(check_in, check_out, '[)') with &&
      )
      where (status in ('payment_pending', 'confirmed'));
  end if;
end;
$$;

create or replace function private.sync_reservation_rooms()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.reservation_rooms allocation
  where allocation.reservation_id = new.id;

  insert into public.reservation_rooms (
    reservation_id,
    room_id,
    check_in,
    check_out,
    status,
    hold_expires_at
  )
  select
    new.id,
    room_id,
    new.check_in,
    new.check_out,
    new.status,
    new.hold_expires_at
  from unnest(new.room_ids) as selected(room_id);

  return new;
end;
$$;

revoke all on function private.sync_reservation_rooms() from public, anon, authenticated;

drop trigger if exists sync_reservation_rooms_after_write on public.reservations;
create trigger sync_reservation_rooms_after_write
after insert or update of room_ids, check_in, check_out, status, hold_expires_at
on public.reservations
for each row execute function private.sync_reservation_rooms();

alter table public.rooms enable row level security;
alter table public.room_monthly_rates enable row level security;
alter table public.reservation_rooms enable row level security;

drop policy if exists rooms_public_read on public.rooms;
create policy rooms_public_read
on public.rooms for select
to anon
using (active);

drop policy if exists rooms_admin_read on public.rooms;
create policy rooms_admin_read
on public.rooms for select
to authenticated
using (active or (select private.is_admin()));

drop policy if exists rooms_admin_insert on public.rooms;
create policy rooms_admin_insert
on public.rooms for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists rooms_admin_update on public.rooms;
create policy rooms_admin_update
on public.rooms for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists rooms_admin_delete on public.rooms;
create policy rooms_admin_delete
on public.rooms for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists room_monthly_rates_public_read on public.room_monthly_rates;
create policy room_monthly_rates_public_read
on public.room_monthly_rates for select
to anon
using (active);

drop policy if exists room_monthly_rates_admin_read on public.room_monthly_rates;
create policy room_monthly_rates_admin_read
on public.room_monthly_rates for select
to authenticated
using (active or (select private.is_admin()));

drop policy if exists room_monthly_rates_admin_insert on public.room_monthly_rates;
create policy room_monthly_rates_admin_insert
on public.room_monthly_rates for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists room_monthly_rates_admin_update on public.room_monthly_rates;
create policy room_monthly_rates_admin_update
on public.room_monthly_rates for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists room_monthly_rates_admin_delete on public.room_monthly_rates;
create policy room_monthly_rates_admin_delete
on public.room_monthly_rates for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists reservation_rooms_admin_read on public.reservation_rooms;
create policy reservation_rooms_admin_read
on public.reservation_rooms for select
to authenticated
using ((select private.is_admin()));

revoke all on table public.rooms from anon, authenticated;
grant select (id, code, max_guests, active, individual_booking_enabled, updated_at)
  on table public.rooms to anon;
grant select, insert, update, delete on table public.rooms to authenticated;

revoke all on table public.room_monthly_rates from anon, authenticated;
grant select (
  id,
  room_id,
  month,
  weekday_rate,
  weekend_rate,
  minimum_nights,
  active,
  created_at,
  updated_at
) on table public.room_monthly_rates to anon;
grant select, insert, update, delete on table public.room_monthly_rates to authenticated;

revoke all on table public.reservation_rooms from anon, authenticated;
grant select on table public.reservation_rooms to authenticated;

grant select (room_id) on table public.availability_blocks to anon;
grant select (room_ids, booking_scope) on table public.reservations to anon;

drop trigger if exists set_rooms_updated_at on public.rooms;
create trigger set_rooms_updated_at
before update on public.rooms
for each row execute function private.set_updated_at();

drop trigger if exists set_room_monthly_rates_updated_at on public.room_monthly_rates;
create trigger set_room_monthly_rates_updated_at
before update on public.room_monthly_rates
for each row execute function private.set_updated_at();

create or replace function public.get_room_availability(p_from date, p_to date)
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
    room.id,
    reservation.check_in,
    reservation.check_out
  from public.reservations reservation
  cross join public.rooms room
  where room.active
    and reservation.status in ('payment_pending', 'confirmed')
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

revoke all on function public.get_room_availability(date, date)
  from public, anon, authenticated;
grant execute on function public.get_room_availability(date, date)
  to anon, authenticated;

create or replace function public.get_availability(p_from date, p_to date)
returns table (
  source text,
  start_date date,
  end_date date
)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct availability.source, availability.start_date, availability.end_date
  from public.get_room_availability(p_from, p_to) availability;
$$;

revoke all on function public.get_availability(date, date)
  from public, anon, authenticated;
grant execute on function public.get_availability(date, date)
  to anon, authenticated;

create or replace function private.create_room_reservation_impl(
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
  v_settings public.booking_settings%rowtype;
  v_nights integer;
  v_minimum_nights integer := 1;
  v_subtotal bigint := 0;
  v_pet_fee integer;
  v_snapshot jsonb := '[]'::jsonb;
  v_reference text;
  v_reservation_id uuid;
  v_hold_expires_at timestamptz;
  v_email text;
  v_room_ids smallint[];
  v_booking_scope text;
  v_capacity integer;
  v_night date;
  v_is_weekend boolean;
  v_night_rate bigint;
  v_rate_count integer;
  v_night_minimum integer;
  v_room_breakdown jsonb;
  v_package public.monthly_rates%rowtype;
begin
  if coalesce(trim(p_website), '') <> '' then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  if char_length(trim(coalesce(p_guest_name, ''))) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'INVALID_GUEST_NAME';
  end if;

  v_email := lower(trim(coalesce(p_email, '')));
  if char_length(v_email) not between 3 and 254
    or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  then
    raise exception using errcode = '22023', message = 'INVALID_EMAIL';
  end if;

  if char_length(trim(coalesce(p_phone, ''))) not between 5 and 40 then
    raise exception using errcode = '22023', message = 'INVALID_PHONE';
  end if;

  if char_length(coalesce(p_notes, '')) > 2000 then
    raise exception using errcode = '22023', message = 'INVALID_NOTES';
  end if;

  if p_language not in ('en', 'de', 'hu', 'tr') then
    raise exception using errcode = '22023', message = 'INVALID_LANGUAGE';
  end if;

  if p_check_in is null
    or p_check_out is null
    or p_check_in < current_date
    or p_check_out <= p_check_in
    or p_check_in > current_date + 730
  then
    raise exception using errcode = '22023', message = 'INVALID_DATES';
  end if;

  v_nights := p_check_out - p_check_in;
  if v_nights > 60 then
    raise exception using errcode = '22023', message = 'STAY_TOO_LONG';
  end if;

  if p_adults is null
    or p_children is null
    or p_pets is null
    or p_adults < 1
    or p_adults > 30
    or p_children < 0
    or p_children > 30
    or p_pets < 0
    or p_pets > 10
  then
    raise exception using errcode = '22023', message = 'INVALID_GUEST_COUNT';
  end if;

  select array_agg(distinct selected.room_id order by selected.room_id)
  into v_room_ids
  from unnest(coalesce(p_room_ids, array[]::smallint[])) as selected(room_id);

  if v_room_ids is null
    or cardinality(v_room_ids) < 1
    or cardinality(v_room_ids) > 4
    or not (v_room_ids <@ array[1, 2, 3, 4]::smallint[])
  then
    raise exception using errcode = '22023', message = 'INVALID_ROOM_SELECTION';
  end if;

  if (
    select count(*)
    from public.rooms room
    where room.id = any(v_room_ids)
      and room.active
  ) <> cardinality(v_room_ids) then
    raise exception using errcode = '22023', message = 'ROOM_NOT_AVAILABLE';
  end if;

  v_booking_scope := case
    when v_room_ids = array[1, 2, 3, 4]::smallint[] then 'whole_villa'
    else 'room_selection'
  end;

  if v_booking_scope = 'room_selection' and exists (
    select 1
    from public.rooms room
    where room.id = any(v_room_ids)
      and not room.individual_booking_enabled
  ) then
    raise exception using errcode = '22023', message = 'ROOM_NOT_AVAILABLE';
  end if;

  select * into v_settings
  from public.booking_settings
  where id = 1;

  if not found then
    raise exception using errcode = 'P0001', message = 'BOOKING_SETTINGS_MISSING';
  end if;

  if v_booking_scope = 'whole_villa' then
    v_capacity := v_settings.max_guests;
  else
    select coalesce(sum(room.max_guests), 0)::integer
    into v_capacity
    from public.rooms room
    where room.id = any(v_room_ids);
  end if;

  if p_adults + p_children > v_capacity then
    raise exception using errcode = '22023', message = 'TOO_MANY_GUESTS';
  end if;

  perform pg_advisory_xact_lock(hashtext('reservation:' || v_email));
  if (
    select count(*)
    from public.reservations recent
    where lower(recent.email) = v_email
      and recent.created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  perform pg_advisory_xact_lock(hashtext('relax-villa-room-reservation'));

  update public.reservations reservation
  set status = 'expired'
  where reservation.status = 'payment_pending'
    and reservation.hold_expires_at is not null
    and reservation.hold_expires_at <= now();

  if exists (
    select 1
    from public.reservation_rooms allocation
    where allocation.room_id = any(v_room_ids)
      and (
        allocation.status = 'confirmed'
        or (
          allocation.status = 'payment_pending'
          and (allocation.hold_expires_at is null or allocation.hold_expires_at > now())
        )
      )
      and daterange(allocation.check_in, allocation.check_out, '[)')
        && daterange(p_check_in, p_check_out, '[)')
  ) or exists (
    select 1
    from public.availability_blocks block
    where block.active
      and (block.room_id is null or block.room_id = any(v_room_ids))
      and daterange(block.start_date, block.end_date, '[)')
        && daterange(p_check_in, p_check_out, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'DATES_UNAVAILABLE';
  end if;

  for v_night in
    select generated.night_date::date
    from generate_series(
      p_check_in::timestamp,
      (p_check_out - 1)::timestamp,
      interval '1 day'
    ) as generated(night_date)
  loop
    v_is_weekend := extract(isodow from v_night)::smallint = any(v_settings.weekend_days);

    if v_booking_scope = 'whole_villa' then
      select * into v_package
      from public.monthly_rates package
      where package.month = date_trunc('month', v_night)::date
        and package.active;

      if not found then
        raise exception using errcode = 'P0001', message = 'RATE_NOT_CONFIGURED';
      end if;

      v_night_rate := case
        when v_is_weekend then v_package.weekend_rate
        else v_package.weekday_rate
      end;
      v_night_minimum := v_package.minimum_nights;
      v_room_breakdown := null;
    else
      select
        count(*)::integer,
        coalesce(sum(
          case
            when v_is_weekend then rate.weekend_rate
            else rate.weekday_rate
          end
        ), 0),
        coalesce(max(rate.minimum_nights), 1)::integer,
        coalesce(jsonb_agg(
          jsonb_build_object(
            'room_id', rate.room_id,
            'rate', case
              when v_is_weekend then rate.weekend_rate
              else rate.weekday_rate
            end
          ) order by rate.room_id
        ), '[]'::jsonb)
      into v_rate_count, v_night_rate, v_night_minimum, v_room_breakdown
      from public.room_monthly_rates rate
      where rate.room_id = any(v_room_ids)
        and rate.month = date_trunc('month', v_night)::date
        and rate.active;

      if v_rate_count <> cardinality(v_room_ids) then
        raise exception using errcode = 'P0001', message = 'RATE_NOT_CONFIGURED';
      end if;
    end if;

    v_subtotal := v_subtotal + v_night_rate;
    v_minimum_nights := greatest(v_minimum_nights, v_night_minimum);
    v_snapshot := v_snapshot || jsonb_build_array(jsonb_build_object(
      'date', v_night,
      'month', date_trunc('month', v_night)::date,
      'kind', case when v_is_weekend then 'weekend' else 'weekday' end,
      'rate', v_night_rate,
      'scope', v_booking_scope,
      'room_ids', v_room_ids,
      'room_rates', v_room_breakdown
    ));
  end loop;

  if v_nights < v_minimum_nights then
    raise exception using errcode = '22023', message = 'MINIMUM_NIGHTS_NOT_MET';
  end if;

  v_pet_fee := case when p_pets > 0 then v_settings.pet_fee else 0 end;
  if v_subtotal + v_pet_fee > 2147483647 then
    raise exception using errcode = '22003', message = 'PRICE_OUT_OF_RANGE';
  end if;

  v_reference := 'RV-' || to_char(now(), 'YYMMDD') || '-'
    || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 8));
  v_hold_expires_at := now()
    + make_interval(hours => v_settings.payment_hold_hours);

  insert into public.reservations (
    reference_code,
    guest_name,
    email,
    phone,
    language,
    check_in,
    check_out,
    adults,
    children,
    pets,
    subtotal,
    pet_fee,
    total_price,
    currency,
    pricing_snapshot,
    notes,
    hold_expires_at,
    room_ids,
    booking_scope
  ) values (
    v_reference,
    trim(p_guest_name),
    v_email,
    trim(p_phone),
    p_language,
    p_check_in,
    p_check_out,
    p_adults,
    p_children,
    p_pets,
    v_subtotal::integer,
    v_pet_fee,
    v_subtotal::integer + v_pet_fee,
    v_settings.currency,
    v_snapshot,
    trim(coalesce(p_notes, '')),
    v_hold_expires_at,
    v_room_ids,
    v_booking_scope
  )
  returning id into v_reservation_id;

  insert into public.reservation_events (
    reservation_id,
    event_type,
    to_status,
    note
  ) values (
    v_reservation_id,
    'reservation_created',
    'payment_pending',
    case
      when v_booking_scope = 'whole_villa' then 'Public whole-villa booking request created'
      else 'Public room booking request created'
    end
  );

  return query
  select
    v_reservation_id,
    v_reference,
    v_subtotal::integer,
    v_pet_fee,
    v_subtotal::integer + v_pet_fee,
    v_settings.currency,
    v_hold_expires_at,
    v_room_ids,
    v_booking_scope;
end;
$$;

revoke all on function private.create_room_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
grant execute on function private.create_room_reservation_impl(
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
  );
$$;

revoke all on function public.create_room_reservation(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) from public, anon, authenticated;
grant execute on function public.create_room_reservation(
  text, text, text, text, date, date, integer, integer, integer, smallint[], text, text
) to anon, authenticated;

create or replace function private.create_reservation_impl(
  p_guest_name text,
  p_email text,
  p_phone text,
  p_language text,
  p_check_in date,
  p_check_out date,
  p_adults integer,
  p_children integer,
  p_pets integer,
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
  hold_expires_at timestamptz
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
    created.hold_expires_at
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
    array[1, 2, 3, 4]::smallint[],
    p_notes,
    p_website
  ) created;
$$;

revoke all on function private.create_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;
grant execute on function private.create_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, text, text
) to anon, authenticated;

alter table public.reservations
  drop constraint if exists reservations_language_check,
  add constraint reservations_language_check check (language in ('en', 'de', 'hu', 'tr'));

alter table public.support_requests
  drop constraint if exists support_requests_language_check,
  add constraint support_requests_language_check check (language in ('en', 'de', 'hu', 'tr'));

create or replace function private.create_support_request_impl(
  p_name text,
  p_email text,
  p_phone text,
  p_language text,
  p_message text,
  p_website text default ''
)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  normalized_name text := trim(coalesce(p_name, ''));
  normalized_email text := lower(trim(coalesce(p_email, '')));
  normalized_phone text := trim(coalesce(p_phone, ''));
  normalized_language text := lower(trim(coalesce(p_language, '')));
  normalized_message text := trim(coalesce(p_message, ''));
  request_id uuid;
begin
  if trim(coalesce(p_website, '')) <> '' then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  if char_length(normalized_name) not between 2 and 120
    or char_length(normalized_email) not between 3 and 254
    or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or char_length(normalized_phone) > 40
    or normalized_language not in ('en', 'de', 'hu', 'tr')
    or char_length(normalized_message) not between 10 and 4000
  then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('support:global'));

  if (
    select count(*)
    from public.support_requests request
    where request.created_at > pg_catalog.now() - interval '1 minute'
  ) >= 30 then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  insert into public.support_requests (name, email, phone, language, message)
  values (
    normalized_name,
    normalized_email,
    normalized_phone,
    normalized_language,
    normalized_message
  )
  returning id into request_id;

  return request_id;
end;
$$;

alter table public.blog_posts
  add column if not exists category_tr text not null default '',
  add column if not exists title_tr text not null default '',
  add column if not exists excerpt_tr text not null default '',
  add column if not exists content_tr text not null default '';

update public.blog_posts
set
  category_tr = case when category_tr = '' then category_en else category_tr end,
  title_tr = case when title_tr = '' then title_en else title_tr end,
  excerpt_tr = case when excerpt_tr = '' then excerpt_en else excerpt_tr end,
  content_tr = case when content_tr = '' then content_en else content_tr end;

alter table public.gallery_images
  add column if not exists alt_tr text not null default '',
  add column if not exists caption_tr text not null default '';

update public.gallery_images
set
  alt_tr = case when alt_tr = '' then alt_en else alt_tr end,
  caption_tr = case when caption_tr = '' then caption_en else caption_tr end;

revoke select on table public.blog_posts from anon;
grant select (
  id,
  slug,
  status,
  category_en,
  category_de,
  category_hu,
  category_tr,
  title_en,
  title_de,
  title_hu,
  title_tr,
  excerpt_en,
  excerpt_de,
  excerpt_hu,
  excerpt_tr,
  content_en,
  content_de,
  content_hu,
  content_tr,
  cover_url,
  published_at,
  created_at,
  updated_at
) on table public.blog_posts to anon;

revoke select on table public.gallery_images from anon;
grant select (
  id,
  storage_path,
  public_url,
  category,
  room,
  alt_en,
  alt_de,
  alt_hu,
  alt_tr,
  caption_en,
  caption_de,
  caption_hu,
  caption_tr,
  sort_order,
  visible,
  created_at,
  updated_at
) on table public.gallery_images to anon;

-- Keep privileged helper implementations out of direct public execution.
revoke all on function private.create_support_request_impl(
  text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function private.create_support_request_impl(
  text, text, text, text, text, text
) to anon;
