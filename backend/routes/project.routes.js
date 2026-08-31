const slugify = require('slugify');
const mongoose = require('mongoose');
const Project = require('../models/Project');

async function projectRoutes(fastify, options) {
  // Public: Get published projects with filtering and pagination
  fastify.get('/', async (request, reply) => {
    try {
      const { category, featured, limit, page = 1 } = request.query || {};

      const query = { isPublished: true };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (featured === 'true') {
        query.featured = true;
      }

      const total = await Project.countDocuments(query);
      let dbQuery = Project.find(query).sort({ order: 1, createdAt: -1 });

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = limit ? parseInt(limit, 10) : 0;

      if (limitNum > 0) {
        dbQuery = dbQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
      }

      const projects = await dbQuery;
      const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

      return {
        success: true,
        count: projects.length,
        total,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum || total,
          totalPages: totalPages || 1,
          hasPrev: pageNum > 1,
          hasNext: pageNum < totalPages
        },
        data: projects
      };
    } catch (err) {
      console.error('[Projects GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Public: Get single project by slug or ID
  fastify.get('/:slug', async (request, reply) => {
    const param = request.params.slug;
    try {
      const isId = mongoose.Types.ObjectId.isValid(param);
      const query = isId
        ? { $or: [{ slug: param }, { _id: param }] }
        : { slug: param };

      const project = await Project.findOne(query);
      if (!project) {
        return reply.code(404).send({ error: true, message: 'Project not found.' });
      }
      return { success: true, data: project };
    } catch (err) {
      console.error('[Project Detail GET] DB error:', err.message);
      return reply.code(503).send({ error: true, message: 'Database error: ' + err.message });
    }
  });

  // Admin: Get all projects
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const projects = await Project.find().sort({ order: 1, createdAt: -1 });
      return { success: true, count: projects.length, data: projects };
    } catch (err) {
      console.error('[Admin Projects GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Admin: Create new project
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.shortDescription || !body.fullDescription) {
      return reply.code(400).send({ error: true, message: 'Title, short description, and full description are required.' });
    }

    const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });

    try {
      const project = await Project.create({ ...body, slug });
      return reply.code(201).send({ success: true, message: 'Project created successfully in DB.', data: project });
    } catch (err) {
      console.error('[Create Project] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to create project in DB: ' + err.message });
    }
  });

  // Admin: Update project
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
      const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!project) {
        return reply.code(404).send({ error: true, message: 'Project not found in DB.' });
      }
      return { success: true, message: 'Project updated successfully in DB.', data: project };
    } catch (err) {
      console.error('[Update Project] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to update project in DB: ' + err.message });
    }
  });

  // Admin: Delete project
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return reply.code(404).send({ error: true, message: 'Project not found in DB.' });
      }
      return { success: true, message: 'Project deleted successfully from DB.' };
    } catch (err) {
      console.error('[Delete Project] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to delete project from DB: ' + err.message });
    }
  });
}

module.exports = projectRoutes;
