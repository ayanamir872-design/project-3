export type Appointment = {
  id: string;
  customer_name: string;
  phone_number: string;
  service_name: string;
  service_id?: string | null;
  service_price_at_booking?: number | null;
  service_currency_at_booking?: string | null;
  service?: {
    id: string;
    name: string;
    slug: string;
    price: number | null;
    currency: string;
    duration_minutes: number;
  } | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
};
