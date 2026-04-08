const { findUserByEmail, createUser, verifyPassword, generateToken } = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, age } = req.body;
        const existing = await findUserByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = await createUser({ name, email, password, role, phone, age });
        res.status(201).json({ success: true, message: 'User registered successfully', data: user });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not registered', notFound: true });
        }
        if (user.status === 'removed') {
            return res.status(403).json({ success: false, message: 'Your access to the Gym Management System has been formally revoked.' });
        }
        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({ success: true, token, user: { id: user.id, role: user.role } });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
