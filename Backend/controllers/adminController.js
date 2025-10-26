const User = require('../models/user');

// ✅ Verify a tutor
const verifyTutor = async (req, res) => {
  const { tutorId, verificationType } = req.body;

  try {
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isVerified = true;
    tutor.verificationType = verificationType || 'manual';
    await tutor.save();

    res.status(200).json({ message: 'Tutor verified successfully', tutor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all unverified tutors
const getUnverifiedTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor', isVerified: false });
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all users (optional)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  verifyTutor,
  getUnverifiedTutors,
  getAllUsers,
  deleteUser
};