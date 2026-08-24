const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const SeoConfig = require('../models/SeoConfig');

const seedData = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('[Seed] Database not connected. Skipping seed.');
    return;
  }
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'adminpass123';
      const defaultEmail = process.env.ADMIN_EMAIL || 'rachitaggarwal1202@gmail.com';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await User.create({
        username: defaultUsername,
        email: defaultEmail,
        password: hashedPassword,
        name: 'Rachit Aggarwal',
        role: 'admin'
      });
      console.log('[Seed] Admin user created with username:', defaultUsername);
    }

    // 2. Seed SEO Configuration
    const seoExists = await SeoConfig.findOne();
    if (!seoExists) {
      await SeoConfig.create({
        siteName: 'Rachit Aggarwal | Senior Software Developer',
        defaultTitle: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer',
        defaultDescription: 'Official website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable cloud applications.',
        keywords: [
          'Rachit Aggarwal',
          'Senior Web Developer',
          'Full-Stack Developer',
          'Next.js Developer',
          'Fastify Backend',
          'MERN Stack',
          'WordPress Specialist',
          'Node.js Developer Delhi'
        ],
        author: 'Rachit Aggarwal',
        ogImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200',
        twitterHandle: '@rachitaggarwal',
        linkedinUrl: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/',
        githubUrl: 'https://github.com/rachit1202',
        contactEmail: 'rachitaggarwal1202@gmail.com',
        contactPhone: '+91 9873088907',
        location: 'Rohini, New Delhi, India'
      });
      console.log('[Seed] Default SEO config created');
    }

    // 3. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: 'Full-Stack Web Development',
          slug: 'full-stack-web-development',
          category: 'Development',
          icon: 'Code2',
          shortDesc: 'Custom high-performance web apps built with Next.js, React, Node.js & MongoDB.',
          fullDesc: 'End-to-end web application development designed for speed, scalability, and seamless user experiences. From database architecture to reactive frontends.',
          features: ['React & Next.js App Router', 'Node.js & Fastify API Backend', 'MongoDB Database Architecture', 'JWT Authentication & Security'],
          deliverables: ['Production Ready Web App', 'Source Code & Documentation', 'Deployment Setup'],
          priceEstimate: 'Custom',
          order: 1
        },
        {
          title: 'Custom WordPress & PHP Solutions',
          slug: 'wordpress-php-development',
          category: 'Development',
          icon: 'Globe',
          shortDesc: 'Custom WordPress themes, plugins, PSD/Figma to WordPress, and custom PHP engines.',
          fullDesc: 'Enterprise WordPress sites tailored from Figma designs, custom plugin development, PHP backend logic, and headless CMS integrations.',
          features: ['Figma / PSD to WordPress', 'Custom Plugin & Theme Development', 'WooCommerce E-Commerce setup', 'Performance & Speed Optimization'],
          deliverables: ['Custom WordPress Theme', 'Plugin Suite', 'Admin Training'],
          priceEstimate: 'Custom',
          order: 2
        },
        {
          title: 'UI/UX Design & Figma Prototyping',
          slug: 'ui-ux-design-figma',
          category: 'Designing',
          icon: 'Palette',
          shortDesc: 'Modern, clean, and conversion-focused UI/UX design using Figma for web and mobile.',
          fullDesc: 'Design systems, interactive prototypes, user journey mapping, and conversion-focused UI layouts. Every screen is designed with developer handoff and technical feasibility in mind.',
          features: ['Scalable Figma Design Systems & Components', 'High-Fidelity Clickable Prototypes', 'Responsive Layouts & Spacing Specs', 'Micro-Interactions & Transitions'],
          deliverables: ['Complete Figma Project File', 'Design System Library', 'Clickable Prototype'],
          priceEstimate: 'Custom',
          order: 3
        },
        {
          title: 'Website Maintenance & Speed Optimization',
          slug: 'website-maintenance',
          category: 'Maintenance',
          icon: 'Settings',
          shortDesc: 'Ongoing maintenance, speed tuning, updates, bug fixes, and 24/7 uptime monitoring.',
          fullDesc: 'Keep your website secure, lightning-fast, and always up to date. Continuous health audits, core updates, backup management, speed improvements, and proactive monitoring.',
          features: ['Core Web Vitals 90+ Score Tuning', 'Regular Core & Security Patch Updates', 'Automated Daily Cloud Backups', '24/7 Uptime Monitoring'],
          deliverables: ['Monthly Performance Audit', 'Guaranteed 99.9% Uptime', 'Priority Support Channel'],
          priceEstimate: 'Monthly Retainer',
          order: 4
        },
        {
          title: 'Cyber Security & Server Hardening',
          slug: 'cyber-security-hardening',
          category: 'Cyber Security',
          icon: 'Shield',
          shortDesc: 'Comprehensive security audit, vulnerability assessment, and hardening for web applications.',
          fullDesc: 'Protect your web applications and API servers against malicious attacks, DDoS, injection vectors, and data breaches with industry-standard security protocols.',
          features: ['OWASP Top 10 Vulnerability Scan', 'JWT Auth & Refresh Token Hardening', 'Input Sanitization & SQLi/XSS Defense', 'Rate Limiting & DDoS Mitigation'],
          deliverables: ['Comprehensive Security Audit Report', 'Codebase Patches Applied', 'Security Best-Practices Guide'],
          priceEstimate: 'Custom',
          order: 5
        },
        {
          title: 'Technical SEO & Search Dominance',
          slug: 'seo-search-dominance',
          category: 'SEO',
          icon: 'Globe',
          shortDesc: 'Technical SEO, Core Web Vitals optimization, and structured metadata for Google rankings.',
          fullDesc: 'Engineered SEO for modern web applications. From server-side metadata generation to JSON-LD structured schema, canonical setups, and sub-second rendering for maximum crawler indexing.',
          features: ['Dynamic XML Sitemap & Robots.txt', 'JSON-LD Schema Markup', 'OpenGraph & Twitter Cards', 'Core Web Vitals Green Scores'],
          deliverables: ['Full SEO Audit & Action Report', 'Configured Schema Markup', 'XML Sitemaps Live'],
          priceEstimate: 'Custom',
          order: 6
        }
      ]);
      console.log('[Seed] Services seeded successfully');
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
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
      ]);
      console.log('[Seed] Projects seeded successfully');
    }

    // 5. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: 'The Ultimate Guide to Modern Full-Stack Web Architecture: Next.js 14 & Fastify Microservices',
          slug: 'ultimate-guide-modern-fullstack-web-architecture',
          category: 'Development',
          summary: 'A comprehensive breakdown of architecting modern, high-throughput web applications using Next.js 14 Server Components, Fastify microservices, and optimized database indexing.',
          content: `Building web applications that can handle high traffic while maintaining sub-second response times requires thoughtful architecture. The combination of Next.js 14 on the frontend and Fastify on the backend represents the gold standard in modern JavaScript/TypeScript engineering.`,
          coverImage: '/blogs/fullstack-architecture.jpg',
          tags: ['Next.js', 'Node.js', 'Fastify', 'Architecture', 'Full-Stack', 'MongoDB'],
          readTime: '7 min read',
          author: 'Rachit Aggarwal',
          isPublished: true,
          metaTitle: 'Modern Full-Stack Web Architecture | Rachit Aggarwal',
          metaDescription: 'Architecting modern web applications with Next.js 14, Fastify, and MongoDB.',
          keywords: ['Next.js', 'Fastify', 'Full-Stack Architecture']
        },
        {
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
          metaTitle: 'UI/UX Design & Systems Guide | Rachit Aggarwal',
          metaDescription: 'Building scalable Figma design systems and conversion-focused dark UI.',
          keywords: ['UI/UX', 'Figma Design', 'Design Systems']
        },
        {
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
          metaTitle: 'Web Application Security Playbook | Rachit Aggarwal',
          metaDescription: 'Defending Node.js and Next.js applications against OWASP Top 10 vulnerabilities.',
          keywords: ['Web Security', 'OWASP', 'API Security']
        },
        {
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
          metaTitle: 'Website Maintenance & Speed Guide | Rachit Aggarwal',
          metaDescription: 'Best practices for automated cloud backups, Core Web Vitals, and uptime monitoring.',
          keywords: ['Website Maintenance', 'Core Web Vitals', 'Speed Optimization']
        },
        {
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
          metaTitle: 'Mastering Technical SEO | Rachit Aggarwal',
          metaDescription: 'Implementing JSON-LD schema, Next.js metadata, and Core Web Vitals for search rankings.',
          keywords: ['Technical SEO', 'Schema Markup', 'Next.js SEO']
        }
      ]);
      console.log('[Seed] Blogs seeded successfully');
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

module.exports = seedData;

