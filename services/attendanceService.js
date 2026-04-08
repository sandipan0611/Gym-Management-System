const db = require('../config/db');

const alreadyCheckedInToday = async (memberId) => {
    const result = await db.query(
        'SELECT id FROM attendance WHERE member_id = $1 AND DATE(check_in_time) = CURRENT_DATE',
        [memberId]
    );
    return result.rows.length > 0;
};

const recordCheckIn = async (memberId) => {
    const result = await db.query(
        'INSERT INTO attendance (member_id) VALUES ($1) RETURNING *',
        [memberId]
    );
    return result.rows[0];
};

const getAttendanceForUser = async (memberId) => {
    let query = 'SELECT a.*, u.name as member_name FROM attendance a JOIN users u ON a.member_id = u.id';
    const params = [];
    if (memberId) {
        query += ' WHERE a.member_id = $1';
        params.push(memberId);
    }
    query += ' ORDER BY a.check_in_time DESC';
    const result = await db.query(query, params);
    return result.rows;
};

module.exports = { alreadyCheckedInToday, recordCheckIn, getAttendanceForUser };
