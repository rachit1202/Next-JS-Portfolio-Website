const SiteConfig = require('../models/SiteConfig');
const mongoose = require('mongoose');

let inMemoryConfig = {
  name: 'Rachit Aggarwal',
  title: 'Senior Web Developer & Full-Stack Engineer',
  role: 'Full-Stack Developer',
  shortBio: 'Senior Web Developer with 3+ years crafting fast, elegant, and scalable web applications.',
  aboutHeadline: 'Crafting the web with precision & passion.',
  aboutBio: [
    "I'm Rachit Aggarwal, a Full-Stack Web Developer based in New Delhi, India. Over the last 3+ years, I've turned complex problems into elegant digital products — from startup MVPs to enterprise-grade platforms.",
    "My approach sits at the intersection of engineering and design. I believe code quality and visual craft aren't trade-offs — the best digital products are both technically sound and genuinely beautiful to use.",
    "I specialize in React, Next.js, Node.js, Fastify, and WordPress for web. I'm obsessive about Core Web Vitals, accessibility, and developer experience. Beyond shipping code, I write technical articles and mentor junior developers."
  ],
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600',
  cvUrl: '#',
  availabilityStatus: 'Available for freelance work',
  workingHours: 'Mon–Sat: 9AM – 8PM IST',
  location: 'Rohini, New Delhi 110085, India',
  email: 'rachitaggarwal1202@gmail.com',
  phone: '+91 9873088907',
  whatsapp: '+91 9873088907',
  websiteUrl: 'rachitaggarwal.dev',
  leadNotificationEmails: 'aggarwalrachit1202@gmail.com',
  experienceYears: '3+',
  completedProjects: '25+',
  happyClients: '20+',
  satisfactionRate: '99%',
  githubUrl: 'https://github.com/rachit1202',
  linkedinUrl: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/',
  twitterUrl: 'https://twitter.com/rachitaggarwal',
  heroTitleWord1: 'Building',
  heroTitleWord2: 'digital',
  heroTitleWord3: 'excellence.',
  heroDescription: "I'm Rachit Aggarwal — a full-stack developer with 3+ years crafting fast, elegant, and scalable web applications.",
  ctaHeading: 'Ready to bring your vision to life?',
  ctaSubtitle: "Whether it's a startup MVP, enterprise platform, or WordPress site — let's make it happen.",
  skills: [
    { name: 'Next.js 14', category: 'Frontend', level: 95, icon: 'Layout' },
    { name: 'React.js', category: 'Frontend', level: 95, icon: 'Code2' },
    { name: 'Node.js & Fastify', category: 'Backend', level: 92, icon: 'Server' },
    { name: 'MongoDB', category: 'Database', level: 88, icon: 'Database' },
    { name: 'WordPress & PHP', category: 'CMS', level: 92, icon: 'Globe' },
    { name: 'REST & GraphQL APIs', category: 'Architecture', level: 90, icon: 'Cpu' },
    { name: 'MySQL & PostgreSQL', category: 'Database', level: 82, icon: 'Database' },
    { name: 'Tailwind CSS & SCSS', category: 'Styling', level: 95, icon: 'Palette' },
    { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'Code' },
    { name: 'Linux / Docker / CI/CD', category: 'DevOps', level: 80, icon: 'Terminal' }
  ],
  experiences: [
    {
      company: 'SODE Counseling Services LLP',
      role: 'Senior Web Developer',
      period: 'Dec 2025 – Present',
      location: 'Noida, India',
      type: 'Full-time',
      description: 'Architecting dynamic digital solutions, counseling web portals, custom API microservices, and client platforms with focus on performance, security, and scalability.',
      highlights: ['Next.js & Fastify microservices', 'MongoDB database architecture', 'JWT auth & role management', 'Client portal development']
    },
    {
      company: 'AdMedia Technologies Pvt Ltd',
      role: 'Senior Web Developer',
      period: 'May 2025 – Dec 2025',
      location: 'Noida, UP, India',
      type: 'Full-time',
      description: 'Converted Figma-based UI designs into custom WordPress layouts & PHP backends. Managed live server deployments, direct client modifications, and led developer teams.',
      highlights: ['Figma to WordPress/PHP conversion', 'Live server management', 'Team leadership & code review', 'Client-facing project delivery']
    },
    {
      company: 'Web Glaze Services',
      role: 'Web Developer',
      period: 'July 2023 – April 2025',
      location: 'Delhi, India',
      type: 'Full-time',
      description: 'Built comprehensive front-end and back-end web solutions. Developed real-world client websites, dynamic web applications, and custom REST API integrations.',
      highlights: ['Full-stack web development', 'REST API integrations', 'Client website development', 'Dynamic web applications']
    }
  ],
  education: [
    {
      institution: 'Amity University Online',
      degree: 'Bachelor of Computer Applications (BCA)',
      field: 'Computer Applications & Software Engineering',
      period: '2025 – 2028',
      description: 'Focusing on advanced computer science, software engineering principles, database systems, algorithms, and enterprise web architecture.'
    },
    {
      institution: 'Board of Technical Education / Polytechnic',
      degree: 'Diploma in Computer Engineering / IT',
      field: 'Computer Science & Technology',
      period: '2022 – 2025',
      description: 'Rigorous technical foundation in programming, object-oriented software engineering, database management, and full-stack web development.'
    },
    {
      institution: 'CBSE Board',
      degree: 'Senior Secondary Examination (Class 12th)',
      field: 'Science / Computer Science',
      period: '2021 – 2022',
      description: 'Completed senior secondary schooling with strong focus on computer science, mathematics, and analytical problem-solving.'
    },
    {
      institution: 'CBSE Board',
      degree: 'Secondary School Examination (Class 10th)',
      field: 'High School Curriculum',
      period: '2019 – 2020',
      description: 'Foundational secondary school education with distinction in mathematics, science, and computer applications.'
    }
  ]
};

async function siteConfigRoutes(fastify, options) {
  // Public: Get Site Configuration
  fastify.get('/', async (request, reply) => {
    try {
      if (mongoose.connection.readyState === 1) {
        let config = await SiteConfig.findOne();
        if (!config) {
          config = await SiteConfig.create(inMemoryConfig);
        }
        return { success: true, data: config };
      }
    } catch (e) {
      console.warn('[SiteConfig] Returning in-memory fallback:', e.message);
    }
    return { success: true, data: inMemoryConfig };
  });

  // Admin: Update Site Configuration
  fastify.put('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const updateData = { ...(request.body || {}) };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    inMemoryConfig = { ...inMemoryConfig, ...updateData };

    try {
      if (mongoose.connection.readyState === 1) {
        let config = await SiteConfig.findOne();
        if (!config) {
          config = await SiteConfig.create(inMemoryConfig);
        } else {
          config = await SiteConfig.findByIdAndUpdate(config._id, updateData, { new: true, runValidators: true });
        }
        return { success: true, message: 'Site configuration updated successfully', data: config };
      }
    } catch (e) {
      console.warn('[SiteConfig] DB update failed, updated in-memory:', e.message);
    }

    return { success: true, message: 'Site configuration updated successfully (in-memory)', data: inMemoryConfig };
  });
}

module.exports = siteConfigRoutes;
