const express = require('express');
const router = express.Router();
const {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors
} = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create tutor profile (after registering as User with role=tutor)
router.post('/', protect, authorize('tutor'), createTutorProfile);

// Get all active tutors (parents can browse)
router.get('/', getAllTutors);

// Get a specific tutor profile
router.get('/:id', getTutorProfile);

// Update tutor profile (self or admin)
router.put('/:id', protect, authorize('tutor','admin'), updateTutorProfile);

module.exports = router;