const db = require('../config/db');

const getAllPlans = async () => {
    const result = await db.query('SELECT * FROM plans ORDER BY price ASC');
    return result.rows;
};

const modifyPlanPrice = async (id, price) => {
    const result = await db.query(
        'UPDATE plans SET price = $1 WHERE id = $2 RETURNING *',
        [price, id]
    );
    return result.rows[0] || null;
};

const addPlan = async ({ name, duration_months, price, description }) => {
    const result = await db.query(
        'INSERT INTO plans (name, duration_months, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, duration_months, price, description]
    );
    return result.rows[0];
};

module.exports = { getAllPlans, modifyPlanPrice, addPlan };
