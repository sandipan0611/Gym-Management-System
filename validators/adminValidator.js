const { body } = require('express-validator');

const hireTrainerRules = [
    body('name').notEmpty().withMessage('Trainer name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('age').isInt({ min: 18, max: 80 }).withMessage('Age must be between 18 and 80'),
    body('specialization').notEmpty().withMessage('Specialization is required'),
];

const assignMemberRules = [
    body('member_id').isInt({ min: 1 }).withMessage('Valid member ID is required'),
    body('trainer_id').isInt({ min: 1 }).withMessage('Valid trainer ID is required'),
    body('workout_id').isInt({ min: 1 }).withMessage('Valid workout ID is required'),
];

module.exports = { hireTrainerRules, assignMemberRules };
