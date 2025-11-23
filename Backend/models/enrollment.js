const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  child: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  status: { type: String, enum: ["active","completed","dropped"], default: "active" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  enrolledAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);