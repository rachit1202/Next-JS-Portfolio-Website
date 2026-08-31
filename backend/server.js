require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const http = require('http');
const https = require('https');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');
const { authenticate } = require('./middleware/auth');

// Route imports
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const blogRoutes = require('./routes/blog.routes');
const serviceRoutes = require('./routes/service.routes');
const leadRoutes = require('./routes/lead.routes');
const seoRoutes = require('./routes/seo.routes');
const sitemapRoutes = require('./routes/sitemap.routes');
const siteConfigRoutes = require('./routes/siteConfig.routes');
const monitoringRoutes = require('./routes/monitoring.routes');

const server = Fastify({
  logger: true
});

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Register Plugins
    await server.register(cors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'Cache-Control', 'Pragma', 'Expires'],
      credentials: true
    });

    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'super_secret_jwt_key_rachit_portfolio_2026_x89a'
    });

    // Decorate Fastify instance with authenticate hook
    server.decorate('authenticate', authenticate);

    // Auto-connect DB if momentarily disconnected
    server.addHook('onRequest', async () => {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }
    });

    // Global Error Handler to guarantee CORS headers on error responses (401, 400, 500)
    server.setErrorHandler((error, request, reply) => {
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header('Access-Control-Allow-Headers', '*');
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      const statusCode = error.statusCode || reply.statusCode || 500;
      reply.code(statusCode < 400 ? 500 : statusCode).send({
        error: true,
        message: error.message || 'An unexpected error occurred.'
      });
    });

    // 3. Seed Database
    await seedData();

    // 4. Register API Routes
    server.register(authRoutes, { prefix: '/api/auth' });
    server.register(projectRoutes, { prefix: '/api/projects' });
    server.register(blogRoutes, { prefix: '/api/blogs' });
    server.register(serviceRoutes, { prefix: '/api/services' });
    server.register(leadRoutes, { prefix: '/api/leads' });
    server.register(seoRoutes, { prefix: '/api/seo' });
    server.register(siteConfigRoutes, { prefix: '/api/site-config' });
    server.register(monitoringRoutes, { prefix: '/api/monitoring' });
    server.register(sitemapRoutes);

    // Health check route
    server.get('/api/health', async () => {
      return { status: 'OK', message: 'Rachit Aggarwal Portfolio API Server Running', timestamp: new Date() };
    });

    const port = process.env.PORT || 5000;
    await server.listen({ port: Number(port), host: '0.0.0.0' });
    console.log(`[Fastify Server] Running on http://localhost:${port}`);

    // ── Keep-Alive Self-Ping ─────────────────────────────────────────────────
    // Render Free Tier spins down servers after 15 min of inactivity.
    // This pings the health endpoint every 13 minutes to keep the server warm.
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    if (RENDER_URL && RENDER_URL.startsWith('http')) {
      const pingInterval = 13 * 60 * 1000; // 13 minutes
      const pingUrl = `${RENDER_URL}/api/health`;
      const pingLib = pingUrl.startsWith('https') ? https : http;

      setInterval(() => {
        pingLib.get(pingUrl, (res) => {
          console.log(`[Keep-Alive] Self-ping → ${pingUrl} — ${res.statusCode}`);
        }).on('error', (err) => {
          console.warn(`[Keep-Alive] Ping failed: ${err.message}`);
        });
      }, pingInterval);

      console.log(`[Keep-Alive] Self-ping active → ${pingUrl} every 13 min`);
    } else {
      console.log('[Keep-Alive] RENDER_EXTERNAL_URL not set — self-ping disabled (local dev).');
    }
    // ─────────────────────────────────────────────────────────────────────────
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
