const db = require('../config/db');

const markAttendance = async (member_id) => {
    const existing = await db.query(
        'SELECT id FROM attendance WHERE member_id = $1 AND DATE(check_in_time) = CURRENT_DATE',
        [member_id]
    );

    if (existing.rows.length > 0) {
        const err = new Error('Already checked in today');
        err.statusCode = 400;
        throw err;
    }

    const attendance = await db.query(
        'INSERT INTO attendance (member_id) VALUES ($1) RETURNING *',
        [member_id]
    );

    return { 
        message: "Attendance marked", 
        data: attendance.rows[0] 
    };
};

const getAttendance = async (member_id) => {
    let query = `
        SELECT a.*, u.name as member_name 
        FROM attendance a 
        JOIN users u ON a.member_id = u.id
    `;
    const params = [];

    if (member_id) {
        query += ' WHERE a.member_id = $1';
        params.push(member_id);
    }

    query += ' ORDER BY a.check_in_time DESC';

    const result = await db.query(query, params);
    return result.rows;
};

module.exports = { 
    markAttendance, 
    getAttendance 
};