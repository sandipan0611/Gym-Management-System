const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const findUserByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

const createUser = async ({ name, email, password, role, phone, age }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await db.query(
        'INSERT INTO users (name, email, password, role, phone, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
        [name, email, hashedPassword, role || 'member', phone, age]
    );
    return result.rows[0];
};

const verifyPassword = (plainText, hashed) => bcrypt.compare(plainText, hashed);

const generateToken = (user) => {
    return jwt.sign(
        { user: { id: user.id, role: user.role } },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '10h' }
    );
};

module.exports = { findUserByEmail, createUser, verifyPassword, generateToken };
