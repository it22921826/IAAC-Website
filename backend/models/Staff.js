const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    // legacy/optional fields so older content still loads
    role: { type: String, trim: true },
    qualifications: { type: String, trim: true },
    bio: { type: String, trim: true },
    image: { type: String, trim: true },
    email: { type: String, trim: true },
    category: { type: String, default: 'faculty', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);