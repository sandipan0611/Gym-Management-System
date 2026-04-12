const db = require('../config/db');

/**
 * Log a new health metric entry for a member.
 */
const addMetric = async (memberId, data) => {
    const { weight_kg, bmi, body_fat_pct } = data;
    const result = await db.query(
        `INSERT INTO member_metrics (member_id, weight_kg, bmi, body_fat_pct)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [memberId, weight_kg || null, bmi || null, body_fat_pct || null]
    );
    return result.rows[0];
};

/**
 * Retrieve all metric entries for a member, ordered most-recent first.
 */
const getMemberMetrics = async (memberId) => {
    const result = await db.query(
        `SELECT * FROM member_metrics
         WHERE member_id = $1
         ORDER BY recorded_at ASC`,
        [memberId]
    );
    return result.rows;
};

module.exports = { addMetric, getMemberMetrics };
