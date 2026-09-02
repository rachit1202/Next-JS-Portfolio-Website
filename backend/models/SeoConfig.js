const mongoose = require('mongoose');

const pageSeoSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true }, // 'home', 'about', 'projects', 'services', 'blogs', 'contact'
    pageName: { type: String, required: true }, // e.g. 'Home Page', 'About Page'
    path: { type: String, default: '/' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: [{ type: String }],
    ogImage: { type: String, default: '' }
  },
  { _id: false }
);

const seoConfigSchema = new mongoose.Schema(
  {
    // Global Branding & Defaults
    siteName: { type: String, default: 'Rachit Aggarwal | Senior Software Developer' },
    defaultTitle: { type: String, default: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer' },
    defaultDescription: { 
      type: String, 
      default: 'Portfolio & Technical Hub of Rachit Aggarwal, Senior Software Developer specializing in Next.js, Node.js, Fastify, MongoDB, WordPress & custom digital solutions.' 
    },
    keywords: [{ type: String }],
    author: { type: String, default: 'Rachit Aggarwal' },
    ogImage: { type: String, default: '/final-logo.png' },
    twitterHandle: { type: String, default: '@rachitaggarwal' },
    linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/' },
    githubUrl: { type: String, default: 'https://github.com/rachit1202' },
    contactEmail: { type: String, default: 'rachitaggarwal1202@gmail.com' },
    contactPhone: { type: String, default: '+91 9873088907' },
    location: { type: String, default: 'Rohini, New Delhi, India' },
    customHeadScripts: { type: String, default: '' },
    permalinkFormat: { type: String, default: '/blogs/:slug' },

    // Page-wise SEO configurations
    pages: [pageSeoSchema]
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('SeoConfig', seoConfigSchema);
