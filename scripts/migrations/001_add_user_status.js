const { pool } = require('./config/db');

async function migrate() {
    try {
        console.log("Adding status column to users table...");
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'`);
        console.log("Added status column to users table successfully.");
        
        // Ensure trainer_id in member_workouts can be NULL (it usually is by default, but just making sure it's not violating constraints if we drop NOT NULL)
        await pool.query(`ALTER TABLE member_workouts ALTER COLUMN trainer_id DROP NOT NULL`);
        console.log("Ensured trainer_id in member_workouts is nullable.");

        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
