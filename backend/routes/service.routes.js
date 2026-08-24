const slugify = require('slugify');
const mongoose = require('mongoose');
const Service = require('../models/Service');

let inMemoryServices = [
  {
    _id: 's1',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    category: 'Development',
    icon: 'Code2',
    shortDesc: 'Custom high-performance web applications using Next.js, React, Node.js & Fastify.',
    fullDesc: 'End-to-end web application development designed for speed, scalability, and seamless user experiences. I build responsive, performant, and maintainable applications from scratch with modern architecture and rock-solid APIs.',
    techStack: ['Next.js 14', 'React.js', 'Node.js', 'Fastify', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'Docker'],
    features: [
      'Next.js 14 App Router & Server Components',
      'High-Throughput Fastify & Node.js API Microservices',
      'Secure Authentication with JWT & Session Management',
      'Database Modeling & Index Optimization in MongoDB / PostgreSQL',
      'Dynamic Admin Dashboard / CMS Included',
      'CI/CD Pipeline & Zero-Downtime Deployment'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Discovery & System Design', description: 'Requirements analysis, schema modeling, API endpoint mapping, and architecture planning.' },
      { stepNumber: 2, title: 'Backend & Database Engine', description: 'Developing Fastify/Node.js REST endpoints, MongoDB models, authentication, and validation schemas.' },
      { stepNumber: 3, title: 'Frontend UI/UX Implementation', description: 'Crafting pixel-perfect Next.js reactive pages with clean state management and animations.' },
      { stepNumber: 4, title: 'Testing, Audit & Production Launch', description: 'Lighthouse 95+ score audit, Core Web Vitals tuning, security hardening, and deployment.' }
    ],
    deliverables: ['Production Ready Web App', 'Clean & Documented Source Code', 'Admin CMS Portal', 'Deployment & CI/CD Setup', '30 Days Post-Launch Support'],
    priceEstimate: 'Custom Quote',
    isPublished: true,
    order: 1
  },
  {
    _id: 's2',
    title: 'WordPress & PHP Development',
    slug: 'wordpress-php-development',
    category: 'Development',
    icon: 'Globe',
    shortDesc: 'Custom WordPress themes, plugins, and PHP backends tailored to your business needs.',
    fullDesc: 'From Figma designs to fully functional custom WordPress websites. Custom theme development without bloated page builders, advanced custom fields (ACF Pro), WooCommerce e-commerce engines, and high-performance PHP backends.',
    techStack: ['WordPress', 'PHP 8.2', 'MySQL', 'ACF Pro', 'WooCommerce', 'JavaScript', 'Tailwind CSS / SCSS', 'cPanel / Linux'],
    features: [
      'Pixel-Perfect Figma to Custom WordPress Conversion',
      'Custom Gutenberg Blocks & ACF Dynamic Fields',
      'WooCommerce Customization & Payment Gateway Integration',
      'Speed & Performance Optimization (Sub-Second Load Times)',
      'cPanel, Apache/Nginx Server Configuration & SSL',
      'Advanced Security Hardening & Malware Defense'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Figma Review & Theme Architecture', description: 'Analyzing design components, custom post types, taxonomy structures, and plugin requirements.' },
      { stepNumber: 2, title: 'Custom PHP Theme Engineering', description: 'Coding clean, semantic PHP templates with ACF integration and custom block builders.' },
      { stepNumber: 3, title: 'WooCommerce & Feature Integrations', description: 'Configuring payment gateways, shipping, automated email triggers, and custom workflows.' },
      { stepNumber: 4, title: 'Server Setup & Go-Live', description: 'Database migration, CDN setup, caching optimization, and live server deployment.' }
    ],
    deliverables: ['Custom WordPress Theme', 'Fully Functional Website', 'Admin Video Walkthrough', 'Performance & SEO Optimization', '30 Days Free Maintenance'],
    priceEstimate: 'Custom Quote',
    isPublished: true,
    order: 2
  },
  {
    _id: 's3',
    title: 'UI/UX Design & Figma Prototyping',
    slug: 'ui-ux-design-figma',
    category: 'Designing',
    icon: 'Palette',
    shortDesc: 'Modern, clean, and conversion-focused UI/UX design using Figma for web and mobile.',
    fullDesc: 'Design systems, interactive prototypes, user journey mapping, and conversion-focused UI layouts. Every screen is designed with developer handoff and technical feasibility in mind.',
    techStack: ['Figma', 'Design Systems', 'Auto Layout', 'Prototyping', 'Component Libraries', 'Tailwind Tokens'],
    features: [
      'Scalable Figma Design Systems & Reusable Components',
      'High-Fidelity Interactive Clickable Prototypes',
      'Dark & Light Mode Variants with Harmonious Palettes',
      'Mobile, Tablet & Desktop Responsive Layouts',
      'Micro-Interactions & Animation Guidelines',
      'Developer Handoff with Spacing & Typography Specs'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Wireframing & User Flows', description: 'Low-fidelity structure mapping, content hierarchy, and UX wireframes.' },
      { stepNumber: 2, title: 'Design System & Component Library', description: 'Colors, typography tokens, buttons, inputs, cards, and modal components.' },
      { stepNumber: 3, title: 'High-Fidelity Visual Design', description: 'Crafting stunning, polished screens in dark and light modes.' },
      { stepNumber: 4, title: 'Interactive Prototype & Export', description: 'Clickable prototype creation and organized developer-ready Figma handoff.' }
    ],
    deliverables: ['Complete Figma Project File', 'Design System Library', 'Clickable Prototype', 'Asset Package (SVG/PNG)', 'Dev Handoff Notes'],
    priceEstimate: 'Custom Quote',
    isPublished: true,
    order: 3
  },
  {
    _id: 's4',
    title: 'Website Maintenance & Speed Optimization',
    slug: 'website-maintenance',
    category: 'Maintenance',
    icon: 'Settings',
    shortDesc: 'Ongoing maintenance, speed tuning, updates, bug fixes, and 24/7 uptime monitoring.',
    fullDesc: 'Keep your website secure, lightning-fast, and always up to date. Continuous health audits, core updates, backup management, speed improvements, and proactive monitoring.',
    techStack: ['Lighthouse', 'Core Web Vitals', 'Redis', 'Nginx', 'Cloudflare', 'cPanel', 'Git'],
    features: [
      'Core Web Vitals Optimization (90+ Google Score)',
      'Regular Core, Plugin & Security Patch Updates',
      'Automated Daily Cloud Backups & Instant Restore',
      'Bug Fixes, Feature Enhancements & Content Edits',
      'Uptime Monitoring & 24-Hour Incident Response',
      'Monthly Analytics & Performance Reports'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Initial Health & Security Audit', description: 'Deep-dive scan of codebase, plugins, database queries, and server response times.' },
      { stepNumber: 2, title: 'Speed & Optimization Overhaul', description: 'Image WebP compression, script deferral, Redis caching, and asset minification.' },
      { stepNumber: 3, title: 'Continuous Proactive Monitoring', description: '24/7 uptime checks, error logging, and weekly security scans.' },
      { stepNumber: 4, title: 'Monthly Reporting & Evolution', description: 'Detailed reports with suggestions for feature updates and traffic insights.' }
    ],
    deliverables: ['Monthly Performance Audit', 'Guaranteed 99.9% Uptime', 'Priority Support Channel', 'Weekly Backup Archive'],
    priceEstimate: 'Monthly Retainer',
    isPublished: true,
    order: 4
  },
  {
    _id: 's5',
    title: 'Cyber Security & Server Hardening',
    slug: 'cyber-security-hardening',
    category: 'Cyber Security',
    icon: 'Shield',
    shortDesc: 'Comprehensive security audit, vulnerability assessment, and hardening for web applications.',
    fullDesc: 'Protect your web applications and API servers against malicious attacks, DDoS, injection vectors, and data breaches with industry-standard security protocols.',
    techStack: ['JWT / OAuth2', 'Helmet', 'Rate Limiting', 'CORS / CSP', 'OWASP Top 10', 'Bcrypt', 'SSL/TLS'],
    features: [
      'OWASP Top 10 Vulnerability Scan & Remediation',
      'Robust JWT Authentication & Refresh Token Architecture',
      'Input Sanitization, SQLi & XSS Prevention',
      'API Rate Limiting, DDoS Mitigation & Brute Force Defense',
      'Security Headers (CSP, HSTS, X-Frame-Options) Configuration',
      'Detailed Compliance & Security Assessment Report'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Penetration & Vulnerability Testing', description: 'Scanning all public endpoints, auth flows, file uploaders, and database queries.' },
      { stepNumber: 2, title: 'Threat Identification & Risk Rating', description: 'Cataloging risks with severity matrix and remediation steps.' },
      { stepNumber: 3, title: 'Codebase Hardening & Patching', description: 'Implementing security middleware, validation schemas, and encryption.' },
      { stepNumber: 4, title: 'Verification & Final Audit Report', description: 'Re-testing all attack vectors and issuing comprehensive security documentation.' }
    ],
    deliverables: ['Comprehensive Security Audit Report', 'Codebase Patches Applied', 'Security Best-Practices Guide'],
    priceEstimate: 'Custom Quote',
    isPublished: true,
    order: 5
  },
  {
    _id: 's6',
    title: 'Technical SEO & Search Dominance',
    slug: 'seo-search-dominance',
    category: 'SEO',
    icon: 'Globe',
    shortDesc: 'Technical SEO, Core Web Vitals optimization, and structured metadata for Google rankings.',
    fullDesc: 'Engineered SEO for modern web applications. From server-side metadata generation to JSON-LD structured schema, canonical setups, and sub-second rendering for maximum crawler indexing.',
    techStack: ['Next.js SEO', 'Schema.org JSON-LD', 'Google Search Console', 'Sitemap XML', 'Robots.txt', 'Core Web Vitals'],
    features: [
      'Automated Dynamic XML Sitemap & Robots.txt Generation',
      'JSON-LD Schema Markup (Articles, Breadcrumbs, Person, Organization)',
      'OpenGraph & Twitter Card Dynamic Image Generation',
      'Canonical URL Enforcement & Duplicate Content Elimination',
      'Core Web Vitals (LCP, FID, CLS) Green Score Tuning',
      'Google Search Console & Analytics Integration'
    ],
    processSteps: [
      { stepNumber: 1, title: 'Technical Crawl & Indexing Audit', description: 'Checking indexing errors, broken links, metadata gaps, and crawl efficiency.' },
      { stepNumber: 2, title: 'Structured Data & Tag Architecture', description: 'Implementing Next.js App Router generateMetadata and JSON-LD schema.' },
      { stepNumber: 3, title: 'Performance & Speed Alignment', description: 'Optimizing LCP, INP, and CLS scores to meet Google ranking signals.' },
      { stepNumber: 4, title: 'Verification & Ranking Tracking', description: 'Submitting sitemaps to Search Console and setting up rank tracking.' }
    ],
    deliverables: ['Full SEO Audit & Action Report', 'Configured Schema Markup', 'XML Sitemaps Live', 'Google Search Console Verification'],
    priceEstimate: 'Custom Quote',
    isPublished: true,
    order: 6
  }
];

