const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const { sendLeadNotificationEmail } = require('../utils/mailer');

let inMemoryLeads = [];

async function leadRoutes(fastify, options) {
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
    const finalPageUrl = pageUrl || request.headers['referer'] || 'https://rachitaggarwal.dev/contact';
    const finalSubject = subject || `${serviceNeeded || 'Project Inquiry'} - ${name}`;

    let createdLeadDoc = null;

    if (mongoose.connection.readyState === 1) {
      try {
        const newLead = await Lead.create({
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
        createdLeadDoc = newLead;
      } catch (e) {
        console.warn('[Lead Submit Error] DB failed:', e.message);
      }
    }

    if (!createdLeadDoc) {
      createdLeadDoc = {
        _id: `lead_${Date.now()}`,
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
        status: 'New',
        createdAt: new Date()
      };
      inMemoryLeads.unshift(createdLeadDoc);
    }

    // Trigger instant email notification in background (non-blocking)
    sendLeadNotificationEmail(createdLeadDoc).catch(err => {
      console.error('[Lead Routes] Mail notification background error:', err.message);
    });

    return reply.code(201).send({
      success: true,
      message: 'Thank you! Your inquiry has been received. Rachit Aggarwal will get back to you shortly.',
      leadId: createdLeadDoc._id
    });
  });

  // Admin: Send test email to verify SMTP configuration
  fastify.post('/test-email', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { targetEmail, customConfig } = request.body || {};
    const { sendTestEmail } = require('../utils/mailer');
    const result = await sendTestEmail(targetEmail, customConfig);
    if (!result.success) {
      return reply.code(400).send({ error: true, message: result.error });
    }
    return { success: true, message: `Test email sent successfully to ${result.recipient}!`, messageId: result.messageId };
  });

  // Admin: Get all lead submissions
  fastify.get('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (mongoose.connection.readyState === 1) {
      try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        const stats = {
          total: leads.length,
          newCount: leads.filter(l => l.status === 'New').length,
          inProgressCount: leads.filter(l => l.status === 'In Progress').length,
          contactedCount: leads.filter(l => l.status === 'Contacted').length,
          closedCount: leads.filter(l => l.status === 'Closed').length
        };
        return { success: true, stats, count: leads.length, data: leads };
      } catch (e) {
        console.warn('[Admin Leads Error] DB failed, using memory fallback:', e.message);
      }
    }

    const stats = {
      total: inMemoryLeads.length,
      newCount: inMemoryLeads.filter(l => l.status === 'New').length,
      inProgressCount: inMemoryLeads.filter(l => l.status === 'In Progress').length,
      contactedCount: inMemoryLeads.filter(l => l.status === 'Contacted').length,
      closedCount: inMemoryLeads.filter(l => l.status === 'Closed').length
    };
    return { success: true, stats, count: inMemoryLeads.length, data: inMemoryLeads };
  });

  // Admin: Update lead status or internal notes
  fastify.patch('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const { status, notes } = request.body || {};

    const updateObj = {};
    if (status) updateObj.status = status;
    if (notes !== undefined) updateObj.notes = notes;

    if (mongoose.connection.readyState === 1) {
      try {
        const lead = await Lead.findByIdAndUpdate(id, updateObj, { new: true });
        if (lead) return { success: true, data: lead };
      } catch (e) {
        console.warn('[Lead Update Error] DB failed:', e.message);
      }
    }

    const index = inMemoryLeads.findIndex(l => l._id === id);
    if (index !== -1) {
      inMemoryLeads[index] = { ...inMemoryLeads[index], ...updateObj };
      return { success: true, data: inMemoryLeads[index] };
    }

    return reply.code(404).send({ error: true, message: 'Lead not found.' });
  });

  // Admin: Delete lead
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const lead = await Lead.findByIdAndDelete(id);
        if (lead) return { success: true, message: 'Lead removed successfully.' };
      } catch (e) {
        console.warn('[Lead Delete Error] DB failed:', e.message);
      }
    }

    inMemoryLeads = inMemoryLeads.filter(l => l._id !== id);
    return { success: true, message: 'Lead removed successfully.' };
  });
}

module.exports = leadRoutes;
