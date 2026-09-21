create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

do $$
begin
  create type public.reservation_status as enum (
    'payment_pending',
    'confirmed',
    'cancelled',
    'expired'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_status as enum (
    'awaiting_transfer',
    'received',
    'refunded'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.blog_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_settings (
  id smallint primary key default 1 check (id = 1),
  currency text not null default 'HUF' check (currency ~ '^[A-Z]{3}$'),
  weekend_days smallint[] not null default array[5, 6]::smallint[],
  payment_hold_hours smallint not null default 48 check (payment_hold_hours between 1 and 336),
  pet_fee integer not null default 0 check (pet_fee >= 0),
  iban text not null default '',
  bank_beneficiary text not null default '',
  bank_name text not null default '',
  bank_account_number text not null default '' constraint booking_settings_bank_account_number_length check (char_length(bank_account_number) <= 80),
  bic_swift text not null default '' constraint booking_settings_bic_swift_length check (char_length(bic_swift) <= 20),
  contact_email text not null default '' constraint booking_settings_contact_email_length check (char_length(contact_email) <= 254),
  whatsapp_number text not null default '',
  max_guests smallint not null default 12 check (max_guests between 1 and 30),
  check_in_time time not null default '15:00',
  check_out_time time not null default '10:00',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.booking_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.monthly_rates (
  id uuid primary key default gen_random_uuid(),
  month date not null unique check (extract(day from month) = 1),
  weekday_rate integer not null check (weekday_rate >= 0),
  weekend_rate integer not null check (weekend_rate >= 0),
  minimum_nights smallint not null default 2 check (minimum_nights between 1 and 30),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists monthly_rates_month_active_idx
  on public.monthly_rates (month, active);

create table if not exists public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'Kapalı tarih',
  start_date date not null,
  end_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  check (end_date > start_date)
);

create index if not exists availability_blocks_dates_idx
  on public.availability_blocks (start_date, end_date)
  where active;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  guest_name text not null,
  email text not null,
  phone text not null,
  language text not null default 'en' check (language in ('en', 'de', 'hu')),
  check_in date not null,
  check_out date not null,
  adults smallint not null check (adults between 1 and 20),
  children smallint not null default 0 check (children between 0 and 20),
  pets smallint not null default 0 check (pets between 0 and 20),
  status public.reservation_status not null default 'payment_pending',
  payment_status public.payment_status not null default 'awaiting_transfer',
  subtotal integer not null check (subtotal >= 0),
  pet_fee integer not null default 0 check (pet_fee >= 0),
  total_price integer not null check (total_price >= 0),
  currency text not null default 'HUF' check (currency ~ '^[A-Z]{3}$'),
  pricing_snapshot jsonb not null default '[]'::jsonb,
  notes text not null default '',
  hold_expires_at timestamptz,
  payment_received_at timestamptz,
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users(id) on delete set null,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_out > check_in),
  check (char_length(reference_code) between 8 and 40)
);

alter table public.reservations
  drop constraint if exists reservations_no_overlap;

alter table public.reservations
  add constraint reservations_no_overlap
  exclude using gist (
    daterange(check_in, check_out, '[)') with &&
  )
  where (status in ('payment_pending', 'confirmed'));

create index if not exists reservations_status_created_idx
  on public.reservations (status, created_at desc);

create index if not exists reservations_check_in_idx
  on public.reservations (check_in);

create index if not exists reservations_payment_pending_idx
  on public.reservations (created_at desc)
  where status = 'payment_pending';

create index if not exists reservations_confirmed_by_idx
  on public.reservations (confirmed_by);

create table if not exists public.reservation_events (
  id bigint generated always as identity primary key,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  event_type text not null,
  from_status public.reservation_status,
  to_status public.reservation_status,
  note text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists reservation_events_reservation_created_idx
  on public.reservation_events (reservation_id, created_at desc);

create index if not exists reservation_events_created_by_idx
  on public.reservation_events (created_by);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.blog_status not null default 'draft',
  category_en text not null default 'Travel',
  category_de text not null default 'Reise',
  category_hu text not null default 'Utazás',
  title_en text not null,
  title_de text not null,
  title_hu text not null,
  excerpt_en text not null default '',
  excerpt_de text not null default '',
  excerpt_hu text not null default '',
  content_en text not null default '',
  content_de text not null default '',
  content_hu text not null default '',
  cover_url text not null default '',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create index if not exists blog_posts_created_by_idx
  on public.blog_posts (created_by);

create index if not exists blog_posts_updated_by_idx
  on public.blog_posts (updated_by);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  category text not null check (category in ('bedrooms', 'shared', 'outdoors', 'blog')),
  room smallint check (room between 1 and 4),
  alt_en text not null default '',
  alt_de text not null default '',
  alt_hu text not null default '',
  caption_en text not null default '',
  caption_de text not null default '',
  caption_hu text not null default '',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_visible_order_idx
  on public.gallery_images (category, sort_order)
  where visible;

create index if not exists gallery_images_created_by_idx
  on public.gallery_images (created_by);

create index if not exists booking_settings_updated_by_idx
  on public.booking_settings (updated_by);

create index if not exists monthly_rates_updated_by_idx
  on public.monthly_rates (updated_by);

create index if not exists availability_blocks_created_by_idx
  on public.availability_blocks (created_by);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function private.set_updated_at();

drop trigger if exists set_booking_settings_updated_at on public.booking_settings;
create trigger set_booking_settings_updated_at
before update on public.booking_settings
for each row execute function private.set_updated_at();

drop trigger if exists set_monthly_rates_updated_at on public.monthly_rates;
create trigger set_monthly_rates_updated_at
before update on public.monthly_rates
for each row execute function private.set_updated_at();

drop trigger if exists set_availability_blocks_updated_at on public.availability_blocks;
create trigger set_availability_blocks_updated_at
before update on public.availability_blocks
for each row execute function private.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function private.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function private.set_updated_at();

drop trigger if exists set_gallery_images_updated_at on public.gallery_images;
create trigger set_gallery_images_updated_at
before update on public.gallery_images
for each row execute function private.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
      and active
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.booking_settings enable row level security;
alter table public.monthly_rates enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_events enable row level security;
alter table public.blog_posts enable row level security;
alter table public.gallery_images enable row level security;

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.booking_settings from anon, authenticated;
revoke all on table public.monthly_rates from anon, authenticated;
revoke all on table public.availability_blocks from anon, authenticated;
revoke all on table public.reservations from anon, authenticated;
revoke all on table public.reservation_events from anon, authenticated;
revoke all on table public.blog_posts from anon, authenticated;
revoke all on table public.gallery_images from anon, authenticated;

grant select on table public.booking_settings to anon, authenticated;
grant select on table public.monthly_rates to anon, authenticated;
grant select on table public.blog_posts to anon, authenticated;
grant select on table public.gallery_images to anon, authenticated;

grant select, insert, update, delete on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.booking_settings to authenticated;
grant select, insert, update, delete on table public.monthly_rates to authenticated;
grant select, insert, update, delete on table public.availability_blocks to authenticated;
grant select, insert, update, delete on table public.reservations to authenticated;
grant select, insert, update, delete on table public.reservation_events to authenticated;
grant select, insert, update, delete on table public.blog_posts to authenticated;
grant select, insert, update, delete on table public.gallery_images to authenticated;
grant usage, select on sequence public.reservation_events_id_seq to authenticated;

drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists admin_users_admin_insert on public.admin_users;
create policy admin_users_admin_insert
on public.admin_users for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists admin_users_admin_update on public.admin_users;
create policy admin_users_admin_update
on public.admin_users for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists admin_users_admin_delete on public.admin_users;
create policy admin_users_admin_delete
on public.admin_users for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists booking_settings_public_read on public.booking_settings;
create policy booking_settings_public_read
on public.booking_settings for select
to anon, authenticated
using (id = 1);

drop policy if exists booking_settings_admin_insert on public.booking_settings;
create policy booking_settings_admin_insert
on public.booking_settings for insert
to authenticated
with check ((select private.is_admin()) and id = 1);

drop policy if exists booking_settings_admin_update on public.booking_settings;
create policy booking_settings_admin_update
on public.booking_settings for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()) and id = 1);

