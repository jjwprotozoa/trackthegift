import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our database schema
export interface DbUser {
  id: string; // UUID from Supabase Auth
  username: string;
  email: string;
  plan: string;
  track_credits: number;
}

export interface DbTracker {
  id: number;
  user_id: string;
  name: string;
  waybill: string;
  carrier: string;
  slug: string;
  theme: string;
  recipient_name: string | null;
  origin: string | null;
  destination: string | null;
  status: string;
  status_message: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbSubscription {
  id: number;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string;
  status: string;
}
