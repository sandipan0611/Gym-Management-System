const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getTrainerDashboard, getAdminDashboard } = require('../controllers/dashboardController');

// GET /api/dashboard/trainer — trainer only
router.get('/trainer', auth, authorize('trainer'), getTrainerDashboard);

// GET /api/dashboard/admin — admin only
router.get('/admin', auth, authorize('admin'), getAdminDashboard);

module.exports = router;
