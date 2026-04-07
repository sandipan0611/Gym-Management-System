require('dotenv').config();
const { pool } = require('./config/db');

async function fix() {
  try {
    await pool.query("UPDATE users SET status = 'replaced' WHERE email = 'trainer1@gym.com'");
    console.log('Database patched successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
