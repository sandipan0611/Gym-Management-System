const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { changePasswordRules } = require('../validators/authValidator');
const { getMembersController, getTrainersController, changePassword } = require('../controllers/userController');

// GET /api/users/members — admin only
router.get('/members', auth, authorize('admin'), getMembersController);

// GET /api/users/trainers — admin only
router.get('/trainers', auth, authorize('admin'), getTrainersController);

// PUT /api/users/password — any authenticated user
router.put('/password', auth, changePasswordRules, validate, changePassword);

module.exports = router;
