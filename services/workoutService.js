const db = require('../config/db');

const getWorkouts = async () => {
    const workouts = await db.query('SELECT * FROM workouts');
    return workouts.rows;
};

const assignWorkout = async (user, data) => {
    const { member_id, workout_id } = data;

    const trainer_id =
        user.role === 'trainer' ? user.id : null;

    // Soft-archive any existing active assignment for this member (workout versioning)
    await db.query(
        `UPDATE member_workouts SET is_active = FALSE WHERE member_id = $1 AND is_active = TRUE`,
        [member_id]
    );

    const assigned = await db.query(
        `INSERT INTO member_workouts (member_id, trainer_id, workout_id, is_active)
         VALUES ($1, $2, $3, TRUE)
         RETURNING *`,
        [member_id, trainer_id, workout_id]
    );

    return assigned.rows[0];
};

const getMemberWorkouts = async (user, member_id_param) => {
    const member_id =
        user.role === 'member' ? user.id : member_id_param;

    const workouts = await db.query(
        `SELECT mw.*, 
                w.name as workout_name, 
                w.description, 
                t.name as trainer_name 
         FROM member_workouts mw 
         JOIN workouts w ON mw.workout_id = w.id 
         LEFT JOIN trainers tr ON mw.trainer_id = tr.id 
         LEFT JOIN users t ON tr.user_id = t.id 
         WHERE mw.member_id = $1 AND mw.is_active = TRUE`,
        [member_id]
    );

    return workouts.rows;
};

module.exports = {
    getWorkouts,
    assignWorkout,
    getMemberWorkouts
};