const { getAdminStats, getTrainerAssignments } = require('../services/dashboardService');

// Role checks are enforced in routes via authorize() middleware
const getTrainerDashboard = async (req, res, next) => {
    try {
        const assignments = await getTrainerAssignments(req.user.id);
        res.json({ success: true, data: assignments });
    } catch (err) { next(err); }
};

const getAdminDashboard = async (req, res, next) => {
    try {
        const stats = await getAdminStats();
        res.json({ success: true, data: stats });
    } catch (err) { next(err); }
};

module.exports = { getTrainerDashboard, getAdminDashboard };
