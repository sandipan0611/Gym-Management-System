const { getMembers, getTrainers, updatePassword } = require('../services/userService');

const getMembersController = async (req, res, next) => {
    try {
        const members = await getMembers();
        res.json({ success: true, data: members });
    } catch (err) { next(err); }
};

const getTrainersController = async (req, res, next) => {
    try {
        const trainers = await getTrainers();
        res.json({ success: true, data: trainers });
    } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await updatePassword(req.user.id, currentPassword, newPassword);
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) { next(err); }
};

module.exports = { getMembersController, getTrainersController, changePassword };
