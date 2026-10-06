export const PUBLIC_BOOKING_SETTINGS_COLUMNS =
  "id, currency, weekend_days, payment_hold_hours, pet_fee, contact_email, whatsapp_number, max_guests, check_in_time, check_out_time, cancellation_free_days, late_cancellation_refund_percent, privacy_retention_months, legal_operator_name, legal_operator_address, updated_at";

export const PUBLIC_MONTHLY_RATE_COLUMNS =
  "id, month, weekday_rate, weekend_rate, minimum_nights, active, created_at, updated_at";

export const PUBLIC_ROOM_COLUMNS =
  "id, code, max_guests, active, individual_booking_enabled, updated_at";

export const PUBLIC_ROOM_MONTHLY_RATE_COLUMNS =
  "id, room_id, month, weekday_rate, weekend_rate, minimum_nights, active, created_at, updated_at";

export const PUBLIC_BLOG_POST_COLUMNS =
  "id, slug, status, category_en, category_de, category_hu, category_tr, title_en, title_de, title_hu, title_tr, excerpt_en, excerpt_de, excerpt_hu, excerpt_tr, content_en, content_de, content_hu, content_tr, cover_url, published_at, created_at, updated_at";

export const PUBLIC_GALLERY_IMAGE_COLUMNS =
  "id, storage_path, public_url, category, room, alt_en, alt_de, alt_hu, alt_tr, caption_en, caption_de, caption_hu, caption_tr, sort_order, visible, created_at, updated_at";
