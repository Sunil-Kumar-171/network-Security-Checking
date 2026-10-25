/*
  # Create Security Scans Table

  1. New Tables
    - `security_scans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `cloud_status` (text) - secure | warning | critical
      - `rom_status` (text) - healthy | degraded | compromised
      - `threat_count` (integer) - number of detected threats
      - `password_strength` (integer) - 0-100 score
      - `encryption_level` (text) - AES-128 | AES-256 | None
      - `last_scan_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `security_scans` table
    - Users can only read/write their own scan data
*/

CREATE TABLE IF NOT EXISTS security_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cloud_status text NOT NULL DEFAULT 'secure',
  rom_status text NOT NULL DEFAULT 'healthy',
  threat_count integer NOT NULL DEFAULT 0,
  password_strength integer NOT NULL DEFAULT 0,
  encryption_level text NOT NULL DEFAULT 'AES-256',
  last_scan_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON security_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON security_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans"
  ON security_scans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
