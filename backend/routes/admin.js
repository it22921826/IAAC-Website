const express = require('express');
const { login, me, applications, stats, config, createCourse, createEvent, deleteCourse, deleteEvent, deleteApplication, messages, deleteMessage } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public: Admin login
router.post('/login', login);

// Public: Suggested admin email
router.get('/config', config);

// Protected: current admin info
router.get('/me', auth, me);

// Protected: example dashboard data
router.get('/applications', auth, applications);
router.get('/stats', auth, stats);
router.get('/messages', auth, messages);

// Protected: content creation
router.post('/courses', auth, createCourse);
router.post('/events', auth, createEvent);

// Protected: deletions
router.delete('/applications/:id', auth, deleteApplication);
router.delete('/courses/:id', auth, deleteCourse);
router.delete('/events/:id', auth, deleteEvent);
router.delete('/messages/:id', auth, deleteMessage);

module.exports = router;
