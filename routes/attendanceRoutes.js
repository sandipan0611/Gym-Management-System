const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { markAttendance, getAttendance } = require('../controllers/attendanceController');

router.use(auth);

// Members and staff can mark attendance
router.post('/', markAttendance);

// Members and staff can see relevant attendance
router.get('/', authorize('admin', 'trainer', 'member'), getAttendance);
router.get('/:member_id', authorize('admin', 'trainer', 'member'), getAttendance);

module.exports = router;
