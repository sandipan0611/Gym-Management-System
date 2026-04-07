const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTrainers, hireTrainer, fireTrainer, replaceTrainer, assignMember, getMembers } = require('../controllers/adminController');

// Ensure only admins can hit these routes
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin authorization denied' });
    }
    next();
};

router.get('/trainers', [auth, adminAuth], getTrainers);
router.post('/trainers', [auth, adminAuth], hireTrainer);
router.put('/trainers/:id/fire', [auth, adminAuth], fireTrainer);
router.post('/trainers/:id/replace', [auth, adminAuth], replaceTrainer);
router.get('/members', [auth, adminAuth], getMembers);
router.post('/assignments', [auth, adminAuth], assignMember);

module.exports = router;
