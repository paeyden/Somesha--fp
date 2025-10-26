// Message schema definition using Mongoose
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    read: {type: Boolean, default: false},
    type: {type: String, enum: ['text', 'image', 'video', 'file'], default: 'text'},
    attachments: [{type: String}], // array of attachment URLs or identifiers
}, {timestamps: true});
module.exports = mongoose.model('Message', messageSchema);