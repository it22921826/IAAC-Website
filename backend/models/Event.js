const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    eventDate: { type: Date, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
