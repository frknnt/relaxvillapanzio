-- URGENT FIX for add_child_booking_fee.sql
--
-- The child-fee version of create_room_reservation_with_fees_impl was a single
-- SQL statement that created the reservation and joined public.reservations in
-- the same query. That join uses the snapshot taken before the insert, so it
-- never sees the new row and the function returned ZERO rows: the reservation
-- was saved and the dates were held, but the guest saw a booking error instead
-- of the reference code and bank details.
--
-- This version runs the insert and the read-back as two separate statements,
-- so the stored row (with child fee total and final reference code) is returned.
-- Safe to run more than once.

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
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_created record;
begin
  select created.*
  into v_created
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
  ) created;

  return query
  select
    v_created.reservation_id,
    stored.reference_code,
    v_created.subtotal,
    v_created.pet_fee,
    stored.total_price,
    v_created.currency,
    v_created.hold_expires_at,
    v_created.room_ids,
    v_created.booking_scope
  from public.reservations stored
  where stored.id = v_created.reservation_id;
end;
$$;
