const {
    getAllTrainers, getAllMembers, createTrainer,
    removeTrainer, substituteTrainer, upsertMemberAssignment
} = require('../services/adminService');

const getTrainers = async (req, res, next) => {
    try {
        const trainers = await getAllTrainers();
        res.json({ success: true, data: trainers });
    } catch (err) { next(err); }
};

const getMembers = async (req, res, next) => {
    try {
        const members = await getAllMembers();
        res.json({ success: true, data: members });
    } catch (err) { next(err); }
};

const hireTrainer = async (req, res, next) => {
    try {
        await createTrainer(req.body);
        res.status(201).json({ success: true, message: 'Trainer hired successfully' });
    } catch (err) { next(err); }
};

const fireTrainer = async (req, res, next) => {
    try {
        await removeTrainer(req.params.id);
        res.json({ success: true, message: 'Trainer removed and assignments cleared' });
    } catch (err) { next(err); }
};

const replaceTrainer = async (req, res, next) => {
    try {
        await substituteTrainer(req.params.id, req.body);
        res.status(201).json({ success: true, message: 'Replacement successful' });
    } catch (err) { next(err); }
};

const assignMember = async (req, res, next) => {
    try {
        await upsertMemberAssignment(req.body);
        res.json({ success: true, message: 'Assignment updated' });
    } catch (err) { next(err); }
};

module.exports = { getTrainers, getMembers, hireTrainer, fireTrainer, replaceTrainer, assignMember };
