export type ReservationStatus =
  | "payment_pending"
  | "confirmed"
  | "cancelled"
  | "expired";

export type PaymentStatus = "awaiting_transfer" | "received" | "refunded";
export type BlogStatus = "draft" | "published";
export type SupportStatus = "new" | "in_progress" | "resolved" | "closed";
export type SupportedLanguage = "en" | "de" | "hu";

export type BookingSettings = {
  id: number;
  currency: string;
  weekend_days: number[];
  payment_hold_hours: number;
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
  pet_fee: number;
  total_price: number;
  currency: string;
  pricing_snapshot: Array<{
    date: string;
    month: string;
    kind: "weekday" | "weekend";
    rate: number;
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
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export type AvailabilityRange = {
  source: "reservation" | "block";
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
};

export type BlogPost = {
  id: string;
  slug: string;
  status: BlogStatus;
  category_en: string;
  category_de: string;
  category_hu: string;
  title_en: string;
  title_de: string;
  title_hu: string;
  excerpt_en: string;
  excerpt_de: string;
  excerpt_hu: string;
  content_en: string;
  content_de: string;
  content_hu: string;
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
  caption_en: string;
  caption_de: string;
  caption_hu: string;
  sort_order: number;
  visible: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};
