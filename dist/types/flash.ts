export interface FlashEvent {
  id: string;
  title_es: string;
  title_en: string;
  slug: string;
  description_es?: string;
  description_en?: string;
  start_at: string;
  end_at: string;
  is_active: boolean;
  hero_image?: string;
  rules_es?: string;
  rules_en?: string;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
}

export interface FlashDesign {
  id: string;
  event_id: string;
  title: string;
  title_es?: string;
  title_en?: string;
  image_url: string;
  color_image_url?: string;
  base_price: number;
  color_extra: number;
  stock: number;
  zones: string[];
  sizes: ('S' | 'M' | 'L')[];
  duration_minutes: number[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlashSlot {
  id: string;
  event_id: string;
  design_id?: string;
  slot_date: string;
  start_time: string;
  duration_minutes: number;
  taken: boolean;
  booking_id?: string;
  created_at: string;
}

export interface FlashBookingRequest {
  eventId: string;
  designId: string;
  slotId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  size: 'S' | 'M' | 'L';
  zone: string;
  withColor: boolean;
  notes?: string;
}

export interface FlashBookingResponse {
  clientSecret: string;
  bookingId: string;
  priceTotal: number;
}
