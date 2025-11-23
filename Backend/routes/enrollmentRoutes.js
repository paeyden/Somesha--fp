const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  getEnrollmentsByChild,
  getEnrollmentsByTutor,
  getEnrollmentsByParent,
  updateEnrollment
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware'); // JWT auth middleware

// @route   POST /api/enrollments
// @desc    Enroll a child into a course
// @access  Parent or Admin
router.post('/', protect, createEnrollment);

// @route   GET /api/enrollments/child/:childId
// @desc    Get enrollments for a child
// @access  Parent, Tutor, or Admin
router.get('/child/:childId', protect, getEnrollmentsByChild);

// @route   GET /api/enrollments/tutor/:tutorId
// @desc    Get enrollments for a tutor
// @access  Tutor or Admin
router.get('/tutor/:tutorId', protect, getEnrollmentsByTutor);

// @route   GET /api/enrollments/parent/:parentId
// @desc    Get enrollments for a parent
// @access  Parent (self) or Admin
router.get('/parent/:parentId', protect, getEnrollmentsByParent);

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment status
// @access  Tutor or Admin
router.put('/:id', protect, updateEnrollment);

module.exports = router;