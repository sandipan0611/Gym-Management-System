const bcrypt = require('bcrypt');
const { Client } = require('pg');
require('dotenv').config();

const db = new Client({ connectionString: process.env.DATABASE_URL });

async function test() {
    await db.connect();
    console.log('Connected to DB');

    const email = 'test_debug@gym.com';
    const password = 'password123';

    // 1. Cleanup
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    console.log('Cleaned up');

    // 2. Register
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await db.query(
        'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5)',
        ['Test User', email, hash, 'member', 'active']
    );
    console.log('Registered user');

    // 3. Login
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (isMatch) {
        console.log('SUCCESS: Sign In works');
    } else {
        console.log('FAILURE: Sign In does not work');
    }

    await db.end();
}

test().catch(err => {
    console.error(err);
    process.exit(1);
});
