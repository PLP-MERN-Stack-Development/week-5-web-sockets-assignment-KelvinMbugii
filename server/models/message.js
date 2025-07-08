const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: String,
  senderId: String,
  message: String,
  isPrivate: Boolean,
  timestamp: Date,
  readBy: [String], 
  reactions: {
    type: Map,
    of: [String],
    default: {},
  },
});

module.exports = mongoose.model('Message', MessageSchema);