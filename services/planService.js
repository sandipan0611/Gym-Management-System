const db = require('../config/db');

const getPlans = async () => {
    const plans = await db.query('SELECT * FROM plans');
    return plans.rows;
};

const createPlan = async (data) => {
    const { name, duration_months, price, description } = data;

    const newPlan = await db.query(
        `INSERT INTO plans (name, duration_months, price, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, duration_months, price, description]
    );

    return newPlan.rows[0];
};

const updatePlan = async (id, data) => {
    const { price } = data;

    const updatedPlan = await db.query(
        `UPDATE plans 
         SET price = $1 
         WHERE id = $2 
         RETURNING *`,
        [price, id]
    );

    if (updatedPlan.rows.length === 0) {
        const err = new Error('Plan not found');
        err.statusCode = 404;
        throw err;
    }

    return updatedPlan.rows[0];
};

module.exports = {
    getPlans,
    createPlan,
    updatePlan
};