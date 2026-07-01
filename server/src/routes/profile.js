const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { profileUpdateSchema, validate } = require('../utils/validators');

const router = express.Router();

// GET /api/profile
router.get('/', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

// PUT /api/profile
router.put('/', auth, validate(profileUpdateSchema), async (req, res) => {
  try {
    const { name, targetRole, experienceLevel } = req.body;
    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (targetRole !== undefined) updateFields.targetRole = targetRole;
    if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

module.exports = router;