drop policy if exists monthly_rates_public_read on public.monthly_rates;
create policy monthly_rates_public_read
on public.monthly_rates for select
to anon
using (active);

drop policy if exists monthly_rates_admin_read on public.monthly_rates;
create policy monthly_rates_admin_read
on public.monthly_rates for select
to authenticated
using (active or (select private.is_admin()));

drop policy if exists monthly_rates_admin_insert on public.monthly_rates;
create policy monthly_rates_admin_insert
on public.monthly_rates for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists monthly_rates_admin_update on public.monthly_rates;
create policy monthly_rates_admin_update
on public.monthly_rates for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists monthly_rates_admin_delete on public.monthly_rates;
create policy monthly_rates_admin_delete
on public.monthly_rates for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists availability_blocks_admin_select on public.availability_blocks;
create policy availability_blocks_admin_select
on public.availability_blocks for select
to authenticated
using ((select private.is_admin()));

drop policy if exists availability_blocks_admin_insert on public.availability_blocks;
create policy availability_blocks_admin_insert
on public.availability_blocks for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists availability_blocks_admin_update on public.availability_blocks;
create policy availability_blocks_admin_update
on public.availability_blocks for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists availability_blocks_admin_delete on public.availability_blocks;
create policy availability_blocks_admin_delete
on public.availability_blocks for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists reservations_admin_select on public.reservations;
create policy reservations_admin_select
on public.reservations for select
to authenticated
using ((select private.is_admin()));

