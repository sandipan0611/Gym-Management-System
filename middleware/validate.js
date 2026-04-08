const { validationResult } = require('express-validator');

/**
 * Runs express-validator checks and short-circuits with 400 if any fail.
 * Place after your validator rule arrays in route definitions.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg,
            errors: errors.array(),
        });
    }
    next();
};

module.exports = validate;
