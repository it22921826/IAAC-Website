const Application = require('../models/Application');
const { sendApplicationNotifications } = require('../config/email');

const COUNSELOR_CODE_TO_NAME = {
  C001: 'Rochini',
  C002: 'Dulani',
  C003: 'Abhishek',
  C004: 'Vishwani',
  C005: 'Michelle',
};

function resolveReferralName(codeOrEmpty) {
  const raw = typeof codeOrEmpty === 'string' ? codeOrEmpty.trim() : '';
  if (!raw) return 'General Office';

  const normalized = raw.toUpperCase();
  return COUNSELOR_CODE_TO_NAME[normalized] ?? 'General Office';
}

exports.create = async (req, res) => {
  try {
    const {
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
      school,
      olYear,
      olResults,
      parentName,
      parentPhone,
      program,
      academy,
      referral,
      counselorCode,
    } = req.body || {};

    const resolvedReferral = resolveReferralName(counselorCode ?? referral);

    if (!firstName || !lastName || !email || !phone || !program || !academy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prevent duplicate submissions: reject if identical application exists within last 2 minutes
    const duplicateCutoff = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await Application.findOne({
      email,
      phone,
      program,
      academy,
      createdAt: { $gte: duplicateCutoff },
    });
    if (existing) {
      return res.status(409).json({ message: 'This application was already submitted. Please wait before trying again.' });
    }

    const app = await Application.create({
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
      school,
      olYear,
      olResults,
      parentName,
      parentPhone,
      program,
      academy,
      referral: resolvedReferral,
    });

    // Fire-and-forget notification emails (do not block user response)
    try {
      const { sent, failed, previews } = await sendApplicationNotifications(app);
      return res.status(201).json({ id: app._id, createdAt: app.createdAt, notifications: { sent, failed, previews } });
    } catch (notifyErr) {
      // If notifications fail, still acknowledge application creation
      return res.status(201).json({ id: app._id, createdAt: app.createdAt, notifications: { sent: 0, failed: 3, previews: [] } });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit application' });
  }
};
