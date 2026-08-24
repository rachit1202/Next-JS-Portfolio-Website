const slugify = require('slugify');
const mongoose = require('mongoose');
const Project = require('../models/Project');

let inMemoryProjects = [
  {
    _id: 'p1',
    title: 'Shri Sai Stationery',
    slug: 'shri-sai-stationery',
    category: 'E-Commerce & Retail',
    shortDescription: 'Comprehensive online stationery & office supplies e-commerce catalog platform with intuitive product filtering, fast checkout, and responsive design.',
    fullDescription: 'A high-performance e-commerce and retail catalog system built for Shri Sai Stationery. Features streamlined inventory search, bulk inquiry workflows, responsive product cards, and instant payment integration.',
    coverImage: '/projects/shri-sai-stationery.webp',
    liveUrl: 'https://web-apex.com/our-portfolio/shri-sai-stationery/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'WooCommerce', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'Payment Gateway'],
    clientName: 'Shri Sai Stationery',
    role: 'Senior Web Developer',
    featured: true,
    isPublished: true,
    order: 1
  },
  {
    _id: 'p2',
    title: 'Pagenest Jobs',
    slug: 'pagenest-jobs',
    category: 'Recruitment & Web Portal',
    shortDescription: 'Dynamic recruitment portal and job board featuring candidate job search, employer job postings, resume uploads, and real-time filtering.',
    fullDescription: 'Scalable job search and career recruitment portal engineering. Connects job seekers with verified employers through custom search algorithms, automated email alerts, and administrative application management.',
    coverImage: '/projects/pagenest.png',
    liveUrl: 'https://web-apex.com/our-portfolio/pagenest-jobs/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['React', 'Next.js', 'Node.js', 'Fastify', 'MongoDB', 'Tailwind CSS'],
    clientName: 'Pagenest Jobs Platform',
    role: 'Full-Stack Architect',
    featured: true,
    isPublished: true,
    order: 2
  },
  {
    _id: 'p3',
    title: 'Thornhill Expeditions',
    slug: 'thornhill-expeditions',
    category: 'Travel & Adventure',
    shortDescription: 'Immersive luxury safari and wilderness travel booking platform with dynamic tour itineraries, interactive maps, and lead capture systems.',
    fullDescription: 'A luxury travel and expedition showcase website crafted with rich visual typography, day-by-day tour itinerary timelines, dynamic booking inquiry forms, and search engine optimization.',
    coverImage: '/projects/thornhill-expeditions.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/thornhill-expeditions/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'Custom PHP', 'ACF Pro', 'JavaScript', 'CSS3', 'SEO Engine'],
    clientName: 'Thornhill Expeditions',
    role: 'Senior Web Developer',
    featured: true,
    isPublished: true,
    order: 3
  },
  {
    _id: 'p4',
    title: 'Macs Adventure',
    slug: 'macs-adventure',
    category: 'Tour & Booking Platform',
    shortDescription: 'Self-guided walking and cycling holiday platform with custom itinerary planners, route mapping, and instant booking workflows.',
    fullDescription: 'Engineered an interactive adventure tourism platform for self-guided walking and cycling holidays across international destinations.',
    coverImage: '/projects/macs-adventure.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/macs-adventure/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Interactive Maps'],
    clientName: 'Macs Adventure Travel',
    role: 'Senior Full-Stack Developer',
    featured: true,
    isPublished: true,
    order: 4
  },
  {
    _id: 'p5',
    title: 'Oceanwide Properties',
    slug: 'oceanwide-properties',
    category: 'Real Estate Portal',
    shortDescription: 'High-end coastal real estate listing portal with advanced property search filters, currency converters, and lead generation systems.',
    fullDescription: 'Modern property listing and real estate portal engineered for premier international real estate investments and luxury coastal homes.',
    coverImage: '/projects/oceanwide-properties.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/oceanwide-properties/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'PHP 8+', 'MySQL', 'Google Maps API', 'Tailwind CSS'],
    clientName: 'Oceanwide Properties',
    role: 'Web Developer & Architect',
    featured: true,
    isPublished: true,
    order: 5
  },
  {
    _id: 'p6',
    title: 'Genesis Home',
    slug: 'genesis-home',
    category: 'Interior & Architecture',
    shortDescription: 'Elegant architecture and interior design showcase website with high-resolution visual lookbooks, project portfolios, and consultation booking.',
    fullDescription: 'A minimalist, high-aesthetic digital showcase for luxury interior designers and architectural studios. Features smooth animations, curated lookbooks, and design service consultation bookings.',
    coverImage: '/projects/genesis-home.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/genesis-home/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['Next.js 14', 'React', 'Framer Motion', 'Tailwind CSS', 'Headless CMS'],
    clientName: 'Genesis Home Interior',
    role: 'Frontend & UI Specialist',
    featured: true,
    isPublished: true,
    order: 6
  }
];

