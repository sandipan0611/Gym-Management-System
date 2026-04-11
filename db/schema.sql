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

CREATE TABLE IF NOT EXISTS trainers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    available_from TIME,
    available_to TIME
);

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES plans(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    subscription_id INT REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'))
);

CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS member_workouts (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    trainer_id INT REFERENCES trainers(id) ON DELETE SET NULL,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
    previous_trainer_id INT REFERENCES trainers(id) ON DELETE SET NULL,
    assigned_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tier 2: Health metrics tracking per member
CREATE TABLE IF NOT EXISTS member_metrics (
    id SERIAL PRIMARY KEY,
    member_id INT REFERENCES users(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5, 2),
    bmi NUMERIC(5, 2),
    body_fat_pct NUMERIC(5, 2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

