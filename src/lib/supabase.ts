import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// Check if we're using real Supabase credentials
const isRealSupabase = import.meta.env.VITE_SUPABASE_URL && 
                       import.meta.env.VITE_SUPABASE_URL !== 'https://demo.supabase.co';

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(supabaseUrl, supabaseAnonKey);

export const USE_MOCK_AUTH = !isRealSupabase;

export interface SecurityScan {
  id: string;
  user_id: string;
  cloud_status: 'secure' | 'warning' | 'critical';
  rom_status: 'healthy' | 'degraded' | 'compromised';
  threat_count: number;
  password_strength: number;
  encryption_level: string;
  last_scan_at: string;
  created_at: string;
}
