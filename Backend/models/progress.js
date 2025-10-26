// links child to their progress in lessons
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    child: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    lesson: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true},
    status: {type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started'},
    score: {type: Number, min: 0, max: 100},
    completedAt: {type: Date},
    feedback: {type: String},
    badgesEarned: [{type: String}], // array of badge identifiers
    timeSpent: {type: Number, default: 0} // time spent in minutes
}, {timestamps: true});
module.exports = mongoose.model('Progress', progressSchema);