const db = require('../config/db');

const bcrypt = require('bcrypt');

const getMembers = async (req, res) => {
    try {
        const members = await db.query("SELECT id, name, email, phone, age, joining_date FROM users WHERE role = 'member'");
        res.json(members.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTrainers = async (req, res) => {
    try {
        const trainers = await db.query("SELECT u.id, u.name, u.email, u.phone, t.specialization, t.available_from, t.available_to FROM users u LEFT JOIN trainers t ON u.id = t.user_id WHERE u.role = 'trainer'");
        res.json(trainers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        const user = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newPassword, salt);
        
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPass, userId]);
        
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getMembers, getTrainers, changePassword };
