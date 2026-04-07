const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMembers, getTrainers, changePassword } = require('../controllers/userController');

router.get('/members', auth, getMembers);
router.get('/trainers', auth, getTrainers);
router.put('/password', auth, changePassword);

module.exports = router;
