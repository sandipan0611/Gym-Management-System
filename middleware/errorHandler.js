/**
 * Centralized error-handling middleware.
 * Must be registered LAST in index.js (after all routes).
 * Controllers call next(err) to reach here.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
    res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
