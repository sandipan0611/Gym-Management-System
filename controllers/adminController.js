const adminService = require('../services/adminService');

const getTrainers = async (req, res, next) => {
    try {
        const trainers = await adminService.getTrainers();
        res.json({ success: true, data: trainers });
    } catch (err) {
        next(err);
    }
};

const hireTrainer = async (req, res, next) => {
    try {
        const result = await adminService.hireTrainer(req.body);
        res.status(201).json({ success: true, message: result.msg });
    } catch (err) {
        next(err);
    }
};

const fireTrainer = async (req, res, next) => {
    try {
        const result = await adminService.fireTrainer(req.params.id);
        res.json({ success: true, message: result.msg });
    } catch (err) {
        next(err);
    }
};

const replaceTrainer = async (req, res, next) => {
    try {
        const result = await adminService.replaceTrainer(req.params.id, req.body);
        res.status(201).json({ success: true, message: result.msg });
    } catch (err) {
        next(err);
    }
};

const assignMember = async (req, res, next) => {
    try {
        const result = await adminService.assignMember(req.body);
        res.json({ success: true, message: result.msg });
    } catch (err) {
        next(err);
    }
};

const getMembers = async (req, res, next) => {
    try {
        const members = await adminService.getMembers();
        res.json({ success: true, data: members });
    } catch (err) {
        next(err);
    }
};

module.exports = { 
    getTrainers, 
    hireTrainer, 
    fireTrainer, 
    replaceTrainer, 
    assignMember, 
    getMembers 
};
