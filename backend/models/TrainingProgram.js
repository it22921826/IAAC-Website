const mongoose = require('mongoose');

const TrainingProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, default: '-' },
    courseType: { type: String, default: 'Practical Training' },
    imageUrl: { type: String },
    imageUrls: [{ type: String }],
    shortDescription: { type: String },
    sessionDetails: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingProgram', TrainingProgramSchema);
