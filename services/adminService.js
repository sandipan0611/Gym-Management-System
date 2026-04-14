const db = require('../config/db');
const bcrypt = require('bcrypt');

const getTrainers = async () => {
    const trainers = await db.query(`
        SELECT u.id as user_id, u.name, u.email, u.status, tr.id as trainer_id, tr.specialization,
               COUNT(mw.id) FILTER (WHERE mw.is_active = TRUE) AS member_count
        FROM users u
        JOIN trainers tr ON u.id = tr.user_id
        LEFT JOIN member_workouts mw ON mw.trainer_id = tr.id
        WHERE u.role = 'trainer'
        GROUP BY u.id, u.name, u.email, u.status, tr.id, tr.specialization
        ORDER BY u.id DESC
    `);
    return trainers.rows.map(r => ({ ...r, member_count: parseInt(r.member_count) }));
};

const hireTrainer = async (data) => {
    const { name, email, password, phone, age, specialization } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const userRes = await db.query(
        `INSERT INTO users (name, email, password, role, phone, age, status)
         VALUES ($1, $2, $3, 'trainer', $4, $5, 'active') RETURNING id`,
        [name, email, hashedPass, phone, age]
    );

    const userId = userRes.rows[0].id;

    await db.query(
        `INSERT INTO trainers (user_id, specialization, available_from, available_to)
         VALUES ($1, $2, '06:00:00', '18:00:00')`,
        [userId, specialization || 'General Fitness']
    );

    return { msg: 'Trainer hired successfully' };
};

const fireTrainer = async (id) => {
    await db.query(
        "UPDATE users SET status = 'removed' WHERE id = $1 AND role = 'trainer'",
        [id]
    );

    const trRes = await db.query(
        "SELECT id FROM trainers WHERE user_id = $1",
        [id]
    );

    if (trRes.rows.length > 0) {
        const trainerId = trRes.rows[0].id;

        await db.query(
            `UPDATE member_workouts 
             SET previous_trainer_id = trainer_id, trainer_id = NULL 
             WHERE trainer_id = $1`,
            [trainerId]
        );
    }

    return { msg: 'Trainer removed and assignments cleared' };
};

const replaceTrainer = async (id, data) => {
    const oldU = await db.query(
        "SELECT name, phone FROM users WHERE id = $1 AND role = 'trainer'",
        [id]
    );

    if (oldU.rows.length === 0) {
        throw new Error('Trainer not found');
    }

    const oldName = oldU.rows[0].name;
    const oldPhone = oldU.rows[0].phone;

    const oldT = await db.query(
        "SELECT id FROM trainers WHERE user_id = $1",
        [id]
    );

    const oldTrainerId = oldT.rows.length > 0 ? oldT.rows[0].id : null;

    const { name, email, password, phone, age, specialization } = data;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const userRes = await db.query(
        `INSERT INTO users (name, email, password, role, phone, age, status)
         VALUES ($1, $2, $3, 'trainer', $4, $5, 'active') RETURNING id`,
        [name || oldName, email, hashedPass, phone || oldPhone, age]
    );

    const newUserId = userRes.rows[0].id;

    const tRes = await db.query(
        `INSERT INTO trainers (user_id, specialization, available_from, available_to)
         VALUES ($1, $2, '06:00:00', '18:00:00') RETURNING id`,
        [newUserId, specialization || 'General Fitness']
    );

    const newTrainerId = tRes.rows[0].id;

    if (oldTrainerId) {
        await db.query(
            `UPDATE member_workouts 
             SET trainer_id = $1, previous_trainer_id = NULL 
             WHERE previous_trainer_id = $2`,
            [newTrainerId, oldTrainerId]
        );
    }

    await db.query(
        "UPDATE users SET status = 'replaced' WHERE id = $1",
        [id]
    );

    return { msg: 'Replacement successful' };
};

const assignMember = async (data) => {
    const { member_id, trainer_id, workout_id } = data;

    const t_id = trainer_id === '' ? null : trainer_id;

    // 1. Ensure the user is marked as 'active' (in case they were 'removed')
    await db.query(
        "UPDATE users SET status = 'active' WHERE id = $1",
        [member_id]
    );

    const exists = await db.query(
        "SELECT id FROM member_workouts WHERE member_id = $1",
        [member_id]
    );

    if (exists.rows.length > 0) {
        await db.query(
            `UPDATE member_workouts 
             SET trainer_id = $1, workout_id = $2, is_active = TRUE 
             WHERE member_id = $3`,
            [t_id, workout_id, member_id]
        );
    } else {
        await db.query(
            `INSERT INTO member_workouts (member_id, trainer_id, workout_id, is_active)
             VALUES ($1, $2, $3, TRUE)`,
            [member_id, t_id, workout_id]
        );
    }

    return { msg: 'Assignment updated and member reactivated' };
};

const getMembers = async () => {
    const members = await db.query(
        "SELECT id, name, email FROM users WHERE role = 'member' ORDER BY name ASC"
    );
    return members.rows;
};

const getSuggestedTrainer = async () => {
    const result = await db.query(`
        SELECT u.id as user_id, u.name, tr.id as trainer_id, tr.specialization,
               COUNT(mw.id) FILTER (WHERE mw.is_active = TRUE) AS member_count
        FROM users u
        JOIN trainers tr ON u.id = tr.user_id
        LEFT JOIN member_workouts mw ON mw.trainer_id = tr.id
        WHERE u.status = 'active' AND u.role = 'trainer'
        GROUP BY u.id, u.name, tr.id, tr.specialization
        ORDER BY member_count ASC
        LIMIT 1
    `);
    return result.rows[0] || null;
};

module.exports = {
    getTrainers,
    hireTrainer,
    fireTrainer,
    replaceTrainer,
    assignMember,
    getMembers,
    getSuggestedTrainer
};