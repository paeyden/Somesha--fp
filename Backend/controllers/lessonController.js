const Lesson = require('../models/lesson');

// @desc    Create a new lesson with notes/resources
// @route   POST /api/lessons
// @access  Tutor only
const createLesson = async (req, res) => {
  const { title, subject, description, grade, scheduledDate, notes, resources } = req.body;
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const newLesson = new Lesson({
      title,
      subject,
      description,
      grade,
      scheduledDate,
      notes,
      resources,
      createdBy: req.user._id
    });

    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get lessons by grade
// @route   GET /api/lessons/grade/:grade
// @access  Public (children/parents can view)
const getLessonsByGrade = async (req, res) => {
  try {
    const lessons = await Lesson.find({ grade: req.params.grade });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get lessons created by a tutor
// @route   GET /api/lessons/tutor/:tutorId
// @access  Tutor or Admin
const getLessonsByTutor = async (req, res) => {
  try {
    if (req.user.role !== "tutor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tutorId = req.params.tutorId;
    if (req.user.role === "tutor" && String(tutorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view other tutors’ lessons" });
    }

    const lessons = await Lesson.find({ createdBy: tutorId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Tutor only
const updateLesson = async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (String(lesson.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    const { title, subject, description, grade, scheduledDate, notes, resources } = req.body;

    lesson.title = title || lesson.title;
    lesson.subject = subject || lesson.subject;
    lesson.description = description || lesson.description;
    lesson.grade = grade || lesson.grade;
    lesson.scheduledDate = scheduledDate || lesson.scheduledDate;
    lesson.notes = notes || lesson.notes;
    lesson.resources = resources || lesson.resources;

    await lesson.save();
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign lesson to children
// @route   POST /api/lessons/:id/assign
// @access  Tutor only
const assignLesson = async (req, res) => {
  const { studentIds } = req.body;
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (String(lesson.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to assign this lesson" });
    }

    lesson.assignedTo = [...new Set([...lesson.assignedTo.map(id => id.toString()), ...studentIds])];
    await lesson.save();

    res.json({ message: "Lesson assigned successfully", lesson });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLesson,
  getLessonsByGrade,
  getLessonsByTutor,
  updateLesson,
  assignLesson
};