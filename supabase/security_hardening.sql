-- Security hardening for public forms, privileged data and future schema changes.

revoke create on schema public from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admin_users_display_name_length'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_display_name_length
      check (char_length(display_name) <= 120);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'booking_settings_values_valid'
      and conrelid = 'public.booking_settings'::regclass
  ) then
    alter table public.booking_settings
      add constraint booking_settings_values_valid
      check (
        cardinality(weekend_days) between 1 and 7
        and weekend_days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]
        and pet_fee between 0 and 100000000
        and char_length(iban) <= 80
        and (iban = '' or iban ~ '^[A-Z]{2}[0-9A-Z]{13,32}$')
        and char_length(bank_beneficiary) <= 160
        and char_length(bank_name) <= 160
        and char_length(bank_account_number) <= 80
        and (bic_swift = '' or bic_swift ~ '^[A-Z0-9]{8}([A-Z0-9]{3})?$')
        and (
          contact_email = ''
          or (
            char_length(contact_email) <= 254
            and contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
          )
        )
        and char_length(whatsapp_number) <= 40
        and (whatsapp_number = '' or whatsapp_number ~ '^[+0-9 ()-]{5,40}$')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'monthly_rates_amount_bounds'
      and conrelid = 'public.monthly_rates'::regclass
  ) then
    alter table public.monthly_rates
      add constraint monthly_rates_amount_bounds
      check (
        weekday_rate between 0 and 30000000
        and weekend_rate between 0 and 30000000
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'availability_blocks_label_length'
      and conrelid = 'public.availability_blocks'::regclass
  ) then
    alter table public.availability_blocks
      add constraint availability_blocks_label_length
      check (char_length(trim(label)) between 1 and 160);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reservations_public_input_valid'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_public_input_valid
      check (
        char_length(trim(guest_name)) between 2 and 120
        and char_length(email) <= 254
        and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
        and char_length(trim(phone)) between 5 and 40
        and char_length(notes) <= 2000
        and check_out - check_in between 1 and 60
        and total_price = subtotal + pet_fee
        and jsonb_typeof(pricing_snapshot) = 'array'
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reservation_events_text_lengths'
      and conrelid = 'public.reservation_events'::regclass
  ) then
    alter table public.reservation_events
      add constraint reservation_events_text_lengths
      check (
        char_length(trim(event_type)) between 1 and 80
        and char_length(note) <= 1000
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'blog_posts_content_lengths'
      and conrelid = 'public.blog_posts'::regclass
  ) then
    alter table public.blog_posts
      add constraint blog_posts_content_lengths
      check (
        char_length(category_en) <= 80
        and char_length(category_de) <= 80
        and char_length(category_hu) <= 80
        and char_length(trim(title_en)) between 1 and 180
        and char_length(trim(title_de)) between 1 and 180
        and char_length(trim(title_hu)) between 1 and 180
        and char_length(excerpt_en) <= 600
        and char_length(excerpt_de) <= 600
        and char_length(excerpt_hu) <= 600
        and char_length(content_en) <= 100000
        and char_length(content_de) <= 100000
        and char_length(content_hu) <= 100000
        and char_length(cover_url) <= 2048
        and (cover_url = '' or cover_url ~ '^(/|https://)')
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'gallery_images_metadata_valid'
      and conrelid = 'public.gallery_images'::regclass
  ) then
    alter table public.gallery_images
      add constraint gallery_images_metadata_valid
      check (
        char_length(storage_path) between 1 and 1024
        and storage_path ~ '^gallery/'
        and storage_path !~ '(^|/)[.][.](/|$)'
        and char_length(public_url) between 1 and 2048
        and public_url ~ '^https://'
        and char_length(alt_en) <= 240
        and char_length(alt_de) <= 240
        and char_length(alt_hu) <= 240
        and char_length(caption_en) <= 600
        and char_length(caption_de) <= 600
        and char_length(caption_hu) <= 600
        and sort_order between -100000 and 100000
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'support_requests_email_length'
      and conrelid = 'public.support_requests'::regclass
  ) then
    alter table public.support_requests
      add constraint support_requests_email_length
      check (char_length(email) <= 254);
  end if;
