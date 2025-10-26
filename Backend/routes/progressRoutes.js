const express = require('express');
const router = express.Router();
const {updateProgress, getProgressByChild} = require('../controllers/progressController');
const {protect, restrictToTutor,  restrictToParent} = require('../middleware/authMiddleware');

// PUT /api/progress/:id → Update a progress entry (Tutor or Admin)
router.put('/:id', protect, restrictToTutor, updateProgress);
// GET /api/progress/child/:childId → Get progress for a child (Parent, Tutor, or Admin)
router.get('/child/:childId', protect, restrictToParent, restrictToTutor, getProgressByChild);

module.exports = router;