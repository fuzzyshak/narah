/*
  # Create confirmed bookings table

  1. New Tables
    - `confirmed_bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `gym_id` (text)
      - `gym_name` (text)
      - `pass_name` (text)
      - `pass_price` (text)
      - `booking_date` (date)
      - `booking_time` (text)
      - `location` (text)
      - `payment_status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `confirmed_bookings` table
    - Add policies for users to read their own bookings
*/

CREATE TABLE IF NOT EXISTS confirmed_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  gym_id text NOT NULL,
  gym_name text NOT NULL,
  pass_name text NOT NULL,
  pass_price text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  location text NOT NULL,
  payment_status text NOT NULL DEFAULT 'paid',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE confirmed_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own bookings
CREATE POLICY "Users can read own bookings"
  ON confirmed_bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for inserting new bookings
CREATE POLICY "Users can insert own bookings"
  ON confirmed_bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);