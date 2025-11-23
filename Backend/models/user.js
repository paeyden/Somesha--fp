const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["parent", "child", "tutor", "admin"],
    required: true,
  },

  admissionNumber: { type: String, unique: true }, // NEW

  // Parent-specific
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Child-specific
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // NEW
  enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" }],
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Progress" }],

  // Tutor-specific
  tutorProfile: {
    subjects: [String],
    bio: String,
    experience: Number,
    verified: { type: Boolean, default: false },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // optional convenience
  },

  // Admin-specific
  isSuperAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);