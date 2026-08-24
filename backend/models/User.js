const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, default: 'Rachit Aggarwal' },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
