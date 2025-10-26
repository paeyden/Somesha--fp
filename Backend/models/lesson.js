// created by the tutor and assigned to children
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    subject: {type: String, required: true},
    grade: {type: String, required: true},
    tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // array of child user IDs
    scheduledDate: {type: Date, required: true},
    status: {type: String, enum: ['assigned', 'in-progress', 'completed'], default: 'assigned'},
    resources: [{type: String}], // URLs or resource identifiers
}, {timestamps: true});
module.exports = mongoose.model('Lesson', lessonSchema);