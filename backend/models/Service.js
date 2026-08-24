const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      default: 'Development',
      enum: ['Development', 'Designing', 'Maintenance', 'Cyber Security', 'Security', 'SEO', 'Consultation'],
    },
    icon: { type: String, default: 'Code' },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String, required: true },
    features: [{ type: String }],
    deliverables: [{ type: String }],
    techStack: [{ type: String }],
    processSteps: [
      {
        stepNumber: { type: Number },
        title: { type: String },
        description: { type: String }
      }
    ],
    priceEstimate: { type: String, default: 'Custom Quote' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
