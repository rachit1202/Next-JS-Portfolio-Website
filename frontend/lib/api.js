const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Timeout in ms for API calls.
// Server-side (SSR): 5s — fast page render with defaults if backend is cold.
// Client-side (browser): 60s — gives ample time for Render free tier spin-up on login & saves.
const SSR_TIMEOUT_MS = 5000;
const CLIENT_TIMEOUT_MS = 60000;

// Helper for HTTP requests with timeout
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...options.headers };

  // Only set Content-Type if there is a body to send
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if stored in localStorage (client-side only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rachit_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Use shorter timeout for SSR (server components) to avoid blocking page render
  const isBrowser = typeof window !== 'undefined';
  const timeoutMs = isBrowser ? CLIENT_TIMEOUT_MS : SSR_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API Error');
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    const isTimeout = error.name === 'AbortError';
    if (isTimeout && isBrowser) {
      throw new Error('Server took too long to respond. It may be waking up, please retry.');
    }
    console.warn(`[API ${isTimeout ? 'TIMEOUT' : 'ERROR'}] ${endpoint}: ${isTimeout ? `No response in ${timeoutMs}ms` : error.message}`);
    throw error;
  }
}


export const api = {
  // Site Configuration & Personal Details (Dynamic CMS)
  getSiteConfig: () => fetchAPI('/site-config').catch(() => ({ success: true, data: defaultSiteConfig })),
  updateSiteConfig: (data) => fetchAPI('/site-config', { method: 'PUT', body: JSON.stringify(data) }),

  // SEO
  getSeo: () => fetchAPI('/seo').catch(() => ({ success: true, data: defaultSeo })),
  updateSeo: (data) => fetchAPI('/seo', { method: 'PUT', body: JSON.stringify(data) }),

  // Projects
  getProjects: (params = '') => {
    let query = '';
    if (typeof params === 'string') {
      query = params ? (params.startsWith('?') ? params : `?${params}`) : '';
    } else if (params && typeof params === 'object') {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
      });
      const s = q.toString();
      query = s ? `?${s}` : '';
    }
    return fetchAPI(`/projects${query}`).catch(() => ({
      success: true,
      data: defaultProjects,
      pagination: { total: defaultProjects.length, page: 1, limit: defaultProjects.length, totalPages: 1, hasPrev: false, hasNext: false }
    }));
  },
  getProjectBySlug: (slug) => fetchAPI(`/projects/${slug}`).catch(() => ({ success: true, data: defaultProjects.find(p => p.slug === slug) || defaultProjects[0] })),
  getAdminProjects: () => fetchAPI('/projects/admin/all'),
  createProject: (data) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),

  // Blogs
  getBlogs: (params = '') => {
    let query = '';
    if (typeof params === 'string') {
      query = params ? (params.startsWith('?') ? params : `?${params}`) : '';
    } else if (params && typeof params === 'object') {
      const q = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
      });
      const s = q.toString();
      query = s ? `?${s}` : '';
    }
    return fetchAPI(`/blogs${query}`).catch(() => ({
      success: true,
      data: defaultBlogs,
      pagination: { total: defaultBlogs.length, page: 1, limit: defaultBlogs.length, totalPages: 1, hasPrev: false, hasNext: false }
    }));
  },
  getBlogBySlug: (slug) => fetchAPI(`/blogs/${slug}`).catch(() => ({ success: true, data: defaultBlogs.find(b => b.slug === slug) || defaultBlogs[0] })),
  getAdminBlogs: () => fetchAPI('/blogs/admin/all'),
  createBlog: (data) => fetchAPI('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  updateBlog: (id, data) => fetchAPI(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlog: (id) => fetchAPI(`/blogs/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => fetchAPI('/services').catch(() => ({ success: true, data: defaultServices })),
  getServiceBySlug: (slug) => fetchAPI(`/services/${slug}`).catch(() => ({ success: true, data: defaultServices.find(s => s.slug === slug) || defaultServices[0] })),
  getAdminServices: () => fetchAPI('/services/admin/all'),
  createService: (data) => fetchAPI('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => fetchAPI(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => fetchAPI(`/services/${id}`, { method: 'DELETE' }),

  // Leads
  submitLead: (data) => fetchAPI('/leads', { method: 'POST', body: JSON.stringify(data) }),
  getLeads: () => fetchAPI('/leads'),
  updateLeadStatus: (id, status) => fetchAPI(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteLead: (id) => fetchAPI(`/leads/${id}`, { method: 'DELETE' }),
  testEmail: (data) => fetchAPI('/leads/test-email', { method: 'POST', body: JSON.stringify(data) }),

  // System & API Monitoring Telemetry
  getMonitoringHealth: () => fetchAPI('/monitoring/health'),
  getMonitoringBenchmark: () => fetchAPI('/monitoring/benchmark'),

  // Auth & User Management
  login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetchAPI('/auth/me'),
  changePassword: (data) => fetchAPI('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => fetchAPI('/auth/users'),
  createUser: (data) => fetchAPI('/auth/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => fetchAPI(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  resetUserPassword: (id, newPassword) => fetchAPI(`/auth/users/${id}/reset-password`, { method: 'PUT', body: JSON.stringify({ newPassword }) }),
  deleteUser: (id) => fetchAPI(`/auth/users/${id}`, { method: 'DELETE' })
};

export const defaultSiteConfig = {
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
  contactFormServices: [
    'Full-Stack Web Development',
    'Custom WordPress & PHP Solutions',
    'UI/UX Design & High-Fidelity Figma',
    'Cyber Security Hardening & Penetration Testing',
    'SEO & Search Engine Dominance',
    'Website Maintenance & Speed Optimization',
    'Technical Consultation'
  ],
  contactFormBudgets: [
    'Under ₹40K',
    '₹40K - ₹1.2L',
    '₹1.2L - ₹2.5L',
    '₹2.5L+'
  ],
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
  heroDescription: 'Senior Web Developer with 3+ years crafting fast, elegant, and scalable web applications.',
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
  footerButtonText: "Start a Project",
  footerButtonUrl: "/contact",
  footerShortBio: "Senior Web Developer crafting fast, elegant, and scalable digital solutions using Next.js, Node.js, Fastify & WordPress.",
  footerCopyrightText: "© {year} Rachit Aggarwal. All rights reserved.",
  skills: [
    { name: 'Next.js 14 / React', category: 'Frontend', level: 95, icon: 'Layout' },
    { name: 'Node.js & Fastify', category: 'Backend', level: 92, icon: 'Server' },
    { name: 'MongoDB & Mongoose', category: 'Database', level: 88, icon: 'Database' },
    { name: 'WordPress & Custom PHP', category: 'CMS', level: 92, icon: 'Globe' },
    { name: 'REST & GraphQL APIs', category: 'Architecture', level: 90, icon: 'Cpu' },
    { name: 'MySQL & PostgreSQL', category: 'Database', level: 82, icon: 'Database' },
    { name: 'Tailwind CSS & Modern UI', category: 'Styling', level: 95, icon: 'Palette' },
    { name: 'TypeScript & JavaScript', category: 'Frontend', level: 90, icon: 'Code' },
    { name: 'Linux / Docker / CI-CD', category: 'DevOps', level: 80, icon: 'Terminal' }
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

// Fallbacks for instant SSR rendering or offline preview
const defaultSeo = {
  siteName: 'Rachit Aggarwal | Senior Software Developer',
  defaultTitle: 'Rachit Aggarwal - Senior Full-Stack & MERN Developer',
  defaultDescription: 'Official portfolio & website of Rachit Aggarwal. Senior Web Developer specializing in Next.js, Node.js, Fastify, MongoDB, PHP, and scalable digital solutions.',
  keywords: ['Rachit Aggarwal', 'Senior Web Developer', 'Full-Stack Developer', 'Next.js', 'Fastify', 'MERN Stack'],
  contactEmail: 'rachitaggarwal1202@gmail.com',
  contactPhone: '+91 9873088907',
  location: 'Rohini, New Delhi, India'
};

const defaultServices = [
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
    priceEstimate: 'Custom Quote'
  },
  {
    _id: 's2',
    title: 'Custom WordPress & PHP Solutions',
    slug: 'wordpress-php-development',
    category: 'Development',
    icon: 'Globe',
    shortDesc: 'Custom WordPress themes, plugins, and PHP backends tailored to your business needs.',
    fullDesc: 'From Figma designs to fully functional custom WordPress websites. Custom theme development without bloated page builders, advanced custom fields (ACF Pro), WooCommerce e-commerce engines, and high-performance PHP backends.',
    techStack: ['WordPress', 'PHP 8+', 'MySQL', 'ACF Pro', 'WooCommerce', 'JavaScript', 'Tailwind CSS / SCSS', 'cPanel / Linux'],
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
    priceEstimate: 'Custom Quote'
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
    priceEstimate: 'Custom Quote'
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
    priceEstimate: 'Monthly Retainer'
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
    priceEstimate: 'Custom Quote'
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
    priceEstimate: 'Custom Quote'
  }
];

const defaultProjects = [
  {
    _id: 'p1',
    title: 'Shri Sai Stationery',
    slug: 'shri-sai-stationery',
    category: 'E-Commerce & Retail',
    shortDescription: 'Comprehensive online stationery & office supplies e-commerce catalog platform with intuitive product filtering, fast checkout, and responsive design.',
    fullDescription: `A high-performance e-commerce and retail catalog system built for Shri Sai Stationery. Features streamlined inventory search, bulk inquiry workflows, responsive product cards, and instant payment integration.\n\n### Key Architectural Highlights\n- **Optimized Catalog Architecture**: Fast product filtering by categories, brands, and price tiers with instant feedback.\n- **Custom Checkout Flow**: Tailored ordering pipeline supporting online payments, quotation generation, and automated invoices.\n- **Mobile-First UX**: 100% fluid mobile experience with sub-second page loads and Lighthouse 95+ performance.\n- **SEO & Search Dominance**: Structured schema for product metadata, rich snippets, and Google Merchant indexing.`,
    coverImage: '/projects/shri-sai-stationery.webp',
    liveUrl: 'https://web-apex.com/our-portfolio/shri-sai-stationery/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'WooCommerce', 'PHP 8.2', 'MySQL', 'Tailwind CSS', 'Payment Gateway'],
    clientName: 'Shri Sai Stationery',
    role: 'Senior Web Developer',
    featured: true
  },
  {
    _id: 'p2',
    title: 'Pagenest Jobs',
    slug: 'pagenest-jobs',
    category: 'Recruitment & Web Portal',
    shortDescription: 'Dynamic recruitment portal and job board featuring candidate job search, employer job postings, resume uploads, and real-time filtering.',
    fullDescription: `Scalable job search and career recruitment portal engineering. Connects job seekers with verified employers through custom search algorithms, automated email alerts, and administrative application management.\n\n### Key Architectural Highlights\n- **Dynamic Filter Engine**: Instant multi-parameter filtering across experience levels, salary brackets, job types, and locations.\n- **Secure Candidate Portal**: Fast resume uploads, profile building, and tracking application status in real-time.\n- **Recruiter Dashboard**: Easy job posting, candidate ranking, and applicant pipeline management.\n- **High-Throughput API**: Fastify and MongoDB microservices handling concurrent search queries seamlessly.`,
    coverImage: '/projects/pagenest.png',
    liveUrl: 'https://web-apex.com/our-portfolio/pagenest-jobs/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['React', 'Next.js', 'Node.js', 'Fastify', 'MongoDB', 'Tailwind CSS'],
    clientName: 'Pagenest Jobs Platform',
    role: 'Full-Stack Architect',
    featured: true
  },
  {
    _id: 'p3',
    title: 'Thornhill Expeditions',
    slug: 'thornhill-expeditions',
    category: 'Travel & Adventure',
    shortDescription: 'Immersive luxury safari and wilderness travel booking platform with dynamic tour itineraries, interactive maps, and lead capture systems.',
    fullDescription: `A luxury travel and expedition showcase website crafted with rich visual typography, day-by-day tour itinerary timelines, dynamic booking inquiry forms, and search engine optimization.\n\n### Key Architectural Highlights\n- **Interactive Itineraries**: Rich collapsible daily schedules, gear packing checklists, and included excursion breakdowns.\n- **High-Resolution Visual Showcase**: Optimized image galleries with lazy-loading for lightning-fast speeds.\n- **Lead Conversion Funnel**: Multi-step inquiry modal integrated with automated CRM notifications.\n- **Search Performance**: Server-rendered dynamic pages with automated XML sitemaps and schema.org integration.`,
    coverImage: '/projects/thornhill-expeditions.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/thornhill-expeditions/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'Custom PHP', 'ACF Pro', 'JavaScript', 'CSS3', 'SEO Engine'],
    clientName: 'Thornhill Expeditions',
    role: 'Senior Web Developer',
    featured: true
  },
  {
    _id: 'p4',
    title: 'Macs Adventure',
    slug: 'macs-adventure',
    category: 'Tour & Booking Platform',
    shortDescription: 'Self-guided walking and cycling holiday platform with custom itinerary planners, route mapping, and instant booking workflows.',
    fullDescription: `Engineered an interactive adventure tourism platform for self-guided walking and cycling holidays across international destinations.\n\n### Key Architectural Highlights\n- **Route & Elevation Mapping**: Interactive trail difficulty ratings, GPS route waypoints, and distance calculators.\n- **Custom Booking Engine**: Date availability pickers, luggage transfer add-ons, and accommodation tier selections.\n- **Performance & PWA**: Offline itinerary caching and responsive traveler guides for mobile on-trail use.\n- **Payment Gateway Integration**: Multi-currency card and wallet checkout with automated booking confirmation.`,
    coverImage: '/projects/macs-adventure.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/macs-adventure/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Interactive Maps'],
    clientName: 'Macs Adventure Travel',
    role: 'Senior Full-Stack Developer',
    featured: true
  },
  {
    _id: 'p5',
    title: 'Oceanwide Properties',
    slug: 'oceanwide-properties',
    category: 'Real Estate Portal',
    shortDescription: 'High-end coastal real estate listing portal with advanced property search filters, currency converters, and lead generation systems.',
    fullDescription: `Modern property listing and real estate portal engineered for premier international real estate investments and luxury coastal homes.\n\n### Key Architectural Highlights\n- **Advanced Property Search**: Custom filtering by location, price, property type, bedrooms, and beachfront proximity.\n- **Interactive Maps & Street View**: Embedded map clustering and neighborhood amenity highlights.\n- **Multilingual & Multi-Currency**: Real-time currency conversions and agent contact WhatsApp integration.\n- **Lead CRM Integration**: Instant inquiry routing directly to real estate brokers with automated follow-ups.`,
    coverImage: '/projects/oceanwide-properties.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/oceanwide-properties/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['WordPress', 'PHP 8+', 'MySQL', 'Google Maps API', 'Tailwind CSS'],
    clientName: 'Oceanwide Properties',
    role: 'Web Developer & Architect',
    featured: true
  },
  {
    _id: 'p6',
    title: 'Genesis Home',
    slug: 'genesis-home',
    category: 'Interior & Architecture',
    shortDescription: 'Elegant architecture and interior design showcase website with high-resolution visual lookbooks, project portfolios, and consultation booking.',
    fullDescription: `A minimalist, high-aesthetic digital showcase for luxury interior designers and architectural studios. Features smooth animations, curated lookbooks, and design service consultation bookings.\n\n### Key Architectural Highlights\n- **Curated Lookbooks**: Categorized interior project galleries with interactive before/after sliders and architectural floorplan views.\n- **Smooth Micro-Animations**: Fluid page transitions and subtle parallax scroll effects using Framer Motion.\n- **Consultation Scheduling**: Interactive calendar booking flow for on-site and virtual interior design consultations.\n- **Responsive Architecture**: Pixel-perfect rendering across high-DPI displays, tablets, and smartphones.`,
    coverImage: '/projects/genesis-home.jpg',
    liveUrl: 'https://web-apex.com/our-portfolio/genesis-home/',
    githubUrl: 'https://github.com/rachit1202',
    techStack: ['Next.js 14', 'React', 'Framer Motion', 'Tailwind CSS', 'Headless CMS'],
    clientName: 'Genesis Home Interior',
    role: 'Frontend & UI Specialist',
    featured: true
  }
];

const defaultBlogs = [
  {
    _id: 'b1',
    title: 'The Ultimate Guide to Modern Full-Stack Web Architecture: Next.js 14 & Fastify Microservices',
    slug: 'ultimate-guide-modern-fullstack-web-architecture',
    category: 'Development',
    summary: 'A comprehensive breakdown of architecting modern, high-throughput web applications using Next.js 14 Server Components, Fastify microservices, and optimized database indexing.',
    content: `Building web applications that can handle high traffic while maintaining sub-second response times requires thoughtful architecture. The combination of **Next.js 14** on the frontend and **Fastify** on the backend represents the gold standard in modern JavaScript/TypeScript engineering.

---

### 1. The Power of Next.js 14 Server Components
Next.js 14 App Router introduces React Server Components (RSC), which execute exclusively on the server. This yields massive benefits:
- **Zero Client Bundle Size**: Heavy dependencies like date-fns, markdown parsers, and sanitizers remain server-side.
- **Direct Database / Microservice Access**: Data fetching happens close to the data source without exposing secret keys to client browsers.
- **Automatic Streaming & Suspense**: Users see the shell and navigation immediately while asynchronous data streams into place.

\`\`\`jsx
// Example Server Component Data Fetching in Next.js 14
export default async function ProjectsPage() {
  const projects = await fetch('https://api.domain.com/projects', {
    next: { revalidate: 60 }
  }).then(res => res.json());

  return <ProjectsGrid projects={projects} />;
}
\`\`\`

---

### 2. Why Fastify Outperforms Traditional Express
Fastify is engineered for extreme throughput. In synthetic and real-world benchmarks, Fastify delivers up to **30,000+ requests per second**, nearly 4x that of traditional Express:
1. **Schema-Driven Serialization**: Using \`fast-json-stringify\`, Fastify pre-compiles JSON response schemas into machine-optimized functions.
2. **Encapsulated Plugin Architecture**: Routes, decorators, and middleware are scoped, eliminating memory leaks and circular dependencies.
3. **Async/Await Native**: Avoids callback overhead and provides clean error handling pipelines.

---

### 3. Database Indexing & Scalability in MongoDB
A fast backend is only as quick as its slowest query. To ensure queries stay below 10ms:
- Create **compound indexes** for queries filtering on multiple fields (e.g., \`{ isPublished: 1, createdAt: -1 }\`).
- Use **projections** to fetch only required fields rather than whole documents.
- Implement Redis caching for frequently accessed read-heavy endpoints like site configs and blog listings.

---

### Conclusion
By pairing Next.js 14 with Fastify and optimized MongoDB storage, developers achieve maximum developer velocity, rock-solid security, and blazingly fast user experiences that scale effortlessly.`,
    coverImage: '/blogs/fullstack-architecture.jpg',
    tags: ['Next.js', 'Node.js', 'Fastify', 'Architecture', 'Full-Stack', 'MongoDB'],
    readTime: '7 min read',
    author: 'Rachit Aggarwal'
  },
  {
    _id: 'b2',
    title: 'Designing for Impact: Principles of High-Converting UI/UX Design & Design Systems in 2026',
    slug: 'high-converting-ui-ux-design-principles-systems',
    category: 'Designing',
    summary: 'How to build scalable Figma design systems, master visual hierarchy, and craft dark glassmorphic interfaces that turn casual visitors into loyal clients.',
    content: `Great design is not just about making things look beautiful — it is about clarity, hierarchy, psychology, and frictionless conversion. In 2026, modern web design has evolved towards high-contrast dark modes, subtle glassmorphism, and structured design token systems.

---

### 1. The 8-Point Grid & Visual Rhythm
Consistent spatial hierarchy is what separates amateur websites from premier digital products. 
- Use multiples of **8px** (4px, 8px, 16px, 24px, 32px, 48px, 64px) for margins, paddings, and component sizing.
- Establish clear typography scales: \`h1 (48px/56px)\`, \`h2 (32px/40px)\`, \`body (16px/24px)\`, \`caption (12px/16px)\`.
- Ensure line-height is at least 150% of the font size for long-form reading comfort.

---

### 2. Mastering Modern Dark Mode & Glassmorphism
Dark themes should never be pure black (\`#000000\`). True black creates harsh contrast that strains the human eye.
- Use rich deep tones like **\`#07070d\`** or **\`#0f0f1c\`** for backgrounds.
- Layer cards with subtle borders (\`rgba(255, 255, 255, 0.08)\`) and multi-layer backdrop blurs (\`backdrop-filter: blur(16px)\`).
- Use vibrant accent gradients (such as Purple \`#9333ea\` ➔ Indigo \`#6366f1\` ➔ Cyan \`#06b6d4\`) to draw attention to Primary Call-To-Action buttons.

\`\`\`css
/* High-End Glassmorphism Card Style */
.glass-card {
  background: rgba(15, 15, 28, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border-radius: 1.5rem;
}
\`\`\`

---

### 3. Psychology of High-Converting CTAs
- **Fitts's Law**: Place action buttons where the cursor or thumb naturally rests on mobile viewports.
- **Single Dominant Action**: Every screen or section must have one unambiguous goal (e.g., "Start a Project" or "View Work").
- **Social Proof Integration**: Place client satisfaction numbers and delivered project counters immediately adjacent to inquiry triggers.

---

### Summary
When design systems in Figma map 1:1 to Tailwind CSS design tokens in code, product development accelerates by 300% and the final user experience feels unified, polished, and unforgettable.`,
    coverImage: '/blogs/ui-ux-design.jpg',
    tags: ['UI/UX Design', 'Figma', 'Design Systems', 'Dark Mode', 'Conversion Rate', 'Typography'],
    readTime: '6 min read',
    author: 'Rachit Aggarwal'
  },
  {
    _id: 'b3',
    title: 'Web Application Security Essentials: Defending Against OWASP Top 10 & API Vulnerabilities',
    slug: 'web-application-security-essentials-owasp-defense',
    category: 'Cyber Security',
    summary: 'Practical developer playbook for locking down web applications against XSS, SQL injection, CSRF, broken authentication, and automated DDoS attack vectors.',
    content: `Cyber threats and automated bot scanners constantly probe web servers for vulnerabilities. Securing full-stack web applications requires defense-in-depth across the frontend, API layer, database, and infrastructure.

---

### 1. Neutralizing Injection & Cross-Site Scripting (XSS)
- **Input Validation**: Never trust client inputs. Always validate and sanitize requests using schemas (like Zod or JSON Schema in Fastify).
- **Escape HTML**: Ensure modern React/Next.js dynamic expressions do not bypass JSX escaping with unvetted \`dangerouslySetInnerHTML\`.
- **Parameterized Queries**: Always use Mongoose schemas or parameterized SQL queries to completely eliminate injection vectors.

---

### 2. Hardening HTTP Security Headers
Every production server should deliver strict security response headers using middleware like Helmet:

\`\`\`javascript
// Essential Security Headers in Node.js / Fastify
const helmet = require('@fastify/helmet');

server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' }
});
\`\`\`

---

### 3. JWT Authentication & Refresh Token Rotation
- Never store JWT access tokens in insecure local storage when handling sensitive transactions.
- Use **HTTP-Only, SameSite=Strict cookies** for session persistence.
- Implement short-lived access tokens (15 minutes) paired with cryptographic refresh token rotation.
- Invalidate token families immediately if token reuse or anomalous IP shifts are detected.

---

### 4. Rate Limiting & Brute Force Defense
Protect authentication and contact submission endpoints with IP-based rate limiting (\`@fastify/rate-limit\`) to prevent brute force credential stuffing and spam abuse.`,
    coverImage: '/blogs/cyber-security.jpg',
    tags: ['Cyber Security', 'OWASP', 'API Security', 'JWT', 'Penetration Testing', 'Node.js'],
    readTime: '8 min read',
    author: 'Rachit Aggarwal'
  },
  {
    _id: 'b4',
    title: 'Proactive Website Maintenance: Ensuring 99.9% Uptime, Sub-Second Speed & Flawless Health',
    slug: 'proactive-website-maintenance-speed-optimization-guide',
    category: 'Maintenance',
    summary: 'Why proactive maintenance matters: automated cloud backups, database vacuuming, Redis caching, dependency security patching, and 24/7 uptime monitoring.',
    content: `A website is not a one-time project — it is a live business asset that requires ongoing care, optimization, and monitoring. Proactive website maintenance prevents disastrous downtimes, data loss, and slow degradation of user experience.

---

### 1. Automated Cloud Backup Strategy (3-2-1 Rule)
- **3 Copies**: Keep three copies of all source code, database dumps, and uploaded media.
- **2 Media Types**: Store backups on primary servers and independent cloud object storage (AWS S3 or Cloudflare R2).
- **1 Offsite**: Keep at least one encrypted cold backup in an isolated location.
- **Restore Testing**: A backup is only as good as its restore capability. Test full database restoration monthly.

---

### 2. Speed Tuning & Core Web Vitals (LCP, CLS, INP)
Slow websites bleed revenue. To maintain Google's green Core Web Vitals scores:
- Convert all images to next-gen **WebP / AVIF** formats with explicit dimensions to prevent layout shifts (CLS).
- Leverage CDN edge caching (Cloudflare) to deliver static assets within 20ms worldwide.
- Defer non-critical scripts and preconnect to critical font CDNs.

\`\`\`bash
# Automated database vacuum & optimization cron example
0 3 * * 0 mongodump --uri="mongodb://..." --archive="/backups/db-$(date +\%Y\%m\%d).gz" --gzip
\`\`\`

---

### 3. 24/7 Uptime & Error Logging
- Implement automated heartbeat ping monitors (e.g. UptimeRobot / BetterStack) alerting within 60 seconds of downtime.
- Collect client-side errors and API 500 exceptions with structured error logging.`,
    coverImage: '/blogs/website-maintenance.jpg',
    tags: ['Maintenance', 'Core Web Vitals', 'Performance', 'Redis', 'Uptime', 'Cloud Backups'],
    readTime: '5 min read',
    author: 'Rachit Aggarwal'
  },
  {
    _id: 'b5',
    title: 'Mastering Technical SEO: Schema Markup, Core Web Vitals & Crawl Budget for Top Google Rankings',
    slug: 'mastering-technical-seo-schema-core-web-vitals',
    category: 'SEO',
    summary: 'The modern engineer guide to Technical SEO: implementing JSON-LD rich snippets, dynamic XML sitemaps, server-side metadata, and Core Web Vitals dominance.',
    content: `Technical SEO is the foundation upon which all content marketing and organic visibility rests. Without proper site architecture, crawler accessibility, and structured data, even the best content remains invisible to search engines.

---

### 1. Dynamic Server-Side Metadata in Next.js
Using Next.js App Router's \`generateMetadata\` API ensures search bots receive fully rendered OpenGraph titles, descriptions, and canonical tags:

\`\`\`javascript
export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);
  return {
    title: \`\${blog.title} | Rachit Aggarwal\`,
    description: blog.summary,
    alternates: {
      canonical: \`https://rachitaggarwal.dev/blogs/\${blog.slug}\`,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: [{ url: blog.coverImage }],
    },
  };
}
\`\`\`

---

### 2. Schema.org JSON-LD Structured Data
Embedding JSON-LD microdata helps search engines generate rich snippets, star ratings, FAQs, and article cards directly in SERP results:
- **Person / Organization Schema**: Establishes author authority and knowledge graph verification.
- **Article / BlogPosting Schema**: Gives exact publishing date, author credentials, and headline metadata.
- **BreadcrumbList Schema**: Helps Google construct intuitive breadcrumbs in search snippets.

---

### 3. Optimizing Crawl Budget & XML Sitemaps
- Generate dynamic XML sitemaps containing all published project, blog, and service URLs with accurate \`lastmod\` timestamps.
- Configure clean \`robots.txt\` disallowing internal admin routes (\`/admin/*\`) to focus search engine bots strictly on indexable content.
- Eliminate 404 broken links and redirect chains with 301 permanent redirects.`,
    coverImage: '/blogs/technical-seo.jpg',
    tags: ['Technical SEO', 'Schema Markup', 'Google Search', 'Core Web Vitals', 'Next.js SEO', 'Sitemaps'],
    readTime: '6 min read',
    author: 'Rachit Aggarwal'
  }
];

