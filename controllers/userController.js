const userService = require('../services/userService');

const getMembers = async (req, res, next) => {
    try {
        const members = await userService.getMembers();
        res.json({ success: true, data: members });
    } catch (err) {
        next(err);
    }
};

const getTrainers = async (req, res, next) => {
    try {
        const trainers = await userService.getTrainers();
        res.json({ success: true, data: trainers });
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const result = await userService.changePassword(req.user.id, req.body);
        res.json({ success: true, message: result.message });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMembers, getTrainers, changePassword };
