const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { markAttendance, getAttendance } = require('../controllers/attendanceController');

router.use(auth);

// Members and staff can mark attendance
router.post('/', markAttendance);

// Only admin and trainers can see all attendance
router.get('/', authorize('admin', 'trainer'), getAttendance);
router.get('/:member_id', authorize('admin', 'trainer'), getAttendance);

module.exports = router;
