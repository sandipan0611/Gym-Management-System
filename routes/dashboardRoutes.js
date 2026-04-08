const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getTrainerAssignments, getAdminDashboard } = require('../controllers/dashboardController');

router.use(auth);

// Private (Trainer)
router.get('/trainer', authorize('trainer'), getTrainerAssignments);

// Private (Admin)
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;
