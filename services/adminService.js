const db = require('../config/db');
const bcrypt = require('bcrypt');

const getAllTrainers = async () => {
    const result = await db.query(`
        SELECT u.id as user_id, u.name, u.email, u.status, tr.id as trainer_id, tr.specialization
        FROM users u
        JOIN trainers tr ON u.id = tr.user_id
        WHERE u.role = 'trainer'
        ORDER BY u.id DESC
    `);
    return result.rows;
};

const getAllMembers = async () => {
    const result = await db.query("SELECT id, name, email FROM users WHERE role = 'member'");
    return result.rows;
};

const createTrainer = async ({ name, email, password, phone, age, specialization }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const userRes = await db.query(
        "INSERT INTO users (name, email, password, role, phone, age, status) VALUES ($1, $2, $3, 'trainer', $4, $5, 'active') RETURNING id",
        [name, email, hashedPass, phone, age]
    );
    const userId = userRes.rows[0].id;
    await db.query(
        "INSERT INTO trainers (user_id, specialization, available_from, available_to) VALUES ($1, $2, '06:00:00', '18:00:00')",
        [userId, specialization || 'General Fitness']
    );
};

const removeTrainer = async (userId) => {
    await db.query("UPDATE users SET status = 'removed' WHERE id = $1 AND role = 'trainer'", [userId]);
    const trRes = await db.query('SELECT id FROM trainers WHERE user_id = $1', [userId]);
    if (trRes.rows.length > 0) {
        const trainerId = trRes.rows[0].id;
        await db.query(
            'UPDATE member_workouts SET previous_trainer_id = trainer_id, trainer_id = NULL WHERE trainer_id = $1',
            [trainerId]
        );
    }
};

const substituteTrainer = async (oldUserId, { name, email, password, phone, age, specialization }) => {
    const oldU = await db.query("SELECT name, phone FROM users WHERE id = $1 AND role = 'trainer'", [oldUserId]);
    if (oldU.rows.length === 0) {
        const err = new Error('Trainer not found');
        err.statusCode = 404;
        throw err;
    }
    const oldT = await db.query('SELECT id FROM trainers WHERE user_id = $1', [oldUserId]);
    const oldTrainerId = oldT.rows.length > 0 ? oldT.rows[0].id : null;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const insertName = name || oldU.rows[0].name;
    const insertPhone = phone || oldU.rows[0].phone;

    const userRes = await db.query(
        "INSERT INTO users (name, email, password, role, phone, age, status) VALUES ($1, $2, $3, 'trainer', $4, $5, 'active') RETURNING id",
        [insertName, email, hashedPass, insertPhone, age]
    );
    const newUserId = userRes.rows[0].id;
    const tRes = await db.query(
        "INSERT INTO trainers (user_id, specialization, available_from, available_to) VALUES ($1, $2, '06:00:00', '18:00:00') RETURNING id",
        [newUserId, specialization || 'General Fitness']
    );
    const newTrainerId = tRes.rows[0].id;

    if (oldTrainerId) {
        await db.query(
            'UPDATE member_workouts SET trainer_id = $1, previous_trainer_id = NULL WHERE previous_trainer_id = $2',
            [newTrainerId, oldTrainerId]
        );
    }
    await db.query("UPDATE users SET status = 'replaced' WHERE id = $1", [oldUserId]);
};

const upsertMemberAssignment = async ({ member_id, trainer_id, workout_id }) => {
    const t_id = trainer_id === '' ? null : trainer_id;
    const exists = await db.query('SELECT id FROM member_workouts WHERE member_id = $1', [member_id]);
    if (exists.rows.length > 0) {
        await db.query(
            'UPDATE member_workouts SET trainer_id = $1, workout_id = $2 WHERE member_id = $3',
            [t_id, workout_id, member_id]
        );
    } else {
        await db.query(
            'INSERT INTO member_workouts (member_id, trainer_id, workout_id) VALUES ($1, $2, $3)',
            [member_id, t_id, workout_id]
        );
    }
};

module.exports = { getAllTrainers, getAllMembers, createTrainer, removeTrainer, substituteTrainer, upsertMemberAssignment };
