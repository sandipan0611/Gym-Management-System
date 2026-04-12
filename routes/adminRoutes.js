const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { hireTrainerValidator, assignMemberValidator } = require('../validators/adminValidator');
const { getTrainers, hireTrainer, fireTrainer, replaceTrainer, assignMember, getMembers, getSuggestedTrainer } = require('../controllers/adminController');

// All routes here require admin role
router.use(auth);
router.use(authorize('admin'));

router.get('/trainers', getTrainers);
router.post('/trainers', hireTrainerValidator, validate, hireTrainer);
router.put('/trainers/:id/fire', fireTrainer);
router.post('/trainers/:id/replace', hireTrainerValidator, validate, replaceTrainer);
router.get('/members', getMembers);
router.post('/assignments', assignMemberValidator, validate, assignMember);
router.get('/suggested-trainer', getSuggestedTrainer);

module.exports = router;
