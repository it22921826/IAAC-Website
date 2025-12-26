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

exports.applications = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const items = await Application.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    const mapped = items.map((a) => ({
      id: a._id,
      name: `${a.firstName} ${a.lastName}`.trim(),
      course: a.program,
      contact: a.phone,
    }));
    return res.status(200).json({ items: mapped });
  } catch (err) {
    return res.status(500).json({ items: [] });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const Application = require('../models/Application');
    await Application.findByIdAndDelete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: 'Application not found' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const Course = require('../models/Course');
    await Course.findByIdAndDelete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: 'Course not found' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const Event = require('../models/Event');
    await Event.findByIdAndDelete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: 'Event not found' });
  }
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

exports.config = (req, res) => {
  return res.status(200).json({
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  });
};

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      duration,
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
    } = req.body || {};
    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }
    const Course = require('../models/Course');
    const course = await Course.create({
      title,
      duration,
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
    });
    return res.status(201).json({ id: course._id, createdAt: course.createdAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create course' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, imageUrl, eventDate } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const Event = require('../models/Event');
    const event = await Event.create({
      title,
      description,
      imageUrl,
      eventDate: eventDate ? new Date(eventDate) : undefined,
    });
    return res.status(201).json({ id: event._id, createdAt: event.createdAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create event' });
  }
};
