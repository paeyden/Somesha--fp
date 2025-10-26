const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLessonsByGrade,
  updateLesson
} = require('../controllers/lessonController');
const {protect, restrictToTutor} = require('../middleware/authMiddleware');

// POST /api/lessons → Create a new lesson (Tutor only)
router.post('/', protect, restrictToTutor , createLesson);

// GET /api/lessons/grade/:grade → Get lessons by grade (All authenticated users)
router.get('/grade/:grade', protect, restrictToTutor, getLessonsByGrade);

// PUT /api/lessons/:id → Update a lesson (Tutor only)
router.put('/:id', protect, restrictToTutor, updateLesson);

module.exports = router;