const db = require('../config/db');

const getPayments = async (req, res, next) => {
    try {
        let query = 'SELECT p.*, s.status as subscription_status, u.name as member_name FROM payments p JOIN subscriptions s ON p.subscription_id = s.id JOIN users u ON s.member_id = u.id';
        const params = [];

        if (req.user.role === 'member') {
            query += ' WHERE s.member_id = $1';
            params.push(req.user.id);
        }

        const payments = await db.query(query, params);
        res.json(payments.rows);
    } catch (err) {
        next(err);
    }
};

const recordPayment = async (req, res, next) => {
    try {
        const { subscription_id, amount, status } = req.body;
        const newPayment = await db.query(
            'INSERT INTO payments (subscription_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
            [subscription_id, amount, status || 'completed']
        );
        res.status(201).json(newPayment.rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = { getPayments, recordPayment };
