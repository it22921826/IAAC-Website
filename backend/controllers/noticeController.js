const Notice = require('../models/Notice');

exports.list = async (_req, res) => {
  try {
    const items = await Notice.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ items });
  } catch (err) {
    console.error('List notices error:', err);
    return res.status(500).json({ items: [] });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const notice = await Notice.create({ title, description, imageUrl });
    return res.status(201).json(notice);
  } catch (err) {
    console.error('Create notice error:', err);
    return res.status(500).json({ message: 'Failed to create notice' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body || {};

    const updated = await Notice.findByIdAndUpdate(
      id,
      { title, description, imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update notice error:', err);
    return res.status(500).json({ message: 'Failed to update notice' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete notice error:', err);
    return res.status(500).json({ message: 'Failed to delete notice' });
  }
};
