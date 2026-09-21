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
