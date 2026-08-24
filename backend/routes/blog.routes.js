const slugify = require('slugify');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

let inMemoryBlogs = [
  {
    _id: 'b1',
    title: 'The Ultimate Guide to Modern Full-Stack Web Architecture: Next.js 14 & Fastify Microservices',
    slug: 'ultimate-guide-modern-fullstack-web-architecture',
    category: 'Development',
    summary: 'A comprehensive breakdown of architecting modern, high-throughput web applications using Next.js 14 Server Components, Fastify microservices, and optimized database indexing.',
    content: `Building web applications that can handle high traffic while maintaining sub-second response times requires thoughtful architecture. The combination of Next.js 14 on the frontend and Fastify on the backend represents the gold standard in modern JavaScript/TypeScript engineering.\n\n### 1. The Power of Next.js 14 Server Components\nNext.js 14 App Router introduces React Server Components (RSC), which execute exclusively on the server.\n\n### 2. Why Fastify Outperforms Traditional Express\nFastify is engineered for extreme throughput, serving up to 30,000+ requests per second with schema-driven serialization.\n\n### 3. Database Indexing & Scalability in MongoDB\nUsing compound indexes and projections keeps latency below 10ms.`,
    coverImage: '/blogs/fullstack-architecture.jpg',
    tags: ['Next.js', 'Node.js', 'Fastify', 'Architecture', 'Full-Stack', 'MongoDB'],
    readTime: '7 min read',
    author: 'Rachit Aggarwal',
    isPublished: true,
    viewsCount: 154
  },
  {
    _id: 'b2',
    title: 'Designing for Impact: Principles of High-Converting UI/UX Design & Design Systems in 2026',
    slug: 'high-converting-ui-ux-design-principles-systems',
    category: 'Designing',
    summary: 'How to build scalable Figma design systems, master visual hierarchy, and craft dark glassmorphic interfaces that turn casual visitors into loyal clients.',
    content: `Great design is not just about making things look beautiful — it is about clarity, hierarchy, psychology, and frictionless conversion. In 2026, modern web design has evolved towards high-contrast dark modes, subtle glassmorphism, and structured design token systems.`,
    coverImage: '/blogs/ui-ux-design.jpg',
    tags: ['UI/UX Design', 'Figma', 'Design Systems', 'Dark Mode', 'Conversion Rate', 'Typography'],
    readTime: '6 min read',
    author: 'Rachit Aggarwal',
    isPublished: true,
    viewsCount: 128
  },
  {
    _id: 'b3',
    title: 'Web Application Security Essentials: Defending Against OWASP Top 10 & API Vulnerabilities',
    slug: 'web-application-security-essentials-owasp-defense',
    category: 'Cyber Security',
    summary: 'Practical developer playbook for locking down web applications against XSS, SQL injection, CSRF, broken authentication, and automated DDoS attack vectors.',
    content: `Cyber threats and automated bot scanners constantly probe web servers for vulnerabilities. Securing full-stack web applications requires defense-in-depth across the frontend, API layer, database, and infrastructure.`,
    coverImage: '/blogs/cyber-security.jpg',
    tags: ['Cyber Security', 'OWASP', 'API Security', 'JWT', 'Penetration Testing', 'Node.js'],
    readTime: '8 min read',
    author: 'Rachit Aggarwal',
    isPublished: true,
    viewsCount: 195
  },
  {
    _id: 'b4',
    title: 'Proactive Website Maintenance: Ensuring 99.9% Uptime, Sub-Second Speed & Flawless Health',
    slug: 'proactive-website-maintenance-speed-optimization-guide',
    category: 'Maintenance',
    summary: 'Why proactive maintenance matters: automated cloud backups, database vacuuming, Redis caching, dependency security patching, and 24/7 uptime monitoring.',
    content: `A website is not a one-time project — it is a live business asset that requires ongoing care, optimization, and monitoring. Proactive website maintenance prevents disastrous downtimes, data loss, and slow degradation of user experience.`,
    coverImage: '/blogs/website-maintenance.jpg',
    tags: ['Maintenance', 'Core Web Vitals', 'Performance', 'Redis', 'Uptime', 'Cloud Backups'],
    readTime: '5 min read',
    author: 'Rachit Aggarwal',
    isPublished: true,
    viewsCount: 112
  },
  {
    _id: 'b5',
    title: 'Mastering Technical SEO: Schema Markup, Core Web Vitals & Crawl Budget for Top Google Rankings',
    slug: 'mastering-technical-seo-schema-core-web-vitals',
    category: 'SEO',
    summary: 'The modern engineer guide to Technical SEO: implementing JSON-LD rich snippets, dynamic XML sitemaps, server-side metadata, and Core Web Vitals dominance.',
    content: `Technical SEO is the foundation upon which all content marketing and organic visibility rests. Without proper site architecture, crawler accessibility, and structured data, even the best content remains invisible to search engines.`,
    coverImage: '/blogs/technical-seo.jpg',
    tags: ['Technical SEO', 'Schema Markup', 'Google Search', 'Core Web Vitals', 'Next.js SEO', 'Sitemaps'],
    readTime: '6 min read',
    author: 'Rachit Aggarwal',
    isPublished: true,
    viewsCount: 176
  }
];

