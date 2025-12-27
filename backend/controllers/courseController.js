const Course = require('../models/Course');

// 1. LIST (Get all courses)
exports.list = async (req, res) => {
  try {
    const items = await Course.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [] });
  }
};

// 2. CREATE (Add a new course) - THIS WAS MISSING
exports.create = async (req, res) => {
  try {
    // We explicitly look for courseType OR category to be safe
    const { 
      title, 
      duration, 
      courseType, 
      category, 
      shortDescription, 
      totalCourseFee, 
      minimumEntryRequirements, 
      evaluationCriteria, 
      examinationFormat, 
      additionalNotes,
      imageUrl,
      imageUrls,
    } = req.body;

    // Create the new course object
    const newCourse = new Course({
      title,
      duration,
      // If courseType is missing, try 'category', or default to 'Other'
      courseType: courseType || category || 'Other Programs', 
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
      imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined),
      imageUrls,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// 3. UPDATE (Edit an existing course)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      duration,
      courseType,
      category,
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
      imageUrl,
      imageUrls,
    } = req.body || {};

    const updatePayload = {
      title,
      duration,
      courseType: courseType || category || 'Other Programs',
      shortDescription,
      totalCourseFee,
      minimumEntryRequirements,
      evaluationCriteria,
      examinationFormat,
      additionalNotes,
      imageUrl: imageUrl || (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined),
      imageUrls,
    };

    const updated = await Course.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update Error:', err);
    return res.status(500).json({ error: 'Failed to update course' });
  }
};

// 4. DELETE (Remove a course)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
};