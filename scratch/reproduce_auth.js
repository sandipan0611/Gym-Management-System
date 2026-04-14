const authService = require('../services/authService');
const db = require('../config/db');
require('dotenv').config();

async function reproduce() {
    try {
        console.log('Testing login for EXISTING user member1@gym.com');
        const user = await authService.loginUser({
            email: 'member1@gym.com',
            password: 'password123'
        });
        console.log('Login success:', !!user.token);

        console.log('Testing reactivation for removed user...');
        const email = 'removed_tester@gym.com';
        await db.query('DELETE FROM users WHERE email = $1', [email]);
        await db.query("INSERT INTO users (name, email, password, role, status) VALUES ('Old', $1, 'hashed', 'member', 'removed')", [email]);
        
        const reg = await authService.registerUser({
            name: 'New', email, password: 'password123', role: 'member', phone: '1', age: 1
        });
        console.log('Reactivation result:', reg.message);

        const login2 = await authService.loginUser({
            email, password: 'password123'
        });
        console.log('Reactivated login success:', !!login2.token);

    } catch (e) {
        console.error('REPRODUCED ERROR:', e);
    } finally {
        process.exit();
    }
}

reproduce();
