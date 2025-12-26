const express = require('express');
const { login, me, applications, stats } = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public: Admin login
router.post('/login', login);

// Protected: current admin info
router.get('/me', auth, me);

// Protected: example dashboard data
router.get('/applications', auth, applications);
router.get('/stats', auth, stats);

module.exports = router;
