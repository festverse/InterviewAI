const mongoose = require('mongoose');

const peerRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  roles: {
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    interviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting'
  },
  interviewType: {
    type: String
  },
  questions: [{
    text: String,
    category: String
  }],
  currentQuestion: {
    type: Number,
    default: 0
  },
  swapped: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PeerRoom', peerRoomSchema);
