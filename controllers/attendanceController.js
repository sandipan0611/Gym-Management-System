const { alreadyCheckedInToday, recordCheckIn, getAttendanceForUser } = require('../services/attendanceService');

const markAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        const duplicate = await alreadyCheckedInToday(member_id);
        if (duplicate) {
            return res.status(400).json({ success: false, message: 'Already checked in today' });
        }
        const record = await recordCheckIn(member_id);
        res.status(201).json({ success: true, message: 'Attendance marked', data: record });
    } catch (err) { next(err); }
};

const getAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        const records = await getAttendanceForUser(member_id);
        res.json({ success: true, data: records });
    } catch (err) { next(err); }
};

module.exports = { markAttendance, getAttendance };
