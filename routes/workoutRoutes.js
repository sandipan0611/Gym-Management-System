const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWorkouts, assignWorkout, getMemberWorkouts } = require('../controllers/workoutController');

router.get('/', auth, getWorkouts);
router.post('/assign', auth, assignWorkout);
router.get('/member', auth, getMemberWorkouts);
router.get('/member/:member_id', auth, getMemberWorkouts);

module.exports = router;
