const Application = require('../models/Application');
const { sendApplicationNotifications } = require('../config/email');

exports.create = async (req, res) => {
  try {
    const {
      // Personal
      title,
      fullName,
      firstName,
      lastName,
      dob,
      nic,
      gender,
      email,
      phone,
      whatsapp,
      address,

      // Education & Guardian
      school,
      olYear,
      olResults,
      parentName,
      parentPhone,

      // Program
      program,
      academy,
      referral,
    } = req.body || {};

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !program || !academy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the application record in MongoDB
    const app = await Application.create({
      // Personal
      title,
      fullName,
      firstName,
      lastName,
      dob: dob ? new Date(dob) : undefined,
      nic,
      gender,
      email,
      phone,
      whatsapp,
      address,

      // Education & Guardian
      school,
      olYear,
      olResults,
      parentName,
      parentPhone,

      // Program
      program,
      academy,
      referral,
    });

    // Fire-and-forget notification emails (do not block user response)
    try {
      const { sent, failed, previews } = await sendApplicationNotifications(app);
      return res.status(201).json({ id: app._id, createdAt: app.createdAt, notifications: { sent, failed, previews } });
    } catch (notifyErr) {
      // If notifications fail, still acknowledge application creation to the user
      console.error('Notification error:', notifyErr);
      return res.status(201).json({ id: app._id, createdAt: app.createdAt, notifications: { sent: 0, failed: 3, previews: [] } });
    }
  } catch (err) {
    console.error('Application creation error:', err);
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};