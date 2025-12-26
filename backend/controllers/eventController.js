const Event = require('../models/Event');

exports.list = async (req, res) => {
  try {
    const items = await Event.find({}).sort({ eventDate: -1, createdAt: -1 }).lean();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [] });
  }
};