end
$$;

create index if not exists reservations_email_created_idx
  on public.reservations (lower(email), created_at desc);

create index if not exists support_requests_email_created_idx
  on public.support_requests (lower(email), created_at desc);

create or replace function private.guard_support_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.name := trim(new.name);
  new.email := lower(trim(new.email));
  new.phone := trim(new.phone);
  new.language := lower(trim(new.language));
  new.message := trim(new.message);
  new.status := 'new'::public.support_status;
  new.admin_notes := '';
  new.resolved_at := null;
  new.resolved_by := null;

  perform pg_advisory_xact_lock(hashtext('support:' || new.email));

  if (
    select count(*)
    from public.support_requests request
    where lower(request.email) = new.email
      and request.created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
  end if;

  return new;
end;
$$;

revoke all on function private.guard_support_request() from public, anon, authenticated;

drop trigger if exists guard_support_request_insert on public.support_requests;
create trigger guard_support_request_insert
before insert on public.support_requests
for each row execute function private.guard_support_request();

create or replace function public.get_availability(p_from date, p_to date)
returns table (
  source text,
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
    reservation.check_in,
    reservation.check_out
  from public.reservations reservation
  where (
      reservation.status = 'confirmed'
      or (
        reservation.status = 'payment_pending'
        and (
          reservation.hold_expires_at is null
          or reservation.hold_expires_at > now()
        )
      )
    )
    and daterange(reservation.check_in, reservation.check_out, '[)')
      && daterange(p_from, p_to, '[)')

  union all

  select
    'block'::text,
    block.start_date,
    block.end_date
  from public.availability_blocks block
  where block.active
    and daterange(block.start_date, block.end_date, '[)')
      && daterange(p_from, p_to, '[)');
end;
$$;

revoke all on function public.get_availability(date, date)
  from public, anon, authenticated;
grant execute on function public.get_availability(date, date)
  to anon, authenticated;

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
  v_email text;
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

  if p_language not in ('en', 'de', 'hu') then
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

  perform pg_advisory_xact_lock(hashtext('reservation:' || v_email));
  if (
    select count(*)
    from public.reservations recent
    where lower(recent.email) = v_email
      and recent.created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception using errcode = 'P0001', message = 'RATE_LIMITED';
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

  perform pg_advisory_xact_lock(hashtext('relax-villa-reservation'));

  update public.reservations as reservation
  set status = 'expired'
  where reservation.status = 'payment_pending'
    and reservation.hold_expires_at is not null
    and reservation.hold_expires_at <= now();

  if exists (
    select 1
    from public.reservations reservation
    where reservation.status in ('payment_pending', 'confirmed')
      and daterange(reservation.check_in, reservation.check_out, '[)')
        && daterange(p_check_in, p_check_out, '[)')
  ) or exists (
    select 1
    from public.availability_blocks block
    where block.active
      and daterange(block.start_date, block.end_date, '[)')
        && daterange(p_check_in, p_check_out, '[)')
  ) then
    raise exception using errcode = '23P01', message = 'DATES_UNAVAILABLE';
  end if;

  select
    count(rate.id)::integer,
    coalesce(max(rate.minimum_nights), 1)::integer,
    coalesce(sum(
      case
        when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
          then rate.weekend_rate
        else rate.weekday_rate
      end
    ), 0),
    coalesce(jsonb_agg(
      jsonb_build_object(
        'date', nights.night_date::date,
        'month', rate.month,
        'kind', case
          when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
            then 'weekend'
          else 'weekday'
        end,
        'rate', case
          when extract(isodow from nights.night_date)::smallint = any(v_settings.weekend_days)
            then rate.weekend_rate
          else rate.weekday_rate
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
  left join public.monthly_rates rate
    on rate.month = date_trunc('month', nights.night_date)::date
   and rate.active;

  if v_priced_nights <> v_nights then
    raise exception using errcode = 'P0001', message = 'RATE_NOT_CONFIGURED';
  end if;

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
    hold_expires_at
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
