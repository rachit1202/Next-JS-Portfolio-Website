const mongoose = require('mongoose');
const SeoConfig = require('../models/SeoConfig');

let inMemorySeo = {
  siteName: 'Rachit Aggarwal | Senior Software Developer',
  defaultTitle: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer',
  defaultDescription: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.',
  keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js', 'Fastify', 'MERN Stack'],
  contactEmail: 'rachitaggarwal1202@gmail.com',
  contactPhone: '+91 9873088907',
  location: 'Rohini, New Delhi, India'
};

async function seoRoutes(fastify, options) {
  // Public: Get dynamic SEO configuration & meta settings
  fastify.get('/', async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        let config = await SeoConfig.findOne();
        if (!config) {
          config = await SeoConfig.create(inMemorySeo);
        }
        return { success: true, data: config };
      } catch (e) {
        console.warn('[SEO Get Error] DB failed, using memory fallback:', e.message);
      }
    }
    return { success: true, data: inMemorySeo };
  });

  // Admin: Update SEO configuration & site metadata settings
  fastify.put('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    inMemorySeo = { ...inMemorySeo, ...body };

    if (mongoose.connection.readyState === 1) {
      try {
        let config = await SeoConfig.findOne();
        if (!config) {
          config = new SeoConfig(body);
        } else {
          Object.assign(config, body);
        }
        await config.save();
        return { success: true, message: 'SEO settings updated successfully.', data: config };
      } catch (e) {
        console.warn('[SEO Update Error] DB failed:', e.message);
      }
    }
    return { success: true, message: 'SEO settings updated successfully.', data: inMemorySeo };
  });
}

module.exports = seoRoutes;
