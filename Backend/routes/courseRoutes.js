const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  addLessonsToCourse,
  getCoursesByTutor
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tutor creates a course
router.post('/', protect, authorize('tutor'), createCourse);

// Get all active courses (public: parents/children can browse)
router.get('/', getCourses);

// Get a single course by ID (public)
router.get('/:id', getCourseById);

// Update a course (tutor owner or admin)
router.put('/:id', protect, authorize('tutor','admin'), updateCourse);

// Add lessons to a course (tutor owner)
router.put('/:id/lessons', protect, authorize('tutor'), addLessonsToCourse);

// Get courses by tutor (tutor owner or admin)
router.get('/tutor/:tutorId', protect, authorize('tutor','admin'), getCoursesByTutor);

module.exports = router;