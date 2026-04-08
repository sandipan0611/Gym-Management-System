const db = require('../config/db');

const getPlans = async (req, res, next) => {
    try {
        const plans = await db.query('SELECT * FROM plans');
        res.json(plans.rows);
    } catch (err) {
        next(err);
    }
};

const createPlan = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: 'Authorization denied'});
        }
        const { name, duration_months, price, description } = req.body;
        const newPlan = await db.query(
            'INSERT INTO plans (name, duration_months, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, duration_months, price, description]
        );
        res.status(201).json(newPlan.rows[0]);
    } catch (err) {
        next(err);
    }
};
const updatePlan = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({message: 'Authorization denied'});
        }
        const { id } = req.params;
        const { price } = req.body;
        const updatedPlan = await db.query(
            'UPDATE plans SET price = $1 WHERE id = $2 RETURNING *',
            [price, id]
        );
        if (updatedPlan.rows.length === 0) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(updatedPlan.rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = { getPlans, createPlan, updatePlan };
