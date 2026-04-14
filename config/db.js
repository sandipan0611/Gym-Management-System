const { Pool } = require('pg');
require('dotenv').config();

// Create the pool using the DATABASE_URL
// The 'ssl' property is required for cloud hosts like Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL Database successfully!'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
