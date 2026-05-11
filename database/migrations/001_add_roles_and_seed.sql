-- Add role to users table if not present
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Create team table if not exists
CREATE TABLE IF NOT EXISTS team (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  rollno VARCHAR(50)
);

-- Seed admin in team table
INSERT INTO team (username, email, rollno)
VALUES ('Ashok Marnala', '24p31a42j9@acet.ac.in', NULL)
ON CONFLICT (email) DO NOTHING;

-- Seed additional students in team table
INSERT INTO team (username, email, rollno) VALUES
('Santhosh', '24p31a42j6@acet.ac.in', '24p31a42j6'),
('Prasanna', '23a91a61g6@aec.edu.in', '23a91a61g6')
ON CONFLICT (email) DO NOTHING;
