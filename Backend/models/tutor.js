const mongoose = require('mongoose');
const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subjects: [{ type: String }],
  grades: [{ type: String }],
  bio: String,
  experience: Number,
  qualifications: [{ type: String }],
  status: { type: String, enum: ["pending","active","suspended"], default: "pending" },

  // Relationships
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // children
  reviews: [
    {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);