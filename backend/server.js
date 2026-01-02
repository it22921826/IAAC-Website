const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Apply essential middleware for security, logging, and parsing
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
// Allow large JSON payloads (multiple base64 images from dashboard)
app.use(express.json({ limit: '50mb' }));

// Optional request logging via morgan
const shouldLogRequests = (process.env.LOG_REQUESTS || 'false').toLowerCase() === 'true';
if (shouldLogRequests) {
  app.use(morgan('dev'));
}

// Mount API routes here
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Public routes
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

const courseRoutes = require('./routes/courses');
app.use('/api/courses', courseRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);
const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;

  let dbStatus = 'disconnected';
  if (dbState === 1) dbStatus = 'connected';
  else if (dbState === 2) dbStatus = 'connecting';
  else if (dbState === 3) dbStatus = 'disconnecting';

  res.status(200).json({
    status: 'ok',
    service: 'IAAC API',
    db: dbStatus,
  });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
