-- Complete the room-pricing workflow without changing existing custom room rates.
-- Missing room prices inherit one quarter of the matching whole-villa package as
-- an editable starting value. Whole-villa pricing still wins when all rooms are selected.

insert into public.room_monthly_rates (
  room_id,
  month,
  weekday_rate,
  weekend_rate,
  minimum_nights,
  active,
  updated_by
)
select
  room.id,
  rate.month,
  round(rate.weekday_rate / 4.0)::integer,
  round(rate.weekend_rate / 4.0)::integer,
  rate.minimum_nights,
  rate.active,
  rate.updated_by
from public.monthly_rates rate
cross join public.rooms room
where room.id between 1 and 4
on conflict (room_id, month) do nothing;

create or replace function public.admin_upsert_monthly_rate_plan(
  p_month date,
  p_whole_villa jsonb,
  p_rooms jsonb
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_room jsonb;
  v_room_id integer;
  v_weekday_rate integer;
  v_weekend_rate integer;
  v_minimum_nights integer;
  v_active boolean;
  v_room_count integer;
  v_distinct_room_count integer;
begin
  if v_actor is null or not (select private.is_admin()) then
    raise exception using errcode = '42501', message = 'ADMIN_REQUIRED';
  end if;

  if p_month is null or p_month <> date_trunc('month', p_month)::date then
    raise exception using errcode = '22023', message = 'INVALID_MONTH';
  end if;

  if jsonb_typeof(p_whole_villa) <> 'object'
     or jsonb_typeof(p_rooms) <> 'array'
     or jsonb_array_length(p_rooms) <> 4 then
    raise exception using errcode = '22023', message = 'INVALID_RATE_PLAN';
  end if;

  select
    count(*),
    count(distinct (item ->> 'room_id')::integer)
  into v_room_count, v_distinct_room_count
  from jsonb_array_elements(p_rooms) item
  where (item ->> 'room_id')::integer between 1 and 4;

  if v_room_count <> 4 or v_distinct_room_count <> 4 then
    raise exception using errcode = '22023', message = 'INVALID_ROOM_RATE_PLAN';
  end if;

  v_weekday_rate := (p_whole_villa ->> 'weekday_rate')::integer;
  v_weekend_rate := (p_whole_villa ->> 'weekend_rate')::integer;
  v_minimum_nights := (p_whole_villa ->> 'minimum_nights')::integer;
  v_active := coalesce((p_whole_villa ->> 'active')::boolean, true);

  if v_weekday_rate < 0
     or v_weekend_rate < 0
     or v_minimum_nights not between 1 and 30 then
    raise exception using errcode = '22023', message = 'INVALID_WHOLE_VILLA_RATE';
  end if;

  insert into public.monthly_rates (
    month,
    weekday_rate,
    weekend_rate,
    minimum_nights,
    active,
    updated_by
  )
  values (
    p_month,
    v_weekday_rate,
    v_weekend_rate,
    v_minimum_nights,
    v_active,
    v_actor
  )
  on conflict (month) do update
  set weekday_rate = excluded.weekday_rate,
      weekend_rate = excluded.weekend_rate,
      minimum_nights = excluded.minimum_nights,
      active = excluded.active,
      updated_by = excluded.updated_by;

  for v_room in
    select value
    from jsonb_array_elements(p_rooms)
  loop
    v_room_id := (v_room ->> 'room_id')::integer;
    v_weekday_rate := (v_room ->> 'weekday_rate')::integer;
    v_weekend_rate := (v_room ->> 'weekend_rate')::integer;
    v_minimum_nights := (v_room ->> 'minimum_nights')::integer;
    v_active := coalesce((v_room ->> 'active')::boolean, true);

    if v_weekday_rate < 0
       or v_weekend_rate < 0
       or v_minimum_nights not between 1 and 30 then
      raise exception using errcode = '22023', message = 'INVALID_ROOM_RATE';
    end if;

    insert into public.room_monthly_rates (
      room_id,
      month,
      weekday_rate,
      weekend_rate,
      minimum_nights,
      active,
      updated_by
    )
    values (
      v_room_id,
      p_month,
      v_weekday_rate,
      v_weekend_rate,
      v_minimum_nights,
      v_active,
      v_actor
    )
    on conflict (room_id, month) do update
    set weekday_rate = excluded.weekday_rate,
        weekend_rate = excluded.weekend_rate,
        minimum_nights = excluded.minimum_nights,
        active = excluded.active,
        updated_by = excluded.updated_by;
  end loop;
end;
$$;

revoke all on function public.admin_upsert_monthly_rate_plan(date, jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.admin_upsert_monthly_rate_plan(date, jsonb, jsonb)
  to authenticated;

create or replace function public.admin_delete_monthly_rate_plan(p_month date)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or not (select private.is_admin()) then
    raise exception using errcode = '42501', message = 'ADMIN_REQUIRED';
  end if;

  if p_month is null or p_month <> date_trunc('month', p_month)::date then
    raise exception using errcode = '22023', message = 'INVALID_MONTH';
  end if;

  delete from public.room_monthly_rates where month = p_month;
  delete from public.monthly_rates where month = p_month;
end;
$$;

revoke all on function public.admin_delete_monthly_rate_plan(date)
  from public, anon, authenticated;
grant execute on function public.admin_delete_monthly_rate_plan(date)
  to authenticated;
