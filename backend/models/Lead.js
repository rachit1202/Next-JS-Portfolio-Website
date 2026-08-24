const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    serviceNeeded: { type: String, default: 'Web Development' },
    budget: { type: String, default: 'Flexible' },
    message: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    pageUrl: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['New', 'In Progress', 'Contacted', 'Closed'], 
      default: 'New' 
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
