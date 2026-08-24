const Project = require('../models/Project');
const Blog = require('../models/Blog');

async function sitemapRoutes(fastify, options) {
  // Public: Dynamic XML Sitemap for SEO crawlers
  fastify.get('/sitemap.xml', async (request, reply) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const projects = await Project.find({ isPublished: true }, 'slug updatedAt');
    const blogs = await Blog.find({ isPublished: true }, 'slug updatedAt');

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/services', priority: '0.9', changefreq: 'weekly' },
      { url: '/projects', priority: '0.9', changefreq: 'weekly' },
      { url: '/blogs', priority: '0.9', changefreq: 'daily' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Projects
    projects.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/projects/${p.slug}</loc>\n`;
      xml += `    <lastmod>${(p.updatedAt || new Date()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Blogs
    blogs.forEach(b => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blogs/${b.slug}</loc>\n`;
      xml += `    <lastmod>${(b.updatedAt || new Date()).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    reply.type('application/xml').send(xml);
  });
}

module.exports = sitemapRoutes;
