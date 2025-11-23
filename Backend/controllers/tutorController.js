const Tutor = require('../models/tutor');

// @desc    Create tutor profile (after user registers as tutor)
// @route   POST /api/tutors
// @access  Tutor only
const createTutorProfile = async (req, res) => {
  try {
    if (req.user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { subjects, grades, bio, experience, qualifications } = req.body;

    const tutorProfile = new Tutor({
      user: req.user._id,
      subjects,
      grades,
      bio,
      experience,
      qualifications
    });

    await tutorProfile.save();
    res.status(201).json(tutorProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get tutor profile
// @route   GET /api/tutors/:id
// @access  Public
const getTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .populate("user", "name email isVerified")
      .populate("lessons", "title subject grade")
      .populate("students", "name grade");

    if (!tutor) return res.status(404).json({ message: "Tutor not found" });
    res.status(200).json(tutor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update tutor profile
// @route   PUT /api/tutors/:id
// @access  Tutor only (self) or Admin
const updateTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    if (req.user.role === "tutor" && String(tutor.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    const { subjects, grades, bio, experience, qualifications, status } = req.body;

    tutor.subjects = subjects || tutor.subjects;
    tutor.grades = grades || tutor.grades;
    tutor.bio = bio || tutor.bio;
    tutor.experience = experience || tutor.experience;
    tutor.qualifications = qualifications || tutor.qualifications;

    if (req.user.role === "admin" && status) {
      tutor.status = status; // only admin can change status
    }

    await tutor.save();
    res.status(200).json(tutor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all tutors (for parent search)
// @route   GET /api/tutors
// @access  Public
const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find()
      .populate("user", "name email isVerified")
      .select("subjects grades bio experience qualifications reviews");
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors
};