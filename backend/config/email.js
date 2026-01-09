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

module.exports = { sendApplicationNotifications };
