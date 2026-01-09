const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Fields used by the current admin dashboard
    eventDate: { type: Date },
    imageUrl: { type: String, trim: true },
    imageUrls: [{ type: String, trim: true }],

    // legacy/optional fields so older content still loads
    date: { type: Date },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
