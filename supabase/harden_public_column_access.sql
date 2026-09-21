revoke select on table public.booking_settings from anon;
grant select (
  id,
  currency,
  weekend_days,
  payment_hold_hours,
  pet_fee,
  iban,
  bank_beneficiary,
  bank_name,
  bank_account_number,
  bic_swift,
  contact_email,
  whatsapp_number,
  max_guests,
  check_in_time,
  check_out_time,
  updated_at
) on table public.booking_settings to anon;

revoke select on table public.monthly_rates from anon;
grant select (
  id,
  month,
  weekday_rate,
  weekend_rate,
  minimum_nights,
  active,
  created_at,
  updated_at
) on table public.monthly_rates to anon;

revoke select on table public.blog_posts from anon;
grant select (
  id,
  slug,
  status,
  category_en,
  category_de,
  category_hu,
  title_en,
  title_de,
  title_hu,
  excerpt_en,
  excerpt_de,
  excerpt_hu,
  content_en,
  content_de,
  content_hu,
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
  caption_en,
  caption_de,
  caption_hu,
  sort_order,
  visible,
  created_at,
  updated_at
) on table public.gallery_images to anon;
