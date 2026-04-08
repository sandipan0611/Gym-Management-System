/**
 * Role-based authorization middleware factory.
 * Usage: authorize('admin') or authorize('admin', 'trainer')
 * Must be placed AFTER auth middleware (which sets req.user).
 */
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
    }
    next();
};

module.exports = authorize;
