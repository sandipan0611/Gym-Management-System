const paymentService = require('../services/paymentService');

const getPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getPayments(req.user);
        res.json({ success: true, data: payments });
    } catch (err) {
        next(err);
    }
};

const recordPayment = async (req, res, next) => {
    try {
        const result = await paymentService.recordPayment(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

module.exports = { getPayments, recordPayment };
