-- Sample Colleges
INSERT INTO colleges (college_name, email, address, contact_number)
VALUES 
('ABC Engineering College', 'abc@college.com', 'Hyderabad, Telangana', '9876543210'),
('XYZ Institute of Technology', 'xyz@college.com', 'Chennai, Tamil Nadu', '9876541230'),
('PQR College of Engineering', 'pqr@college.com', 'Bangalore, Karnataka', '9876549870');

-- Sample Branches
INSERT INTO branches (branch_name, college_id)
VALUES 
('CSE', 1),
('IT', 1),
('ECE', 1),
('CSE', 2),
('AIML', 2),
('CSE', 3),
('MECH', 3);

-- Sample Users
INSERT INTO users (username, email, password, role, college_id, branch_id, batch_year, passout_year)
VALUES 
('siddhi_j', 'siddhi@abc.com', 'hashed_password123', 'student', 1, 1, 2023, 2027),
('balaji_k', 'balaji@abc.com', 'hashed_password123', 'student', 1, 1, 2023, 2027),
('santhosh_r', 'santhosh@abc.com', 'hashed_password123', 'student', 1, 2, 2023, 2027),
('prasanna_m', 'prasanna@abc.com', 'hashed_password123', 'student', 1, 1, 2023, 2027),
('manikanta_u', 'manikanta@abc.com', 'hashed_password123', 'student', 1, 3, 2023, 2027),
('prof_kumar', 'kumar@abc.com', 'hashed_password123', 'teacher', 1, 1, NULL, NULL),
('prof_priya', 'priya@xyz.com', 'hashed_password123', 'teacher', 2, 4, NULL, NULL);