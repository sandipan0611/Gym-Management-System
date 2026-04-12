const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({ 
            success: true, 
            message: result.message, 
            data: result.user 
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json({ 
            success: true, 
            token: result.token, 
            data: result.user 
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
