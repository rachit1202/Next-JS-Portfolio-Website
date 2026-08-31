const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema(
  {
    // Profile & Personal
    name: { type: String, default: 'Rachit Aggarwal' },
    title: { type: String, default: 'Senior Web Developer & Full-Stack Engineer' },
    role: { type: String, default: 'Full-Stack Developer' },
    shortBio: { type: String, default: 'Senior Web Developer with 3+ years crafting fast, elegant, and scalable web applications.' },
    aboutHeadline: { type: String, default: 'Crafting the web with precision & passion.' },
    aboutBio: [
      { type: String }
    ],
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600' },
    cvUrl: { type: String, default: '#' },
    availabilityStatus: { type: String, default: 'Available for freelance work' },
    workingHours: { type: String, default: 'Mon–Sat: 9AM – 8PM IST' },
    location: { type: String, default: 'Rohini, New Delhi 110085, India' },
    email: { type: String, default: 'rachitaggarwal1202@gmail.com' },
    phone: { type: String, default: '+91 9873088907' },
    whatsapp: { type: String, default: '+91 9873088907' },
    websiteUrl: { type: String, default: 'https://rachitaggarwal.dev' },
    websiteLabel: { type: String, default: 'rachitaggarwal.dev' },
    githubUsername: { type: String, default: '@rachit1202' },
    linkedinUsername: { type: String, default: 'in/rachit-aggarwal-b9492b248' },
    leadNotificationEmails: { type: String, default: 'aggarwalrachit1202@gmail.com' },

    // SMTP Mailer Configuration
    smtpHost: { type: String, default: 'smtp.gmail.com' },
    smtpPort: { type: Number, default: 465 },
    smtpSecure: { type: Boolean, default: true },
    smtpUser: { type: String, default: 'aggarwalrachit1202@gmail.com' },
    smtpPass: { type: String, default: '' },
    smtpSenderName: { type: String, default: 'Rachit Aggarwal Portfolio' },

    // Contact Form Dynamic Options
    contactFormServices: [
      { type: String }
    ],
    contactFormBudgets: [
      { type: String }
    ],

    // Metrics & Stats
    experienceYears: { type: String, default: '3+' },
    completedProjects: { type: String, default: '25+' },
    happyClients: { type: String, default: '20+' },
    satisfactionRate: { type: String, default: '99%' },

    // Social Links
    githubUrl: { type: String, default: 'https://github.com/rachit1202' },
    linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/rachit-aggarwal-b9492b248/' },
    twitterUrl: { type: String, default: 'https://twitter.com/rachitaggarwal' },

    // Hero / Home Page Texts
    heroTitleWord1: { type: String, default: 'Building' },
    heroTitleWord2: { type: String, default: 'digital' },
    heroTitleWord3: { type: String, default: 'excellence.' },
    heroDescription: { type: String, default: 'Senior Web Developer with 3+ years crafting fast, elegant, and scalable web applications.' },

    // CTA Banners Configuration
    ctaHeading: { type: String, default: 'Ready to bring your vision to life?' },
    ctaSubtitle: { type: String, default: "Whether it's a startup MVP, enterprise platform, or WordPress site — let's make it happen." },
    ctaPrimaryBtn: { type: String, default: 'Start a Conversation' },
    ctaSecondaryBtn: { type: String, default: 'Explore All Work' },

    // Single Project Page CTA Banner
    projectCtaTagline: { type: String, default: '// INTERESTED IN SIMILAR WORK?' },
    projectCtaHeading: { type: String, default: 'Need a high-impact platform like {title}?' },
    projectCtaSubtitle: { type: String, default: "Let's build something exceptional for your business or startup." },
    projectCtaPrimaryBtn: { type: String, default: 'Start a Conversation' },
    projectCtaSecondaryBtn: { type: String, default: 'Explore More Projects' },

    // Single Service Page CTA Banner
    serviceCtaTagline: { type: String, default: '// GET STARTED' },
    serviceCtaHeading: { type: String, default: 'Ready to build with {title}?' },
    serviceCtaSubtitle: { type: String, default: "Let's schedule a quick call to discuss your exact project specs, timeline, and deliverables." },
    serviceCtaPrimaryBtn: { type: String, default: 'Start Your Project' },
    serviceCtaSecondaryBtn: { type: String, default: 'Email Directly' },

    // Footer Configuration
    footerTagline: { type: String, default: "// LET'S COLLABORATE" },
    footerHeading: { type: String, default: "Have a project in mind?\nLet's build it together." },
    footerButtonText: { type: String, default: "Start a Project" },
    footerButtonUrl: { type: String, default: "/contact" },
    footerShortBio: { type: String, default: "Senior Web Developer crafting fast, elegant, and scalable digital solutions using Next.js, Node.js, Fastify & WordPress." },
    footerCopyrightText: { type: String, default: "© {year} Rachit Aggarwal. All rights reserved." },

    // Dynamic Technical Skills
    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'Frontend' }, // Frontend, Backend, Database, CMS, Architecture, Tools
        level: { type: Number, default: 90 },
        icon: { type: String, default: 'Code2' }
      }
    ],

    // Work Experiences
    experiences: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        period: { type: String, required: true },
        location: { type: String, default: 'Noida, India' },
        type: { type: String, default: 'Full-time' },
        description: { type: String, required: true },
        highlights: [{ type: String }]
      }
    ],

    // Education
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, default: 'Information Technology' },
        period: { type: String, required: true },
        description: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
