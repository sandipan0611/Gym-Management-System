const { getAllPlans, modifyPlanPrice, addPlan } = require('../services/planService');

// Role checks enforced in routes via authorize()
const getPlans = async (req, res, next) => {
    try {
        const plans = await getAllPlans();
        res.json({ success: true, data: plans });
    } catch (err) { next(err); }
};

const createPlan = async (req, res, next) => {
    try {
        const plan = await addPlan(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (err) { next(err); }
};

const updatePlan = async (req, res, next) => {
    try {
        const plan = await modifyPlanPrice(req.params.id, req.body.price);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
        res.json({ success: true, data: plan });
    } catch (err) { next(err); }
};

module.exports = { getPlans, createPlan, updatePlan };
