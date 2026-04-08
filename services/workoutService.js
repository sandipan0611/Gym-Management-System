const db = require('../config/db');

const getAllWorkouts = async () => {
    const result = await db.query('SELECT * FROM workouts ORDER BY id ASC');
    return result.rows;
};

const getMemberWorkouts = async (memberId) => {
    const result = await db.query(
        `SELECT mw.*, w.name as workout_name, w.description,
                t.name as trainer_name
         FROM member_workouts mw
         JOIN workouts w ON mw.workout_id = w.id
         LEFT JOIN trainers tr ON mw.trainer_id = tr.id
         LEFT JOIN users t ON tr.user_id = t.id
         WHERE mw.member_id = $1`,
        [memberId]
    );
    return result.rows;
};

module.exports = { getAllWorkouts, getMemberWorkouts };
