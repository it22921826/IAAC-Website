const express = require('express');
const { chat } = require('../controllers/chatController');

const router = express.Router();

// Public: AI chat endpoint
router.post('/', chat);

module.exports = router;
