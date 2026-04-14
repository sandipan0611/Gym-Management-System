const authService = require('../services/authService');
const db = require('../config/db');
require('dotenv').config();

async function checkFlow() {
    try {
        console.log('--- Phase 1: Reactivation ---');
        const email = 'debug_user@gym.com';
        
        // Setup a removed user
        await db.query('DELETE FROM users WHERE email = $1', [email]);
        await db.query("INSERT INTO users (name, email, password, role, status) VALUES ('Old Me', $1, 'oldpkg', 'member', 'removed')", [email]);
        
        const regRes = await authService.registerUser({
            name: 'New Me',
            email: email,
            password: 'password123',
            role: 'member',
            phone: '123',
            age: 25
        });
        console.log('Registration result:', regRes.message);

        console.log('--- Phase 2: Login ---');
        const loginRes = await authService.loginUser({
            email: email,
            password: 'password123'
        });
        console.log('Login result: Success, token exists:', !!loginRes.token);

    } catch (e) {
        console.error('Flow failed:', e);
    } finally {
        process.exit();
    }
}

checkFlow();
