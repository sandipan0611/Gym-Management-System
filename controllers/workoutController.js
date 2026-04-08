const { getAllWorkouts, getMemberWorkouts } = require('../services/workoutService');

const getWorkouts = async (req, res, next) => {
    try {
        const workouts = await getAllWorkouts();
        res.json({ success: true, data: workouts });
    } catch (err) { next(err); }
};

const getMemberWorkoutsController = async (req, res, next) => {
    try {
        const member_id = req.user.role === 'member' ? req.user.id : req.params.member_id;
        const workouts = await getMemberWorkouts(member_id);
        res.json({ success: true, data: workouts });
    } catch (err) { next(err); }
};

module.exports = { getWorkouts, getMemberWorkoutsController };
