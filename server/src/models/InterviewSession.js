const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral'],
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead'],
    required: true,
  },
  questions: [{
    text: String,
    category: String,
    difficulty: String,
  }],
  transcript: [{
    questionIndex: Number,
    answer: String,
    duration: Number,
  }],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