drop policy if exists reservations_admin_insert on public.reservations;
create policy reservations_admin_insert
on public.reservations for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists reservations_admin_update on public.reservations;
create policy reservations_admin_update
on public.reservations for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists reservations_admin_delete on public.reservations;
create policy reservations_admin_delete
on public.reservations for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists reservation_events_admin_select on public.reservation_events;
create policy reservation_events_admin_select
on public.reservation_events for select
to authenticated
using ((select private.is_admin()));

drop policy if exists reservation_events_admin_insert on public.reservation_events;
create policy reservation_events_admin_insert
on public.reservation_events for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read
on public.blog_posts for select
to anon
using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists blog_posts_admin_read on public.blog_posts;
create policy blog_posts_admin_read
on public.blog_posts for select
to authenticated
using (
  (status = 'published' and published_at is not null and published_at <= now())
  or (select private.is_admin())
);

drop policy if exists blog_posts_admin_insert on public.blog_posts;
create policy blog_posts_admin_insert
on public.blog_posts for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists blog_posts_admin_update on public.blog_posts;
create policy blog_posts_admin_update
on public.blog_posts for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists blog_posts_admin_delete on public.blog_posts;
create policy blog_posts_admin_delete
on public.blog_posts for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists gallery_images_public_read on public.gallery_images;
create policy gallery_images_public_read
on public.gallery_images for select
to anon
using (visible);

drop policy if exists gallery_images_admin_read on public.gallery_images;
create policy gallery_images_admin_read
on public.gallery_images for select
to authenticated
using (visible or (select private.is_admin()));

drop policy if exists gallery_images_admin_insert on public.gallery_images;
create policy gallery_images_admin_insert
on public.gallery_images for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists gallery_images_admin_update on public.gallery_images;
create policy gallery_images_admin_update
on public.gallery_images for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists gallery_images_admin_delete on public.gallery_images;
create policy gallery_images_admin_delete
on public.gallery_images for delete
to authenticated
using ((select private.is_admin()));

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
  select
    'reservation'::text,
    r.check_in,
    r.check_out
  from public.reservations r
  where (
      r.status = 'confirmed'
      or (
        r.status = 'payment_pending'
        and (r.hold_expires_at is null or r.hold_expires_at > now())
      )
    )
    and daterange(r.check_in, r.check_out, '[)') && daterange(p_from, p_to, '[)')

  union all

  select
    'block'::text,
    b.start_date,
    b.end_date
  from public.availability_blocks b
  where b.active
    and daterange(b.start_date, b.end_date, '[)') && daterange(p_from, p_to, '[)');
