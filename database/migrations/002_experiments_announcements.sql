CREATE TABLE IF NOT EXISTS experiments (
  id SERIAL PRIMARY KEY,
  lab_category VARCHAR(100) NOT NULL,  -- e.g. 'Data Structures', 'C Programming'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  aim TEXT,
  procedure TEXT,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  target_role VARCHAR(20) DEFAULT 'student'  -- 'student', 'faculty', or 'all'
);

CREATE TABLE IF NOT EXISTS student_records (
  id SERIAL PRIMARY KEY,
  student_id UUID REFERENCES users(user_id),
  experiment_id INTEGER REFERENCES experiments(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  score INTEGER,
  notes TEXT,
  pdf_path TEXT
);
