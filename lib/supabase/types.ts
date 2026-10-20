export type ReservationStatus =
  | "payment_pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export type PaymentStatus = "awaiting_transfer" | "received" | "refunded";
export type BlogStatus = "draft" | "published";
export type SupportStatus = "new" | "in_progress" | "resolved" | "closed";
export type SupportedLanguage = "en" | "de" | "hu" | "tr";

export type BookingSettings = {
  id: number;
  currency: string;
  weekend_days: number[];
  payment_hold_hours: number;
  child_fee: number;
  pet_fee: number;
  iban: string;
  bank_beneficiary: string;
  bank_name: string;
  bank_account_number: string;
  bic_swift: string;
  contact_email: string;
  whatsapp_number: string;
  max_guests: number;
  check_in_time: string;
  check_out_time: string;
  cancellation_free_days: number;
  late_cancellation_refund_percent: number;
  privacy_retention_months: number;
  legal_operator_name: string;
  legal_operator_address: string;
  updated_at: string;
  updated_by: string | null;
};

export type MonthlyRate = {
  id: string;
  month: string;
  weekday_rate: number;
  weekend_rate: number;
  minimum_nights: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type VillaRoom = {
  id: number;
  code: string;
  max_guests: number;
  active: boolean;
  individual_booking_enabled: boolean;
  updated_at: string;
};

export type RoomMonthlyRate = {
  id: string;
  room_id: number;
  month: string;
  weekday_rate: number;
  weekend_rate: number;
  minimum_nights: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type Reservation = {
  id: string;
  reference_code: string;
  guest_name: string;
  email: string;
  phone: string;
  language: SupportedLanguage;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  pets: number;
  status: ReservationStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  child_fee: number;
  pet_fee: number;
  total_price: number;
  currency: string;
  room_ids: number[];
  booking_scope: "whole_villa" | "room_selection";
  pricing_snapshot: Array<{
    date: string;
    month: string;
    kind: "weekday" | "weekend";
    rate: number;
    scope?: "whole_villa" | "room_selection";
    room_ids?: number[];
    room_rates?: Array<{ room_id: number; rate: number }> | null;
  }>;
  notes: string;
  hold_expires_at: string | null;
  payment_received_at: string | null;
  confirmed_at: string | null;
  confirmed_by: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AvailabilityBlock = {
  id: string;
  label: string;
  start_date: string;
  end_date: string;
  room_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type AvailabilityRange = {
  source: "reservation" | "block";
  room_id: number;
  start_date: string;
  end_date: string;
};

export type BookingResult = {
  reservation_id: string;
  reference_code: string;
  subtotal: number;
  pet_fee: number;
  total_price: number;
  currency: string;
  hold_expires_at: string;
  room_ids: number[];
  booking_scope: "whole_villa" | "room_selection";
  bank_beneficiary: string;
  bank_name: string;
  bank_account_number: string;
  iban: string;
  bic_swift: string;
};

export type PublicReservationStatus = Pick<
  Reservation,
  | "reference_code"
  | "status"
  | "payment_status"
  | "check_in"
  | "check_out"
  | "total_price"
  | "currency"
  | "hold_expires_at"
  | "room_ids"
  | "booking_scope"
>;

export type BlogPost = {
  id: string;
  slug: string;
  status: BlogStatus;
  category_en: string;
  category_de: string;
  category_hu: string;
  category_tr: string;
  title_en: string;
  title_de: string;
  title_hu: string;
  title_tr: string;
  excerpt_en: string;
  excerpt_de: string;
  excerpt_hu: string;
  excerpt_tr: string;
  content_en: string;
  content_de: string;
  content_hu: string;
  content_tr: string;
  cover_url: string;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SupportRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: SupportedLanguage;
  message: string;
  status: SupportStatus;
  admin_notes: string;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRecord = {
  id: string;
  storage_path: string;
  public_url: string;
  category: "bedrooms" | "shared" | "outdoors" | "blog";
  room: number | null;
  alt_en: string;
  alt_de: string;
  alt_hu: string;
  alt_tr: string;
  caption_en: string;
  caption_de: string;
  caption_hu: string;
  caption_tr: string;
  sort_order: number;
  visible: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
