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

const getProfile = async (req, res, next) => {
    try {
        const profile = await userService.getProfile(req.user.id);
        res.json({ success: true, data: profile });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const updated = await userService.updateProfile(req.user.id, req.body);
        res.json({ success: true, data: updated, message: 'Profile updated successfully' });
    } catch (err) {
        next(err);
    }
};

const leaveGym = async (req, res, next) => {
    try {
        const result = await userService.leaveGym(req.user.id);
        res.json({ success: true, message: result.message });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMembers, getTrainers, changePassword, getProfile, updateProfile, leaveGym };
