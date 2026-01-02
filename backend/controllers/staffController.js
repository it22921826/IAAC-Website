const Staff = require('../models/Staff');

exports.list = async (_req, res) => {
  try {
    const items = await Staff.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ items });
  } catch (err) {
    console.error('List staff error:', err);
    return res.status(500).json({ items: [] });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const staff = await Staff.create({ name, description, imageUrl });
    return res.status(201).json(staff);
  } catch (err) {
    console.error('Create staff error:', err);
    return res.status(500).json({ message: 'Failed to create staff member' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body || {};

    const updated = await Staff.findByIdAndUpdate(
      id,
      { name, description, imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update staff error:', err);
    return res.status(500).json({ message: 'Failed to update staff member' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete staff error:', err);
    return res.status(500).json({ message: 'Failed to delete staff member' });
  }
};
