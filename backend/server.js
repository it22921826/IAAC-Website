const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

dotenv.config();

// Fail fast if MongoDB is unavailable (avoid hanging requests)
mongoose.set('bufferCommands', false);

const app = express();

// Apply essential middleware for security, logging, and parsing
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header)
      if (!origin) return callback(null, true);

      const envOrigin = process.env.FRONTEND_URL;
      const allowList = new Set(
        [
          envOrigin,
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ].filter(Boolean)
      );

      // Allow any localhost/127.0.0.1 port during development
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost || allowList.has(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
const noticeRoutes = require('./routes/notices');
app.use('/api/notices', noticeRoutes);
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

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
  } catch (err) {
    console.error('MongoDB not connected; API will run with limited functionality');
  }

  const server = app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other process or set PORT to a different value.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
};

startServer();

module.exports = app;
