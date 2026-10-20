-- Brand new reservation reference codes as Harmony Balaton Villa.
--
-- New codes look like HBV-261020-1A2B3C4D instead of RV-261020-1A2B3C4D.
-- Existing reservations keep their original RV- codes, so guests can still
-- look up older bookings on the reservation status page.
-- Safe to run more than once.

create or replace function private.apply_brand_reference_prefix()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.reference_code like 'RV-%' then
    new.reference_code := 'HBV-' || substr(new.reference_code, 4);
  end if;
  return new;
end;
$$;

revoke all on function private.apply_brand_reference_prefix()
  from public, anon, authenticated;

drop trigger if exists apply_brand_reference_prefix on public.reservations;
create trigger apply_brand_reference_prefix
before insert on public.reservations
for each row execute function private.apply_brand_reference_prefix();

-- Run fix_booking_result_after_child_fee.sql first: it makes the booking
-- result return the stored (HBV-) code that the guest must use.
