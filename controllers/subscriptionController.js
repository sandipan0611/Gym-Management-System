const db = require('../config/db');

const getSubscriptions = async (req, res, next) => {
    try {
        let query = 'SELECT s.*, p.name as plan_name, u.name as member_name FROM subscriptions s JOIN plans p ON s.plan_id = p.id JOIN users u ON s.member_id = u.id';
        const params = [];
        if (req.user.role === 'member') {
            query += ' WHERE s.member_id = $1';
            params.push(req.user.id);
        }
        const subs = await db.query(query, params);
        res.json(subs.rows);
    } catch (err) {
        next(err);
    }
};

const createSubscription = async (req, res, next) => {
    try {
        const { plan_id } = req.body;
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        
        await db.query("UPDATE subscriptions SET status = 'cancelled' WHERE member_id = $1", [member_id]);
        
        const newSub = await db.query(
            `INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status) 
             VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + (SELECT duration_months FROM plans WHERE id = $2) * INTERVAL '1 month', 'active') 
             RETURNING *`,
            [member_id, plan_id]
        );
        res.status(201).json(newSub.rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = { getSubscriptions, createSubscription };
