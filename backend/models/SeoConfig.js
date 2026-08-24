const mongoose = require('mongoose');

const seoConfigSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Rachit Aggarwal | Senior Software Developer' },
    defaultTitle: { type: String, default: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer' },
    defaultDescription: { 
      type: String, 
      default: 'Portfolio & Technical Hub of Rachit Aggarwal, Senior Software Developer specializing in Next.js, Node.js, Fastify, MongoDB, WordPress & custom digital solutions.' 
    },
    keywords: [{ type: String }],
    author: { type: String, default: 'Rachit Aggarwal' },
    ogImage: { type: String, default: '/og-cover.png' },
    twitterHandle: { type: String, default: '@rachitaggarwal' },
    linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248' },
    githubUrl: { type: String, default: 'https://github.com/rachitaggarwal' },
    contactEmail: { type: String, default: 'rachitaggarwal1202@gmail.com' },
    contactPhone: { type: String, default: '+91 9873088907' },
    location: { type: String, default: 'Rohini, New Delhi, India' },
    customHeadScripts: { type: String, default: '' },
    permalinkFormat: { type: String, default: '/blogs/:slug' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SeoConfig', seoConfigSchema);
