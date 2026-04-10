const db = require('../config/db');

const getTrainerAssignments = async (userId) => {
    const assignments = await db.query(
        `SELECT mw.id as assignment_id, u.name as member_name, u.email as member_email, u.phone, 
                w.name as workout_name, w.description as workout_desc
         FROM member_workouts mw
         JOIN trainers tr ON mw.trainer_id = tr.id
         JOIN users u ON mw.member_id = u.id
         JOIN workouts w ON mw.workout_id = w.id
         WHERE tr.user_id = $1`,
        [userId]
    );

    return assignments.rows;
};

const getAdminDashboard = async () => {
    const membersCount = await db.query(
        "SELECT COUNT(*) FROM users WHERE role = 'member'"
    );

    const trainersCount = await db.query(
        "SELECT COUNT(*) FROM users WHERE role = 'trainer' AND status = 'active'"
    );

    const revenue = await db.query(`
        SELECT SUM(p.price) as total_revenue
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.status = 'active'
    `);

    const assignments = await db.query(`
        SELECT mw.id, u_member.name as member_name, u_trainer.name as trainer_name, w.name as workout_name
        FROM member_workouts mw
        JOIN users u_member ON mw.member_id = u_member.id
        JOIN trainers tr ON mw.trainer_id = tr.id
        JOIN users u_trainer ON tr.user_id = u_trainer.id
        JOIN workouts w ON mw.workout_id = w.id
    `);

    return {
        population: {
            members: parseInt(membersCount.rows[0].count),
            trainers: parseInt(trainersCount.rows[0].count)
        },
        revenue: parseFloat(revenue.rows[0].total_revenue || 0),
        assignments: assignments.rows
    };
};

module.exports = {
    getTrainerAssignments,
    getAdminDashboard
};