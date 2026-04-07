const db = require('../config/db');
const bcrypt = require('bcrypt');

const getTrainers = async (req, res) => {
    try {
        const trainers = await db.query(`
            SELECT u.id as user_id, u.name, u.email, u.status, tr.id as trainer_id, tr.specialization
            FROM users u
            JOIN trainers tr ON u.id = tr.user_id
            WHERE u.role = 'trainer'
            ORDER BY u.id DESC
        `);
        res.json(trainers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const hireTrainer = async (req, res) => {
    try {
        const { name, email, password, phone, age, specialization } = req.body;
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
        res.status(201).json({ msg: 'Trainer hired successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const fireTrainer = async (req, res) => {
    try {
        const { id } = req.params; // this is the users.id
        
        await db.query("UPDATE users SET status = 'removed' WHERE id = $1 AND role = 'trainer'", [id]);
        
        const trRes = await db.query("SELECT id FROM trainers WHERE user_id = $1", [id]);
        if(trRes.rows.length > 0) {
            const trainerId = trRes.rows[0].id;
            await db.query("UPDATE member_workouts SET previous_trainer_id = trainer_id, trainer_id = NULL WHERE trainer_id = $1", [trainerId]);
        }
        res.json({ msg: 'Trainer removed and assignments cleared' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const replaceTrainer = async (req, res) => {
    try {
        const { id } = req.params; // old users.id
        
        const oldU = await db.query("SELECT name, phone FROM users WHERE id = $1 AND role = 'trainer'", [id]);
        if (oldU.rows.length === 0) return res.status(404).send('Trainer not found');
        
        const oldName = oldU.rows[0].name;
        const oldPhone = oldU.rows[0].phone;
        
        const oldT = await db.query("SELECT id FROM trainers WHERE user_id = $1", [id]);
        const oldTrainerId = oldT.rows.length > 0 ? oldT.rows[0].id : null;
        
        const { name, email, password, phone, age, specialization } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        
        const insertName = name || oldName;
        const insertPhone = phone || oldPhone;

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
           await db.query("UPDATE member_workouts SET trainer_id = $1, previous_trainer_id = NULL WHERE previous_trainer_id = $2", [newTrainerId, oldTrainerId]);
        }
        
        // Mark old user officially replaced so they don't show up in Pending UI
        await db.query("UPDATE users SET status = 'replaced' WHERE id = $1", [id]);
        
        res.status(201).json({ msg: 'Replacement successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const assignMember = async (req, res) => {
    try {
        const { member_id, trainer_id, workout_id } = req.body;
        
        const t_id = trainer_id === '' ? null : trainer_id;
        
        const exists = await db.query("SELECT id FROM member_workouts WHERE member_id = $1", [member_id]);
        if(exists.rows.length > 0) {
            await db.query("UPDATE member_workouts SET trainer_id = $1, workout_id = $2 WHERE member_id = $3", [t_id, workout_id, member_id]);
        } else {
            await db.query("INSERT INTO member_workouts (member_id, trainer_id, workout_id) VALUES ($1, $2, $3)", [member_id, t_id, workout_id]);
        }
        res.json({ msg: 'Assignment updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getMembers = async (req, res) => {
    try {
        const members = await db.query(`SELECT id, name, email FROM users WHERE role = 'member'`);
        res.json(members.rows);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { getTrainers, hireTrainer, fireTrainer, replaceTrainer, assignMember, getMembers };
