const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrainerAssignments, getAdminDashboard } = require('../controllers/dashboardController');

// @route   GET api/dashboard/trainer
// @desc    Get assignments for the logged-in trainer
// @access  Private (Trainer)
router.get('/trainer', auth, getTrainerAssignments);

// @route   GET api/dashboard/admin
// @desc    Get complete gym stats and all assignments
// @access  Private (Admin)
router.get('/admin', auth, getAdminDashboard);

module.exports = router;
