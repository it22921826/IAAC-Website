const express = require('express');
const { create } = require('../controllers/applicationController');

const router = express.Router();

// Public endpoint to submit applications
router.post('/', create);

module.exports = router;
