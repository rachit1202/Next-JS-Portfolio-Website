const mongoose = require('mongoose');
const SeoConfig = require('../models/SeoConfig');

const defaultPages = [
  {
    pageKey: 'home',
    pageName: 'Home Page',
    path: '/',
    title: 'Rachit Aggarwal | Senior Full-Stack & Next.js Web Developer',
    description: 'Official portfolio of Rachit Aggarwal — Senior Full-Stack Developer specializing in high-performance Next.js web applications, Fastify REST APIs, and scalable web solutions.',
    keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js Developer Delhi', 'Fastify Backend Developer', 'MERN Stack Developer', 'WordPress Developer India'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/'
  },
  {
    pageKey: 'about',
    pageName: 'About Me',
    path: '/about',
    title: 'About Rachit Aggarwal | Background, Skills & Full-Stack Experience',
    description: 'Career journey, work experiences, technical capability, education, and development approach of Rachit Aggarwal. 3+ years delivering 25+ client projects.',
    keywords: ['About Rachit Aggarwal', 'Full-Stack Developer Bio', 'Web Developer Experience', 'Next.js Developer Skills', 'Fastify Node.js Architecture'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/about'
  },
  {
    pageKey: 'projects',
    pageName: 'Projects Portfolio',
    path: '/projects',
    title: 'Featured Projects & Case Studies | Rachit Aggarwal Portfolio',
    description: 'Explore live web applications, enterprise portals, custom WordPress platforms, and high-throughput REST API microservices engineered by Rachit Aggarwal.',
    keywords: ['Web Projects Portfolio', 'Next.js Case Studies', 'Full-Stack Web Apps', 'WordPress Development Showcase', 'Fastify REST API Examples'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/projects'
  },
  {
    pageKey: 'services',
    pageName: 'Services & Capabilities',
    path: '/services',
    title: 'Web Development Services & Solutions | Rachit Aggarwal',
    description: 'End-to-end web development services: Next.js 14 web applications, Fastify REST API backends, custom WordPress development, and performance optimization.',
    keywords: ['Web Development Services', 'Hire Next.js Developer', 'Fastify API Development', 'Custom WordPress Developer', 'Freelance Web Developer India'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/services'
  },
  {
    pageKey: 'blogs',
    pageName: 'Tech Blog & Insights',
    path: '/blogs',
    title: 'Engineering Blog & Web Dev Tutorials | Rachit Aggarwal',
    description: 'In-depth articles, tutorials, and architectural insights on modern web development, Next.js 14, Fastify APIs, Node.js performance, and SEO best practices.',
    keywords: ['Web Development Blog', 'Next.js Tutorials', 'Node.js Performance', 'Fastify Guides', 'Technical SEO Delhi'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/blogs'
  },
  {
    pageKey: 'contact',
    pageName: 'Contact & Inquiries',
    path: '/contact',
    title: 'Contact Rachit Aggarwal | Hire a Senior Full-Stack Developer',
    description: 'Get in touch with Rachit Aggarwal for custom software development, freelance projects, technical consulting, or collaborations. Available for hire.',
    keywords: ['Contact Rachit Aggarwal', 'Hire Web Developer Delhi', 'Freelance Web Developer Inquiry', 'Project Consultation'],
    ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
    canonicalUrl: 'https://rachitaggarwal.vercel.app/contact'
  }
];

const defaultSeo = {
  siteName: 'Rachit Aggarwal | Senior Software & Full-Stack Developer',
  defaultTitle: 'Rachit Aggarwal - Senior Full-Stack Developer (Next.js & Fastify)',
  defaultDescription: 'Portfolio & technical hub of Rachit Aggarwal. Senior Full-Stack Developer specializing in high-performance Next.js web applications, Fastify REST APIs, and scalable digital solutions.',
  keywords: ['Rachit Aggarwal', 'Senior Full-Stack Developer', 'Next.js Developer Delhi', 'Fastify Backend Developer', 'MERN Stack Developer', 'WordPress Developer India', 'Node.js Developer', 'Freelance Web Developer Delhi'],
  author: 'Rachit Aggarwal',
  ogImage: 'https://web-apex.com/wp-content/uploads/2026/08/final-logo.png',
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
        config = new SeoConfig({ ...defaultSeo, ...body });
      } else {
        Object.assign(config, body);
        if (body.pages) {
          config.pages = body.pages;
          config.markModified('pages');
        }
        if (body.keywords) {
          config.keywords = body.keywords;
          config.markModified('keywords');
        }
      }
      const savedConfig = await config.save();
      return { success: true, message: 'SEO & Page Metadata settings updated successfully in DB.', data: savedConfig };
    } catch (err) {
      console.error('[SEO PUT] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to save SEO settings to DB: ' + err.message });
    }
  });
}

module.exports = seoRoutes;
