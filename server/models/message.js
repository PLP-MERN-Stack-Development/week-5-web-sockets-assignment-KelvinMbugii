const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: String,
    senderId: String,
    message: String,
    isPrivate: { type: Boolean, default: false },
    to: String,
    timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Message', MessageSchema);