$$;

revoke all on function public.get_availability(date, date) from public, anon, authenticated;
grant execute on function public.get_availability(date, date) to anon, authenticated;

create or replace function public.create_reservation(
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
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings public.booking_settings%rowtype;
  v_nights integer;
  v_priced_nights integer;
  v_minimum_nights integer;
  v_subtotal bigint;
  v_pet_fee integer;
  v_snapshot jsonb;
  v_reference text;
  v_reservation_id uuid;
  v_hold_expires_at timestamptz;
begin
  if coalesce(trim(p_website), '') <> '' then
    raise exception using errcode = '22023', message = 'INVALID_REQUEST';
  end if;

  if char_length(trim(coalesce(p_guest_name, ''))) not between 2 and 120 then
    raise exception using errcode = '22023', message = 'INVALID_GUEST_NAME';
  end if;

  if coalesce(p_email, '') !~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then
    raise exception using errcode = '22023', message = 'INVALID_EMAIL';
  end if;

  if char_length(trim(coalesce(p_phone, ''))) not between 5 and 40 then
    raise exception using errcode = '22023', message = 'INVALID_PHONE';
  end if;

  if p_language not in ('en', 'de', 'hu') then
    raise exception using errcode = '22023', message = 'INVALID_LANGUAGE';
  end if;

  if p_check_in < current_date or p_check_out <= p_check_in then
    raise exception using errcode = '22023', message = 'INVALID_DATES';
  end if;

  if p_adults < 1 or p_children < 0 or p_pets < 0 then
    raise exception using errcode = '22023', message = 'INVALID_GUEST_COUNT';
  end if;

  select * into v_settings
  from public.booking_settings
  where id = 1;

  if not found then
    raise exception using errcode = 'P0001', message = 'BOOKING_SETTINGS_MISSING';
  end if;

  if p_adults + p_children > v_settings.max_guests then
    raise exception using errcode = '22023', message = 'TOO_MANY_GUESTS';
  end if;

  v_nights := p_check_out - p_check_in;

  perform pg_advisory_xact_lock(hashtext('relax-villa-reservation'));

  update public.reservations as reservation
  set status = 'expired'
  where reservation.status = 'payment_pending'
    and reservation.hold_expires_at is not null
    and reservation.hold_expires_at <= now();

  if exists (
    select 1
    from public.reservations r
    where r.status in ('payment_pending', 'confirmed')
      and daterange(r.check_in, r.check_out, '[)') && daterange(p_check_in, p_check_out, '[)')
  ) or exists (
    select 1
    from public.availability_blocks b
    where b.active
      and daterange(b.start_date, b.end_date, '[)') && daterange(p_check_in, p_check_out, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'DATES_UNAVAILABLE';
  end if;

  select
    count(r.id)::integer,
    coalesce(max(r.minimum_nights), 1)::integer,
    coalesce(sum(
      case
        when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
          then r.weekend_rate
        else r.weekday_rate
      end
    ), 0),
    coalesce(jsonb_agg(
      jsonb_build_object(
        'date', nights.night_date::date,
        'month', r.month,
        'kind', case
          when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
            then 'weekend'
          else 'weekday'
        end,
        'rate', case
          when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
            then r.weekend_rate
          else r.weekday_rate
        end
      )
      order by nights.night_date
    ), '[]'::jsonb)
  into v_priced_nights, v_minimum_nights, v_subtotal, v_snapshot
  from generate_series(
    p_check_in::timestamp,
    (p_check_out - 1)::timestamp,
    interval '1 day'
  ) as nights(night_date)
  left join public.monthly_rates r
    on r.month = date_trunc('month', nights.night_date)::date
   and r.active;

  if v_priced_nights <> v_nights then
    raise exception using errcode = 'P0001', message = 'RATE_NOT_CONFIGURED';
  end if;

  if v_nights < v_minimum_nights then
    raise exception using errcode = '22023', message = 'MINIMUM_NIGHTS_NOT_MET';
  end if;

  v_pet_fee := case when p_pets > 0 then v_settings.pet_fee else 0 end;
  v_reference := 'RV-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 8));
  v_hold_expires_at := now() + make_interval(hours => v_settings.payment_hold_hours);

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
    hold_expires_at
  ) values (
    v_reference,
    trim(p_guest_name),
    lower(trim(p_email)),
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
    left(coalesce(p_notes, ''), 2000),
    v_hold_expires_at
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
    'Public booking request created'
  );

  return query
  select
    v_reservation_id,
    v_reference,
    v_subtotal::integer,
    v_pet_fee,
    v_subtotal::integer + v_pet_fee,
    v_settings.currency,
    v_hold_expires_at;
end;
$$;

revoke all on function public.create_reservation(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;
grant execute on function public.create_reservation(
  text, text, text, text, date, date, integer, integer, integer, text, text
) to anon, authenticated;

create or replace function public.admin_set_reservation_status(
  p_reservation_id uuid,
  p_status public.reservation_status,
  p_note text default ''
)
returns public.reservations
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_previous public.reservation_status;
  v_result public.reservations%rowtype;
begin
  if not (select private.is_admin()) then
    raise exception using errcode = '42501', message = 'ADMIN_REQUIRED';
  end if;

  select status into v_previous
  from public.reservations
  where id = p_reservation_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'RESERVATION_NOT_FOUND';
  end if;

  update public.reservations
  set
    status = p_status,
    payment_status = case
      when p_status = 'confirmed' then 'received'::public.payment_status
      when p_status = 'payment_pending' then 'awaiting_transfer'::public.payment_status
      else payment_status
    end,
    payment_received_at = case
      when p_status = 'confirmed' then coalesce(payment_received_at, now())
      when p_status = 'payment_pending' then null
      else payment_received_at
    end,
    confirmed_at = case when p_status = 'confirmed' then now() else null end,
    confirmed_by = case when p_status = 'confirmed' then (select auth.uid()) else null end,
    cancelled_at = case when p_status = 'cancelled' then now() else null end
  where id = p_reservation_id
  returning * into v_result;

  insert into public.reservation_events (
    reservation_id,
    event_type,
    from_status,
    to_status,
    note,
    created_by
  ) values (
    p_reservation_id,
    case
      when p_status = 'confirmed' then 'payment_confirmed'
      when p_status = 'cancelled' then 'reservation_cancelled'
      when p_status = 'expired' then 'reservation_expired'
      else 'reservation_reopened'
    end,
    v_previous,
    p_status,
    left(coalesce(p_note, ''), 1000),
    (select auth.uid())
  );

  return v_result;
end;
$$;

revoke all on function public.admin_set_reservation_status(
  uuid, public.reservation_status, text
) from public, anon, authenticated;
grant execute on function public.admin_set_reservation_status(
  uuid, public.reservation_status, text
) to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'villa-media',
  'villa-media',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists villa_media_admin_select on storage.objects;
create policy villa_media_admin_select
on storage.objects for select
to authenticated
using (bucket_id = 'villa-media' and (select private.is_admin()));

drop policy if exists villa_media_admin_insert on storage.objects;
create policy villa_media_admin_insert
on storage.objects for insert
to authenticated
with check (bucket_id = 'villa-media' and (select private.is_admin()));

drop policy if exists villa_media_admin_update on storage.objects;
create policy villa_media_admin_update
on storage.objects for update
to authenticated
using (bucket_id = 'villa-media' and (select private.is_admin()))
with check (bucket_id = 'villa-media' and (select private.is_admin()));

drop policy if exists villa_media_admin_delete on storage.objects;
create policy villa_media_admin_delete
on storage.objects for delete
to authenticated
using (bucket_id = 'villa-media' and (select private.is_admin()));

grant usage on type public.reservation_status to anon, authenticated;
grant usage on type public.payment_status to anon, authenticated;
grant usage on type public.blog_status to anon, authenticated;
