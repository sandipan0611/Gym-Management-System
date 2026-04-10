const planService = require('../services/planService');

const getPlans = async (req, res, next) => {
    try {
        const plans = await planService.getPlans();
        res.json({ success: true, data: plans });
    } catch (err) {
        next(err);
    }
};

const createPlan = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Authorization denied' });
        }
        const result = await planService.createPlan(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const updatePlan = async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Authorization denied' });
        }
        const result = await planService.updatePlan(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { getPlans, createPlan, updatePlan };
