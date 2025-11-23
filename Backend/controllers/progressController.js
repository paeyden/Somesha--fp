const Progress = require('../models/progress');
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const User = require('../models/user');

// @desc    Create a progress entry for a child + lesson
// @route   POST /api/progress
// @access  Tutor or Admin
const createProgress = async (req, res) => {
  const { childId, lessonId } = req.body;
  try {
    const lesson = await Lesson.findById(lessonId).populate("course");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const enrollment = await Enrollment.findOne({
      child: childId,
      course: lesson.course._id
    });
    if (!enrollment) {
      return res.status(403).json({ message: "Child not enrolled in this course" });
    }

    const progress = new Progress({
      child: childId,
      lesson: lessonId,
      tutor: lesson.createdBy,
      course: lesson.course._id,
      enrollment: enrollment._id,
      status: "not-started"
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update progress entry
// @route   PUT /api/progress/:id
// @access  Tutor or Admin
const updateProgress = async (req, res) => {
  const { status, score, feedback, timeSpent, badgeEarned } = req.body;
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress entry not found' });

    if (req.user.role === 'tutor' && String(progress.tutor) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this progress' });
    }

    progress.status = status || progress.status;
    progress.score = score ?? progress.score;
    progress.feedback = feedback ?? progress.feedback;
    progress.timeSpent = timeSpent ?? progress.timeSpent;
    progress.badgeEarned = badgeEarned ?? progress.badgeEarned;

    if (status === 'completed' && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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

    // Parent ownership check
    if (req.user.role === 'parent' && !req.user.children.includes(child._id)) {
      return res.status(403).json({ message: 'Not authorized to view this child’s progress' });
    }

    // Tutor ownership check
    if (req.user.role === 'tutor') {
      const tutorLessons = await Lesson.find({ createdBy: req.user._id });
      const assignedChildIds = tutorLessons.flatMap(l => l.assignedTo.map(id => id.toString()));
      if (!assignedChildIds.includes(child._id.toString())) {
        return res.status(403).json({ message: 'Not authorized to view this child’s progress' });
      }
    }

    const progressEntries = await Progress.find({ child: child._id })
      .populate('lesson', 'title notes resources')
      .populate('course', 'title subject grade')
      .populate('enrollment', 'status enrolledAt');

    res.status(200).json(progressEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get progress for a course
// @route   GET /api/progress/course/:courseId
// @access  Tutor or Admin
const getProgressByCourse = async (req, res) => {
  try {
    const progressEntries = await Progress.find({ course: req.params.courseId })
      .populate('child', 'name grade')
      .populate('lesson', 'title subject')
      .populate('enrollment', 'status');
    res.status(200).json(progressEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get progress for an enrollment
// @route   GET /api/progress/enrollment/:enrollmentId
// @access  Parent, Tutor, or Admin
const getProgressByEnrollment = async (req, res) => {
  try {
    const progressEntries = await Progress.find({ enrollment: req.params.enrollmentId })
      .populate('child', 'name grade')
      .populate('lesson', 'title notes')
      .populate('course', 'title subject grade');
    res.status(200).json(progressEntries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProgress,
  updateProgress,
  getProgressByChild,
  getProgressByCourse,
  getProgressByEnrollment
};