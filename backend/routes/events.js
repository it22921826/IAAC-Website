const express = require('express');
const { list } = require('../controllers/eventController');

const router = express.Router();

router.get('/', list);

module.exports = router;
