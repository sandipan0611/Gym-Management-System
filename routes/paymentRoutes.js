const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getPayments, recordPayment } = require('../controllers/paymentController');

router.use(auth);

// Members can see their own, admins see all
router.get('/', getPayments);

// Only admins can record payments
router.post('/', authorize('admin'), recordPayment);

module.exports = router;