async function blogRoutes(fastify, options) {
  // Public: Get all published blogs (with server-side pagination & filtering)
  fastify.get('/', async (request, reply) => {
    const { category, limit, page, tag, search } = request.query || {};

    if (mongoose.connection.readyState === 1) {
      try {
        let query = { isPublished: true };
        if (category && category !== 'All') query.category = category;
        if (tag) query.tags = tag;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { summary: { $regex: search, $options: 'i' } }
          ];
        }

        const total = await Blog.countDocuments(query);
        let dbQuery = Blog.find(query).sort({ publishedAt: -1, createdAt: -1 });

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
      } catch (e) {
        console.warn('[Blog Route Error] DB failed, using memory fallback:', e.message);
      }
    }

    let filtered = inMemoryBlogs.filter(b => b.isPublished);
    if (category && category !== 'All') filtered = filtered.filter(b => b.category === category);
    if (tag) filtered = filtered.filter(b => b.tags?.includes(tag));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : 0;

    let pagedBlogs = filtered;
    if (limitNum > 0) {
      pagedBlogs = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return {
      success: true,
      count: pagedBlogs.length,
      total,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: totalPages || 1,
        hasPrev: pageNum > 1,
        hasNext: pageNum < totalPages
      },
      data: pagedBlogs
    };
  });

  // Public: Get single blog by slug
  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const blog = await Blog.findOneAndUpdate(
          { slug, isPublished: true },
          { $inc: { viewsCount: 1 } },
          { new: true }
        );
        if (blog) return { success: true, data: blog };
      } catch (e) {
        console.warn('[Blog Detail Error] DB failed, using memory fallback:', e.message);
      }
    }

    const blog = inMemoryBlogs.find(b => b.slug === slug || b._id === slug);
    if (!blog) {
      return reply.code(404).send({ error: true, message: 'Blog article not found.' });
    }
    blog.viewsCount = (blog.viewsCount || 0) + 1;
    return { success: true, data: blog };
  });

  // Admin: Get all blogs
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return { success: true, count: blogs.length, data: blogs };
      } catch (e) {
        console.warn('[Admin Blogs Error] DB failed, using memory fallback:', e.message);
      }
    }
    return { success: true, count: inMemoryBlogs.length, data: inMemoryBlogs };
  });

  // Admin: Create blog post
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.content || !body.summary) {
      return reply.code(400).send({ error: true, message: 'Title, summary, and content are required.' });
    }

    const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });

    if (mongoose.connection.readyState === 1) {
      try {
        const blog = await Blog.create({ ...body, slug });
        return reply.code(201).send({ success: true, data: blog });
      } catch (e) {
        console.warn('[Create Blog Error] DB failed, using memory fallback:', e.message);
      }
    }

    const newBlog = { ...body, _id: `b_${Date.now()}`, slug, createdAt: new Date() };
    inMemoryBlogs.unshift(newBlog);
    return reply.code(201).send({ success: true, data: newBlog });
  });

  // Admin: Update blog post
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

    if (mongoose.connection.readyState === 1) {
      try {
        const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (blog) return { success: true, data: blog };
      } catch (e) {
        console.warn('[Update Blog Error] DB failed, using memory fallback:', e.message);
      }
    }

    const index = inMemoryBlogs.findIndex(b => b._id === id || b.slug === id);
    if (index !== -1) {
      inMemoryBlogs[index] = { ...inMemoryBlogs[index], ...body };
      return { success: true, data: inMemoryBlogs[index] };
    }

    return reply.code(404).send({ error: true, message: 'Blog article not found.' });
  });

  // Admin: Delete blog post
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const blog = await Blog.findByIdAndDelete(id);
        if (blog) return { success: true, message: 'Blog deleted successfully.' };
      } catch (e) {
        console.warn('[Delete Blog Error] DB failed, using memory fallback:', e.message);
      }
    }

    inMemoryBlogs = inMemoryBlogs.filter(b => b._id !== id && b.slug !== id);
    return { success: true, message: 'Blog deleted successfully.' };
  });
}

module.exports = blogRoutes;
