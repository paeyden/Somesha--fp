const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Math Grade 7"
  description: String,
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Lessons inside the course
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],

  // Notes (syllabus or overview)
  notes: { type: String },

  // Supporting resources
  resources: [{ type: String }],

  status: { type: String, enum: ["draft","active","archived"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);