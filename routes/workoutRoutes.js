const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getWorkouts, assignWorkout, getMemberWorkouts } = require('../controllers/workoutController');

router.use(auth);

// All authenticated can see workouts list
router.get('/', getWorkouts);

// Only trainer/admin can assign workouts
router.post('/assign', authorize('admin', 'trainer'), assignWorkout);

// Members see their own, trainers/admin see theirs/all
router.get('/member', getMemberWorkouts);
router.get('/member/:member_id', authorize('admin', 'trainer'), getMemberWorkouts);

module.exports = router;
