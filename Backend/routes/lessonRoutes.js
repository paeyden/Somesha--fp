const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLessonsByGrade,
  getLessonsByTutor,
  updateLesson,
  assignLesson
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tutor creates a lesson with notes/resources
router.post('/', protect, authorize('tutor'), createLesson);

// Get lessons by grade (public)
router.get('/grade/:grade', getLessonsByGrade);

// Get lessons created by a tutor
router.get('/tutor/:tutorId', protect, authorize('tutor','admin'), getLessonsByTutor);

// Update a lesson
router.put('/:id', protect, authorize('tutor'), updateLesson);

// Assign lesson to children
router.post('/:id/assign', protect, authorize('tutor'), assignLesson);

module.exports = router;