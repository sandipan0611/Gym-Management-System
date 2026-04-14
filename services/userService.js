const db = require('../config/db');
const bcrypt = require('bcrypt');

const getMembers = async () => {
    const members = await db.query(
        `SELECT id, name, email, phone, age, joining_date 
         FROM users 
         WHERE role = 'member'`
    );
    return members.rows;
};

const getTrainers = async () => {
    const trainers = await db.query(
        `SELECT u.id, u.name, u.email, u.phone, 
                t.specialization, t.available_from, t.available_to 
         FROM users u 
         LEFT JOIN trainers t ON u.id = t.user_id 
         WHERE u.role = 'trainer'`
    );
    return trainers.rows;
};

const changePassword = async (userId, data) => {
    const { currentPassword, newPassword } = data;

    const user = await db.query(
        'SELECT password FROM users WHERE id = $1',
        [userId]
    );

    if (user.rows.length === 0) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.rows[0].password
    );

    if (!isMatch) {
        const err = new Error('Incorrect current password');
        err.statusCode = 400;
        throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    await db.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPass, userId]
    );

    return { message: 'Password updated successfully' };
};

const getProfile = async (userId) => {
    const result = await db.query(
        `SELECT id, name, email, phone, age, role, joining_date
         FROM users WHERE id = $1`,
        [userId]
    );
    if (result.rows.length === 0) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return result.rows[0];
};

const updateProfile = async (userId, data) => {
    const { name, phone, age, specialization, email } = data;
    
    // Update users table
    const result = await db.query(
        `UPDATE users
         SET name  = COALESCE($1, name),
             phone = COALESCE($2, phone),
             age   = COALESCE($3, age),
             email = COALESCE($4, email)
         WHERE id = $5
         RETURNING id, name, email, phone, age, role`,
        [name || null, phone || null, age ? parseInt(age) : null, email || null, userId]
    );

    const user = result.rows[0];

    // If specialization is provided and user is a trainer, update trainers table
    if (specialization !== undefined && user.role === 'trainer') {
        await db.query(
            `UPDATE trainers 
             SET specialization = $1 
             WHERE user_id = $2`,
            [specialization, userId]
        );
        user.specialization = specialization;
    }

    return user;
};

module.exports = {
    getMembers,
    getTrainers,
    changePassword,
    getProfile,
    updateProfile
};