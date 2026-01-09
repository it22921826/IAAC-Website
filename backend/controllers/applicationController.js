const Application = require('../models/Application');

exports.create = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      nic,
      gender,
      email,
      phone,
      whatsapp,
      address,
      program,
      academy,
    } = req.body || {};

    if (!firstName || !lastName || !email || !phone || !program || !academy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const app = await Application.create({
      firstName,
      lastName,
      dob: dob ? new Date(dob) : undefined,
      nic,
      gender,
      email,
      phone,
      whatsapp,
      address,
      program,
      academy,
    });

    return res.status(201).json({ id: app._id, createdAt: app.createdAt });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};
