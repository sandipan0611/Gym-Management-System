const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { hireTrainerRules, assignMemberRules } = require('../validators/adminValidator');
const { getTrainers, getMembers, hireTrainer, fireTrainer, replaceTrainer, assignMember } = require('../controllers/adminController');

// GET /api/admin/trainers
router.get('/trainers', auth, authorize('admin'), getTrainers);

// POST /api/admin/trainers
router.post('/trainers', auth, authorize('admin'), hireTrainerRules, validate, hireTrainer);

// PUT /api/admin/trainers/:id/fire
router.put('/trainers/:id/fire', auth, authorize('admin'), fireTrainer);

// POST /api/admin/trainers/:id/replace
router.post('/trainers/:id/replace', auth, authorize('admin'), replaceTrainer);

// GET /api/admin/members
router.get('/members', auth, authorize('admin'), getMembers);

// POST /api/admin/assignments
router.post('/assignments', auth, authorize('admin'), assignMemberRules, validate, assignMember);

module.exports = router;
