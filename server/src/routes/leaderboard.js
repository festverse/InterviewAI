const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ eloRating: -1 })
      .skip(skip)
      .limit(limit)
      .select('name eloRating stats.sessionsCompleted -_id'); // Exclude _id to prevent leaking User ID publicly

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        leaderboard: users,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard.',
    });
  }
});

module.exports = router;
