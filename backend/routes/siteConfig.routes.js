const SiteConfig = require('../models/SiteConfig');

// Default values used ONLY when creating the very first record in DB
const defaultConfig = {
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
  websiteUrl: 'https://rachitaggarwal.dev',
  websiteLabel: 'rachitaggarwal.dev',
  githubUsername: '@rachit1202',
  linkedinUsername: 'in/rachit-aggarwal-b9492b248',
  leadNotificationEmails: 'aggarwalrachit1202@gmail.com',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 465,
  smtpSecure: true,
  smtpUser: 'aggarwalrachit1202@gmail.com',
  smtpPass: '',
  smtpSenderName: 'Rachit Aggarwal Portfolio',
  contactFormServices: [
    'Full-Stack Web Development',
    'Custom WordPress & PHP Solutions',
    'UI/UX Design & High-Fidelity Figma',
    'Cyber Security Hardening & Penetration Testing',
    'SEO & Search Engine Dominance',
    'Website Maintenance & Speed Optimization',
    'Technical Consultation'
  ],
  contactFormBudgets: ['Under ₹40K', '₹40K - ₹1.2L', '₹1.2L - ₹2.5L', '₹2.5L+'],
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
  ctaHeading: 'Ready to bring your vision to life?',
  ctaSubtitle: "Whether it's a startup MVP, enterprise platform, or WordPress site — let's make it happen.",
  ctaPrimaryBtn: 'Start a Conversation',
  ctaSecondaryBtn: 'Explore All Work',
  projectCtaTagline: '// INTERESTED IN SIMILAR WORK?',
  projectCtaHeading: 'Need a high-impact platform like {title}?',
  projectCtaSubtitle: "Let's build something exceptional for your business or startup.",
  projectCtaPrimaryBtn: 'Start a Conversation',
  projectCtaSecondaryBtn: 'Explore More Projects',
  serviceCtaTagline: '// GET STARTED',
  serviceCtaHeading: 'Ready to build with {title}?',
  serviceCtaSubtitle: "Let's schedule a quick call to discuss your exact project specs, timeline, and deliverables.",
  serviceCtaPrimaryBtn: 'Start Your Project',
  serviceCtaSecondaryBtn: 'Email Directly',
  footerTagline: "// LET'S COLLABORATE",
  footerHeading: "Have a project in mind?\nLet's build it together.",
  footerButtonText: 'Start a Project',
  footerButtonUrl: '/contact',
  footerShortBio: 'Senior Web Developer crafting fast, elegant, and scalable digital solutions using Next.js, Node.js, Fastify & WordPress.',
  footerCopyrightText: '© {year} Rachit Aggarwal. All rights reserved.',
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
  // Public: Get Site Configuration — always from DB
  fastify.get('/', async (request, reply) => {
    try {
      let config = await SiteConfig.findOne().lean();
      if (!config) {
        // First time: create the record in DB using defaults
        config = await SiteConfig.create(defaultConfig);
        console.log('[SiteConfig] First-time default config created in DB.');
      }
      return { success: true, data: config };
    } catch (err) {
      console.error('[SiteConfig GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database unavailable. Please retry in a moment.' });
    }
  });

  // Admin: Update Site Configuration — always to DB
  fastify.put('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const updateData = { ...(request.body || {}) };
    // Strip MongoDB internal fields
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    try {
      let config = await SiteConfig.findOne();
      if (!config) {
        // No record yet — create it with the submitted data merged into defaults
        config = await SiteConfig.create({ ...defaultConfig, ...updateData });
        console.log('[SiteConfig] Config record created on first PUT.');
      } else {
        config = await SiteConfig.findByIdAndUpdate(
          config._id,
          { $set: updateData },
          { new: true, runValidators: false }
        );
      }
      return { success: true, message: 'Site configuration updated successfully.', data: config };
    } catch (err) {
      console.error('[SiteConfig PUT] DB error:', err.message);
      return reply.code(500).send({ success: false, message: 'Failed to save configuration: ' + err.message });
    }
  });
}

module.exports = siteConfigRoutes;
