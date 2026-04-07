const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPlans, createPlan, updatePlan } = require('../controllers/planController');

router.get('/', getPlans);
router.post('/', auth, createPlan);
router.put('/:id', auth, updatePlan);

module.exports = router;