async function projectRoutes(fastify, options) {
  // Public: Get all projects (with server-side pagination & filtering)
  fastify.get('/', async (request, reply) => {
    const { category, featured, limit, page } = request.query || {};

    if (mongoose.connection.readyState === 1) {
      try {
        let query = { isPublished: true };
        if (category && category !== 'All') query.category = category;
        if (featured === 'true') query.featured = true;

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
      } catch (e) {
        console.warn('[Project Route Error] DB failed, using memory fallback:', e.message);
      }
    }

    let filtered = inMemoryProjects.filter(p => p.isPublished);
    if (category && category !== 'All') filtered = filtered.filter(p => p.category === category);
    if (featured === 'true') filtered = filtered.filter(p => p.featured);

    const total = filtered.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = limit ? parseInt(limit, 10) : 0;

    let pagedProjects = filtered;
    if (limitNum > 0) {
      pagedProjects = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }
    const totalPages = limitNum > 0 ? Math.ceil(total / limitNum) : 1;

    return {
      success: true,
      count: pagedProjects.length,
      total,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum || total,
        totalPages: totalPages || 1,
        hasPrev: pageNum > 1,
        hasNext: pageNum < totalPages
      },
      data: pagedProjects
    };
  });

  // Public: Get single project by slug or ID
  fastify.get('/:slug', async (request, reply) => {
    const param = request.params.slug;

    if (mongoose.connection.readyState === 1) {
      try {
        const isId = mongoose.Types.ObjectId.isValid(param);
        const query = isId
          ? { $or: [{ slug: param }, { _id: param }] }
          : { slug: param };

        const project = await Project.findOne(query);
        if (project) {
          return { success: true, data: project };
        }
      } catch (e) {
        console.warn('[Project Detail Error] DB failed, using memory fallback:', e.message);
      }
    }

    const project = inMemoryProjects.find(p => p.slug === param || p._id === param);
    if (!project) {
      return reply.code(404).send({ error: true, message: 'Project not found.' });
    }
    return { success: true, data: project };
  });

  // Admin: Get all projects
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        const projects = await Project.find().sort({ createdAt: -1 });
        return { success: true, count: projects.length, data: projects };
      } catch (e) {
        console.warn('[Admin Projects Error] DB failed, using memory fallback:', e.message);
      }
    }
    return { success: true, count: inMemoryProjects.length, data: inMemoryProjects };
  });

  // Admin: Create new project
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.shortDescription || !body.fullDescription) {
      return reply.code(400).send({ error: true, message: 'Title, short description, and full description are required.' });
    }

    const slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });
    const finalSlug = slug;

    if (mongoose.connection.readyState === 1) {
      try {
        const project = await Project.create({ ...body, slug: finalSlug });
        return reply.code(201).send({ success: true, data: project });
      } catch (e) {
        console.warn('[Create Project Error] DB failed, using memory fallback:', e.message);
      }
    }

    const newProj = { ...body, _id: `p_${Date.now()}`, slug: finalSlug, createdAt: new Date() };
    inMemoryProjects.unshift(newProj);
    return reply.code(201).send({ success: true, data: newProj });
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

    if (mongoose.connection.readyState === 1) {
      try {
        const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (project) return { success: true, data: project };
      } catch (e) {
        console.warn('[Update Project Error] DB failed, using memory fallback:', e.message);
      }
    }

    const index = inMemoryProjects.findIndex(p => p._id === id || p.slug === id);
    if (index !== -1) {
      inMemoryProjects[index] = { ...inMemoryProjects[index], ...body };
      return { success: true, data: inMemoryProjects[index] };
    }

    return reply.code(404).send({ error: true, message: 'Project not found.' });
  });

  // Admin: Delete project
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const project = await Project.findByIdAndDelete(id);
        if (project) return { success: true, message: 'Project deleted successfully.' };
      } catch (e) {
        console.warn('[Delete Project Error] DB failed, using memory fallback:', e.message);
      }
    }

    inMemoryProjects = inMemoryProjects.filter(p => p._id !== id && p.slug !== id);
    return { success: true, message: 'Project deleted successfully.' };
  });
}

module.exports = projectRoutes;
