const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: false },
    nic: { type: String, required: false },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: false },
    address: { type: String, required: false },
    program: { type: String, required: true },
    academy: { type: String, required: true },
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
