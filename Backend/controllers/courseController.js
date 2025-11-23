const Course = require('../models/course');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Tutor only
const createCourse = async (req, res) => {
  const { title, subject, description, grade, notes, resources } = req.body;
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = new Course({
      title,
      subject,
      description,
      grade,
      notes,
      resources,
      tutor: req.user._id
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all active courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" })
      .populate("tutor", "name email admissionNumber isVerified")
      .select("title subject grade description notes resources lessons");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("tutor", "name email admissionNumber")
      .populate("lessons", "title subject notes resources grade");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Tutor (owner) or Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.role === "tutor" && String(course.tutor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const { title, subject, description, grade, notes, resources, status } = req.body;

    course.title = title || course.title;
    course.subject = subject || course.subject;
    course.description = description || course.description;
    course.grade = grade || course.grade;
    course.notes = notes || course.notes;
    course.resources = resources || course.resources;

    if (req.user.role === "admin" && status) {
      course.status = status;
    }

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add lessons to a course
// @route   PUT /api/courses/:id/lessons
// @access  Tutor only
const addLessonsToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.tutor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { lessonIds } = req.body;
    course.lessons = [...new Set([...course.lessons.map(id => id.toString()), ...lessonIds])];
    await course.save();

    res.json({ message: "Lessons added to course", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get course by tutor and populate lessons
const getCoursesByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    // If tutor role, make sure they can only access their own courses
    if (req.user.role === "tutor" && String(req.user._id) !== tutorId) {
      return res.status(403).json({ message: "Not authorized to view these courses" });
    }

    const courses = await Course.find({ tutor: tutorId })
      .populate("lessons", "title subject notes resources grade")
      .select("title subject grade description notes resources lessons");

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  addLessonsToCourse,
  getCoursesByTutor
};