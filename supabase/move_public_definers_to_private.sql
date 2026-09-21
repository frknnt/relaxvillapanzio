-- Keep privileged implementations outside the exposed Data API schema.

grant usage on schema private to anon, authenticated;

do $$
begin
  if to_regprocedure(
    'private.create_reservation_impl(text,text,text,text,date,date,integer,integer,integer,text,text)'
  ) is null
  and to_regprocedure(
    'public.create_reservation(text,text,text,text,date,date,integer,integer,integer,text,text)'
  ) is not null then
    execute 'alter function public.create_reservation(text,text,text,text,date,date,integer,integer,integer,text,text) set schema private';
    execute 'alter function private.create_reservation(text,text,text,text,date,date,integer,integer,integer,text,text) rename to create_reservation_impl';
  end if;
end
$$;

revoke all on function private.create_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;
grant execute on function private.create_reservation_impl(
  text, text, text, text, date, date, integer, integer, integer, text, text
) to anon, authenticated;

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
language sql
volatile
security invoker
set search_path = ''
as $$
  select *
  from private.create_reservation_impl(
    p_guest_name,
    p_email,
    p_phone,
    p_language,
    p_check_in,
    p_check_out,
    p_adults,
    p_children,
    p_pets,
    p_notes,
    p_website
  );
$$;

revoke all on function public.create_reservation(
  text, text, text, text, date, date, integer, integer, integer, text, text
) from public, anon, authenticated;
grant execute on function public.create_reservation(
  text, text, text, text, date, date, integer, integer, integer, text, text
) to anon, authenticated;

grant select (check_in, check_out, status, hold_expires_at)
  on table public.reservations to anon;
grant select (start_date, end_date, active)
  on table public.availability_blocks to anon;

drop policy if exists reservations_public_availability on public.reservations;
create policy reservations_public_availability
on public.reservations for select
to anon
using (
  status = 'confirmed'
  or (
    status = 'payment_pending'
    and (hold_expires_at is null or hold_expires_at > now())
  )
);

drop policy if exists availability_blocks_public_read on public.availability_blocks;
create policy availability_blocks_public_read
on public.availability_blocks for select
to anon
using (active);

create or replace function public.get_availability(p_from date, p_to date)
returns table (
  source text,
  start_date date,
  end_date date
)
language plpgsql
stable
security invoker
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
  where daterange(reservation.check_in, reservation.check_out, '[)')
    && daterange(p_from, p_to, '[)')

  union all

  select
    'block'::text,
    block.start_date,
    block.end_date
  from public.availability_blocks block
  where daterange(block.start_date, block.end_date, '[)')
    && daterange(p_from, p_to, '[)');
end;
$$;

revoke all on function public.get_availability(date, date)
  from public, anon, authenticated;
grant execute on function public.get_availability(date, date)
  to anon, authenticated;
