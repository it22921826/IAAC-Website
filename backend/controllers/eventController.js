const Event = require('../models/Event');

// List all events (public)
exports.list = async (req, res) => {
  try {
    const items = await Event.find({})
      .sort({ eventDate: -1, date: -1, createdAt: -1 })
      .lean();
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ items: [] });
  }
};

// Create a new event (used by admin dashboard via /api/events)
exports.create = async (req, res) => {
  try {
    const { title, description, imageUrl, imageUrls, eventDate } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const cleanedImageUrls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : undefined;
    const cleanedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : imageUrl;

    const event = await Event.create({
      title,
      description,
      imageUrl:
        cleanedImageUrl
          ? cleanedImageUrl
          : Array.isArray(cleanedImageUrls) && cleanedImageUrls.length > 0
            ? cleanedImageUrls[0]
            : undefined,
      imageUrls: cleanedImageUrls,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      // legacy compatibility
      date: eventDate ? new Date(eventDate) : undefined,
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err);
    return res.status(500).json({ message: 'Failed to create event' });
  }
};

// Update an existing event
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, imageUrls, eventDate } = req.body || {};

    const cleanedImageUrls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : undefined;
    const cleanedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : imageUrl;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    // Don't clear existing images unless non-empty data is provided.
    if (Array.isArray(cleanedImageUrls) && cleanedImageUrls.length > 0) {
      updatePayload.imageUrls = cleanedImageUrls;
    }
    if (cleanedImageUrl) {
      updatePayload.imageUrl = cleanedImageUrl;
    } else if (Array.isArray(cleanedImageUrls) && cleanedImageUrls.length > 0) {
      updatePayload.imageUrl = cleanedImageUrls[0];
    }
    if (eventDate !== undefined) {
      updatePayload.eventDate = eventDate ? new Date(eventDate) : undefined;
      // legacy compatibility
      updatePayload.date = eventDate ? new Date(eventDate) : undefined;
    }

    const updated = await Event.findByIdAndUpdate(id, updatePayload, {
      new: true,
      omitUndefined: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error('Update event error:', err);
    return res.status(500).json({ message: 'Failed to update event' });
  }
};

// Delete an event
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    return res.status(500).json({ message: 'Failed to delete event' });
  }
};
