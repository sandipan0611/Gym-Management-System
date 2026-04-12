const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const registerUser = async (data) => {
    const { name, email, password, role, phone, age } = data;

    const userExists = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (userExists.rows.length > 0) {
        const err = new Error('User already exists');
        err.statusCode = 400;
        throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
        `INSERT INTO users (name, email, password, role, phone, age)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, email, role`,
        [name, email, hashedPassword, role || 'member', phone, age]
    );

    return {
        message: 'User registered successfully',
        user: newUser.rows[0]
    };
};

const loginUser = async (data) => {
    const { email, password } = data;

    const user = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );

    if (user.rows.length === 0) {
        const err = new Error('Email not registered');
        err.statusCode = 404;
        err.notFound = true;
        throw err;
    }

    if (user.rows[0].status === 'removed') {
        const err = new Error(
            'Your access to the Gym Management System has been formally revoked.'
        );
        err.statusCode = 403;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
        const err = new Error('Invalid Credentials');
        err.statusCode = 400;
        throw err;
    }

    const payload = {
        user: {
            id: user.rows[0].id,
            role: user.rows[0].role
        }
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '10h' }
    );

    return {
        token,
        user: payload.user
    };
};

module.exports = {
    registerUser,
    loginUser
};