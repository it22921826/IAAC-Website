const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true },
    courseType: { type: String, required: true },
    imageUrl: { type: String },
    imageUrls: [{ type: String }],
    shortDescription: { type: String },
    totalCourseFee: { type: String },
    minimumEntryRequirements: { type: String },
    evaluationCriteria: { type: String },
    examinationFormat: { type: String },
    additionalNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
