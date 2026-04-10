const subscriptionService = require('../services/subscriptionService');

const getSubscriptions = async (req, res, next) => {
    try {
        const subs = await subscriptionService.getSubscriptions(req.user);
        res.json({ success: true, data: subs });
    } catch (err) {
        next(err);
    }
};

const createSubscription = async (req, res, next) => {
    try {
        const result = await subscriptionService.createSubscription(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { getSubscriptions, createSubscription };
