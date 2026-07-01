const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scores: {
    clarity: { type: Number, min: 1, max: 10 },
    technicalDepth: { type: Number, min: 1, max: 10 },
    structure: { type: Number, min: 1, max: 10 },
    fillerWords: { type: Number, min: 1, max: 10 },
    pacing: { type: Number, min: 1, max: 10 },
  },
  overallScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  suggestions: [{
    type: String,
  }],
  perQuestion: [{
    questionIndex: Number,
    score: { type: Number, min: 1, max: 10 },
    feedback: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
