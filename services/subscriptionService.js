const db = require('../config/db');

const getSubscriptionsForUser = async (userId, role) => {
    let query = `SELECT s.*, p.name as plan_name, u.name as member_name
                 FROM subscriptions s
                 JOIN plans p ON s.plan_id = p.id
                 JOIN users u ON s.member_id = u.id`;
    const params = [];
    if (role === 'member') {
        query += ' WHERE s.member_id = $1 ORDER BY s.start_date DESC';
        params.push(userId);
    } else {
        query += ' ORDER BY s.start_date DESC';
    }
    const result = await db.query(query, params);
    return result.rows;
};

const createOrReplaceSubscription = async (memberId, planId) => {
    await db.query("UPDATE subscriptions SET status = 'cancelled' WHERE member_id = $1", [memberId]);
    const result = await db.query(
        `INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status)
         VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + (SELECT duration_months FROM plans WHERE id = $2) * INTERVAL '1 month', 'active')
         RETURNING *`,
        [memberId, planId]
    );
    return result.rows[0];
};

module.exports = { getSubscriptionsForUser, createOrReplaceSubscription };
