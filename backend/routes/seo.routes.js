const mongoose = require('mongoose');
const SeoConfig = require('../models/SeoConfig');

const defaultPages = [
  {
    pageKey: 'home',
    pageName: 'Home Page',
    path: '/',
    title: 'Rachit Aggarwal | Senior Web Developer & Full-Stack Engineer',
    description: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.',
    keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js', 'Fastify', 'MERN Stack', 'WordPress'],
    ogImage: '/final-logo.png'
  },
  {
    pageKey: 'about',
    pageName: 'About Me',
    path: '/about',
    title: 'About Rachit Aggarwal | Senior Web Developer & Architect',
    description: 'Career journey, work experiences, technical capability, education, and development approach of Rachit Aggarwal.',
    keywords: ['About Rachit Aggarwal', 'Full-Stack Developer Bio', 'Web Developer Experience', 'Frontend Backend Skills'],
    ogImage: '/final-logo.png'
  },
  {
    pageKey: 'projects',
    pageName: 'Projects Portfolio',
    path: '/projects',
    title: 'Projects Portfolio | Rachit Aggarwal — Selected Work',
    description: 'Browse featured web applications, WordPress platforms, enterprise portals, and Fastify REST API backends engineered by Rachit Aggarwal.',
    keywords: ['Web Projects', 'Next.js Portfolio', 'Full-Stack Applications', 'WordPress Development Case Studies'],
    ogImage: '/final-logo.png'
  },
  {
    pageKey: 'services',
    pageName: 'Services & Capabilities',
    path: '/services',
    title: 'Services | Rachit Aggarwal — Web Development & Design Solutions',
    description: 'Full-Stack Next.js development, Fastify API microservices, custom WordPress solutions, UI/UX design, SEO optimization and more by Rachit Aggarwal.',
    keywords: ['Web Development Services', 'Hire Next.js Developer', 'Custom WordPress Development', 'API Development Delhi'],
    ogImage: '/final-logo.png'
  },
  {
    pageKey: 'blogs',
    pageName: 'Tech Blog & Insights',
    path: '/blogs',
    title: 'Tech Blog | Rachit Aggarwal — Thoughts & Tutorials',
    description: 'In-depth articles on modern web development, Next.js 14, Fastify APIs, Node.js performance, MongoDB optimization, and SEO best practices.',
    keywords: ['Web Development Blog', 'Next.js Tutorials', 'Node.js Performance', 'Technical SEO Guides'],
    ogImage: '/final-logo.png'
  },
  {
    pageKey: 'contact',
    pageName: 'Contact & Inquiries',
    path: '/contact',
    title: 'Contact Rachit Aggarwal | Get In Touch & Hire',
    description: 'Get in touch with Rachit Aggarwal for custom software development, freelance projects, technical consulting, or collaborations.',
    keywords: ['Contact Rachit Aggarwal', 'Hire Web Developer', 'Freelance Inquiry Delhi', 'Project Consultation'],
    ogImage: '/final-logo.png'
  }
];

const defaultSeo = {
  siteName: 'Rachit Aggarwal | Senior Software Developer',
  defaultTitle: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer',
  defaultDescription: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.',
  keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js', 'Fastify', 'MERN Stack'],
  author: 'Rachit Aggarwal',
  ogImage: '/final-logo.png',
  twitterHandle: '@rachitaggarwal',
  linkedinUrl: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/',
  githubUrl: 'https://github.com/rachit1202',
  contactEmail: 'rachitaggarwal1202@gmail.com',
  contactPhone: '+91 9873088907',
  location: 'Rohini, New Delhi, India',
  customHeadScripts: '',
  pages: defaultPages
};

async function seoRoutes(fastify, options) {
  // Public: Get dynamic SEO configuration & meta settings
  fastify.get('/', async (request, reply) => {
    try {
      let config = await SeoConfig.findOne().lean();
      if (!config) {
        config = await SeoConfig.create(defaultSeo);
      } else if (!config.pages || config.pages.length === 0) {
        // Automatically populate page list if not yet present
        await SeoConfig.findByIdAndUpdate(config._id, { $set: { pages: defaultPages } });
        config.pages = defaultPages;
      }
      return { success: true, data: config };
    } catch (err) {
      console.error('[SEO GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: defaultSeo });
    }
  });

  // Public: Get specific page SEO
  fastify.get('/page/:key', async (request, reply) => {
    const { key } = request.params;
    try {
      let config = await SeoConfig.findOne().lean();
      const pages = config?.pages?.length ? config.pages : defaultPages;
      const pageSeo = pages.find(p => p.pageKey.toLowerCase() === key.toLowerCase());
      if (pageSeo) {
        return { success: true, data: pageSeo, global: config };
      }
      const fallback = defaultPages.find(p => p.pageKey.toLowerCase() === key.toLowerCase());
      return { success: true, data: fallback || null, global: config };
    } catch (err) {
      console.error('[SEO Page GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: err.message });
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
      return { success: true, message: 'SEO & Page Metadata settings updated successfully in DB.', data: config };
    } catch (err) {
      console.error('[SEO PUT] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to save SEO settings to DB: ' + err.message });
    }
  });
}

module.exports = seoRoutes;
