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
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Mount API routes here, e.g. app.use('/api/auth', authRoutes);
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
