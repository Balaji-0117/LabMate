CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(250) NOT NULL,
	role VARCHAR(50) DEFAULT 'student',
	college VARCHAR(250),
	branch VARCHAR(150),
	batch_year INTEGER,
	passout_year INTEGER,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP
); 