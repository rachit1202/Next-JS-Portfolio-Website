const nodemailer = require('nodemailer');
const SiteConfig = require('../models/SiteConfig');

/**
 * Get nodemailer transporter dynamically from SiteConfig in DB or environment variables
 */
async function createTransporter(customConfig = null) {
  let host = process.env.SMTP_HOST || 'smtp.gmail.com';
  let port = Number(process.env.SMTP_PORT) || 465;
  let secure = process.env.SMTP_SECURE === 'true' || port === 465;
  let user = process.env.SMTP_USER || process.env.GMAIL_USER || 'aggarwalrachit1202@gmail.com';
  let pass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '';

  if (customConfig) {
    if (customConfig.smtpHost) host = customConfig.smtpHost;
    if (customConfig.smtpPort) port = Number(customConfig.smtpPort);
    if (customConfig.smtpSecure !== undefined) secure = customConfig.smtpSecure;
    if (customConfig.smtpUser) user = customConfig.smtpUser;
    if (customConfig.smtpPass) pass = customConfig.smtpPass;
  } else {
    try {
      const dbConfig = await SiteConfig.findOne();
      if (dbConfig) {
        if (dbConfig.smtpHost) host = dbConfig.smtpHost;
        if (dbConfig.smtpPort) port = Number(dbConfig.smtpPort);
        if (dbConfig.smtpSecure !== undefined) secure = dbConfig.smtpSecure;
        if (dbConfig.smtpUser) user = dbConfig.smtpUser;
        if (dbConfig.smtpPass) pass = dbConfig.smtpPass;
      }
    } catch (err) {
      console.warn('[Mailer] Could not read SMTP config from DB:', err.message);
    }
  }

  // If host is gmail and port is 465 / 587
  const isGmail = host.toLowerCase().includes('gmail');

  const transporterOptions = isGmail && !host.includes('custom')
    ? {
        service: 'gmail',
        auth: {
          user: user.trim(),
          pass: pass.trim().replace(/\s+/g, '') // remove spaces from Gmail app passwords
        }
      }
    : {
        host: host.trim(),
        port: port,
        secure: secure || port === 465,
        auth: {
          user: user.trim(),
          pass: pass.trim()
        }
      };

  return {
    transporter: nodemailer.createTransport(transporterOptions),
    user,
    pass,
    host,
    port
  };
}

/**
 * Send email notification for new client lead
 * @param {Object} lead - The lead document ({ name, email, phone, serviceNeeded, budget, message, createdAt })
 */
