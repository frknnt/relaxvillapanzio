-- Include the child-fee snapshot in the reservation total integrity check.
-- Kept as a separate migration because the child-fee columns were already deployed.

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
