const db = require('../config/db');

const markAttendance = async (req, res) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.body.member_id;
        
        const existing = await db.query(
            'SELECT id FROM attendance WHERE member_id = $1 AND DATE(check_in_time) = CURRENT_DATE',
            [member_id]
        );
        
        if(existing.rows.length > 0) {
            return res.status(400).json({ message: "Already checked in today" });
        }
        
        const attendance = await db.query(
            'INSERT INTO attendance (member_id) VALUES ($1) RETURNING *',
            [member_id]
        );
        res.status(201).json({ message: "Attendance marked", data: attendance.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAttendance = async (req, res) => {
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { markAttendance, getAttendance };
