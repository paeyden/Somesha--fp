const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const User = require('../models/user');

// @desc    Enroll a child into a course
// @route   POST /api/enrollments
// @access  Parent or Admin
const createEnrollment = async (req, res) => {
  const { childId, courseId } = req.body;

  try {
    if (req.user.role !== "parent" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(courseId).populate("lessons");
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Parent ownership check
    if (req.user.role === "parent" && !req.user.children.includes(childId)) {
      return res.status(403).json({ message: "Not authorized to enroll this child" });
    }

    const enrollment = new Enrollment({
      tutor: course.tutor,           // store tutor's User ID
      child: childId,                // store child's User ID
      parent: req.user._id,          // store parent's User ID
      course: courseId,              // store course ID
      lessons: course.lessons,       // automatically assign all lessons from course
      status: "active"
    });

    await enrollment.save();
    res.status(201).json(enrollment);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get enrollments for a child
// @route   GET /api/enrollments/child/:childId
// @access  Parent, Tutor, or Admin
const getEnrollmentsByChild = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ child: req.params.childId })
      .populate({
        path: "course",
        select: "title subject grade lessons",
        populate: {
          path: "lessons",
          select: "title subject grade description notes resources"
        }
      })
      .populate("tutor", "name email admissionNumber")
      .populate("parent", "name email admissionNumber");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Get enrollments for a tutor
// @route   GET /api/enrollments/tutor/:tutorId
// @access  Tutor or Admin
const getEnrollmentsByTutor = async (req, res) => {
  try {
    const tutorProfile = await Tutor.findOne({ user: req.user._id });
    if (!tutorProfile)
      return res.status(404).json({ message: "Tutor profile not found" });

    if (req.user.role === "tutor" && tutorProfile._id.toString() !== req.params.tutorId) {
      return res.status(403).json({ message: "Not authorized to view other tutors’ enrollments" });
    }

    const enrollments = await Enrollment.find({ tutor: tutorProfile._id })
      .populate("child", "name grade admissionNumber")
      .populate("lessons", "title subject grade description resources") // populate lessons
      .populate("parent", "name email admissionNumber")
      .populate("course", "title subject grade");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get enrollments for a parent
// @route   GET /api/enrollments/parent/:parentId
// @access  Parent (self) or Admin
const getEnrollmentsByParent = async (req, res) => {
  try {
    const parentId = req.user.role === "parent" ? req.user._id : req.params.parentId;

    const enrollments = await Enrollment.find({ parent: parentId })
      .populate({
        path: "course",
        select: "title subject grade lessons",
        populate: { path: "lessons", select: "title subject grade description resources" }
      })
      .populate("child", "name grade admissionNumber")
      .populate("tutor", "name email admissionNumber");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Tutor or Admin
const updateEnrollment = async (req, res) => {
  const { status } = req.body;
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    // Only tutor of the enrollment or admin can update
    if (req.user.role === "tutor" && String(enrollment.tutor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this enrollment" });
    }
    if (status) enrollment.status = status;
    await enrollment.save();
    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  createEnrollment,
  getEnrollmentsByChild,
  getEnrollmentsByTutor,
  getEnrollmentsByParent,
  updateEnrollment
};
