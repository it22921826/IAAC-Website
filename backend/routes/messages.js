const express = require('express');
const { create } = require('../controllers/messageController');

const router = express.Router();

// Public endpoint to submit messages from Contact Us, Career Support, etc.
router.post('/', create);

module.exports = router;
