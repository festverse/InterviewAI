const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  targetRole: {
    type: String,
    default: '',
    trim: true,
  },
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead'],
    default: 'junior',
  },
  stats: {
    sessionsCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
  },
  eloRating: {
    type: Number,
    default: 1200,
  },
  quotaDate: {
    type: String,
    default: '',
  },
  quotaUsed: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Never return passwordHash in JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

// Helper to get safe user data for API responses
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    targetRole: this.targetRole,
    experienceLevel: this.experienceLevel,
    stats: this.stats,
    eloRating: this.eloRating,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
