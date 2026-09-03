const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { sendLeadNotificationEmail, sendTestEmail } = require('../utils/mailer');

async function leadRoutes(fastify, options) {
  // Admin: Send test email to verify SMTP configuration
  fastify.post('/test-email', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { targetEmail, customConfig } = request.body || {};
    try {
      const result = await sendTestEmail(targetEmail, customConfig);
      if (!result.success) {
        return reply.code(400).send({ success: false, message: result.error || 'Failed to send test email.' });
      }
      return { success: true, message: `Test email successfully delivered to ${result.recipient}!` };
    } catch (err) {
      console.error('[Test Email Error]:', err.message);
      return reply.code(500).send({ success: false, message: err.message });
    }
  });

  // Public: Submit contact form lead
  fastify.post('/', async (request, reply) => {
    const { name, email, phone, subject, serviceNeeded, budget, message, pageUrl } = request.body || {};

    if (!name || !email || !message) {
      return reply.code(400).send({ error: true, message: 'Name, email, and message are required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.code(400).send({ error: true, message: 'Please provide a valid email address.' });
    }

    // Capture User IP Address and Source Page URL
    const rawIp = request.headers['x-forwarded-for'] || 
                  request.headers['x-real-ip'] || 
                  request.ip || 
                  request.raw?.socket?.remoteAddress || '';
    const ipAddress = (typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '').replace('::ffff:', '') || '127.0.0.1';
    const userAgent = request.headers['user-agent'] || '';
    const finalPageUrl = pageUrl || request.headers['referer'] || 'https://rachitaggarwal.vercel.app/contact';
    const finalSubject = subject || `${serviceNeeded || 'Project Inquiry'} - ${name}`;

    try {
      const createdLead = await Lead.create({
        name,
        email,
        phone: phone || '',
        subject: finalSubject,
        serviceNeeded: serviceNeeded || 'General Inquiry',
        budget: budget || 'Flexible',
        message,
        ipAddress,
        pageUrl: finalPageUrl,
        userAgent,
        status: 'New'
      });

      // Send async email notification (non-blocking)
      sendLeadNotificationEmail(createdLead).catch((emailErr) => {
        console.warn('[Email Dispatch Warning] Could not send lead notification email:', emailErr.message);
      });

      return reply.code(201).send({
        success: true,
        message: 'Thank you! Your message has been received. Rachit will get back to you shortly.',
        data: createdLead
      });
    } catch (err) {
      console.error('[Lead Submit Error] DB failed:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to submit inquiry to DB: ' + err.message });
    }
  });

  // Admin: Get all leads with status statistics and filtering
  fastify.get('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { status, search } = request.query || {};
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ];
      }

      const [leads, allLeads] = await Promise.all([
        Lead.find(query).sort({ createdAt: -1 }),
        Lead.find({}, 'status')
      ]);

      const stats = {
        total: allLeads.length,
        newCount: allLeads.filter(l => l.status === 'New').length,
        inProgressCount: allLeads.filter(l => l.status === 'In Progress').length,
        contactedCount: allLeads.filter(l => l.status === 'Contacted').length,
        closedCount: allLeads.filter(l => l.status === 'Closed').length
      };

      return {
        success: true,
        stats,
        count: leads.length,
        data: leads
      };
    } catch (err) {
      console.error('[Leads GET] DB error:', err.message);
      return reply.code(503).send({ success: false, message: 'Database error: ' + err.message, data: [], stats: { total: 0, newCount: 0, inProgressCount: 0, contactedCount: 0, closedCount: 0 } });
    }
  });

  // Admin: Update lead status and internal notes
  fastify.patch('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const { status, notes } = request.body || {};

    const updateObj = {};
    if (status) updateObj.status = status;
    if (notes !== undefined) updateObj.notes = notes;

    try {
      const updated = await Lead.findByIdAndUpdate(id, { $set: updateObj }, { new: true, runValidators: true });
      if (!updated) {
        return reply.code(404).send({ error: true, message: 'Lead not found in DB.' });
      }
      return { success: true, message: 'Lead updated successfully in DB.', data: updated };
    } catch (err) {
      console.error('[Lead PATCH] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to update lead in DB: ' + err.message });
    }
  });

  // Admin: Delete lead
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    try {
      const deleted = await Lead.findByIdAndDelete(id);
      if (!deleted) {
        return reply.code(404).send({ error: true, message: 'Lead not found in DB.' });
      }
      return { success: true, message: 'Lead deleted successfully from DB.' };
    } catch (err) {
      console.error('[Lead DELETE] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to delete lead from DB: ' + err.message });
    }
  });
}

module.exports = leadRoutes;
