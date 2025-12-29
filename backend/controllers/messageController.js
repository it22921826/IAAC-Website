const Message = require('../models/Message');

// Public: create a new message (Contact Us, Career Support, etc.)
exports.create = async (req, res) => {
  try {
    const { firstName, lastName, fullName, email, phone, subject, message, source } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const doc = await Message.create({
      firstName,
      lastName,
      fullName,
      email,
      phone,
      subject,
      message,
      source: source || 'other',
    });

    return res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send message' });
  }
};
