const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'Web Development' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    tags: [{ type: String }],
    readTime: { type: String, default: '5 min read' },
    author: { type: String, default: 'Rachit Aggarwal' },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    viewsCount: { type: Number, default: 0 },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
