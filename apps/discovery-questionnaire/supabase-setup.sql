-- Supabase Database Setup Script
-- Run this in Supabase SQL Editor to create the table and policies

-- Create the questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id TEXT PRIMARY KEY,
  response_data JSONB NOT NULL,
  user_name TEXT,
  user_email TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_created_at 
ON questionnaire_responses(created_at DESC);

-- Create an index on completed_at for filtering completed responses
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_completed_at 
ON questionnaire_responses(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for public submissions)
CREATE POLICY "Allow public insert" ON questionnaire_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow anyone to read (for admin interface)
CREATE POLICY "Allow public read" ON questionnaire_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Optional: Policy to allow updates (if needed)
-- CREATE POLICY "Allow public update" ON questionnaire_responses
--   FOR UPDATE
--   TO anon, authenticated
--   USING (true)
--   WITH CHECK (true);

-- Optional: Policy to allow deletes (if needed)
-- CREATE POLICY "Allow public delete" ON questionnaire_responses
--   FOR DELETE
--   TO anon, authenticated
--   USING (true);
