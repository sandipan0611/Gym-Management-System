const dashboardService = require('../services/dashboardService');

const getTrainerAssignments = async (req, res, next) => {
    try {
        if (req.user.role !== 'trainer') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const assignments = await dashboardService.getTrainerAssignments(req.user.id);
        res.json({ success: true, data: assignments });
    } catch (err) {
        next(err);
    }
};

const getAdminDashboard = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const stats = await dashboardService.getAdminDashboard();
        res.json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};

module.exports = { getTrainerAssignments, getAdminDashboard };
