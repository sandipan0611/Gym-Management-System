const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log('Starting migration to satisfy \'cancelled\' spelling...');

  try {
    // 1. Update any existing data (just in case)
    console.log('Updating existing rows to \'cancelled\'...');
    await pool.query("UPDATE subscriptions SET status = 'cancelled' WHERE status = 'canceled'");

    // 2. Drop the old constraint
    // Many PG setups autofill the name as tablename_columnname_check
    console.log('Dropping old constraint (subscriptions_status_check)...');
    await pool.query("ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check");

    // 3. Add the new constraint
    console.log('Adding new constraint with double-L support...');
    await pool.query("ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'expired', 'cancelled'))");

    console.log('Migration COMPLETED successfully!');
  } catch (err) {
    console.error('Migration FAILED:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
