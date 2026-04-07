const { pool } = require('./config/db');

async function migrate() {
    try {
        console.log("Adding previous_trainer_id to member_workouts...");
        await pool.query(`ALTER TABLE member_workouts ADD COLUMN IF NOT EXISTS previous_trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL`);
        console.log("Migration 2 complete.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
