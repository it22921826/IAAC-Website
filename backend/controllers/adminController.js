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

// --- FIXED FUNCTION ---
exports.applications = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const items = await Application.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
      
    const mapped = items.map((a) => ({
      // identifiers
      id: a._id,
      createdAt: a.createdAt,

      // personal
      fullName: a.fullName || `${a.firstName || ''} ${a.lastName || ''}`.trim(),
      name: `${a.firstName || ''} ${a.lastName || ''}`.trim(),
      title: a.title,
      dob: a.dob,
      nic: a.nic,
      gender: a.gender,

      // contact
      email: a.email,
      mobile: a.phone,
      contact: a.phone,
      whatsapp: a.whatsapp,
      homeAddress: a.address,
      address: a.address,

      // education & guardian
      school: a.school,
      olYear: a.olYear,
      olResults: a.olResults,
      parentName: a.parentName,
      parentPhone: a.parentPhone,

      // program
      course: a.program,
      courseApplied: a.program,
      academy: a.academy,
      referral: a.referral,

      // admin state
      isDone: !!a.isDone,
    }));
    return res.status(200).json({ items: mapped });
  } catch (err) {
    return res.status(500).json({ items: [] });
  }
};

exports.markApplicationDone = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const existing = await Application.findById(req.params.id).lean();

    if (!existing) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: { isDone: !existing.isDone } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({ id: updated._id, isDone: !!updated.isDone });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update application' });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const doc = await Application.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (doc.isDone) {
      return res.status(403).json({ message: 'Application is locked (done)' });
    }
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

exports.messages = async (req, res) => {
  try {
    const Message = require('../models/Message');
    const items = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const mapped = items.map((m) => ({
      id: m._id,
      name:
        m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Unknown',
      email: m.email,
      phone: m.phone,
      academy: m.academy,
      subject: m.subject || 'No subject',
      message: m.message,
      source: m.source || 'other',
      createdAt: m.createdAt,
      isDone: !!m.isDone,
    }));

    return res.status(200).json({ items: mapped });
  } catch (err) {
    return res.status(500).json({ items: [] });
  }
};

exports.markMessageDone = async (req, res) => {
  try {
    const Message = require('../models/Message');
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { isDone: true } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ id: updated._id, isDone: !!updated.isDone });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update message' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const Message = require('../models/Message');
    const doc = await Message.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (doc.isDone) {
      return res.status(403).json({ message: 'Message is locked (done)' });
    }
    await Message.findByIdAndDelete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: 'Message not found' });
  }
};

exports.stats = (req, res) => {
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
      courseType,
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
    } = req.body || {};
    if (!title || !duration || !courseType) {
      return res.status(400).json({ message: 'Title, duration, and course type are required' });
    }
    const Course = require('../models/Course');
    const course = await Course.create({
      title,
      duration,
      courseType,
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
    const { title, description, imageUrl, imageUrls, eventDate } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const Event = require('../models/Event');
    const event = await Event.create({
      title,
      description,
      imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined),
      imageUrls,
      eventDate: eventDate ? new Date(eventDate) : undefined,
    });
    return res.status(201).json({ id: event._id, createdAt: event.createdAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create event' });
  }
};