async function serviceRoutes(fastify, options) {
  // Public: Get all active services
  fastify.get('/', async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        const services = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
        return { success: true, count: services.length, data: services };
      } catch (e) {
        console.warn('[Services Route Error] DB failed, using memory fallback:', e.message);
      }
    }
    return { success: true, count: inMemoryServices.length, data: inMemoryServices };
  });

  // Public: Get single service by slug
  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const service = await Service.findOne({ slug, isPublished: true });
        if (service) {
          return { success: true, data: service };
        }
      } catch (e) {
        console.warn('[Service Detail Error] DB failed, using memory fallback:', e.message);
      }
    }

    const service = inMemoryServices.find(s => s.slug === slug || s._id === slug);
    if (!service) {
      return reply.code(404).send({ error: true, message: 'Service not found.' });
    }
    return { success: true, data: service };
  });

  // Admin: Get all services
  fastify.get('/admin/all', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 });
        return { success: true, count: services.length, data: services };
      } catch (e) {
        console.warn('[Admin Services Error] DB failed, using memory fallback:', e.message);
      }
    }
    return { success: true, count: inMemoryServices.length, data: inMemoryServices };
  });

  // Admin: Create service
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const body = request.body || {};
    if (!body.title || !body.shortDesc || !body.fullDesc) {
      return reply.code(400).send({ error: true, message: 'Title, shortDesc, and fullDesc are required.' });
    }

    const slug = body.slug
      ? slugify(body.slug, { lower: true, strict: true })
      : slugify(body.title, { lower: true, strict: true });

    if (mongoose.connection.readyState === 1) {
      try {
        const service = await Service.create({ ...body, slug });
        return reply.code(201).send({ success: true, data: service });
      } catch (e) {
        console.warn('[Create Service Error] DB failed, using memory fallback:', e.message);
      }
    }

    const newServ = { ...body, _id: `s_${Date.now()}`, slug, createdAt: new Date() };
    inMemoryServices.push(newServ);
    return reply.code(201).send({ success: true, data: newServ });
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

    if (mongoose.connection.readyState === 1) {
      try {
        const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (service) return { success: true, data: service };
      } catch (e) {
        console.warn('[Update Service Error] DB failed, using memory fallback:', e.message);
      }
    }

    const index = inMemoryServices.findIndex(s => s._id === id || s.slug === id);
    if (index !== -1) {
      inMemoryServices[index] = { ...inMemoryServices[index], ...body };
      return { success: true, data: inMemoryServices[index] };
    }

    return reply.code(404).send({ error: true, message: 'Service not found.' });
  });

  // Admin: Delete service
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const service = await Service.findByIdAndDelete(id);
        if (service) return { success: true, message: 'Service deleted successfully.' };
      } catch (e) {
        console.warn('[Delete Service Error] DB failed, using memory fallback:', e.message);
      }
    }

    inMemoryServices = inMemoryServices.filter(s => s._id !== id && s.slug !== id);
    return { success: true, message: 'Service deleted successfully.' };
  });
}

module.exports = serviceRoutes;
