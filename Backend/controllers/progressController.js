const Progress = require('../models/progress');
const Lesson = require('../models/lesson');
const User = require('../models/user');

// @desc    Update progress entry
// @route   PUT /api/progress/:id
// @access  Tutor or Admin
const updateProgress = async (req, res) => {
  const { status, score, feedback, timeSpent, badgeEarned } = req.body;

  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress entry not found' });

    // Optional: check if user is allowed to update this progress
    if (req.user.role !== 'tutor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update progress' });
    }

    // Update fields
    progress.status = status || progress.status;
    progress.score = score ?? progress.score;
    progress.feedback = feedback ?? progress.feedback;
    progress.timeSpent = timeSpent ?? progress.timeSpent;
    progress.badgeEarned = badgeEarned ?? progress.badgeEarned;

    // If status is completed, set completedAt
    if (status === 'completed' && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get progress for a child
// @route   GET /api/progress/child/:childId
// @access  Parent, Tutor, or Admin
const getProgressByChild = async (req, res) => {
  try {
    const child = await User.findById(req.params.childId);
    if (!child || child.role !== 'child') {
      return res.status(404).json({ message: 'Child not found' });
    }

    const progressEntries = await Progress.find({ child: child._id }).populate('lesson');
    res.status(200).json(progressEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateProgress,
  getProgressByChild
};