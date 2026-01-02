const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true }, // Important: Stores date in ISO format
  time: { type: String, required: true }, // e.g., "10:00 AM - 12:00 PM"
  location: { type: String, required: true },
  category: { type: String, default: 'General' }, // e.g., Academic, Sports
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
