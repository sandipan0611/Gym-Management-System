const authService = require('../services/authService');
const db = require('../config/db');
require('dotenv').config();

async function testCaseInsensitive() {
    try {
        const email = 'CaseTEST@gym.com';
        const lowerEmail = email.toLowerCase();
        const password = 'password123';

        console.log('--- Phase 1: Register with Mixed Case ---');
        await db.query('DELETE FROM users WHERE LOWER(email) = $1', [lowerEmail]);
        const reg = await authService.registerUser({
            name: 'Case User',
            email: email,
            password: password,
            role: 'member'
        });
        console.log('Registration success. Saved email:', reg.user.email);

        console.log('--- Phase 2: Login with lowercase ---');
        const login1 = await authService.loginUser({
            email: lowerEmail,
            password: password
        });
        console.log('Login with lowercase success:', !!login1.token);

        console.log('--- Phase 3: Login with ALL CAPS ---');
        const login2 = await authService.loginUser({
            email: email.toUpperCase(),
            password: password
        });
        console.log('Login with ALL CAPS success:', !!login2.token);
        
        console.log('User object check (name/email present):', login2.user.name, login2.user.email);

    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        process.exit();
    }
}

testCaseInsensitive();
