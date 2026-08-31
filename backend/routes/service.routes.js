const slugify = require('slugify');
const mongoose = require('mongoose');
const Service = require('../models/Service');

async function serviceRoutes(fastify, options) {
  // Public: Get published services with optional category filtering
  fastify.get('/', async (request, reply) => {
    try {
      const { category } = request.query || {};
      const query = { isPublished: true };

      if (category && category !== 'All') {
        query.category = category;
      }

      const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
      return { success: true, count: services.length, data: services };
    } catch (err) {
      console.error('[Services GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Public: Get single service by slug or ID
  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    try {
      const isId = mongoose.Types.ObjectId.isValid(slug);
      const query = isId
        ? { $or: [{ slug }, { _id: slug }] }
        : { slug };

      const service = await Service.findOne(query);
      if (!service) {
        return reply.code(404).send({ error: true, message: 'Service not found in DB.' });
      }

      return { success: true, data: service };
    } catch (err) {
      console.error('[Service Detail GET] DB error:', err.message);
      return reply.code(503).send({ error: true, message: 'Database error: ' + err.message });
    }
  });

  // Admin: Get all services
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const services = await Service.find().sort({ order: 1, createdAt: 1 });
      return { success: true, count: services.length, data: services };
    } catch (err) {
      console.error('[Admin Services GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Admin: Create new service
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.shortDesc || !body.fullDesc) {
      return reply.code(400).send({ error: true, message: 'Title, short description, and full description are required.' });
    }

    const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });

    try {
      const service = await Service.create({ ...body, slug });
      return reply.code(201).send({ success: true, message: 'Service created successfully in DB.', data: service });
    } catch (err) {
      console.error('[Create Service] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to create service in DB: ' + err.message });
    }
  });

  // Admin: Update service
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const body = { ...(request.body || {}) };

    delete body._id;
    delete body.__v;
    delete body.createdAt;
    delete body.updatedAt;

    if (body.slug) {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }

    try {
      const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!service) {
        return reply.code(404).send({ error: true, message: 'Service not found in DB.' });
      }
      return { success: true, message: 'Service updated successfully in DB.', data: service };
    } catch (err) {
      console.error('[Update Service] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to update service in DB: ' + err.message });
    }
  });

  // Admin: Delete service
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    try {
      const service = await Service.findByIdAndDelete(id);
      if (!service) {
        return reply.code(404).send({ error: true, message: 'Service not found in DB.' });
      }
      return { success: true, message: 'Service deleted successfully from DB.' };
    } catch (err) {
      console.error('[Delete Service] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to delete service from DB: ' + err.message });
    }
  });
}

module.exports = serviceRoutes;
