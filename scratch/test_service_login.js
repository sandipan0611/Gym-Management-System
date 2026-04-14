const authService = require('./services/authService');
const db = require('./config/db');
require('dotenv').config();

async function checkLogin() {
    try {
        console.log('Testing login for member1@gym.com...');
        const result = await authService.loginUser({
            email: 'member1@gym.com',
            password: 'password123'
        });
        console.log('Login result:', !!result.token);
    } catch (e) {
        console.error('Login failed:', e.message);
    } finally {
        // Pool is global, but we can't easily end it if shared.
        // We'll just exit.
        process.exit();
    }
}

checkLogin();
