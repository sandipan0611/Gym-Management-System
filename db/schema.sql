-- Gym Management System — Cloud Compatible Schema
-- Optimized for Neon/Cloud PostgreSQL

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'trainer', 'member')),
    phone VARCHAR(20),
    age INT,
    status VARCHAR(20) DEFAULT 'active',
    joining_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    available_from TIME,
    available_to TIME
);

-- 3. Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled'))
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    subscription_id INT REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'))
);

-- 6. Workouts Table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 7. Member Workouts (Assignments)
CREATE TABLE IF NOT EXISTS member_workouts (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    trainer_id INT REFERENCES trainers(id) ON DELETE SET NULL,
    previous_trainer_id INT REFERENCES trainers(id) ON DELETE SET NULL,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 8. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Member Metrics (Health Tracking)
CREATE TABLE IF NOT EXISTS member_metrics (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2),
    bmi NUMERIC(5,2),
    body_fat_pct NUMERIC(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member ON subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_member_workouts_member ON member_workouts(member_id);
CREATE INDEX IF NOT EXISTS idx_metrics_member ON member_metrics(member_id);
