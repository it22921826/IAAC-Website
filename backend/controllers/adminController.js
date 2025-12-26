const jwt = require('jsonwebtoken');

function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

exports.login = (req, res) => {
  const { email, password } = req.body || {};

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server missing JWT_SECRET' });
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'Admin credentials not configured' });
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const user = { name: 'Admin', email, role: 'admin' };
    const token = signToken({ sub: email, role: 'admin' });
    return res.status(200).json({ user, token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

exports.me = (req, res) => {
  return res.status(200).json({ user: req.user });
};

exports.applications = (req, res) => {
  // Placeholder data; integrate with MongoDB collections later
  const list = [
    { name: 'Sanuthi Ranaweera', course: 'Diploma in Cabin Crew', contact: '071 234 5678' },
    { name: 'Kasun Perera', course: 'Pilot Training (PPL)', contact: '077 123 9876' },
    { name: 'Amaya De Silva', course: 'Airport Ground Ops', contact: '070 555 1234' },
  ];
  return res.status(200).json({ items: list });
};

exports.stats = (req, res) => {
  // Example metrics; replace with real queries later
  return res.status(200).json({
    applicationsToday: 12,
    totalStudents: 1240,
    upcomingEvents: 3,
    period: 'Dec 25, 2025',
  });
};