async function sendLeadNotificationEmail(lead) {
  try {
    let recipientEmails = ['aggarwalrachit1202@gmail.com'];
    let dbConfig = null;

    try {
      dbConfig = await SiteConfig.findOne();
      if (dbConfig && dbConfig.leadNotificationEmails) {
        const raw = dbConfig.leadNotificationEmails;
        const parsed = raw
          .split(/[,;\s]+/)
          .map(e => e.trim())
          .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
        if (parsed.length > 0) {
          recipientEmails = parsed;
        }
      }
    } catch (err) {
      console.warn('[Mailer] Could not query SiteConfig for notification emails, using default:', err.message);
    }

    const mailListStr = recipientEmails.join(', ');
    const { transporter, user, pass } = await createTransporter(dbConfig);

    const subject = `🚀 New Lead: ${lead.name} - ${lead.subject || lead.serviceNeeded || 'Project Inquiry'}`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0d19; color: #f1f5f9; padding: 32px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">
            🎉 New Project Inquiry Received
          </h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
            Submitted via Rachit Aggarwal Portfolio Contact Form
          </p>
        </div>

        <!-- Key Lead Details Card -->
        <div style="background-color: #121426; border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px; font-weight: 600;">Client Name:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Email Address:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${lead.email}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${lead.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Phone Number:</td>
              <td style="padding: 8px 0; color: #ffffff;">${lead.phone || '<span style="color:#64748b;">Not provided</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Subject / Topic:</td>
              <td style="padding: 8px 0; color: #f8fafc; font-weight: 600;">${lead.subject || '<span style="color:#64748b;">General Inquiry</span>'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Service Required:</td>
              <td style="padding: 8px 0;">
                <span style="display: inline-block; background-color: rgba(147, 51, 234, 0.2); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.4); padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                  ${lead.serviceNeeded || 'General Inquiry'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Estimated Budget:</td>
              <td style="padding: 8px 0; color: #34d399; font-weight: 600;">${lead.budget || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">User IP Address:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-family: monospace; font-size: 13px;">${lead.ipAddress || '127.0.0.1'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Submitted From:</td>
              <td style="padding: 8px 0;">
                <a href="${lead.pageUrl || '#'}" target="_blank" style="color: #a78bfa; text-decoration: none; font-size: 12px; word-break: break-all;">
                  ${lead.pageUrl || 'https://rachitaggarwal.dev/contact'}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Submitted At:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-size: 13px;">${new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
            </tr>
          </table>
        </div>

        <!-- Message Body -->
        <div style="margin-bottom: 28px;">
          <h3 style="color: #ffffff; font-size: 14px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">
            💬 Client Message:
          </h3>
          <div style="background-color: #07080f; border-left: 4px solid #818cf8; padding: 16px; border-radius: 8px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${lead.message}</div>
        </div>

        <!-- Action CTA Buttons -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="mailto:${lead.email}?subject=Re:%20${encodeURIComponent(lead.serviceNeeded || 'Project Inquiry')}%20-%20Rachit%20Aggarwal" 
             style="display: inline-block; background: linear-gradient(135deg, #9333ea, #6366f1); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 10px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);">
            ✉️ Direct Reply to Client
          </a>
        </div>

        <!-- Footer Notice -->
        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.5;">
          This lead was automatically dispatched to: <strong>${mailListStr}</strong><br/>
          To configure recipients or SMTP credentials, go to <strong>Admin Panel &rarr; Site & Profile CMS &rarr; Contact & Socials</strong>.
        </div>

      </div>
    `;

    const mailOptions = {
      from: `"Rachit Aggarwal Portfolio" <${user}>`,
      to: mailListStr,
      replyTo: lead.email,
      subject,
      html: htmlContent
    };

    console.log(`[Mailer] Dispatching lead email notification to: ${mailListStr} using sender: ${user}`);

    if (pass && pass.length > 0) {
      const info = await transporter.sendMail(mailOptions);
      console.log('[Mailer] Lead notification sent successfully! MessageId:', info.messageId);
      return { success: true, messageId: info.messageId, recipients: mailListStr };
    } else {
      console.log(`[Mailer Pending Config] SMTP Password/App Password not set yet. Email notification was queued for: ${mailListStr}. Set your Gmail App Password in Site CMS to activate live delivery.`);
      return { success: false, pendingConfig: true, recipients: mailListStr, message: 'SMTP credentials pending.' };
    }
  } catch (err) {
    console.error('[Mailer Error] Failed to dispatch lead notification email:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send a test email to verify SMTP configuration
 */
async function sendTestEmail(targetEmail, customConfig = null) {
  try {
    const { transporter, user, pass } = await createTransporter(customConfig);

    if (!pass || pass.trim() === '') {
      throw new Error('SMTP Password / Gmail App Password is empty. Please enter your 16-digit Google App Password.');
    }

    const testRecipient = targetEmail || user || 'aggarwalrachit1202@gmail.com';

    const mailOptions = {
      from: `"Rachit Aggarwal Portfolio" <${user}>`,
      to: testRecipient,
      subject: '✅ SMTP Email Test: Connection Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0b0d19; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #22c55e;">
          <h2 style="color: #4ade80; margin-top: 0;">🎉 SMTP Connection Verified!</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Your portfolio website is now successfully connected to your email server. All future client inquiries from your contact form will be delivered to this inbox automatically.
          </p>
          <div style="background-color: #1e293b; padding: 12px; border-radius: 8px; font-size: 12px; color: #94a3b8; font-family: monospace;">
            Sender: ${user}<br/>
            Recipient: ${testRecipient}<br/>
            Tested At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId, recipient: testRecipient };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendLeadNotificationEmail,
  sendTestEmail,
  createTransporter
};
