-- Add observation_data column to student_records
ALTER TABLE student_records ADD COLUMN IF NOT EXISTS observation_data JSONB;
