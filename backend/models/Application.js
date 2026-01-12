const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    // Personal
    title: { type: String, required: false },
    fullName: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: false },
    nic: { type: String, required: false },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: false },
    address: { type: String, required: false },

<<<<<<< HEAD
    // Education & Guardian (captured from Apply Now)
=======
    // Education & Guardian
>>>>>>> 2a73e64d87c9b76a49fdfee2e4c021c1e913c970
    school: { type: String, required: false },
    olYear: { type: String, required: false },
    olResults: { type: mongoose.Schema.Types.Mixed, required: false },
    parentName: { type: String, required: false },
    parentPhone: { type: String, required: false },

<<<<<<< HEAD
=======
    // Program selection
>>>>>>> 2a73e64d87c9b76a49fdfee2e4c021c1e913c970
    program: { type: String, required: true },
    academy: { type: String, required: true },
    referral: { type: String, required: false },

    // Admin processing
    isDone: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
