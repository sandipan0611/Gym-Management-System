const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getPlans, createPlan, updatePlan } = require('../controllers/planController');

// Public can see plans
router.get('/', getPlans);

// Only admin can manage plans
router.post('/', [auth, authorize('admin')], createPlan);
router.put('/:id', [auth, authorize('admin')], updatePlan);

module.exports = router;
