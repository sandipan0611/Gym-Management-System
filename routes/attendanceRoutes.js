const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { markAttendance, getAttendance } = require('../controllers/attendanceController');

router.post('/', auth, markAttendance);
router.get('/', auth, getAttendance);
router.get('/:member_id', auth, getAttendance);

module.exports = router;
