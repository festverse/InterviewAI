const User = require('../models/User');

const DAILY_LIMIT = 8;

const checkQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const today = new Date().toDateString();

    if (user.quotaDate !== today) {
      user.quotaDate = today;
      user.quotaUsed = 0;
    }

    if (user.quotaUsed >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: "You've used today's free sessions — come back tomorrow.",
        data: {
          quotaUsed: user.quotaUsed,
          dailyLimit: DAILY_LIMIT,
          resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
        },
      });
    }

    user.quotaUsed += 1;
    await user.save();

    req.quotaRemaining = DAILY_LIMIT - user.quotaUsed;
    next();
  } catch (error) {
    console.error('Quota check error:', error);
    next(error);
  }
};

module.exports = { checkQuota, DAILY_LIMIT };
