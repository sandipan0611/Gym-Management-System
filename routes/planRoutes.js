const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getPlans, createPlan, updatePlan } = require('../controllers/planController');

// GET /api/plans — public, no auth required
router.get('/', getPlans);

// POST /api/plans — admin only
router.post('/', auth, authorize('admin'), createPlan);

// PUT /api/plans/:id — admin only
router.put('/:id', auth, authorize('admin'), updatePlan);

module.exports = router;
