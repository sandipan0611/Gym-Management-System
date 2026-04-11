-- ============================================================
-- TrackFit Gym System — Tier 2 Schema Upgrade
-- Run this once against your existing database.
-- All statements are idempotent (safe to re-run).
-- ============================================================

-- 1. Health Metrics table — tracks weight, BMI, body fat over time per member
CREATE TABLE IF NOT EXISTS member_metrics (
    id            SERIAL PRIMARY KEY,
    member_id     INT REFERENCES users(id) ON DELETE CASCADE,
    weight_kg     NUMERIC(5, 2),
    bmi           NUMERIC(5, 2),
    body_fat_pct  NUMERIC(5, 2),
    recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Workout versioning — add is_active flag to member_workouts
--    Existing rows will default to TRUE (active), preserving Tier 1 behavior.
ALTER TABLE member_workouts
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
