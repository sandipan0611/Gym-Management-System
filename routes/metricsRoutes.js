const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMetrics, addMetric } = require('../controllers/metricsController');

// All routes require authentication
router.use(auth);

// GET /api/metrics — fetch logged-in member's health metric history
router.get('/', getMetrics);

// POST /api/metrics — log a new health metric entry
router.post('/', addMetric);

module.exports = router;
