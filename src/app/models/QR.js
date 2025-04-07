//models/QR.js

import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  password: String,
  expiresAt: Date,
  scans: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.QR || mongoose.model('QR', qrSchema);