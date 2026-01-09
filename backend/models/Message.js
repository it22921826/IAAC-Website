const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    academy: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ['contact', 'career-support', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
