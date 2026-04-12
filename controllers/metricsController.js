const metricsService = require('../services/metricsService');

const getMetrics = async (req, res, next) => {
    try {
        const metrics = await metricsService.getMemberMetrics(req.user.id);
        res.json({ success: true, data: metrics });
    } catch (err) {
        next(err);
    }
};

const addMetric = async (req, res, next) => {
    try {
        const metric = await metricsService.addMetric(req.user.id, req.body);
        res.status(201).json({ success: true, data: metric });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMetrics, addMetric };
