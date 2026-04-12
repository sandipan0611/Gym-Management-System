/**
 * reportService.js
 * Handles complex cross-table analytics queries for the admin intelligence layer.
 */
const db = require('../config/db');

/**
 * Monthly Recurring Revenue — sum of active plan prices in the current calendar month.
 */
const getMRR = async () => {
    const result = await db.query(`
        SELECT COALESCE(SUM(p.price), 0) AS mrr
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.status = 'active'
          AND DATE_TRUNC('month', s.start_date) = DATE_TRUNC('month', CURRENT_DATE)
    `);
    return parseFloat(result.rows[0].mrr);
};

/**
 * Revenue grouped by plan name — for the Revenue by Plan bar chart.
 * Uses active subscriptions only.
 */
const getRevenueByPlan = async () => {
    const result = await db.query(`
        SELECT p.name, COALESCE(SUM(p.price), 0) AS value
        FROM subscriptions s
        JOIN plans p ON s.plan_id = p.id
        WHERE s.status = 'active'
        GROUP BY p.name
        ORDER BY value DESC
    `);
    return result.rows.map(r => ({ name: r.name, value: parseFloat(r.value) }));
};

/**
 * Active member count per trainer — for the Trainer Load horizontal bar chart.
 */
const getTrainerLoad = async () => {
    const result = await db.query(`
        SELECT u.name AS trainer_name, COUNT(mw.id) AS count
        FROM trainers tr
        JOIN users u ON tr.user_id = u.id
        LEFT JOIN member_workouts mw ON mw.trainer_id = tr.id AND mw.is_active = TRUE
        WHERE u.status = 'active' AND u.role = 'trainer'
        GROUP BY u.name
        ORDER BY count DESC
    `);
    return result.rows.map(r => ({ trainer_name: r.trainer_name, count: parseInt(r.count) }));
};

/**
 * Daily check-in counts for the last N days — for the Attendance Trend area chart.
 * @param {number} days - number of past days to include (default 30)
 */
const getAttendanceTrend = async (days = 30) => {
    const result = await db.query(`
        SELECT TO_CHAR(DATE(check_in_time), 'MM-DD') AS date,
               COUNT(*) AS visits
        FROM attendance
        WHERE check_in_time >= NOW() - INTERVAL '${parseInt(days)} days'
        GROUP BY DATE(check_in_time)
        ORDER BY DATE(check_in_time) ASC
    `);
    return result.rows.map(r => ({ date: r.date, visits: parseInt(r.visits) }));
};

/**
 * Check-in counts grouped by hour-of-day — for the Peak Hours area chart.
 */
const getPeakHours = async () => {
    const result = await db.query(`
        SELECT EXTRACT(HOUR FROM check_in_time)::INT AS hour,
               COUNT(*) AS count
        FROM attendance
        GROUP BY hour
        ORDER BY hour ASC
    `);
    return result.rows.map(r => ({ hour: r.hour, count: parseInt(r.count) }));
};

/**
 * Members whose active subscription expires within the next 7 days.
 */
const getExpiringSoon = async () => {
    const result = await db.query(`
        SELECT u.name AS member_name, u.email, s.end_date,
               (s.end_date - CURRENT_DATE) AS days_left
        FROM subscriptions s
        JOIN users u ON s.member_id = u.id
        WHERE s.status = 'active'
          AND s.end_date <= CURRENT_DATE + INTERVAL '7 days'
          AND s.end_date >= CURRENT_DATE
        ORDER BY s.end_date ASC
    `);
    return result.rows.map(r => ({
        member_name: r.member_name,
        email: r.email,
        end_date: r.end_date,
        days_left: parseInt(r.days_left)
    }));
};

module.exports = {
    getMRR,
    getRevenueByPlan,
    getTrainerLoad,
    getAttendanceTrend,
    getPeakHours,
    getExpiringSoon
};
