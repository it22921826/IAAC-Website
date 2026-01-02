const router = require('express').Router();
const Event = require('../models/EventModel');

// 1. GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by nearest date
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. ADD NEW EVENT (Use this in your Admin Dashboard later)
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;