const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    role: {type: String, enum: ['child', 'tutor', 'parent', 'admin'], required: true},
    grade:{type: String},
    tscNumber: { type: String },       // for TSC-registered tutors
    nationalID: { type: String },      // required for all tutors
    isVerified: { type: Boolean, default: false }, // admin approval
    verificationType: { type: String, enum: ['tsc', 'manual'], default: 'manual' }, // how they were verified
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);