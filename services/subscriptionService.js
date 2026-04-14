const db = require('../config/db');

const paymentService = require('./paymentService');

const getSubscriptions = async (user) => {
    let query = `
        SELECT s.*, p.name as plan_name, u.name as member_name 
        FROM subscriptions s 
        JOIN plans p ON s.plan_id = p.id 
        JOIN users u ON s.member_id = u.id
    `;
    const params = [];

    if (user.role === 'member') {
        query += ' WHERE s.member_id = $1';
        params.push(user.id);
    }
    
    query += " ORDER BY (s.status = 'active') DESC, s.start_date DESC";

    const subs = await db.query(query, params);
    return subs.rows;
};

const createSubscription = async (user, data) => {
    const { plan_id } = data;

    const member_id =
        user.role === 'member' ? user.id : data.member_id;

    // Fetch plan price for payment record
    const planRes = await db.query('SELECT price FROM plans WHERE id = $1', [plan_id]);
    if (planRes.rows.length === 0) {
        const err = new Error('Plan not found');
        err.statusCode = 404;
        throw err;
    }
    const amount = planRes.rows[0].price;

    // Cancel previous subscriptions
    await db.query(
        "UPDATE subscriptions SET status = 'cancelled' WHERE member_id = $1",
        [member_id]
    );

    // Create new subscription
    const newSub = await db.query(
        `INSERT INTO subscriptions 
         (member_id, plan_id, start_date, end_date, status) 
         VALUES (
            $1, 
            $2, 
            CURRENT_DATE, 
            CURRENT_DATE + 
              (SELECT duration_months FROM plans WHERE id = $2) * INTERVAL '1 month',
            'active'
         ) 
         RETURNING *`,
        [member_id, plan_id]
    );

    // Record the payment
    await paymentService.recordPayment({
        subscription_id: newSub.rows[0].id,
        amount: amount,
        status: 'completed'
    });

    return newSub.rows[0];
};

module.exports = {
    getSubscriptions,
    createSubscription
};