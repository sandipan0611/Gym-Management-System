const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getWorkouts, getMemberWorkoutsController } = require('../controllers/workoutController');

// GET /api/workouts — all workout types (any authenticated user)
router.get('/', auth, getWorkouts);

// GET /api/workouts/member — logged-in member's assigned workout
router.get('/member', auth, authorize('member', 'admin'), getMemberWorkoutsController);

// GET /api/workouts/member/:member_id — admin fetch for specific member
router.get('/member/:member_id', auth, authorize('admin'), getMemberWorkoutsController);

module.exports = router;
