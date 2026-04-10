const db = require('../config/db');

const getPayments = async (user) => {
    let query = `
        SELECT p.*, s.status as subscription_status, u.name as member_name 
        FROM payments p 
        JOIN subscriptions s ON p.subscription_id = s.id 
        JOIN users u ON s.member_id = u.id
    `;
    const params = [];

    if (user.role === 'member') {
        query += ' WHERE s.member_id = $1';
        params.push(user.id);
    }

    const payments = await db.query(query, params);
    return payments.rows;
};

const recordPayment = async (data) => {
    const { subscription_id, amount, status } = data;

    const newPayment = await db.query(
        `INSERT INTO payments (subscription_id, amount, status)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [subscription_id, amount, status || 'completed']
    );

    return newPayment.rows[0];
};

module.exports = {
    getPayments,
    recordPayment
};