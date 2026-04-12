const attendanceService = require('../services/attendanceService');

const markAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        const result = await attendanceService.markAttendance(member_id);
        res.status(201).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

const getAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        const data = await attendanceService.getAttendance(member_id);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = { markAttendance, getAttendance };
