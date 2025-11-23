const express = require('express');
const router = express.Router();
const {
  createProgress,
  updateProgress,
  getProgressByChild,
  getProgressByCourse,
  getProgressByEnrollment
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create a progress entry (tutor/admin)
router.post('/', protect, authorize('tutor','admin'), createProgress);

// Update a progress entry (tutor/admin)
router.put('/:id', protect, authorize('tutor','admin'), updateProgress);

// Get progress for a child (parent/tutor/admin)
router.get('/child/:childId', protect, authorize('parent','tutor','admin'), getProgressByChild);

// Get progress for a course (tutor/admin)
router.get('/course/:courseId', protect, authorize('tutor','admin'), getProgressByCourse);

// Get progress for an enrollment (parent/tutor/admin)
router.get('/enrollment/:enrollmentId', protect, authorize('parent','tutor','admin'), getProgressByEnrollment);

module.exports = router;