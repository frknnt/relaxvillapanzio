-- Keep privileged availability reads outside the exposed public API schema.

create index if not exists rooms_updated_by_idx
  on public.rooms (updated_by);

create index if not exists room_monthly_rates_updated_by_idx
  on public.room_monthly_rates (updated_by);

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

revoke all on function private.get_room_availability_impl(date, date)
  from public, anon, authenticated;
grant execute on function private.get_room_availability_impl(date, date)
  to anon, authenticated;

create or replace function public.get_room_availability(p_from date, p_to date)
returns table (
  source text,
  room_id smallint,
  start_date date,
  end_date date
)
language sql
stable
security invoker
set search_path = ''
as $$
  select *
  from private.get_room_availability_impl(p_from, p_to);
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
security invoker
set search_path = ''
as $$
  select distinct availability.source, availability.start_date, availability.end_date
  from private.get_room_availability_impl(p_from, p_to) availability;
$$;

revoke all on function public.get_availability(date, date)
  from public, anon, authenticated;
grant execute on function public.get_availability(date, date)
  to anon, authenticated;
