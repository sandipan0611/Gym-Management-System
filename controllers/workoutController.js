const db = require('../config/db');

const getWorkouts = async (req, res) => {
    try {
        const workouts = await db.query('SELECT * FROM workouts');
        res.json(workouts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const assignWorkout = async (req, res) => {
    try {
        const { member_id, workout_id } = req.body;
        const trainer_id = req.user.role === 'trainer' ? req.user.id : null;

        const assigned = await db.query(
            'INSERT INTO member_workouts (member_id, trainer_id, workout_id) VALUES ($1, $2, $3) RETURNING *',
            [member_id, trainer_id, workout_id]
        );
        res.status(201).json(assigned.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getMemberWorkouts = async (req, res) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        const workouts = await db.query(
            'SELECT mw.*, w.name as workout_name, w.description, t.name as trainer_name FROM member_workouts mw JOIN workouts w ON mw.workout_id = w.id LEFT JOIN trainers tr ON mw.trainer_id = tr.id LEFT JOIN users t ON tr.user_id = t.id WHERE mw.member_id = $1',
            [member_id]
        );
        res.json(workouts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getWorkouts, assignWorkout, getMemberWorkouts };
