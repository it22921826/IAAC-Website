const nodemailer = require('nodemailer');

function readSmtpEnv() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}

function createTransportFromConfig({ host, port, secure, user, pass }) {
  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing: set SMTP_HOST, SMTP_USER, SMTP_PASS');
  }
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(process.env.SMTP_ALLOW_SELF_SIGNED === 'true' ? { tls: { rejectUnauthorized: false } } : {}),
  });
  return transport;
}

async function getTransporter() {
  const testMode = (process.env.EMAIL_TEST_MODE || 'false').toLowerCase() === 'true';
  if (testMode) {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    if ((process.env.EMAIL_DEBUG || 'false').toLowerCase() === 'true') {
      console.log('[email] Using Ethereal test mode');
    }
    return transport;
  }
  const cfg = readSmtpEnv();
  const transport = createTransportFromConfig(cfg);
  if ((process.env.EMAIL_DEBUG || 'false').toLowerCase() === 'true') {
    const masked = cfg.user ? cfg.user.replace(/(.{2}).+(@.*)/, '$1***$2') : 'unknown';
    console.log(`[email] Using SMTP ${cfg.host}:${cfg.port} secure=${cfg.secure} user=${masked}`);
  }
  return transport;
}

function getRecipients() {
  const raw = process.env.NOTIFY_EMAILS || '';
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return list.slice(0, 3); // ensure up to three recipients per requirement
}

function fromAddress() {
  return process.env.FROM_EMAIL || process.env.SMTP_USER;
}

async function sendApplicationNotifications(app) {
  let transporter = await getTransporter();
  const recipients = getRecipients();
  const debug = (process.env.EMAIL_DEBUG || 'false').toLowerCase() === 'true';
  const testMode = (process.env.EMAIL_TEST_MODE || 'false').toLowerCase() === 'true';

  if (recipients.length === 0) {
    // No recipients configured; nothing to send
    return { sent: 0, failed: 0 };
  }

  const subject = `New Application: ${app.firstName} ${app.lastName} - ${app.program}`;
  const lines = [
    'A new application has been submitted with the following details:',
    '',
    `Name: ${app.firstName} ${app.lastName}`,
    app.dob ? `DOB: ${new Date(app.dob).toLocaleDateString()}` : undefined,
    app.nic ? `NIC: ${app.nic}` : undefined,
    app.gender ? `Gender: ${app.gender}` : undefined,
    `Email: ${app.email}`,
    `Phone: ${app.phone}`,
    app.address ? `Address: ${app.address}` : undefined,
    `Program: ${app.program}`,
    '',
    `Submitted At: ${new Date(app.createdAt).toLocaleString()}`,
  ].filter(Boolean);

  const text = lines.join('\n');

  let sent = 0;
  let failed = 0;

  // Optional: verify SMTP connection to surface issues proactively
  if (debug) {
    try {
      await transporter.verify();
      console.log('[email] SMTP connection verified');
    } catch (verifyErr) {
      const msg = verifyErr && verifyErr.message ? verifyErr.message : String(verifyErr);
      console.error('[email] SMTP verify failed:', msg);
      // Fallback between STARTTLS (587,false) and SMTPS (465,true)
      if (/wrong version number|EPROTO|handshake/i.test(msg)) {
        const envCfg = readSmtpEnv();
        const fallback = envCfg.secure || envCfg.port === 465
          ? { host: envCfg.host, port: 587, secure: false, user: envCfg.user, pass: envCfg.pass }
          : { host: envCfg.host, port: 465, secure: true, user: envCfg.user, pass: envCfg.pass };
        if (debug) {
          console.log(`[email] Retrying with fallback SMTP ${fallback.host}:${fallback.port} secure=${fallback.secure}`);
        }
        try {
          transporter = createTransportFromConfig(fallback);
          await transporter.verify();
          console.log('[email] Fallback SMTP connection verified');
        } catch (fallbackErr) {
          console.error('[email] Fallback SMTP verify failed:', fallbackErr && fallbackErr.message ? fallbackErr.message : fallbackErr);
        }
      }
    }
  }

  const previews = [];
  if (debug) {
    console.log('[email] Recipients:', recipients.join(', '));
    console.log('[email] From:', fromAddress());
    console.log('[email] Subject:', subject);
  }
  for (const to of recipients) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress(),
        to,
        subject,
        text,
      });
      if (debug) {
        console.log(`[email] Sent to ${to}: messageId=${info && info.messageId}`);
      }
      if (testMode) {
        const url = nodemailer.getTestMessageUrl(info);
        if (url) previews.push(url);
      }
      sent += 1;
    } catch (err) {
      if (debug) {
        console.error(`[email] Failed to send to ${to}:`, err && err.message ? err.message : err);
      }
      failed += 1;
    }
  }

  return { sent, failed, previews };
}

module.exports = { sendApplicationNotifications, sendApprovalEmail };

/**
 * Send approval/acceptance email to the student.
 */
