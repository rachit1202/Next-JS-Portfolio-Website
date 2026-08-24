const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, default: 'Full-Stack' },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    techStack: [{ type: String }],
    clientName: { type: String, default: '' },
    role: { type: String, default: 'Senior Web Developer' },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    engineeringQuality: { type: String, default: 'Delivered with Core Web Vitals 95+ score, responsive mobile-first UI, secure API authentication, and structured dynamic metadata.' },
    customCtaHeading: { type: String, default: '' },
    customCtaSubtitle: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
