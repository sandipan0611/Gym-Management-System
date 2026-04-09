const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getSubscriptions, createSubscription } = require('../controllers/subscriptionController');

router.use(auth);

// Members see their own, admin sees all
router.get('/', getSubscriptions);

// Any authenticated can subscribe (usually members)
router.post('/', createSubscription);

module.exports = router;
