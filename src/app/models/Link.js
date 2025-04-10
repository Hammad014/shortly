//models/Link.js

import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  deviceType: String,
  os: String,
  browser: String,
  countryCode: { type: String, default: 'Unknown' }
});

const linkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  fullShortUrl: { type: String, required: true },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9_-]{3,20}$/.test(v);
      },
      message: 'Alias must be 3-20 lowercase characters (a-z, 0-9, _, -)'
    }
  },
  clicks: [clickSchema],
  totalClicks: { type: Number, default: 0 },
  uniqueVisitors: [String],
  date: { type: Date, default: Date.now },
  sessionId: { type: String, required: true },

  domain: {
    type: String,
    required: true,
    default: process.env.NEXT_PUBLIC_BASE_URL
  },
  
  expirationType: {
    type: String,
    enum: ['none', 'datetime', 'clicks'],
    default: 'none'
  },
  expiresAt: Date,
  expireAfterClicks: Number,
  status: {
    type: String,
    enum: ['active', 'expired'],
    default: 'active'
  },
  bulkBatchId: String,
  source: {
    type: String,
    enum: ['single', 'bulk'],
    default: 'single'
  },
});

linkSchema.index({ sessionId: 1, bulkBatchId: 1 });

linkSchema.pre('save', function(next) {
  if (this.expirationType === 'datetime' && this.expiresAt) {
    if (new Date(this.expiresAt) < new Date()) {
      this.status = 'expired';
    }
  }
  
  if (this.expirationType === 'clicks' && this.expireAfterClicks) {
    if (this.totalClicks >= this.expireAfterClicks) {
      this.status = 'expired';
    }
  }
  next();
});

const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);
export default Link;