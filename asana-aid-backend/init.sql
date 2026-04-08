-- ASANA AID DATABASE SCHEMA
-- TEXTUAL ER DIAGRAM:
-- [Users] 1 --- 1 [UserHealthProfiles]
-- [Users] 1 --- N [UserGoals]
-- [Users] 1 --- N [UserMedicalConditions] N --- 1 [MedicalConditions]
-- [Users] 1 --- N [UserPlans]
-- [Users] 1 --- N [SessionProgress] N --- 1 [YogaSessions]
-- [Users] 1 --- N [ActivityLogs]
-- [Users] 1 --- 1 [Streaks]
-- [YogaPrograms] 1 --- N [YogaSessions]
-- [YogaSessions] 1 --- N [SessionPoses] N --- 1 [YogaPoses]

-- Users and Profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_health_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    weight DECIMAL(5,2), -- in kg
    height DECIMAL(5,2), -- in cm
    gender VARCHAR(10),
    experience_level VARCHAR(20) DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_medical_conditions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    condition_id UUID REFERENCES medical_conditions(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, condition_id)
);

CREATE TABLE user_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL -- 'Flexibility', 'Strength', 'Weight Loss', 'Stress Relief'
);

-- Yoga Content
CREATE TABLE yoga_poses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    focus_area VARCHAR(50), -- 'Core', 'Legs', 'Back', 'Neck'
    media_url VARCHAR(255),
    base_duration INT DEFAULT 30, -- In seconds
    instructions JSONB -- Detailed step-by-step instructions
);

CREATE TABLE yoga_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    focus_area VARCHAR(50),
    created_by UUID REFERENCES users(id) -- Could be null for system-generated programs
);

CREATE TABLE yoga_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES yoga_programs(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES user_plans(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    duration INT, -- Estimated total duration in seconds
    difficulty VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_poses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES yoga_sessions(id) ON DELETE CASCADE,
    pose_id UUID REFERENCES yoga_poses(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    duration_override INT -- Optional duration specifically for this session
);

-- Plans and Progress
CREATE TABLE user_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    plan_config JSONB, -- Stores the parameters used to generate the plan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES yoga_sessions(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Not Started', -- 'Not Started', 'In Progress', 'Completed'
    current_pose_index INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'Login', 'Session Start', 'Session End', 'Profile Update'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    last_session_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXING SUGGESTIONS
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_session_progress_user ON session_progress(user_id, status);
CREATE INDEX idx_session_poses_session ON session_poses(session_id, order_index);
CREATE INDEX idx_activity_logs_user_timestamp ON activity_logs(user_id, timestamp);
