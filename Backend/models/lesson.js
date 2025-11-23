const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String },
  description: { type: String },
  grade: { type: String, required: true },
  scheduledDate: { type: Date },

  // Main teaching content
  notes: { type: String }, // markdown or rich text

  // Supporting materials
  resources: [{ type: String }], // links, file URLs, etc.

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  status: { type: String, enum: ["draft","assigned","completed"], default: "assigned" }
}, { timestamps: true });

module.exports = mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);