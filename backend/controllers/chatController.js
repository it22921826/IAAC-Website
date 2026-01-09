const Course = require('../models/Course');
const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Staff = require('../models/Staff');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function normalizeMessages(input) {
  if (!Array.isArray(input)) return [];
  const allowedRoles = new Set(['user', 'assistant']);
  const trimmed = input
    .filter((m) => m && typeof m === 'object')
    .map((m) => ({
      role: allowedRoles.has(m.role) ? m.role : 'user',
      content: typeof m.content === 'string' ? m.content : '',
    }))
    .map((m) => ({ ...m, content: m.content.trim() }))
    .filter((m) => m.content.length > 0);

  // Keep last 12 turns max
  return trimmed.slice(-12);
}

async function replyCourses() {
  const courses = await Course.find({}, { title: 1, duration: 1 }).sort({ title: 1 }).limit(10).lean();
  if (!courses.length) return 'Our course catalog is currently being updated. Please check back soon or contact IAAC.';
  const lines = courses.map((c) => `• ${c.title}${c.duration ? ` — ${c.duration}` : ''}`);
  return `Here are some IAAC programs:
${lines.join('\n')}
For full details, visit the Programs section.`;
}

async function replyEvents() {
  const now = new Date();
  const events = await Event.find({ $or: [{ eventDate: { $gte: now } }, { date: { $gte: now } }] })
    .sort({ eventDate: 1 })
    .limit(5)
    .lean();
  if (!events.length) return 'There are no upcoming events at the moment. Please check the Events page for updates.';
  const fmt = (d) => (d ? new Date(d).toLocaleDateString() : 'TBA');
  const lines = events.map((e) => `• ${e.title} — ${fmt(e.eventDate || e.date)}`);
  return `Upcoming IAAC events:
${lines.join('\n')}`;
}

async function replyNotices() {
  const notices = await Notice.find({}).sort({ createdAt: -1 }).limit(5).lean();
  if (!notices.length) return 'No recent notices available right now.';
  const lines = notices.map((n) => `• ${n.title}`);
  return `Latest notices:
${lines.join('\n')}`;
}

async function replyContact() {
  const staff = await Staff.find({ email: { $exists: true, $ne: '' } }, { name: 1, email: 1 })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  const envEmails = (process.env.NOTIFY_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const emails = [process.env.FROM_EMAIL, ...envEmails, ...staff.map((s) => s.email)].filter(Boolean);
  if (!emails.length) return 'You can reach IAAC through the Contact page for phone and email details.';
  const unique = Array.from(new Set(emails)).slice(0, 3);
  return `Contact IAAC via email: ${unique.join(', ')}. For phone numbers and addresses, see the Contact page.`;
}

async function replyApply() {
  return 'To apply, open the Apply Now page and submit the form with your details and preferred program. Our team will contact you with next steps.';
}

async function handleQuery(q) {
  const t = q.toLowerCase();
  const has = (...words) => words.every((w) => t.includes(w));
  const any = (...words) => words.some((w) => t.includes(w));

  if (any('course', 'program', 'offer')) return replyCourses();
  if (any('event', 'workshop', 'seminar')) return replyEvents();
  if (any('notice', 'announcement', 'update')) return replyNotices();
  if (any('apply', 'admission', 'enroll', 'register')) return replyApply();
  if (any('contact', 'email', 'phone')) return replyContact();

  return 'I can help with courses, admissions, contact details, and events. Try asking: "What courses do you offer?" or "How do I apply?"';
}

exports.chat = async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : await readJson(req);
    const messages = normalizeMessages(body.messages);
    if (messages.length === 0) return res.status(400).json({ message: 'messages is required' });
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const q = lastUser?.content || '';
    const reply = await handleQuery(q);
    return res.status(200).json({ reply });
  } catch (err) {
    const msg = err && typeof err.message === 'string' ? err.message : 'Chat failed';
    return res.status(500).json({ message: msg });
  }
};
