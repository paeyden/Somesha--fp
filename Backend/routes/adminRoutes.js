const express = require('express');
const router = express.Router();
const{verifyTutor, getUnverifiedTutors, getAllUsers, deleteUser} = require('../controllers/adminController');
const { protect, authorize} = require('../middleware/authMiddleware');

// PUT /api/admin/verify-tutor/:tutorId → Verify a tutor (Admin only)
router.put('/verify-tutor/:tutorId', protect, authorize, verifyTutor);
// GET /api/admin/unverified-tutors → Get unverified tutors (Admin only)
router.get('/unverified-tutors', protect, authorize, getUnverifiedTutors);
// GET /api/admin/users → Get all users (Admin only)
router.get('/users', protect, authorize, getAllUsers);
// DELETE /api/admin/users/:userId → Delete a user (Admin only)
router.delete('/users/:userId', protect, authorize, deleteUser);

module.exports = router;