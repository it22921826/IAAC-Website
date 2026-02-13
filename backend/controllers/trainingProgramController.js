const TrainingProgram = require('../models/TrainingProgram');

// 1. LIST all training programs
exports.list = async (req, res) => {
  try {
    const items = await TrainingProgram.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [] });
  }
};

// 2. CREATE a new training program
exports.create = async (req, res) => {
  try {
    const {
      title,
      duration,
      shortDescription,
      sessionDetails,
      imageUrl,
      imageData,
      imageUrls,
    } = req.body;

    const finalImage =
      imageData ||
      imageUrl ||
      (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined);

    const newProgram = new TrainingProgram({
      title: title || 'Practical Session',
      duration: duration || '-',
      courseType: 'Practical Training',
      shortDescription,
      sessionDetails,
      imageUrl: finalImage,
      imageUrls,
    });

    const saved = await newProgram.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Training Error:', err);
    res.status(500).json({ error: 'Failed to create training program' });
  }
};

// 3. UPDATE a training program
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      duration,
      shortDescription,
      sessionDetails,
      imageUrl,
      imageData,
      imageUrls,
    } = req.body || {};

    const finalImage =
      imageData ||
      imageUrl ||
      (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : undefined);

    const updatePayload = {
      title,
      duration: duration || '-',
      courseType: 'Practical Training',
      shortDescription,
      sessionDetails,
      imageUrl: finalImage,
      imageUrls,
    };

    const updated = await TrainingProgram.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Training program not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update Training Error:', err);
    return res.status(500).json({ error: 'Failed to update training program' });
  }
};

// 4. DELETE a training program
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await TrainingProgram.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
