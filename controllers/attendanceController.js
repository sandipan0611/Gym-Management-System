const { alreadyCheckedInToday, recordCheckIn, getAttendanceForUser } = require('../services/attendanceService');

const markAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        const duplicate = await alreadyCheckedInToday(member_id);
        if (duplicate) {
            return res.status(400).json({ success: false, message: 'Already checked in today' });
        }
        
        const attendance = await db.query(
            'INSERT INTO attendance (member_id) VALUES ($1) RETURNING *',
            [member_id]
        );
        res.status(201).json({ message: "Attendance marked", data: attendance.rows[0] });
    } catch (err) {
        next(err);
    }
};

const getAttendance = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        
        let query = 'SELECT a.*, u.name as member_name FROM attendance a JOIN users u ON a.member_id = u.id';
        const params = [];

        if (member_id) {
            query += ' WHERE a.member_id = $1';
            params.push(member_id);
        }
        
        query += ' ORDER BY a.check_in_time DESC';

        const stats = await db.query(query, params);
        res.json(stats.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { markAttendance, getAttendance };
