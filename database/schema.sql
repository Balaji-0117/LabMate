CREATE TABLE colleges(
	college_id SERIAL PRIMARY KEY,
	college_name VARCHAR(250) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	address VARCHAR(250),
	contact_number VARCHAR(15) UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches(
	branch_id SERIAL PRIMARY KEY,
	branch_name VARCHAR(150) NOT NULL,
	college_id INTEGER REFERENCES colleges(college_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(50) DEFAULT 'student',
	college_id INTEGER REFERENCES colleges(college_id),
	branch_id INTEGER REFERENCES branches(branch_id),
	batch_year INTEGER,
	passout_year INTEGER,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	last_login TIMESTAMP
); 