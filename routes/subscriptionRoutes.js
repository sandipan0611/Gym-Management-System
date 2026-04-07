const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSubscriptions, createSubscription } = require('../controllers/subscriptionController');

router.get('/', auth, getSubscriptions);
router.post('/', auth, createSubscription);

module.exports = router;
