const Course = require('../models/Course');

exports.list = async (req, res) => {
  try {
    const items = await Course.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [] });
  }
};
