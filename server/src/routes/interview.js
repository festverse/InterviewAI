const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkQuota } = require('../middleware/quota');
const InterviewSession = require('../models/InterviewSession');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const PeerRoom = require('../models/PeerRoom');
const questionService = require('../services/questionService');
const feedbackService = require('../services/feedbackService');

// GET /api/interview/peer/current
router.get('/peer/current', auth, async (req, res) => {
  try {
    const room = await PeerRoom.findOne({
      participants: req.userId,
      status: { $ne: 'completed' }
    });
    res.json({ success: true, data: room ? { roomId: room.roomId, type: room.interviewType } : null });
  } catch (error) {
    console.error('Get current peer room error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/interview/start
router.post('/start', auth, checkQuota, async (req, res) => {
  try {
    const { type, targetRole, experienceLevel, count } = req.body;
    const questions = await questionService.generateQuestions(type, targetRole, experienceLevel, count);
    
    const session = new InterviewSession({
      userId: req.userId,
      type,
      targetRole,
      experienceLevel,
      questions,
      transcript: []
    });
    await session.save();

    res.json({ success: true, data: { sessionId: session._id, questions } });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ success: false, message: 'Failed to start interview.' });
  }
});

// POST /api/interview/:sessionId/submit
router.post('/:sessionId/submit', auth, async (req, res) => {
  try {
    const { questionIndex, answer, duration } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    
    session.transcript.push({ questionIndex, answer, duration });
    await session.save();

    res.json({ success: true, message: 'Transcript appended successfully' });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
});

// POST /api/interview/:sessionId/analyze
router.post('/:sessionId/analyze', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    
    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Session already completed' });
    }

    const feedbackData = await feedbackService.analyzeTranscript(session.questions, session.transcript, session.type, session.targetRole);
    
    const feedback = new Feedback({
      sessionId: session._id,
      userId: req.userId,
      ...feedbackData
    });
    await feedback.save();
    
    session.status = 'completed';
    await session.save();

    const user = await User.findById(req.userId);
    user.stats.sessionsCompleted += 1;
    // Calculate new average score
    const allFeedbacks = await Feedback.find({ userId: req.userId });
    const totalScore = allFeedbacks.reduce((sum, f) => sum + (f.overallScore || 0), 0);
    user.stats.averageScore = allFeedbacks.length > 0 ? (totalScore / allFeedbacks.length) : 0;
    await user.save();

    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Analyze session error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze session' });
  }
});

// GET /api/interview/sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ success: false, message: 'Failed to get sessions' });
  }
});

// GET /api/interview/sessions/:sessionId
router.get('/sessions/:sessionId', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const feedback = await Feedback.findOne({ sessionId: session._id });
    res.json({ success: true, data: { session, feedback } });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ success: false, message: 'Failed to get session details' });
  }
});

module.exports = router;
