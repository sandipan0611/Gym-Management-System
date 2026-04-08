const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { markAttendance, getAttendance } = require('../controllers/attendanceController');

// POST /api/attendance — member checks in
router.post('/', auth, authorize('member', 'admin'), markAttendance);

// GET /api/attendance — member or admin views own/all attendance
router.get('/', auth, authorize('member', 'admin'), getAttendance);

// GET /api/attendance/:member_id — admin views specific member's attendance
router.get('/:member_id', auth, authorize('admin'), getAttendance);

module.exports = router;
