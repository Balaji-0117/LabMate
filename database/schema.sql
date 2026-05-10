CREATE TABLE users (

    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    username VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password TEXT NOT NULL,

    roll_number VARCHAR(20) UNIQUE,

    branch VARCHAR(50),

    semester INTEGER,

    section VARCHAR(10),

    profile_image TEXT,

    bio TEXT,

    is_verified BOOLEAN DEFAULT FALSE,

    verification_token TEXT,

    token_expiry TIMESTAMP,

    reset_token TEXT,

    reset_token_expiry TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE experiments (
    experiment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    subject_name VARCHAR(100) NOT NULL,
    experiment_title VARCHAR(255) NOT NULL,

    experiment_description TEXT,

    difficulty VARCHAR(20),

    total_marks INTEGER DEFAULT 100,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_experiments (

    student_exp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(user_id)
        ON DELETE CASCADE,

    experiment_id UUID REFERENCES experiments(experiment_id)
        ON DELETE CASCADE,

    status VARCHAR(20) DEFAULT 'pending',

    viva_score INTEGER DEFAULT 0,

    experiment_score INTEGER DEFAULT 0,

    completion_percentage INTEGER DEFAULT 0,

    started_at TIMESTAMP,

    completed_at TIMESTAMP,

    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (

    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(user_id)
        ON DELETE CASCADE,

    title VARCHAR(255),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (

    exam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    subject_name VARCHAR(100),

    exam_title VARCHAR(255),

    exam_date DATE,

    total_marks INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_viva_history (

    viva_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(user_id),

    experiment_id UUID REFERENCES experiments(experiment_id),

    question TEXT,

    student_answer TEXT,

    ai_feedback TEXT,

    marks_awarded INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
