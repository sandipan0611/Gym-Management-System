const { body } = require("express-validator");

exports.hireTrainerValidator = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

exports.assignMemberValidator = [
  body("member_id").isInt(),
  body("trainer_id").optional({ checkFalsy: true }).isInt(),
  body("workout_id").isInt(),
];