const { getSubscriptionsForUser, createOrReplaceSubscription } = require('../services/subscriptionService');

const getSubscriptions = async (req, res, next) => {
    try {
        const subs = await getSubscriptionsForUser(req.user.id, req.user.role);
        res.json({ success: true, data: subs });
    } catch (err) { next(err); }
};

const createSubscription = async (req, res, next) => {
    try {
        const { plan_id } = req.body;
        if (!plan_id) {
            return res.status(400).json({ success: false, message: 'plan_id is required' });
        }
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        const sub = await createOrReplaceSubscription(member_id, plan_id);
        res.status(201).json({ success: true, data: sub });
    } catch (err) { next(err); }
};

module.exports = { getSubscriptions, createSubscription };