async function sendApprovalEmail(app) {
  let transporter = await getTransporter();
  const debug = (process.env.EMAIL_DEBUG || 'false').toLowerCase() === 'true';
  const testMode = (process.env.EMAIL_TEST_MODE || 'false').toLowerCase() === 'true';

  if (!app.email) {
    return { sent: false, error: 'No student email address' };
  }

  const studentName = app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Student';
  const programName = app.program || 'the selected program';
  const academyName = app.academy || 'IAAC';

  const siteUrl = process.env.FRONTEND_URL || 'https://iaacasia.com';
  const logoUrl = `${siteUrl}/logo3.png`;

  const subject = `Congratulations! You Have Been Selected - ${academyName}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px 30px; text-align: center;">
        <img src="${logoUrl}" alt="IAAC Logo" style="width: 80px; height: auto; margin-bottom: 16px;" />
        <h1 style="color: #ffffff; font-size: 26px; margin: 0 0 6px 0; letter-spacing: 0.5px;">Congratulations from IAAC !</h1>
        <p style="color: #bfdbfe; font-size: 13px; margin: 0;">International Airline and Aviation College</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">Dear <strong>${studentName}</strong>,</p>
        
        <p style="font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 20px;">
          We are delighted to inform you that your application for 
          <strong style="color: #1e3a8a;">${programName}</strong> 
          at <strong>${academyName}</strong> has been reviewed and 
          <span style="color: #059669; font-weight: bold;">approved</span>.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 15px;">Next Steps to Complete Your Enrollment:</h3>
          <ol style="color: #334155; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
            <li>Visit the <strong>${academyName}</strong> campus with your original documents</li>
            <li>Bring your NIC/Passport, O/L results sheet, and 2 passport-size photos</li>
            <li>Complete the registration form and pay the initial enrollment fee</li>
            <li>Collect your student ID and class schedule</li>
          </ol>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
          <p style="color: #1e40af; font-size: 13px; margin: 0;">
            <strong>Important:</strong> Please complete your enrollment within <strong>14 days</strong> of receiving this email to secure your seat.
          </p>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 24px;">
          If you have any questions, feel free to contact us or visit the campus during working hours.
        </p>

        <p style="font-size: 14px; color: #334155; margin-top: 30px;">
          Best regards,<br/>
          <strong>Admissions Office</strong><br/>
          International Airline and Aviation College (IAAC)
        </p>
      </div>
      
      <!-- Footer with Contact Info -->
      <div style="background: #0f172a; padding: 28px 30px; text-align: center;">
        <img src="${logoUrl}" alt="IAAC" style="width: 50px; height: auto; margin-bottom: 14px; opacity: 0.9;" />
        
        <!-- IAAC City -->
        <div style="margin-bottom: 14px;">
          <p style="color: #60a5fa; font-size: 12px; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">IAAC City Academy</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 3px 0;">49A Siri Dhamma Mawatha, Colombo 01000, Sri Lanka</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Phone: <a href="tel:+94766763777" style="color: #60a5fa; text-decoration: none;">+94 76 676 3777</a>
          </p>
        </div>

        <!-- IAAC Airport -->
        <div style="margin-bottom: 16px; padding-top: 12px; border-top: 1px solid #1e293b;">
          <p style="color: #60a5fa; font-size: 12px; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">IAAC Airport Academy</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0 0 3px 0;">261 Ven Baddegama Wimalawansa Mawatha, Deans Road, Colombo 01000, Sri Lanka</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Phone: <a href="tel:+94762782781" style="color: #60a5fa; text-decoration: none;">+94 76 278 2781</a>
          </p>
        </div>

        <div style="margin-bottom: 10px;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            Email: <a href="mailto:info@iaac.lk" style="color: #60a5fa; text-decoration: none;">info@iaac.lk</a>
          </p>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 14px;">
          <a href="${siteUrl}" style="color: #60a5fa; font-size: 12px; text-decoration: none; font-weight: bold;">www.iaacasia.com</a>
          <p style="color: #64748b; font-size: 11px; margin: 8px 0 0 0;">This is an automated message from IAAC Admissions Portal.</p>
        </div>
      </div>
    </div>
  `;

  const text = [
    `Dear ${studentName},`,
    '',
    `Congratulations! Your application for ${programName} at ${academyName} has been approved.`,
    '',
    'Next Steps to Complete Your Enrollment:',
    `1. Visit the ${academyName} campus with your original documents`,
    '2. Bring your NIC/Passport, O/L results sheet, and 2 passport-size photos',
    '3. Complete the registration form and pay the initial enrollment fee',
    '4. Collect your student ID and class schedule',
    '',
    'Please complete your enrollment within 14 days of receiving this email to secure your seat.',
    '',
    '---',
    'IAAC - International Airline and Aviation College',
    '',
    'IAAC City Academy',
    '49A Siri Dhamma Mawatha, Colombo 01000, Sri Lanka',
    'Phone: +94 76 676 3777',
    '',
    'IAAC Airport Academy',
    '261 Ven Baddegama Wimalawansa Mawatha, Deans Road, Colombo 01000, Sri Lanka',
    'Phone: +94 76 278 2781',
    '',
    'Email: info@iaac.lk',
    'Web: https://iaacasia.com',
    '',
    'Best regards,',
    'Admissions Office',
  ].join('\n');

  try {
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: app.email,
      subject,
      text,
      html,
    });

    if (debug) {
      console.log(`[email] Approval email sent to ${app.email}: messageId=${info && info.messageId}`);
    }

    let preview = null;
    if (testMode) {
      preview = nodemailer.getTestMessageUrl(info);
    }

    return { sent: true, preview };
  } catch (err) {
    if (debug) {
      console.error(`[email] Failed to send approval email to ${app.email}:`, err && err.message ? err.message : err);
    }
    return { sent: false, error: err && err.message ? err.message : 'Email sending failed' };
  }
}
