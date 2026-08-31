const slugify = require('slugify');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

async function blogRoutes(fastify, options) {
  // Public: Get published blogs with filtering, tag search, and pagination
  fastify.get('/', async (request, reply) => {
    try {
      const { category, tag, limit, page = 1, search } = request.query || {};

      const query = { isPublished: true };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (tag) {
        query.tags = { $in: [tag] };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const total = await Blog.countDocuments(query);
      let dbQuery = Blog.find(query).sort({ createdAt: -1 });

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = limit ? parseInt(limit, 10) : 0;

      if (limitNum > 0) {
        dbQuery = dbQuery.skip((pageNum - 1) * limitNum).limit(limitNum);
      }

      const blogs = await dbQuery;
      const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

      return {
        success: true,
        count: blogs.length,
        total,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum || total,
          totalPages: totalPages || 1,
          hasPrev: pageNum > 1,
          hasNext: pageNum < totalPages
        },
        data: blogs
      };
    } catch (err) {
      console.error('[Blogs GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Public: Get single blog by slug and increment view count
  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    try {
      const isId = mongoose.Types.ObjectId.isValid(slug);
      const query = isId
        ? { $or: [{ slug }, { _id: slug }] }
        : { slug };

      const blog = await Blog.findOneAndUpdate(
        query,
        { $inc: { viewsCount: 1 } },
        { new: true }
      );

      if (!blog) {
        return reply.code(404).send({ error: true, message: 'Blog article not found in DB.' });
      }

      return { success: true, data: blog };
    } catch (err) {
      console.error('[Blog Detail GET] DB error:', err.message);
      return reply.code(503).send({ error: true, message: 'Database error: ' + err.message });
    }
  });

  // Admin: Get all blogs
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return { success: true, count: blogs.length, data: blogs };
    } catch (err) {
      console.error('[Admin Blogs GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [] });
    }
  });

  // Admin: Create new blog
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.summary || !body.content) {
      return reply.code(400).send({ error: true, message: 'Title, summary, and content are required.' });
    }

    const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });

    try {
      const blog = await Blog.create({ ...body, slug });
      return reply.code(201).send({ success: true, message: 'Blog created successfully in DB.', data: blog });
    } catch (err) {
      console.error('[Create Blog] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to create blog in DB: ' + err.message });
    }
  });

  // Admin: Update blog
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
      const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!blog) {
        return reply.code(404).send({ error: true, message: 'Blog not found in DB.' });
      }
      return { success: true, message: 'Blog updated successfully in DB.', data: blog };
    } catch (err) {
      console.error('[Update Blog] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to update blog in DB: ' + err.message });
    }
  });

  // Admin: Delete blog
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    try {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) {
        return reply.code(404).send({ error: true, message: 'Blog not found in DB.' });
      }
      return { success: true, message: 'Blog deleted successfully from DB.' };
    } catch (err) {
      console.error('[Delete Blog] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to delete blog from DB: ' + err.message });
    }
  });
}

module.exports = blogRoutes;
