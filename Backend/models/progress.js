const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  child: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🔗 Tie progress to enrollment & course
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },

  status: { type: String, enum: ["not-started","in-progress","completed"], default: "not-started" },
  score: Number,
  feedback: String,
  timeSpent: Number,
  badgeEarned: String,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.models.Progress || mongoose.model("Progress", progressSchema);