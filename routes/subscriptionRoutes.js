const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getSubscriptions, createSubscription } = require('../controllers/subscriptionController');

// GET /api/subscriptions
router.get('/', auth, authorize('member', 'admin'), getSubscriptions);

// POST /api/subscriptions
router.post('/', auth, authorize('member', 'admin'), createSubscription);

module.exports = router;
