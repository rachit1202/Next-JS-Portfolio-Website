const mongoose = require('mongoose');

async function monitoringRoutes(fastify, options) {
  // Public / Admin: Live Health & System Metrics
  fastify.get('/health', async (request, reply) => {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let dbLatencyMs = null;
    let collections = [];

    if (mongoose.connection.readyState === 1) {
      dbStatus = 'connected';
      try {
        const pingStart = Date.now();
        await mongoose.connection.db.admin().ping();
        dbLatencyMs = Date.now() - pingStart;
        
        const cols = await mongoose.connection.db.listCollections().toArray();
        collections = cols.map(c => c.name);
      } catch (err) {
        dbStatus = 'error: ' + err.message;
      }
    } else if (mongoose.connection.readyState === 2) {
      dbStatus = 'connecting';
    }

    const memoryUsage = process.memoryUsage();
    const uptimeSec = Math.floor(process.uptime());

    const totalResponseTimeMs = Date.now() - startTime;

    return {
      success: true,
      status: 'operational',
      timestamp: new Date().toISOString(),
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: uptimeSec,
        uptimeFormatted: formatUptime(uptimeSec),
        memory: {
          rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 10) / 10,
          heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 10) / 10,
          heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 10) / 10,
        },
        responseTimeMs: totalResponseTimeMs
      },
      database: {
        type: 'MongoDB Atlas',
        status: dbStatus,
        latencyMs: dbLatencyMs,
        collectionsCount: collections.length,
        collections: collections
      },
      endpoints: [
        { name: 'Projects API', path: '/api/projects', method: 'GET' },
        { name: 'Services API', path: '/api/services', method: 'GET' },
        { name: 'Blogs API', path: '/api/blogs', method: 'GET' },
        { name: 'Site Config CMS', path: '/api/site-config', method: 'GET' },
        { name: 'SEO Metadata API', path: '/api/seo', method: 'GET' },
        { name: 'Inquiries API', path: '/api/leads', method: 'GET' },
        { name: 'System Health API', path: '/api/monitoring/health', method: 'GET' }
      ]
    };
  });

  // Comprehensive Real-Time API benchmark runner
  fastify.get('/benchmark', async (request, reply) => {
    const endpoints = [
      { id: 'site-config', name: 'Site Config CMS', path: '/api/site-config' },
      { id: 'projects', name: 'Projects Catalog', path: '/api/projects' },
      { id: 'services', name: 'Services Offerings', path: '/api/services' },
      { id: 'blogs', name: 'Blogs & Articles', path: '/api/blogs' },
      { id: 'seo', name: 'SEO & Metadata', path: '/api/seo' },
      { id: 'health', name: 'System Health Probe', path: '/api/monitoring/health' },
    ];

    const results = [];
    const baseUrl = `http://localhost:${process.env.PORT || 5000}`;

    for (const ep of endpoints) {
      const epStart = Date.now();
      let status = 200;
      let ok = true;
      let errorMsg = null;
      let itemsCount = null;

      try {
        const res = await fastify.inject({
          method: 'GET',
          url: ep.path
        });
        status = res.statusCode;
        const latency = Date.now() - epStart;
        const payload = JSON.parse(res.payload || '{}');
        itemsCount = Array.isArray(payload.data) ? payload.data.length : (payload.data ? 1 : null);

        results.push({
          id: ep.id,
          name: ep.name,
          path: ep.path,
          method: 'GET',
          statusCode: status,
          statusText: status === 200 ? 'Healthy' : 'Degraded',
          latencyMs: latency,
          category: latency < 100 ? 'Optimal' : latency < 300 ? 'Moderate' : 'High Latency',
          itemsCount: itemsCount,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        const latency = Date.now() - epStart;
        results.push({
          id: ep.id,
          name: ep.name,
          path: ep.path,
          method: 'GET',
          statusCode: 500,
          statusText: 'Down / Error',
          latencyMs: latency,
          category: 'Down',
          error: err.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Sort by latency descending so the user immediately spots the slowest API
    const sortedByLatency = [...results].sort((a, b) => b.latencyMs - a.latencyMs);
    const slowest = sortedByLatency[0];
    const fastest = sortedByLatency[sortedByLatency.length - 1];
    const avgLatency = Math.round(results.reduce((acc, r) => acc + r.latencyMs, 0) / results.length);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalEndpoints: results.length,
        healthyCount: results.filter(r => r.statusCode === 200).length,
        slowestApi: slowest ? { name: slowest.name, latencyMs: slowest.latencyMs } : null,
        fastestApi: fastest ? { name: fastest.name, latencyMs: fastest.latencyMs } : null,
        avgLatencyMs: avgLatency,
        allOperational: results.every(r => r.statusCode === 200)
      },
      endpoints: results
    };
  });
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
}

module.exports = monitoringRoutes;
