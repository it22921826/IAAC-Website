const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not defined; starting API without MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Enable verbose Mongoose query logs only when explicitly requested
    const mongoDebug = (process.env.MONGO_DEBUG || 'false').toLowerCase() === 'true';
    mongoose.set('debug', mongoDebug);

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
};

module.exports = connectDB;
