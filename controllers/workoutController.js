const workoutService = require('../services/workoutService');

const getWorkouts = async (req, res, next) => {
    try {
        const workouts = await workoutService.getWorkouts();
        res.json({ success: true, data: workouts });
    } catch (err) {
        next(err);
    }
};

const assignWorkout = async (req, res, next) => {
    try {
        const result = await workoutService.assignWorkout(req.user, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

const getMemberWorkouts = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        const data = await workoutService.getMemberWorkouts(req.user, member_id);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

module.exports = { getWorkouts, assignWorkout, getMemberWorkouts };
