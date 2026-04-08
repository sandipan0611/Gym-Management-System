const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getMembers, getTrainers, changePassword } = require('../controllers/userController');

router.use(auth);

// Admin only lists
router.get('/members', authorize('admin'), getMembers);
router.get('/trainers', authorize('admin'), getTrainers);

// Any authenticated user can change their password
router.put('/password', changePassword);

module.exports = router;
