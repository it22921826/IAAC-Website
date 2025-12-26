const express = require('express');
const { list } = require('../controllers/courseController');

const router = express.Router();

router.get('/', list);

module.exports = router;
