const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPayments, recordPayment } = require('../controllers/paymentController');

router.get('/', auth, getPayments);
router.post('/', auth, recordPayment);

module.exports = router;
