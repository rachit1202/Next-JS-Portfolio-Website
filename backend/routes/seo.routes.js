const mongoose = require('mongoose');
const SeoConfig = require('../models/SeoConfig');

const defaultSeo = {
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
    try {
      let config = await SeoConfig.findOne().lean();
      if (!config) {
        config = await SeoConfig.create(defaultSeo);
      }
      return { success: true, data: config };
    } catch (err) {
      console.error('[SEO GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: defaultSeo });
    }
  });

  // Admin: Update SEO configuration & site metadata settings
  fastify.put('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = { ...(request.body || {}) };
    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    try {
      let config = await SeoConfig.findOne();
      if (!config) {
        config = await SeoConfig.create({ ...defaultSeo, ...body });
      } else {
        config = await SeoConfig.findByIdAndUpdate(config._id, { $set: body }, { new: true, runValidators: true });
      }
      return { success: true, message: 'SEO settings updated successfully in DB.', data: config };
    } catch (err) {
      console.error('[SEO PUT] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to save SEO settings to DB: ' + err.message });
    }
  });
}

module.exports = seoRoutes;
